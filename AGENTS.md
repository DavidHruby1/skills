# Instructions

- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- Ask before proceeding when an ambiguity affects required behavior, scope, public contracts, safety, or a hard-to-reverse decision. Resolve local implementation details from source evidence and established conventions rather than interrupting for every uncertainty.
- Keep maintained codebase documentation under repository-root `docs/`, with the root `README.md` as its entry point. Follow existing navigation and read only the documentation and ADRs relevant to the requested change. Update affected documentation alongside code changes, preserve one canonical source per topic, and keep current architecture separate from historical ADRs.
- Use `duckduckgo-mcp-server` for internet research.
- Use the `memory` tool with `mode: "search"` to search project memory before acting when a past decision, user preference, recurring failure, or previously attempted solution ONLY IF IT COULD materially change the approach. Use focused technical queries; skip memory for routine work or facts established by the current source, and treat retrieved memories as leads to verify rather than authoritative truth.
- Don't create useless unit tests that copy the code, they're useless.
- Don't be paranoid and don't verify everything. After you finish writing code, run only type-check, run tests, and then STOP.
- Don't use `ghostchrome` automatically. Use it only when I explicitly tell you to.

## Subagents

Outside command workflows, handle small tasks directly, including lookups, implementation, validation, documentation, and requested review. Delegate only medium or large assignments when separate context, specialization, or useful parallel work has a concrete benefit; size alone does not require delegation.

- **Small:** A local, well-understood change or question with limited interactions and focused verification.
- **Medium:** A bounded change or investigation requiring substantial work across interacting behavior or responsibilities.
- **Large:** Broad work requiring coordination of multiple substantial parts or cross-system behavior.

Judge the actual assignment, not file/line counts or the surrounding project's size. Investigate unknown scope briefly before classifying it; risk calls for appropriate verification, not automatic delegation. Small corrections may stay with an already justified delegate. Command workflows retain their prescribed roles and gates regardless of size.

Outside commands, use `code-review` only for explicitly requested medium or large reviews. Review small scopes directly without the skill or inspectors; assess the full requested scope, not just the latest correction. Task completion alone never authorizes the skill.

### Agents

- `@bash-agent`: Runs supplied shell commands and reports exit statuses and relevant output. Use for tests or command batches with substantial output, not routine commands.
- `@worker`: Implements a clearly scoped production change. It does not edit tests, run commands, or modify Git state.
- `@ticket-master`: Reconciles plan-derived issues and PR links. It does not edit files, Git state, or pull requests.
- `@inspector`: Performs read-only Standards or Spec review. Use only when explicitly requested or required by an active workflow.
- `@docu-writer`: Writes source-backed documentation under repository-root `docs/`. Do not delegate product decisions.
- `@spec-auditor`: Audits a task specification against its proposal and relevant source without editing or redesigning it.
- `@researcher`: Performs external research with DuckDuckGo and returns source-backed findings. It does not edit files or run commands.
- `@explore`: Finds ownership, entrypoints, and flows in unfamiliar or broad code areas. Use direct tools for known files or symbols.
- `@general`: Last resort only. Always prefer the appropriate custom agents, splitting work between them when suitable. Use only when necessary and no custom agent or combination can handle the task.

### Delegation

- Choose the narrowest suitable agent and give it a self-contained objective, scope, constraints, expected output, and completion criteria.
- Run independent assignments in parallel. Avoid overlapping ownership and do not duplicate delegated work.
- Follow delegation rules defined by an active command or skill. Resume the same agent for corrections instead of starting over.
- The main agent owns integration, verification, and user communication.
