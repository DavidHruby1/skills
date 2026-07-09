# Reviewing Code

Use when evaluating code, a diff, an implementation plan, AI-generated code, or a proposed refactor.

Reviews should catch behavior drift, missing validation, duplicated knowledge, weak boundaries, and clean-looking code that increases coupling. Do not spend review attention on preference unless it affects correctness, safety, maintainability, or future change.

## Answer

- Did behavior change unintentionally?
- Is the change safe to validate?
- Does the code make future changes easier or harder?
- Is important knowledge duplicated, leaked, or hidden in the wrong place?
- Are new abstractions deep enough to justify their surface area?
- Are names and comments making the design more obvious without hiding confusing code?
- Are findings concrete, prioritized, and actionable?

## Priority

1. Correctness, data loss, security, or behavior regression.
2. Unsafe refactor or behavior change hidden inside structure changes.
3. Missing validation for risky behavior or structure changes.
4. Change amplification, duplicated knowledge, leaked assumptions, or temporal coupling.
5. Shallow abstractions, speculative generality, or needless indirection.
6. Comments, names, or readability issues that affect future change.

## Finding Shape

A useful finding includes location, specific risk, why it matters, and the smallest credible fix direction. Ask for tests only when tied to a concrete risk.

Lead with findings ordered by severity. If no findings are found, say so and name residual risk or unverified areas.

## Check For

- refactors that changed ordering, defaults, error handling, return shapes, side effects, persistence, or external calls
- false behavior-preserving refactors where tests or fixtures changed to match new behavior
- duplicated knowledge: business rules, data-shape conversions, validation, lifecycle order, or policy represented in multiple places
- information leakage: external API quirks, internal data shapes, or policy assumptions leaking past a boundary
- temporal decomposition: callers required to know lifecycle ordering, phases, or internal state
- boolean flags hiding multiple behaviors
- shallow modules, pass-through methods, services, managers, helpers, interfaces, or factories that hide no knowledge
- long methods or large classes where one change touches unrelated reasons to change
- vague names such as `manager`, `handler`, `processor`, `data`, `info`, or `result` when they hide the real decision
- comments that repeat code, preserve stale history, or state contracts the code does not enforce
- tests changed during a claimed refactor in a way that suggests behavior was not preserved

Avoid approving code because it is shorter, cleaner-looking, or more pattern-shaped. Avoid broad redesign advice when a concrete local fix would address the risk.

Stop when remaining comments are preference-only, further review needs unavailable facts, the next useful step is validation, or no findings remain and residual risk is stated.

## Examples

### Behavior Drift Hidden In Refactor

Weak review: "This refactor looks cleaner. Nice extraction."

Better finding: High: this is labeled as a refactor, but the extracted path now applies discounts before rounding instead of after rounding. That changes invoice totals for fractional quantities. Preserve the original operation order or mark this as a behavior change and add coverage for the new rounding rule.

Do not call it drift when the task explicitly changed the rounding rule and the diff validates that new behavior.

### Shallow Pass-Through Abstraction

Weak review: "Consider using a service layer here."

Better finding: Medium: `UserManager.getUser` only forwards to `UserRepository.getUser`, so callers gain another dependency without hiding authorization, caching, mapping, or error policy. Use the repository directly until there is real user policy for this boundary to own.

Do not reject the layer if it owns meaningful policy.

### Missing Validation Tied To Risk

Weak review: "Add more tests."

Better finding: Medium: this changes the fallback order for user display labels, but there is no coverage for invited users without `display_name`. That path is likely to regress because the rule comes from the external API shape. Add a focused test or document the manual verification performed.

Do not request a new test if existing coverage or credible manual verification already exercises the exact risk.
