## Instructions

- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- Use `anti-over-engineering` when assessing scope, abstractions, dependencies, or verification effort for a concrete software change during design, planning, implementation decisions, or review. Do not load it for general programming questions, code walkthroughs, or routine edits.
- Ask before proceeding when an ambiguity affects required behavior, scope, public contracts, safety, or a hard-to-reverse decision. Resolve local implementation details from source evidence and established conventions rather than interrupting for every uncertainty.
- Keep maintained codebase documentation under repository-root `docs/`, with the root `README.md` as its entry point. Follow existing navigation and read only the documentation and ADRs relevant to the requested change; use `docs/onboarding.md` when broader context is needed and it exists. Update affected documentation alongside code changes, preserve one canonical source per topic, and keep current architecture separate from historical ADRs.
- Use `duckduckgo-mcp-server` for internet research.
- **NEVER** do alembic migrations by hand. Use `alembic` cli tool and commands like `alembic revision --autogenerate`, `alembic upgrade head` for example; `.venv` must be active before doing the migration.
- Prefer **vertical slices** development approach rather than horizontal slices.
- ALWAYS USE 4 SPACES FOR INDENTATION!

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

## Over-engineering

Implement the simplest reasonable solution that fully solves the current task. Detailed rules and examples are maintained in [anti-over-engineering](skills/anti-over-engineering/SKILL.md); apply them only within the current assignment and permissions.

- Change only what the task and its direct prerequisites require. Report unrelated issues after completion without fixing them or interrupting for them.
- Simplification must preserve required behavior, authorization, necessary trust-boundary validation, data protection, and relevant accessibility.
- Stop after proportionate verification. Repeat checks only for relevant changes, failures, or new concrete uncertainty.

### Testing and verification

- Verify requested behavior against the user's specification or an established contract. Add tests only for concrete uncovered behavior or material risk; detailed selection rules are in `anti-over-engineering` above. Respect assignments that prohibit test work.
- Before finishing, review the diff and run relevant existing tests and the configured type-check. Do not introduce tooling just for this checklist; for documentation-only changes, check content and references instead.
- State what was inspected, actually run, and passed or could not be verified. Reading code is not evidence of execution.
