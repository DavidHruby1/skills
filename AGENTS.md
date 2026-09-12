## Instructions

- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- Use [anti-over-engineering](skills/anti-over-engineering/SKILL.md) when assessing scope, abstractions, dependencies, or verification effort for a concrete software change during design, planning, implementation decisions, or review. Do not load it for general programming questions, code walkthroughs, or routine edits.
- Ask before proceeding when an ambiguity affects required behavior, scope, public contracts, safety, or a hard-to-reverse decision. Resolve local implementation details from source evidence and established conventions rather than interrupting for every uncertainty.
- Keep maintained codebase documentation under repository-root `docs/`, with the root `README.md` as its entry point. Follow existing navigation and read only the documentation and ADRs relevant to the requested change; use `docs/onboarding.md` when broader context is needed and it exists. Update affected documentation alongside code changes, preserve one canonical source per topic, and keep current architecture separate from historical ADRs.
- Use `duckduckgo-mcp-server` for internet research.

## Subagents

Delegate when separate context, specialization, independent review, or large output materially helps. Otherwise work directly.

### Agents

- `@bash-agent`: Runs supplied shell commands and reports exit statuses and relevant output. Use for tests or command batches with substantial output, not routine commands.
- `@worker`: Implements a clearly scoped production change. It does not edit tests, run commands, or modify Git state.
- `@ticket-master`: Reconciles plan-derived issues and PR links. It does not edit files, Git state, or pull requests.
- `@inspector`: Performs read-only Standards or Spec review. Use only when explicitly requested or required by an active workflow.
- `@docu-writer`: Writes source-backed documentation under repository-root `docs/`. Do not delegate product decisions.
- `@researcher`: Performs external research with DuckDuckGo and returns source-backed findings. It does not edit files or run commands.
- `@explore`: Finds ownership, entrypoints, and flows in unfamiliar or broad code areas. Use direct tools for known files or symbols.
- `@general`: Last resort only. Always prefer the appropriate custom agents, splitting work between them when suitable. Use only when necessary and no custom agent or combination can handle the task.

### Delegation

- Choose the narrowest suitable agent and give it a self-contained objective, scope, constraints, expected output, and completion criteria.
- Run independent assignments in parallel. Avoid overlapping ownership and do not duplicate delegated work.
- Follow delegation rules defined by an active command or skill. Resume the same agent for corrections instead of starting over.
- The main agent owns integration, verification, and user communication.

## Testing

<!-- Temporary home for test-quality guidance until dedicated testing skills exist; move these rules there rather than copying them. -->

Apply these rules when test authoring is within the assignment; they do not authorize additional test work.

- Reuse the repository's test runner, fixtures, and helpers when their contracts fit. Keep setup limited to what the tested behavior requires.
- Exercise the public boundary real callers use. Assert observable behavior rather than private implementation structure.
- Keep collaborators real when their interaction is what the test must prove. Replace only boundaries outside that scope; do not mock the behavior under test.
- Keep tests deterministic and independently runnable. Control relevant sources of nondeterminism and restore changed state; never depend on another test's execution order.
- Use explicit assertions and independently obvious expected values. Do not reproduce the production algorithm to calculate the expected result.
- Do not reimplement the behavior under test in fixtures, factories, or setup helpers. Keep test data and setup understandable without reconstructing business logic.
- Verify calls only when sending that command is itself part of the observable contract, not merely an implementation detail.
- Use snapshots for deliberately reviewed, stable representations, not as a substitute for assertions that identify the promised behavior.
