import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { lstat, mkdir, readFile, realpath, readdir } from "node:fs/promises";
import { once } from "node:events";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";

const children = new Set<ChildProcess>();
const decoder = new TextDecoder();

export function stopChildren(): void {
  for (const child of children) {
    if (child.pid) {
      try {
        if (process.platform === "linux") process.kill(-child.pid, "SIGTERM");
        else child.kill("SIGTERM");
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
      }
    }
  }
}

export async function run(
  argv: string[],
  cwd: string,
  options: { logPath?: string; allowFailure?: boolean; env?: Record<string, string> } = {},
): Promise<{ code: number; stdout: string; stderr: string }> {
  if (!argv.length) throw new Error("Empty command");
  let log: ReturnType<typeof createWriteStream> | undefined;
  let child: ChildProcess | undefined;
  try {
    if (options.logPath) {
      await mkdir(dirname(options.logPath), { recursive: true });
      log = createWriteStream(options.logPath, { flags: "a" });
      log.write(`\n$ ${JSON.stringify(argv)} (cwd: ${cwd})\n`);
    }
    child = spawn(argv[0], argv.slice(1), {
      cwd,
      env: { ...process.env, ...options.env },
      detached: process.platform === "linux",
      stdio: ["ignore", "pipe", "pipe"],
    });
    children.add(child);
    const output: { stdout: string; stderr: string } = { stdout: "", stderr: "" };
    const consume = async (stream: NonNullable<ChildProcess["stdout"]>, channel: "stdout" | "stderr") => {
      for await (const chunk of stream) {
        const text = decoder.decode(chunk as Buffer);
        output[channel] += text;
        if (log) {
          output[channel] = output[channel].slice(-32000);
          if (!log.write(chunk as Buffer)) await once(log, "drain");
          const target = channel === "stdout" ? process.stdout : process.stderr;
          if (!target.write(chunk as Buffer)) await once(target, "drain");
        }
      }
    };
    const stdout = consume(child.stdout!, "stdout");
    const stderr = consume(child.stderr!, "stderr");
    const exit = new Promise<number>((accept, reject) => {
      child!.once("error", reject);
      child!.once("close", (code, signal) => {
        if (code === null && signal === null) reject(new Error("Process closed without an exit status"));
        else accept(code ?? 128);
      });
    });
    const [code] = await Promise.all([exit, stdout, stderr]);
    if (code !== 0 && !options.allowFailure)
      throw new Error(`${JSON.stringify(argv)} in ${cwd} exited ${code}\nstdout:\n${output.stdout}\nstderr:\n${output.stderr}`);
    return { code, ...output };
  } catch (error) {
    if (child?.pid) {
      try { if (process.platform === "linux") process.kill(-child.pid, "SIGTERM"); else child.kill("SIGTERM"); }
      catch (killError) { if ((killError as NodeJS.ErrnoException).code !== "ESRCH") throw killError; }
    }
    throw error;
  } finally {
    if (child) children.delete(child);
    if (log) {
      log.end();
      await once(log, "close");
    }
  }
}

export async function git(cwd: string, ...args: string[]): Promise<string> {
  const result = await run(["git", "-c", "core.quotePath=false", ...args], cwd, {
    env: { GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" },
  });
  return result.stdout.replace(/\r?\n$/, "");
}

function pathsFromZ(value: string): string[] {
  return value.split("\0").filter((path) => path.length > 0);
}

export async function changedPaths(cwd: string): Promise<string[]> {
  const [tracked, untracked] = await Promise.all([
    git(cwd, "diff", "HEAD", "--name-only", "-z", "--no-renames"),
    git(cwd, "ls-files", "--others", "--exclude-standard", "-z"),
  ]);
  return [...new Set([...pathsFromZ(tracked), ...pathsFromZ(untracked)])]
    .filter((path) => !path.startsWith(".opencode/logs/"));
}

export async function assertOwned(
  cwd: string,
  phase: { ownedPaths: string[] },
  protectedPaths: string[],
): Promise<string[]> {
  const paths = await changedPaths(cwd);
  const root = await realpath(cwd);
  const allowed = new Set(phase.ownedPaths);
  const protectedGlobs = protectedPaths.map((pattern) => new Bun.Glob(pattern));
  for (const path of paths) {
    const parts = path.split("/");
    const name = parts.at(-1)!;
    if (!allowed.has(path) || protectedGlobs.some((glob) => glob.match(path)) ||
        parts.some((part) => [".git", ".opencode", ".env", "tests", "test", "__tests__", "fixtures", "__snapshots__"].includes(part)) ||
        /(?:^|\.)(?:test|spec)\./.test(name) || /\.(?:test|spec)\.[^/]+$/.test(name)) {
      throw new Error(`Unowned or protected change: ${path}`);
    }
    const target = resolve(root, path);
    if (relative(root, target).startsWith(`..${sep}`) || relative(root, target) === ".." || isAbsolute(relative(root, target)))
      throw new Error(`Path escapes worktree: ${path}`);
    let cursor = root;
    for (const part of parts) {
      cursor = resolve(cursor, part);
      try {
        const stat = await lstat(cursor);
        if (stat.isSymbolicLink()) throw new Error(`Symlink in changed path: ${path}`);
        const actual = await realpath(cursor);
        const rel = relative(root, actual);
        if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) throw new Error(`Path escapes worktree: ${path}`);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        break;
      }
    }
    const entry = await git(cwd, "ls-files", "--stage", "-z", "--", path);
    if (entry.startsWith("160000 ")) throw new Error(`Gitlink in changed path: ${path}`);
  }
  return paths;
}

