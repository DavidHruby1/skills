import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve } from "node:path";

export default async ({ client, directory }) => {
    const configured = Number(process.env.OPENCODE_LARGE_READ_MIN_LINES ?? 350);
    const maxLines = Number.isSafeInteger(configured) && configured > 0 ? configured : 350;

    return {
        "tool.execute.before": async ({ tool, sessionID }, { args }) => {
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

            throw new Error(
                `[large-read-guard] Requested text range exceeds ${maxLines} lines. `
                + `If you know the symbol, use grep then read with an explicit limit <= ${maxLines} `
                + "and the appropriate offset. For broader exploration, use task with "
                + 'subagent_type: "explore"; give it the file path and your specific question, '
                + "and request concise findings with source locations, not the full file. "
                + "Read the relevant source ranges yourself before editing or verifying a fix; "
                + "read adjacent ranges if broader context is necessary."
            );
        },
    };
};
