## Instructions

- Keep responses simple using `ASD-STE100` Simplified Technical English as inspiration.
- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- When you encounter an **ambiguity**, then stop and consider wider impact and ask questions rather than making assumptions.
- Documentation lives under the repository-root `docs/` directory. Read the repository documentation that governs the requested change. Start with `docs/onboarding.md` when broader project context is needed or repository instructions require it. For monorepos, also check relevant component documentation such as `docs/backend/` and `docs/frontend/`.
- Artifacts live in `.opencode/artifacts/task-NNN/`. An explicitly named task is active; otherwise the greatest suffix is active. `/grilling` creates the next task, while `/grilling task-NNN <reason>` resumes that existing task.
- Use `duckduckgo-mcp-server` for internet research.
- Choose repository tools by the question. When an existing `graphify-out/` can narrow a broad architecture, ownership, relationship, or data-flow question, query it first and verify important claims in source. For known files, names, strings, configuration, documentation, or localized questions, use direct `Read`, `Glob`, or `Grep`/`rg`. Use `ast-grep` for syntax-aware searches and structural transformations when syntax improves precision or safety; do not use it as a mandatory first choice.
- Never invoke `inspector` autonomously; use it only when the user explicitly requests it or the active command explicitly requires it.
- **NEVER** do alembic migrations by hand. Use `alembic` cli tool; `.venv` must be active before doing the migration.

## Subagents

Use subagents selectively. Work directly when the scope and behavior home are clear. Counts are signals, not sufficient reasons to delegate. Delegate only to reduce context load, resolve bounded uncertainty, enable useful parallel work, or isolate a coherent stage.

If a special command such as `/grilling`, `/create-plan`, or `/research` is active, follow that command's workflow. Otherwise, only use these subagents:

- `@explore`: Use for broad read-only discovery or unknown ownership, entrypoints, or flow. More than six relevant files or three packages is a useful signal. Do not use it for a known symbol in a small scope. Ask one bounded question and require source evidence. Query an existing `graphify-out/` first for broad relationship questions.
- `@bash-agent`: Always use when several shell commands are expected to produce large outputs or for running tests. Provide the exact commands, working directory, and dependency order. Require a compact report with each command's exit status and the evidence needed to assess its result.
- `@general`: Use only for substantial cross-cutting work that one agent can own end to end and that materially reduces primary-agent context. Investigation, implementation, and validation alone are not enough. Do not use it for simple work, pure discovery, or a clean worker stage.
- `@worker`: Use for a coherent, independent production stage, normally across four files or about 150 lines. Require a clear behavior boundary, non-overlapping paths, and a complete contract. The worker does not edit tests or Git state.
- `@tester`: Use for a substantial independent test stage, normally with five behavior cases or three test files. Implement one to four focused cases directly. Give it a clear test boundary and behavior contract. The tester does not edit production code or run tests.

Choose the narrowest suitable agent. Chain agents only when one output defines the next assignment. Every prompt must state the scope, inputs, contract, expected report, and definition of done.

Always check the subagent's output and steer them.

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

- Change only what the request and its direct prerequisites require.
- Do not add unrelated cleanup, features, configuration, dependencies, or refactoring.
- Report unrelated problems instead of fixing them.
- Stop when the requested behavior is implemented and proportionately verified.

When a bad project pattern directly affects the task, do not silently copy or redesign it. Stop before implementing and report:
1. the problem and its effect on the task;
2. the smallest solution following the existing pattern and its downside;
3. the smallest better solution and its additional scope.

Ask which option to use. Clearly state when the existing option is unsafe.
Do not interrupt for unrelated technical debt, cosmetic issues, or personal preferences. Mention them separately after completing the task.

### Abstraction

- Prefer a good existing pattern when it fits the current problem.
- Do not copy a bad pattern merely for consistency.
- Extract an abstraction when multiple places must follow the same rule, or when one responsibility is difficult to understand or test in place.
- Keep similar code separate when its behavior or rules may reasonably diverge.
- Before adding a layer, dependency, option, factory, registry, cache, retry system, or extension point, identify the current problem it solves.
- If no current requirement or material risk justifies it, do not add it.

**BAD** One endpoint -> generic service, factory, registry, and plugin system.  
**GOOD** One focused implementation using appropriate existing structure.

**BAD** Rewrite an entire module to fix one bug.  
**GOOD** Fix the cause and add a focused regression test.

**BAD** Add retries because failures might occur someday.  
**GOOD** Add retries for expected transient failures with defined limits and behavior.

### Testing and verification

- First test the requested behavior through the changed path.
- Add edge-case tests only for high-value edge cases.
- One representative input per behavior or guard is normally enough.
- Add another case only when it exercises a different path, rule, or consequence.
- For a bug fix, add a test that fails before the fix and passes afterward when practical.
- Do not test framework internals, unreachable states, equivalent input permutations, or unrelated modules.

Escalate verification in this order:
1. targeted tests for the changed behavior;
2. tests for the affected module or package;
3. repository-wide checks.

Move to a broader level only when the change can affect that level or project instructions require it.
Use broader testing when the change affects security, data integrity, financial logic, concurrency, public contracts, or code shared by many modules.
Do not rerun a passing check unless relevant code changed.

Before finishing:
1. compare the result with the request;
2. inspect the diff for unrelated changes;
3. run required lint, type, build, and test checks for the affected scope;
4. state what was verified, what was not, and any unrelated failures.
Then stop.
