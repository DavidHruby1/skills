import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { join, parse, resolve, sep } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

export default async ({ directory: workingDirectory, worktree }) => {
    // OpenCode can use the filesystem root as worktree outside a repository.
    const root = resolve(worktree && worktree !== parse(worktree).root ? worktree : workingDirectory);
    const globalConfigDirectory = resolve(homedir(), ".config", "opencode");
    if (root === globalConfigDirectory || root.startsWith(`${globalConfigDirectory}${sep}`)) return {};
    const directory = join(root, ".opencode", "logs");
    // A process can host multiple plugin instances, so PID alone is not unique.
    const instance = `${process.pid}-${randomUUID()}`;
    const queue = [];
    const messages = new Map();
    const snapshots = new Map();
    const errorTypes = new Set([
        "ProviderAuthError", "UnknownError", "MessageOutputLengthError",
        "MessageAbortedError", "StructuredOutputError", "ContextOverflowError",
        "ContentFilterError", "APIError", "ApiError",
    ]);
    let queuedBytes = 0;
    let writer;
    let closed = false;
    let failed = false;
    let warned = false;
    let initialized = false;

    function warn() {
        if (warned) return;
        warned = true;
        console.warn("[observability] Some records were dropped; logging is best-effort.");
    }

    function remember(map, key, value) {
        map.set(key, value);
        if (map.size > 4096) map.delete(map.keys().next().value);
    }

    function errorType(error) {
        return error ? (errorTypes.has(error.name) ? error.name : "UnknownError") : undefined;
    }

    function toolErrorCategory(error) {
        if (typeof error !== "string") return "unknown";
        if (error.startsWith("ENOENT:") || error.startsWith("NotFoundError:")) return "not_found";
        if (error.startsWith("EACCES:") || error.startsWith("EPERM:") || error.startsWith("PermissionDeniedError:")) {
            return "permission_denied";
        }
        if (error.startsWith("ETIMEDOUT:") || error.startsWith("TimeoutError:")) return "timeout";
        if (error.startsWith("AbortError:") || error.startsWith("CancelledError:") || error.startsWith("CanceledError:")) {
            return "cancelled";
        }
        return "unknown";
    }

    async function drain() {
        try {
            if (!initialized) {
                await mkdir(directory, { recursive: true, mode: 0o700 });
                try {
                    await writeFile(join(directory, ".gitignore"), "*\n", { flag: "wx", mode: 0o600 });
                } catch (error) {
                    if (error.code !== "EEXIST") throw error;
                }
                initialized = true;
            }
            while (queue.length) {
                const first = queue[0];
                const batch = [];
                while (queue.length && queue[0].day === first.day && batch.length < 256) {
                    const item = queue.shift();
                    queuedBytes -= item.bytes;
                    batch.push(item.line);
                }
                await appendFile(join(directory, `${first.day}-${instance}.jsonl`), batch.join(""), {
                    encoding: "utf8",
                    mode: 0o600,
                });
            }
        } catch {
            // Do not retry every event on a full or inaccessible disk.
            failed = true;
            queue.length = 0;
            queuedBytes = 0;
            warn();
        } finally {
            writer = undefined;
        }
    }

    function record(data, key, dedupData = data) {
        const snapshot = JSON.stringify(dedupData);
        if (key && snapshots.get(key) === snapshot) return;
        const ts = new Date().toISOString();
        const line = JSON.stringify({ v: 1, ts, ...data }) + "\n";
        const bytes = Buffer.byteLength(line);
        if (queue.length >= 1024 || queuedBytes + bytes > 1024 * 1024 || bytes > 16384) {
            warn();
            return;
        }
        if (key) remember(snapshots, key, snapshot);
        queue.push({ day: ts.slice(0, 10), line, bytes });
        queuedBytes += bytes;
        if (!writer) writer = drain();
    }

    return {
        async event({ event }) {
            if (closed || failed) return;
            try {
                const p = event.properties;
                if (event.type === "message.updated" && p.info.role === "assistant") {
                    const m = p.info;
                    const key = `${m.sessionID}:${m.id}`;
                    const agent = typeof m.agent === "string" ? m.agent : null;
                    remember(messages, key, agent);
                    if (m.time.completed === undefined) return;
                    record({
                        kind: "llm", sessionID: m.sessionID, messageID: m.id, agent,
                        provider: m.providerID, model: m.modelID,
                        status: m.error ? "error" : "completed",
                        messageDurationMs: m.time.completed - m.time.created,
                        inputTokens: m.tokens.input, outputTokens: m.tokens.output,
                        reasoningTokens: m.tokens.reasoning,
                        cacheReadTokens: m.tokens.cache.read, cacheWriteTokens: m.tokens.cache.write,
                        reportedCost: m.cost, errorType: errorType(m.error),
                    }, `llm:${key}`);
                } else if (event.type === "message.part.updated" && p.part.type === "tool") {
                    const part = p.part;
                    const state = part.state;
                    const toolKey = `${part.sessionID}:${part.messageID}:${part.callID}`;
                    const agent = messages.get(`${part.sessionID}:${part.messageID}`) ?? null;
                    if (state.status === "running") {
                        const start = {
                            kind: "tool", sessionID: part.sessionID, messageID: part.messageID,
                            partID: part.id, callID: part.callID,
                            tool: part.tool, status: "running", startedAt: state.time.start,
                        };
                        record({ ...start, agent }, `tool-start:${toolKey}`, start);
                    } else if (state.status === "completed" || state.status === "error") {
                        record({
                            kind: "tool", sessionID: part.sessionID, messageID: part.messageID,
                            partID: part.id, callID: part.callID, agent,
                            tool: part.tool, status: state.status,
                            durationMs: state.time.end - state.time.start,
                            ...(state.status === "error" ? { errorCategory: toolErrorCategory(state.error) } : {}),
                        }, `tool:${toolKey}`);
                    }
                } else if (event.type === "session.created") {
                    record({
                        kind: "session", sessionID: p.info.id,
                        parentSessionID: p.info.parentID ?? null, status: "created",
                    }, `created:${p.info.id}`);
                } else if (event.type === "session.status") {
                    const status = p.status;
                    record({
                        kind: "session", sessionID: p.sessionID, status: status.type,
                        attempt: status.type === "retry" ? status.attempt : undefined,
                        nextRetryAt: status.type === "retry" ? status.next : undefined,
                    }, `status:${p.sessionID}`);
                } else if (event.type === "session.idle") {
                    record({ kind: "session", sessionID: p.sessionID, status: "idle" }, `status:${p.sessionID}`);
                } else if (event.type === "session.error") {
                    record({
                        kind: "session", sessionID: p.sessionID ?? null,
                        status: "error", errorType: errorType(p.error),
                    });
                } else if (["permission.updated", "permission.asked", "permission.v2.asked"].includes(event.type)) {
                    // SDK generations expose different envelopes; never copy patterns or metadata.
                    record({
                        kind: "permission", sessionID: p.sessionID, permissionID: p.id,
                        status: "asked", messageID: p.source?.messageID ?? p.tool?.messageID ?? p.messageID,
                        callID: p.source?.callID ?? p.tool?.callID ?? p.callID,
                    }, `permission:${p.sessionID}:${p.id}`);
                } else if (["permission.replied", "permission.v2.replied"].includes(event.type)) {
                    const response = p.reply ?? p.response;
                    record({
                        kind: "permission", sessionID: p.sessionID,
                        permissionID: p.requestID ?? p.permissionID, status: "replied",
                        response: ["once", "always", "reject"].includes(response) ? response : "unknown",
                    }, `permission:${p.sessionID}:${p.requestID ?? p.permissionID}`);
                }
            } catch {
                // Malformed events must not affect the agent or leak their payload into diagnostics.
                warn();
            }
        },
        async dispose() {
            closed = true;
            await writer;
            messages.clear();
            snapshots.clear();
        },
    };
};
