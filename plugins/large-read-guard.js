import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

export default async ({ client, directory }) => {
    const configured = Number(process.env.OPENCODE_LARGE_READ_MIN_LINES ?? 350);
    const maxLines = Number.isSafeInteger(configured) && configured > 0 ? configured : 350;
    const pendingDelegations = new Map();

    return {
        "tool.execute.before": async ({ tool, sessionID }, { args }) => {
            const pending = pendingDelegations.get(sessionID);
            if (pending) {
                if (tool !== "task" || args.subagent_type !== "explore") {
                    throw new Error(
                        `[large-read-guard] Delegation is required before any other tool call. `
                        + `Call task with subagent_type: "explore" for ${pending.filePath}.`
                    );
                }
                if (typeof args.prompt !== "string" || !args.prompt.trim()) {
                    throw new Error(
                        "[large-read-guard] The required explore task must include a specific, non-empty prompt."
                    );
                }

                args.prompt = `${args.prompt.trim()}\n\n`
                    + `Required delegated scope: inspect ${pending.filePath}, starting near line ${pending.offset}, `
                    + `to answer this task's concrete question. Return concise findings with source locations; `
                    + `do not return the full file.`;
                pendingDelegations.delete(sessionID);
                return;
            }

            if (tool !== "read") return;
            const offset = args.offset ?? 1;
            const limit = args.limit ?? 2000; // OpenCode's default Read limit.
            if (!Number.isSafeInteger(offset) || offset < 1
                || !Number.isSafeInteger(limit) || limit < 1) return;
            if (limit <= maxLines) return;

            const filePath = resolve(directory, args.filePath);
            // These are attachments, not line-oriented text reads.
            if ([".pdf", ".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(extname(filePath).toLowerCase())) return;

            let lines = 0;
            let lastByte;
            const boundary = offset - 1 + maxLines;
            try {
                if (!(await stat(filePath)).isFile()) return;
                // Count bytes in bounded chunks, including an unterminated last line.
                // Stop as soon as the requested range exceeds the budget.
                for await (const chunk of createReadStream(filePath, { highWaterMark: 8192 })) {
                    if (chunk.includes(0)) return; // Leave binary handling to Read.
                    lastByte = chunk[chunk.length - 1];
                    for (const byte of chunk) {
                        if (byte === 10) lines++;
                        if (lines > boundary) break;
                    }
                    if (lines > boundary) break;
                }
                if (lastByte !== undefined && lastByte !== 10) lines++;
            } catch (error) {
                // Let Read report ordinary path/access errors through its normal checks.
                if (["ENOENT", "ENOTDIR", "EACCES", "EPERM"].includes(error.code)) return;
                throw error;
            }
            if (lines <= boundary) return;

            let session;
            try {
                const result = await client.session.get({
                    path: { id: sessionID },
                    query: { directory },
                    throwOnError: true,
                });
                session = result.data;
                if (!session?.id) throw new Error("Missing session");
            } catch {
                // This is a context optimization, not a security boundary. Do not
                // strand a subagent when its session metadata is unavailable.
                console.warn("[large-read-guard] Session lookup failed; leaving this read unrestricted.");
                return;
            }
            if (session.parentID) return;

            pendingDelegations.set(sessionID, { filePath, offset });
            throw new Error(
                `[large-read-guard] Requested text range exceeds ${maxLines} lines. `
                + "Before any other tool call, you must use task with "
                + 'subagent_type: "explore" and a specific question. The guard will add the file path '
                + "and requested starting line to that task. "
                + "Read the relevant source ranges yourself before editing or verifying a fix; "
                + "read adjacent ranges if broader context is necessary."
            );
        },
    };
};
