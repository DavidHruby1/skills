#!/usr/bin/env bun
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, realpath, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, relative, resolve, sep } from "node:path";
import { createOpencode } from "@opencode-ai/sdk/v2";
import type { OpencodeClient } from "@opencode-ai/sdk/v2";
import { z } from "zod";
import {
  DiagnosisSchema, ExecutionSchema, PlanSchema, PlannerResultSchema, PublicationSchema,
  ReviewSchema, TicketsSchema, WorkerResultSchema, validatePlan, validateReview,
  type Execution, type ExecutionPhase, type Review,
} from "./implement-schema.ts";
import {
  assertClean, assertOwned, assertUnpublished, changedPaths, commitPhase, ensureWorktree,
  fingerprint, git, run, stopChildren,
} from "./implement-git.ts";

type PhaseState = { session?: string; commit?: string; validated?: string; expectedTree?: string; fixes: number };
type State = {
  executionHash: string; planner?: string; tickets?: Record<string, string>;
  phases: Record<string, PhaseState>; reviewSessions: string[]; reviews: Review[];
  reviewHeads?: Array<Record<string, string>>;
  repairsComplete?: number; parents?: Record<string, string>;
  published: Record<string, string>; linked?: Record<string, boolean>;
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const json = (value: unknown) => JSON.stringify(value, null, 2);
const taskId = process.argv[2];
if (!taskId || !/^task-[0-9]+$/.test(taskId) || process.argv.length !== 3) {
  console.error("Usage: implement task-001");
  process.exit(2);
}

let interrupted = false;
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, () => {
  interrupted = true;
  stopChildren();
});
const checkInterrupted = () => { if (interrupted) throw new Error("Interrupted; rerun the same command to resume."); };

function checked<T>(result: { data?: T; error?: unknown }, label: string): T {
  if (result.error || !result.data) throw new Error(`${label}: ${json(result.error ?? "empty SDK response")}`);
  return result.data;
}

