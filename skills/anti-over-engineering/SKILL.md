---
name: anti-over-engineering
description: Assess whether scope, abstractions, dependencies, or verification effort are justified for a concrete software change during design, planning, implementation decisions, or code review. Not for general programming questions, code walkthroughs, routine edits, or non-software plans.
---

## Over-engineering

Apply the relevant rules to the current decision, not as a mandatory checklist or separate workflow. Respect the agent's assigned scope and permissions; review use does not authorize edits, and testing guidance does not authorize test work for production-only or execution-only assignments.

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

When a bad project pattern directly affects the task, do not silently copy or redesign it. Correct it directly only when the change is small, safe, and within scope. Otherwise report:

1. the problem and its effect on the task;
2. the smallest solution following the existing pattern and its downside;
3. the smallest better solution and its additional scope.

Ask which option to use. Clearly state when the existing option is unsafe. Do not interrupt for unrelated technical debt, cosmetic issues, or personal preferences.

### Patterns and abstraction

- Follow existing patterns when they fit, unless they cause concrete correctness, safety, or maintenance problems. Unfamiliarity or personal preference is not a reason to replace them.
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
