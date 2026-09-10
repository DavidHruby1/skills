## Instructions

- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- Before choosing a solution, always check the Over-engineering rules and confirm it stays within the requested scope.
- Ask before proceeding when an ambiguity affects required behavior, scope, public contracts, safety, or a hard-to-reverse decision. Resolve local implementation details from source evidence and established conventions rather than interrupting for every uncertainty.
- Keep maintained codebase documentation under repository-root `docs/`, with the root `README.md` as its entry point. Follow existing navigation and read only the documentation and ADRs relevant to the requested change; use `docs/onboarding.md` when broader context is needed and it exists. Update affected documentation alongside code changes, preserve one canonical source per topic, and keep current architecture separate from historical ADRs.
- Use `duckduckgo-mcp-server` for internet research.
- **NEVER** do alembic migrations by hand. Use `alembic` cli tool and commands like `alembic revision --autogenerate`, `alembic upgrade head` for example; `.venv` must be active before doing the migration.
- Prefer **vertical slices** development approach rather than horizontal slices.
- ALWAYS USE 4 SPACES FOR INDENTATION!

## Workflow Contracts

- The task workflow is `/architecture` -> `/technical-design` -> `/create-plan` -> `/implement`. Its authoritative artifacts are `.opencode/task-xxx/ARCHITECTURE.md`, `TECHNICAL-DESIGN.md`, and `PLAN.md`; do not invent additional prerequisites or deviate from them.
- An active command or skill owns its detailed workflow and gates. Do not duplicate, bypass, or silently replace unavailable requirements.
- Tests are prepared before `/implement`; implementation delegates do not author or modify them. The orchestrator owns Git, integration, diagnosis, and execution of prepared checks.
- `/implement` owns implementation and its required validation and review gates. `create-pr` owns publication, `ticket-master` owns plan-derived issue lifecycle, and `/finish` owns post-merge verification and cleanup.

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

**Over-engineering** means adding more concepts, behavior, generality, or verification than the current task reasonably requires.
**Core principle:** Implement the simplest reasonable solution that fully solves the current task.

### Definitions

#### Complexity

Complexity is the amount of information a maintainer must understand and coordinate: branches, states, layers, indirection, configuration, dependencies, public APIs, side effects, and files that must change together.
Line count is not complexity. Twenty direct lines may be simpler than a five-line generic dispatcher requiring a registry, factory, and configuration.

**Necessary complexity** solves a current requirement or removes more current risk, duplication, or coordination than it introduces.
**Speculative complexity** exists mainly for hypothetical future requirements or failures that are not currently expected.

#### Project patterns

**A good project pattern**:

- solves the same kind of problem;
- makes behavior and failures clear;
- keeps responsibilities reasonably local;
- avoids unnecessary coupling;
- can be tested without excessive unrelated setup.

**A bad project pattern**:

- produces incorrect or unsafe behavior;
- swallows important errors;
- relies on hidden global state;
- duplicates business rules that must remain consistent;
- introduces unnecessary indirection or coupling;
- makes local behavior require excessive setup or unrelated changes.

Unfamiliar code, personal preference, or imperfect style does not by itself make a pattern bad.

#### Abstraction

**A useful abstraction** reduces what its callers must understand or ensures that multiple places follow the same rule.
**A useless abstraction** adds another layer, name, option, or indirection without removing comparable complexity or risk.

#### Edge cases

**A high-value edge case** can reach the changed code now and is at least one of:

- required by the task or an existing contract;
- observed in tests, issues, logs, or normal use;
- the nearest valid or invalid boundary affected by the change;
- able to cause a security issue, data or financial loss, wrong output, or a normal-use crash.

**High-value examples:**

- an allowed empty list before accessing its first item;
- duplicate payment submission;
- authorization failure;
- a specified minimum or maximum value.

**Low-value examples:**

- `null` already rejected before reaching the changed code;
- hypothetical future input types;
- framework internals;
- many malformed inputs that all exercise the same guard and outcome.

### Scope

- Before editing, establish required behavior, current implementation, and relevant callers. Trace only the affected flow; fix bugs where the rule belongs, not just the symptom.
- Change only what the task and its direct prerequisites require. Report unrelated issues after completion without fixing them or interrupting for them.
- Simplification must preserve required behavior, authorization, necessary trust-boundary validation, data protection, and relevant accessibility.
- Stop after proportionate verification. Repeat checks only for relevant changes, failures, or new concrete uncertainty.

When a bad project pattern directly affects the task, do not silently copy or redesign it. If the correction is not small, safe, and within scope, report:

1. the problem and its effect on the task;
2. the smallest solution following the existing pattern and its downside;
3. the smallest better solution and its additional scope.

Ask which option to use. Clearly state when the existing option is unsafe. Do not interrupt for unrelated technical debt, cosmetic issues, or personal preferences.

### Patterns and abstraction

- Follow existing patterns when they fit, unless they cause concrete correctness, safety, or maintenance problems. Unfamiliarity or personal preference is not a reason to replace them.
- Correct a problematic pattern directly only when the change is small, safe, and within scope. Otherwise explain its impact, the smallest existing-pattern option and downside, and the smallest better option and added scope; ask before proceeding. Explicitly flag unsafe options.
- Extract abstractions to keep shared rules consistent or make a responsibility easier to understand or test. Keep similar code separate when its rules may diverge.
- Add layers, dependencies, configuration, or extension points only for a current requirement or material risk, not hypothetical future needs.
- Before adding a factory, registry, cache, retry system, or other infrastructure, identify the current problem it solves. If there is none, do not add it.

- **BAD** One endpoint -> generic service, factory, registry, and plugin system.
- **GOOD** One focused implementation using appropriate existing structure.

- **BAD** Rewrite an entire module to fix one bug.
- **GOOD** Fix the cause and add a focused regression test.

- **BAD** Add retries because failures might occur someday.
- **GOOD** Add retries for expected transient failures with defined limits and behavior.

### Testing and verification

- First verify requested behavior through the changed path. Derive expectations from the user's specification or an established repository contract; ask rather than invent unclear behavior.
- Add tests only for a concrete behavior, regression, or material risk not adequately covered. For bugs, prefer a focused test that fails before the fix and passes afterward when practical. This limits test creation, not execution.
- Cover reachable edge cases required by the contract, observed in practice, at affected boundaries, or carrying material correctness or safety risk. Add cases only for distinct paths, rules, or consequences; skip framework internals, unreachable states, equivalent permutations, and unrelated modules.
- One representative input per behavior or guard is normally enough. Add another only when it exercises a different path, rule, or consequence.
- Escalate from targeted tests to affected-module checks and then repository-wide checks. Broaden verification only when the change can affect that level, project instructions require it, or the change concerns security, data integrity, financial logic, concurrency, public contracts, or widely shared code.
- Before finishing, review the diff and run relevant existing tests and the configured type-check. Do not introduce tooling just for this checklist; for documentation-only changes, check content and references instead.
- State what was inspected, actually run, and passed or could not be verified. Reading code is not evidence of execution.