export async function fingerprint(cwd: string): Promise<string> {
  const hash = createHash("sha256");
  const [head, branch, diff, untracked] = await Promise.all([
    git(cwd, "rev-parse", "HEAD"),
    git(cwd, "symbolic-ref", "--short", "HEAD"),
    git(cwd, "diff", "HEAD", "--binary", "--no-ext-diff", "--no-textconv", "--", ".", ":(exclude).opencode/logs"),
    git(cwd, "ls-files", "--others", "--exclude-standard", "-z"),
  ]);
  hash.update(JSON.stringify([head, branch, diff]));
  for (const path of pathsFromZ(untracked).filter((path) => !path.startsWith(".opencode/logs/")).sort()) {
    const stat = await lstat(resolve(cwd, path));
    hash.update(JSON.stringify([path, stat.mode]));
    hash.update(await readFile(resolve(cwd, path)));
  }
  return hash.digest("hex");
}

export async function assertClean(cwd: string): Promise<void> {
  const [paths, staged] = await Promise.all([
    changedPaths(cwd), git(cwd, "diff", "--cached", "--name-only", "-z"),
  ]);
  if (paths.length || staged) throw new Error(`Worktree is not clean: ${JSON.stringify(paths)}`);
}

export async function ensureWorktree(repo: string, path: string, branch: string, base: string): Promise<void> {
  const absolute = resolve(path);
  const list = await git(repo, "worktree", "list", "--porcelain", "-z");
  const records = list.split("\0\0").map((record) => record.split("\0"));
  const match = records.find((record) => record[0] === `worktree ${absolute}`);
  const branchRef = `refs/heads/${branch}`;
  if (match) {
    if (!match.includes(`branch ${branchRef}`)) throw new Error(`Worktree ${absolute} is on another branch`);
    const head = await git(absolute, "rev-parse", "HEAD");
    if ((await run(["git", "merge-base", "--is-ancestor", base, head], absolute, { allowFailure: true })).code !== 0)
      throw new Error(`Worktree ${absolute} is not based on ${base}`);
    if (await git(absolute, "symbolic-ref", "--short", "HEAD") !== branch)
      throw new Error(`Worktree ${absolute} is not pinned to ${branch}`);
    return;
  }
  try {
    if ((await readdir(absolute)).length) throw new Error(`Foreign nonempty directory: ${absolute}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const exists = await run(["git", "show-ref", "--verify", "--quiet", branchRef], repo, { allowFailure: true });
  if (exists.code === 0) {
    if (await git(repo, "rev-parse", branchRef) !== await git(repo, "rev-parse", base))
      throw new Error(`Branch ${branch} already exists without matching worktree`);
  } else if (exists.code !== 1) throw new Error(`Cannot inspect branch ${branch}: ${exists.stderr}`);
  await mkdir(dirname(absolute), { recursive: true });
  await git(repo, "worktree", "add", ...(exists.code === 0 ? [] : ["-b", branch]), absolute, exists.code === 0 ? branch : base);
  if (await git(absolute, "symbolic-ref", "--short", "HEAD") !== branch)
    throw new Error(`Worktree ${absolute} is not pinned to ${branch}`);
}

export async function commitPhase(
  cwd: string, paths: string[], message: string, operationId: string, parentSHA: string,
): Promise<string> {
  const [head, status, diff, staged, recent] = await Promise.all([
    git(cwd, "rev-parse", "HEAD"), git(cwd, "status", "--porcelain=v1", "-z"),
    git(cwd, "diff", "HEAD", "--stat"), git(cwd, "diff", "--cached", "--name-only", "-z"),
    git(cwd, "log", "--oneline", "-10"),
  ]);
  if (head !== parentSHA) {
    const [parents, trailer] = await Promise.all([
      git(cwd, "rev-list", "--parents", "-n", "1", "HEAD"),
      git(cwd, "log", "-1", "--format=%B"),
    ]);
    if (parents === `${head} ${parentSHA}` && trailer.split("\n").includes(`OpenCode-Operation: ${operationId}`)) {
      await assertClean(cwd);
      return head;
    }
    throw new Error(`Unexpected HEAD ${head}; expected ${parentSHA}. Recent commits:\n${recent}`);
  }
  if (!paths.length) throw new Error("Cannot commit an empty phase");
  const selected = new Set(paths);
  const preStaged = pathsFromZ(staged);
  if (preStaged.some((path) => !selected.has(path)))
    throw new Error(`Other paths already staged: ${JSON.stringify(preStaged)}; status: ${status}; diff: ${diff}; log: ${recent}`);
  await git(cwd, "--literal-pathspecs", "add", "--", ...paths);
  const stagedNow = pathsFromZ(await git(cwd, "diff", "--cached", "--name-only", "-z"));
  if (!stagedNow.length || stagedNow.some((path) => !selected.has(path)))
    throw new Error(`Unexpected staged changes: ${JSON.stringify(stagedNow)}`);
  const checkedTree = await git(cwd, "write-tree");
  await git(cwd, "commit", "-m", message, "-m", `OpenCode-Operation: ${operationId}`);
  await assertClean(cwd);
  if (await git(cwd, "rev-parse", "HEAD^{tree}") !== checkedTree)
    throw new Error("Commit hooks changed the validated tree; this commit requires revalidation before publication");
  return git(cwd, "rev-parse", "HEAD");
}

export async function assertUnpublished(repo: string, branch: string): Promise<void> {
  const remotes = (await git(repo, "remote")).split("\n").filter(Boolean);
  for (const remote of remotes) {
    const found = await git(repo, "ls-remote", "--heads", remote, `refs/heads/${branch}`);
    if (found) throw new Error(`Branch ${branch} is published on ${remote}; refusing to rewrite history`);
  }
}
