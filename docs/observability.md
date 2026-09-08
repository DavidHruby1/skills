# Local Observability

`plugins/observability.js` is an automatically loaded local OpenCode plugin.
Restart OpenCode after installing or changing it. It requires no extra dependency
and sends no data over the network.

## Output

Files live in `<project-worktree>/.opencode/logs/`, keeping each project's logs
separate. Outside a repository, when OpenCode provides the filesystem root as
the worktree, the plugin uses OpenCode's working directory instead.
Each UTF-8 JSONL line is one record with schema version `v: 1` and UTC observation
time `ts`. Files are named `<UTC-date>-<pid>-<instance-uuid>.jsonl`; each plugin
instance has its own writer. A file is created on the first relevant event.
New directories use mode 0700 and new files 0600.
The logger creates `.opencode/logs/.gitignore` containing `*` to keep logs out of
Git. An existing ignore file is left untouched; existing tracked files are not
untracked. The plugin itself remains global, so it observes each opened project.

- `tool`: running and terminal calls, IDs, tool name, agent when known, and
  terminal duration. Running records include `startedAt` and no duration.
- `llm`: completed assistant-message snapshots, provider/model, token counts
  including reasoning and cache, reported cost, message duration and error type.
- `session`: creation with parent session ID, busy/idle/retry status and errors.
- `permission`: request/reply IDs and allowlisted reply value, without resources.

Retry status includes attempt and next retry timestamp, not the error message.
Tool failures have `status: "error"`; their free-text errors are never stored.
They include only `errorCategory`: `not_found`, `permission_denied`, `timeout`,
`cancelled`, or `unknown`. Classification is best-effort: it recognizes only a
small allowlist of anchored error prefixes, and falls back to `unknown`.
Typed LLM/session errors are reduced to a known error name or `UnknownError`.
Prompts, text/reasoning parts, tool arguments/outputs, paths, permission patterns,
session titles and arbitrary metadata are excluded. No payload debug mode exists.

## Interpretation

Tool records include a `running` observation before their terminal state. A crash
or cancellation without a final event can leave only the running record. `idle`
does not close a session. Durations use OpenCode timestamps: message duration is
not isolated API latency, and tool duration may include waiting. `reportedCost`
is OpenCode's value, not a verified invoice. Zero does not establish that a
provider request was free.

Agent names come only from an assistant message's explicit `agent` field.
Otherwise they are null; agent parts and legacy `mode` are not used to guess.
A tool's agent can also be joined from its matching LLM record later.
Parent session IDs are observed on creation; existing sessions are not backfilled.

Updates are snapshots, not increments. Recent identical snapshots are suppressed
using bounded caches (4096 entries each); repeated running updates are suppressed
even when later agent enrichment changes. For totals, take the last LLM record per
`sessionID + messageID`, and the latest terminal tool record per
`sessionID + messageID + callID` across files. Treat calls with only a running
record as non-terminal, and do not sum every updated snapshot. Do not add LLM
token/cost totals to step-part totals; step parts are not logged.
For delegated work, include child sessions explicitly via `parentSessionID`.

## Reliability And Storage

The event hook enqueues metadata without waiting for filesystem I/O. One writer
appends batches, with a queue limited to 1024 records and 1 MiB, plus one in-flight
batch of at most 256 records. Individual records over 16 KiB are dropped.
Overflow or malformed events produce at most one generic stderr warning per
instance. An I/O failure disables that instance's logger until OpenCode restarts;
it does not fail the event hook. No payload or filesystem error text is printed.
Disposal drains accepted writes; abrupt process termination can lose queued data
or leave an incomplete final line. This is diagnostic logging, not an audit log.

Daily files are rotated by UTC observation date. There is no automatic deletion
or total disk quota: remove old files when no longer needed. File permissions do
not protect against other processes running as the same user.

## Verification

There is no configured type-checker. Live delivery and agent attribution must
still be checked after an OpenCode restart. Automated tests are intentionally
not included, as requested.
