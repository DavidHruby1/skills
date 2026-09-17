# Reviewing Code

Use when evaluating code, a diff, an implementation plan, AI-generated code, or a proposed refactor.

Reviews should catch behavior drift, missing validation, duplicated knowledge, weak boundaries, and clean-looking code that increases coupling. Do not spend review attention on preference unless it affects correctness, safety, maintainability, or future change.

## Answer

- Did behavior change unintentionally?
- Is the change safe to validate?
- Does the code make future changes easier or harder?
- Does the change pass the Abstraction Gate in [SKILL.md](../SKILL.md)?
- Does syntax pass the Syntax Simplicity Gate in [writing-code.md](writing-code.md)?
- Does every new or materially changed non-trivial declaration comply with the Comments contract in [writing-code.md](writing-code.md)?
- Are findings concrete, prioritized, and actionable?

## Priority

1. Correctness, data loss, security, or behavior regression.
2. Unsafe refactor or behavior change hidden inside structure changes.
3. Missing validation for risky behavior or structure changes.
4. Change amplification, duplicated rules, leaked assumptions, or temporal coupling.
5. Failed abstraction, syntax simplicity, or comment compliance.
6. Names or readability issues that affect future change.

## Finding Shape

A useful finding includes location, specific risk, why it matters, and the smallest credible fix direction. Ask for tests only when tied to a concrete risk.

Lead with findings ordered by severity. If no findings are found, say so and name residual risk or unverified areas.

## Check For

- refactors that changed ordering, defaults, error handling, return shapes, side effects, persistence, or external calls
- false behavior-preserving refactors where tests or fixtures changed to match new behavior
- a concrete rule implemented outside its behavior home or copied by callers
- information leakage: external API quirks, internal data shapes, or policy assumptions leaking past a boundary
- temporal decomposition: callers required to know lifecycle ordering, phases, or internal state
- boolean flags hiding multiple behaviors
- long methods or large classes where one change touches unrelated reasons to change
- vague names such as `manager`, `handler`, `processor`, `data`, `info`, or `result` when they hide the real decision
- abstraction changes that fail any requirement in the authoritative Abstraction Gate
- comprehensions, `next`, generators, or chains that fail the authoritative Syntax Simplicity Gate; do not substitute another threshold or a blanket ban
- missing or non-compliant comments under the authoritative Comments contract
- tests changed during a claimed refactor in a way that suggests behavior was not preserved

Treat a failed required contract as a concrete maintainability defect, not a preference-only observation. Avoid approving code because it is shorter, cleaner-looking, or more pattern-shaped. Avoid broad redesign advice when a concrete local fix would address the risk.

Stop when remaining comments are preference-only, further review needs unavailable facts, the next useful step is validation, or no findings remain and residual risk is stated.

## Examples

### Behavior Drift Hidden In Refactor

Weak review: "This refactor looks cleaner. Nice extraction."

Better finding: High: this is labeled as a refactor, but the extracted path now applies discounts before rounding instead of after rounding. That changes invoice totals for fractional quantities. Preserve the original operation order or mark this as a behavior change and add coverage for the new rounding rule.

Do not call it drift when the task explicitly changed the rounding rule and the diff validates that new behavior.

### Missing Validation Tied To Risk

Weak review: "Add more tests."

Better finding: Medium: this changes the fallback order for user display labels, but there is no coverage for invited users without `display_name`. That path is likely to regress because the rule comes from the external API shape. Add a focused test or document the manual verification performed.

Do not request a new test if existing coverage or credible manual verification already exercises the exact risk.
