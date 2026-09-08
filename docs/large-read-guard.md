# Large Read Guard

`plugins/large-read-guard.js` loads automatically from the global plugin directory.
Restart OpenCode after installing or changing it. No config entry or dependency
is needed.

For root sessions, the `tool.execute.before` hook rejects text reads whose
requested range contains more than 350 lines. After a rejection, the same root
session cannot make another tool call until it delegates a non-empty, specific
prompt through `task` with `subagent_type: "explore"`. The hook adds the rejected
file path and starting line to the delegated prompt. It does not launch a
subagent itself; it enforces the parent agent's next tool choice.

- Explicit `limit <= 350` passes. Offset alone is not an exemption.
- Small files and short remaining ranges near EOF pass.
- All child sessions (`parentID` present), not just `explore`, are exempt.
- A different tool or subagent type cannot bypass a pending delegation.
- A valid delegation clears the requirement before the task executes. If that
    task fails, another oversized read establishes the requirement again.
- Directories, missing/inaccessible files, supported attachment extensions and
    detected binary files are left to native Read handling.
- If session lookup fails, the hook warns and allows native Read to proceed.

Set `OPENCODE_LARGE_READ_MIN_LINES=500` in the environment before launching
OpenCode to change the threshold. Invalid, nonpositive or fractional values
fall back to 350. OpenCode's default read limit is 2000 lines; a threshold at
least that large permits default reads.

The file is scanned in bounded chunks, stopping once the requested range exceeds
the threshold. This is a line-count heuristic, not a token/byte cap or a security
boundary. It does not guard Bash, Grep, MCP tools, or native permission decisions.
It never adds file contents to its error or warning messages. For correctness,
the main agent can read adjacent bounded ranges rather than relying on a lossy
summary. No overall cost or quality improvement is guaranteed.

## Verification

Run `bun test tests/large-read-guard.test.js` from `~/.config/opencode`.
There is no configured type-checker. Tests cover the delegation handshake and
child-session exemption.