async function save(path: string, state: State): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.tmp`;
  await writeFile(tmp, json(state) + "\n", { mode: 0o600 });
  await rename(tmp, path);
}

async function session(client: OpencodeClient, state: State, path: string, key: "planner" | "reviewSessions", directory: string, title: string, index = 0): Promise<string> {
  const old = key === "planner" ? state.planner : state.reviewSessions[index];
  if (old) {
    checked(await client.session.get({ sessionID: old, directory }), `session ${old}`);
    return old;
  }
  const created = checked(await client.session.create({ directory, title }), `create ${title}`);
  if (key === "planner") state.planner = created.id;
  else state.reviewSessions[index] = created.id;
  await save(path, state);
  return created.id;
}

async function prompt<T extends z.ZodType>(client: OpencodeClient, directory: string, sessionID: string, agent: string, text: string, schema: T, readOnly = false): Promise<z.infer<T>> {
  checkInterrupted();
  const response = checked(await client.session.prompt({
    sessionID, directory, agent,
    ...(readOnly ? { tools: { edit: false, write: false, apply_patch: false, bash: false, task: false } } : {}),
    format: { type: "json_schema", schema: z.toJSONSchema(schema), retryCount: 2 },
    parts: [{ type: "text", text }],
  }), `${agent} prompt`);
  if (response.info.error || !response.info.time.completed) throw new Error(`${agent} failed or did not finish: ${json(response.info.error)}`);
  if (response.info.structured === undefined) throw new Error(`${agent} returned no structured output`);
  return schema.parse(response.info.structured);
}

function remoteIdentity(url: string): string | null {
  const match = url.match(/^(?:ssh:\/\/git@|https?:\/\/|git@)([^/:]+)[:/]([^?#]+?)(?:\.git)?\/?$/);
  return match ? `${match[1]}/${match[2].replace(/\.git$/, "")}` : null;
}

async function inside(root: string, subpath: string): Promise<string> {
  const path = resolve(root, subpath);
  const rel = relative(await realpath(root), await realpath(path));
  if (rel === ".." || rel.startsWith(`..${sep}`) || rel.startsWith(sep)) throw new Error(`Path escapes repository: ${subpath}`);
  return path;
}

function allowedReadme(spec: string): boolean {
  return /^(?:status:\s*accepted|\*\*status:\*\*\s*accepted)\s*$/im.test(spec);
}

async function main(): Promise<void> {
  const repo = await git(process.cwd(), "rev-parse", "--show-toplevel");
  const base = "stage";
  const baseSHA = await git(repo, "rev-parse", "--verify", `refs/heads/${base}^{commit}`);
  const taskDir = join(repo, ".opencode", "tasks", taskId);
  const proposal = await readFile(join(taskDir, "PROPOSAL.md"), "utf8");
  const spec = await readFile(join(taskDir, "SPEC.md"), "utf8");
  if (!allowedReadme(spec)) throw new Error("SPEC.md must explicitly declare Status: accepted");
  const executionFile = join(taskDir, "execution.json");
  const stateFile = join(process.env.XDG_STATE_HOME ?? join(homedir(), ".local", "state"), "opencode", "implement", hash(repo), `${taskId}.json`);
  const rawState = existsSync(stateFile) ? JSON.parse(await readFile(stateFile, "utf8")) as State : undefined;
  let state: State = rawState ?? { executionHash: "", phases: {}, reviewSessions: [], reviews: [], published: {} };
  state.parents ??= {};
  state.linked ??= {};
  state.reviewHeads ??= [];
  const { client, server } = await createOpencode();
  try {
    let execution: Execution;
    if (existsSync(executionFile)) {
      execution = ExecutionSchema.parse(JSON.parse(await readFile(executionFile, "utf8")));
    } else {
      if (state.executionHash) throw new Error("Previously saved execution.json is missing; refusing to replan side effects");
      const id = await session(client, state, stateFile, "planner", repo, `${taskId}: execution planning`);
      let answer = await prompt(client, repo, id, "build", `Read the complete ${join(taskDir, "PROPOSAL.md")} and ${join(taskDir, "SPEC.md")} and all relevant production sources and project instructions. SPEC is binding; proposal is background and traceability. Produce a detailed step-by-step implementation plan for ONE repository with the fewest small, coherent, individually testable vertical-slice PRs in linear order. Each phase must have exact owned files, concrete ordered worker steps, precise binding contracts, safe intermediate state, accepted criteria, read-first production symbols, code-size estimate (aim <=500 lines; justify indivisible larger slices). No tests authored by workers; identify all existing tests/fixtures/config as protectedPaths, existing setup and runnable verification commands with source evidence and argv (no shell), and provider remote identity. Do not invent commands. Return blocked if evidence or decisions are missing. Current root: ${repo}.\nPROPOSAL.md:\n${proposal}\nSPEC.md:\n${spec}`, PlannerResultSchema, true);
      for (let attempt = 0; attempt < 3; attempt++) {
        if (answer.status === "blocked" || !answer.plan) throw new Error(`Planning blocked: ${answer.reason}`);
        try { validatePlan(answer.plan, spec); break; }
        catch (error) {
          if (attempt === 2) throw error;
          answer = await prompt(client, repo, id, "build", `Repair ONLY these deterministic plan errors; re-read both documents and return the FULL corrected plan:\n${String(error)}`, PlannerResultSchema, true);
        }
      }
      const plan = PlanSchema.parse(answer.plan);
      validatePlan(plan, spec);
      const remote = await git(repo, "remote", "get-url", plan.repository.remote);
      if (remoteIdentity(remote) !== plan.repository.identity) throw new Error(`Remote identity mismatch: ${remote} != ${plan.repository.identity}`);
      const repoKey = hash(repo).slice(0, 16);
      execution = ExecutionSchema.parse({
        ...plan, version: 1, taskId, proposalHash: hash(proposal), specHash: hash(spec), integrationBranch: base, baseSHA,
        phases: plan.phases.map((phase, index) => ({ ...phase, id: `phase-${String(index + 1).padStart(2, "0")}`,
          branch: `${taskId}/phase-${String(index + 1).padStart(2, "0")}`,
          target: index ? `${taskId}/phase-${String(index).padStart(2, "0")}` : base,
          worktree: join(homedir(), ".local", "state", "opencode", "worktrees", repoKey, taskId, `phase-${String(index + 1).padStart(2, "0")}`) })),
      });
      await writeFile(executionFile, json(execution) + "\n", { flag: "wx" });
    }
    if (execution.taskId !== taskId || execution.proposalHash !== hash(proposal) || execution.specHash !== hash(spec) || execution.integrationBranch !== base || execution.baseSHA !== baseSHA)
      throw new Error("Task documents or base branch changed since planning; stop and reconcile manually");
    validatePlan(execution, spec);
    const executionHash = hash(await readFile(executionFile, "utf8"));
    if (state.executionHash && state.executionHash !== executionHash) throw new Error("execution.json was changed after execution started");
    state.executionHash = executionHash;
    await save(stateFile, state);
    const prMap = execution.phases.map((phase, index) => ({
      id: phase.id, source: `${execution.repository.identity}:${phase.branch}`,
      start: `${execution.repository.identity}:${phase.target}`,
      initialTarget: `${execution.repository.identity}:${phase.target}`,
      finalIntegrationTarget: `${execution.repository.identity}:${base}`,
      dependsOn: index ? [execution.phases[index - 1].id] : [],
      transition: index ? `After ${execution.phases[index - 1].id} merges into ${base}, retarget to ${base}` : "none",
    }));

    if (!state.tickets) {
      const ticketSession = checked(await client.session.create({ directory: repo, title: `${taskId}: issues` }), "create ticket session");
      const tickets = await prompt(client, repo, ticketSession.id, "ticket-master", `Action: reconcile. Project root: ${repo}. Task ID: ${taskId}. Execution plan: ${executionFile}. Tracking repository: ${execution.repository.identity}. Complete PR map: ${json(prMap)}. Create/verify parent + phase issues and both labels opencode-task and ${taskId}. Follow all ticket-master marker, provider identity, nonduplication, and human-content rules. Return ONLY structured result with phase issue URLs.`, TicketsSchema);
      if (tickets.status !== "pass" || tickets.issues.length !== execution.phases.length || execution.phases.some(p => !tickets.issues.some(i => i.phaseId === p.id))) throw new Error(`Issue reconciliation incomplete: ${json(tickets)}`);
      state.tickets = Object.fromEntries(tickets.issues.map(i => [i.phaseId, i.url]));
      await save(stateFile, state);
    }

    async function runChecks(phase: ExecutionPhase, phaseState: PhaseState): Promise<void> {
      let before = await fingerprint(phase.worktree);
      if (phaseState.validated === before) return;
      for (let attempt = phaseState.fixes; attempt <= 3; attempt++) {
        let failure = "";
        for (const command of execution.checks) {
          const cwd = await inside(phase.worktree, command.cwd);
          const result = await run(command.argv, cwd, { allowFailure: true, logPath: join(stateFile + ".logs", phase.id + ".log") });
          const after = await fingerprint(phase.worktree);
          if (after !== before) throw new Error(`Check ${command.name} modified ${phase.id} worktree; inspect and clean it manually`);
          if (result.code) { failure = `${command.name} exited ${result.code}:\n${result.stdout}\n${result.stderr}`; break; }
        }
        if (!failure) { phaseState.validated = before; phaseState.fixes = 0; await save(stateFile, state); return; }
        if (attempt === 3) throw new Error(`${phase.id}: checks failed after 3 repairs: ${failure}`);
        const diagnosisSession = checked(await client.session.create({ directory: phase.worktree, title: `${phase.id}: check diagnosis` }), "diagnosis session");
        const diagnosis = await prompt(client, phase.worktree, diagnosisSession.id, "build", `You are READ ONLY: tools edit, bash, task, and skill are prohibited. Diagnose the failing check from production code and this command output; do NOT read test source, fixtures, assertions or coverage. Identify the owning phase, production counterexample and recommended fix; or report blocked if this is an environment/test-contract problem. Plan phases: ${json(execution.phases.map(p => ({ id: p.id, paths: p.ownedPaths })))}. Failure:\n${failure}`, DiagnosisSchema, true);
        if (diagnosis.status !== "fix" || diagnosis.phaseId !== phase.id) throw new Error(`Cross-phase or blocked diagnosis at ${phase.id}: ${json(diagnosis)}. Stop rather than repair in the wrong PR.`);
        phaseState.fixes = attempt + 1;
        await save(stateFile, state);
        const result = await prompt(client, phase.worktree, phaseState.session!, "worker", `Assignment ${phase.id}, work path ${phase.worktree}. Fix this production failure within assigned owned files only. Do not read, modify, seek or run tests, Git or shell. Counterexample: ${diagnosis.counterexample}. Suggested correction: ${diagnosis.recommendedFix}. Keep SPEC contracts: ${json(phase.specRefs)}. Return structured status.`, WorkerResultSchema);
        if (result.status !== "done") throw new Error(`Worker blocked: ${result.summary}`);
        await assertOwned(phase.worktree, phase, execution.protectedPaths);
        before = await fingerprint(phase.worktree);
      }
    }

    for (let i = 0; i < execution.phases.length; i++) {
      checkInterrupted();
      const phase = execution.phases[i];
      const previous = execution.phases[i - 1];
      const parent = previous ? state.phases[previous.id]?.commit : baseSHA;
      if (!parent) throw new Error(`Missing predecessor commit for ${phase.id}`);
      state.phases[phase.id] ??= { fixes: 0 };
      const item = state.phases[phase.id];
      if (!item.commit) await assertUnpublished(repo, phase.branch);
      await ensureWorktree(repo, phase.worktree, phase.branch, state.parents![phase.id] ?? parent);
      if (item.commit) {
        if (await git(phase.worktree, "rev-parse", "HEAD") !== item.commit) throw new Error(`Unexpected ${phase.id} HEAD`);
        await assertClean(phase.worktree);
        continue;
      }
      const current = await git(phase.worktree, "rev-parse", "HEAD");
      if (current !== parent) {
        if (!item.expectedTree || item.expectedTree !== await git(phase.worktree, "rev-parse", "HEAD^{tree}")) throw new Error(`Unverified commit tree for ${phase.id}; inspect before resuming`);
        item.commit = await commitPhase(phase.worktree, [], phase.commitMessage, `${taskId}/${phase.id}/initial`, parent);
        state.parents![phase.id] = parent;
        item.validated = await fingerprint(phase.worktree);
        await save(stateFile, state);
        continue;
      }
      if (!item.session) {
        for (const command of execution.setup) {
          const cwd = await inside(phase.worktree, command.cwd);
          await run(command.argv, cwd, { logPath: join(stateFile + ".logs", phase.id + ".log") });
        }
        await assertClean(phase.worktree);
        item.session = checked(await client.session.create({ directory: phase.worktree, title: `${taskId}: ${phase.id}` }), "worker session").id;
        await save(stateFile, state);
      }
      const modified = await changedPaths(phase.worktree);
      if (!modified.length) {
        const worker = await prompt(client, phase.worktree, item.session, "worker", `Standalone assignment ${phase.id}. Work path: ${phase.worktree}. Assigned production paths: ${json(phase.ownedPaths)}. Read first: ${json(phase.readFirst)}. Complete binding phase plan: ${json(phase)}. Relevant binding SPEC excerpts: ${json(phase.specRefs)}. Implement only this phase. Do not read, seek, edit or run tests; do not use Git, shell, validation, or delegate. Do not change task artifacts. Return structured status and summary.`, WorkerResultSchema);
        if (worker.status !== "done") throw new Error(`Worker blocked on ${phase.id}: ${worker.summary}`);
      }
      if (!(await assertOwned(phase.worktree, phase, execution.protectedPaths)).length) throw new Error(`${phase.id} has no changes; refusing an empty PR`);
      await runChecks(phase, item);
      const checkedPaths = await assertOwned(phase.worktree, phase, execution.protectedPaths);
      await git(phase.worktree, "--literal-pathspecs", "add", "--", ...checkedPaths);
      item.expectedTree = await git(phase.worktree, "write-tree");
      await save(stateFile, state);
      item.commit = await commitPhase(phase.worktree, checkedPaths, phase.commitMessage, `${taskId}/${phase.id}/initial`, parent);
      state.parents![phase.id] = parent;
      item.validated = await fingerprint(phase.worktree);
      await save(stateFile, state);
    }

    const reviewContext = async () => {
      const slices = [];
      for (let i = 0; i < execution.phases.length; i++) {
        const p = execution.phases[i];
        const from = i ? state.phases[execution.phases[i - 1].id].commit! : baseSHA;
        const to = state.phases[p.id].commit!;
        if (await git(p.worktree, "rev-parse", "HEAD") !== to) throw new Error(`Moved HEAD during review for ${p.id}`);
        await assertClean(p.worktree);
        slices.push({ phaseId: p.id, from, to, path: p.worktree, diff: await git(p.worktree, "diff", `${from}..${to}`, "--", ".", ":(exclude)**/*.test.*", ":(exclude)**/*.spec.*", ":(exclude)**/tests/**"), checks: { commands: execution.checks, fingerprint: state.phases[p.id].validated, log: join(stateFile + ".logs", p.id + ".log") } });
      }
      return slices;
    };

    while (true) {
      const last = state.reviews.at(-1);
      if (last?.status === "pass") break;
      if (!last || state.repairsComplete === state.reviews.length) {
        if (state.reviews.length === 3) break;
        const round = state.reviews.length + 1;
        const slices = await reviewContext();
        let result: Review;
        if (round === 1) {
          const ids = await Promise.all([0, 1].map((index) => session(client, state, stateFile, "reviewSessions", repo, `${taskId}: review ${index ? "Spec" : "Standards"}`, index)));
          const axes = await Promise.all(ids.map((id, index) => prompt(client, repo, id, "inspector", `Axis: ${index ? "Spec" : "Standards"}; Mode: standalone. Perform full read-only review of ALL PR slices and cross-PR behavior. Inspect relevant unchanged production callers and contracts. Do not read or assess test sources/coverage. Do not edit or run commands that change Git state. Use current code-review Standards/Spec criteria. For each proven finding give phase owner, exact changed path, evidence and concrete recommended repair. Other axis verdict must be pass; return structured JSON. Proposal:\n${proposal}\nAccepted SPEC:\n${spec}\nExecution:\n${json(execution)}\nPinned diffs and validation evidence:\n${json(slices)}`, ReviewSchema)));
          if (axes.some(r => r.status === "blocked")) throw new Error(`Initial review blocked: ${json(axes)}`);
          result = ReviewSchema.parse({ status: axes.some(r => r.findings.length) ? "rework" : "pass", standardsVerdict: axes[0].standardsVerdict, specVerdict: axes[1].specVerdict, summary: axes.map(r => r.summary).join("; "), findings: axes.flatMap(r => r.findings), resolutions: [], blocker: "" });
        } else {
          const id = await session(client, state, stateFile, "reviewSessions", repo, `${taskId}: correction review`, 2);
          const corrections = await Promise.all(slices.map(async (slice) => ({ phaseId: slice.phaseId, diff: await git(slice.path, "diff", `${state.reviewHeads!.at(-1)![slice.phaseId]}..${slice.to}`, "--", ".", ":(exclude)**/*.test.*", ":(exclude)**/*.spec.*", ":(exclude)**/tests/**") })));
          result = await prompt(client, repo, id, "inspector", `Axis: All; Mode: standalone. One-agent correction review, NOT a fresh full review. Check each finding from the previous report against CURRENT code. Return fixed/not_fixed/superseded for every prior finding ID; inspect repair diff and affected integration contracts for regressions or new serious defects. Never claim a fresh independent full-review pass. Base verdicts on current findings and resolutions. Read-only, no test source/coverage. Previous review:\n${json(state.reviews.at(-1))}\nActual correction diffs since that review:\n${json(corrections)}\nProposal:\n${proposal}\nSPEC:\n${spec}\nCurrent execution:\n${json(execution)}\nCurrent pinned slices:\n${json(slices)}`, ReviewSchema);
        }
        validateReview(result, execution, state.reviews.at(-1));
        state.reviews.push(result);
        state.reviewHeads!.push(Object.fromEntries(slices.map(slice => [slice.phaseId, slice.to])));
        await save(stateFile, state);
        if (result.status === "blocked") throw new Error(`Review blocked: ${result.blocker}`);
        if (result.status === "pass") break;
      }
      const result = state.reviews.at(-1)!;
      const round = state.reviews.length;

      for (const phase of execution.phases.filter(p => result.findings.some(f => f.phaseId === p.id))) {
        const item = state.phases[phase.id];
        const previousCommit = item.commit!;
        await assertUnpublished(repo, phase.branch);
        const alreadyRepaired = (await git(phase.worktree, "log", "-1", "--format=%B")).split("\n").includes(`OpenCode-Operation: ${taskId}/${phase.id}/review-${round}`);
        if (alreadyRepaired && (item.expectedTree !== await git(phase.worktree, "rev-parse", "HEAD^{tree}") ||
          (await git(phase.worktree, "rev-parse", "HEAD")) !== previousCommit &&
          (await git(phase.worktree, "rev-parse", "HEAD^")) !== previousCommit))
          throw new Error(`Unverified previous repair commit for ${phase.id}`);
        if (!alreadyRepaired && await git(phase.worktree, "rev-parse", "HEAD") === previousCommit) {
          if (!(await changedPaths(phase.worktree)).length) {
            const repair = await prompt(client, phase.worktree, item.session!, "worker", `Assignment ${phase.id}; work path ${phase.worktree}. Correct only these verified production findings within owned files; recommendedFix is guidance subordinate to binding SPEC and source. Do NOT read/seek/edit/run tests, Git, shell, or task artifacts. Findings: ${json(result.findings.filter(f => f.phaseId === phase.id))}. Relevant SPEC excerpts: ${json(phase.specRefs)}. Return structured status.`, WorkerResultSchema);
            if (repair.status !== "done") throw new Error(`Repair blocked: ${repair.summary}`);
          }
          const paths = await assertOwned(phase.worktree, phase, execution.protectedPaths);
          if (!paths.length) throw new Error(`Review findings for ${phase.id} were not changed`);
          item.validated = undefined;
          await save(stateFile, state);
          await runChecks(phase, item);
        }
        if (!alreadyRepaired) {
          const paths = await assertOwned(phase.worktree, phase, execution.protectedPaths);
          if (paths.length) {
            await git(phase.worktree, "--literal-pathspecs", "add", "--", ...paths);
            item.expectedTree = await git(phase.worktree, "write-tree");
            await save(stateFile, state);
          } else if (!item.expectedTree || item.expectedTree !== await git(phase.worktree, "rev-parse", "HEAD^{tree}")) {
            throw new Error(`Unverified repair commit tree for ${phase.id}`);
          }
          item.commit = await commitPhase(phase.worktree, paths, `Fix ${phase.id} review findings`, `${taskId}/${phase.id}/review-${round}`, previousCommit);
        }
        else item.commit = await git(phase.worktree, "rev-parse", "HEAD");
        item.validated = await fingerprint(phase.worktree);
        await save(stateFile, state);

        for (let i = execution.phases.indexOf(phase) + 1; i < execution.phases.length; i++) {
          const child = execution.phases[i];
          const before = execution.phases[i - 1];
          const childState = state.phases[child.id];
          const newParent = state.phases[before.id].commit!;
          const currentChild = await git(child.worktree, "rev-parse", "HEAD");
          if ((await run(["git", "merge-base", "--is-ancestor", newParent, currentChild], child.worktree, { allowFailure: true })).code !== 0) {
            if (currentChild !== childState.commit) throw new Error(`Unexpected or incomplete rebase on ${child.id}; resolve before resuming`);
            await assertUnpublished(repo, child.branch);
            await assertClean(child.worktree);
            const oldParent = state.parents![child.id];
            if (!oldParent) throw new Error(`Missing previous parent for ${child.id}`);
            const rebase = await run(["git", "rebase", "--onto", newParent, oldParent, child.branch], child.worktree, { allowFailure: true });
            if (rebase.code) throw new Error(`Rebase conflict on ${child.id}; preserve worktree and resolve before resume: ${rebase.stderr}`);
          }
          childState.commit = await git(child.worktree, "rev-parse", "HEAD");
          state.parents![child.id] = newParent;
          childState.validated = undefined;
          await save(stateFile, state);
          await runChecks(child, childState);
          childState.validated = await fingerprint(child.worktree);
          await save(stateFile, state);
        }
      }
      state.repairsComplete = round;
      await save(stateFile, state);
    }

    for (const phase of execution.phases) {
      if (!state.phases[phase.id].validated || state.phases[phase.id].validated !== await fingerprint(phase.worktree)) throw new Error(`Unvalidated final worktree ${phase.id}`);
      await assertClean(phase.worktree);
    }
    const finalReview = state.reviews.at(-1);
    if (!finalReview || finalReview.status === "blocked") throw new Error("No completed review gate");
    if (await git(repo, "rev-parse", "--verify", `refs/heads/${base}^{commit}`) !== baseSHA)
      throw new Error("Integration branch moved since planning; verify the stack before publication");
    console.log(finalReview.status === "pass" ? "Review PASS" : "Third-round findings repaired; final corrections were NOT independently re-reviewed.");

    for (const phase of execution.phases) {
      if (!state.published[phase.id]) {
        const publishSession = checked(await client.session.create({ directory: phase.worktree, title: `${taskId}: publish ${phase.id}` }), "publication session");
        const result = await prompt(client, phase.worktree, publishSession.id, "build", `Load the create-pr skill and follow its SINGLE-BRANCH publication contract. Explicit branch ${phase.branch}, exact target ${phase.target}, repo ${execution.repository.identity}, verified tracked issue ${state.tickets![phase.id]}. Do not infer task-wide PLAN.md mode. Inspect current source/target and their diff, preserve unrelated changes, prepare/push/create-or-update only this PR, write Czech template with Tracked by issue URL, verify provider source/target/URL and remote diff. Prior checks: ${json(state.phases[phase.id])}. Review: ${finalReview.status === "pass" ? "PASS" : "Round 3 corrections were tested but NOT independently re-reviewed"}. Return structured publication status and verified URL. Source commit ${state.phases[phase.id].commit}.`, PublicationSchema);
        if (result.status !== "published" || !result.url) throw new Error(`Publication blocked at ${phase.id}: ${result.summary}`);
        const remoteHead = await git(repo, "ls-remote", "--heads", execution.repository.remote, `refs/heads/${phase.branch}`);
        if (remoteHead.split(/\s+/)[0] !== state.phases[phase.id].commit) throw new Error(`Published ${phase.id} source SHA differs from validated commit; URL: ${result.url}`);
        state.published[phase.id] = result.url;
        await save(stateFile, state);
      }
      if (state.linked![phase.id]) continue;
      const linkSession = checked(await client.session.create({ directory: repo, title: `${taskId}: link ${phase.id}` }), "link session");
      const linked = await prompt(client, repo, linkSession.id, "ticket-master", `Action: link-prs. Project root ${repo}; execution plan ${executionFile}; task ${taskId}; repository ${execution.repository.identity}; full PR map ${json(prMap)}; newly published ${phase.id}: ${state.published[phase.id]}. Verify provider identity and match, link issue marker and preserve human notes. Return structured ticket summary with all phase URLs.`, TicketsSchema);
      if (linked.status !== "pass") throw new Error(`PR ${state.published[phase.id]} was published but issue linking failed: ${linked.summary}`);
      state.linked![phase.id] = true;
      await save(stateFile, state);
    }
    console.log(json({ taskId, review: finalReview.status, rounds: state.reviews.length, prs: state.published, mergeOrder: execution.phases.map(p => p.id) }));
  } finally {
    server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
