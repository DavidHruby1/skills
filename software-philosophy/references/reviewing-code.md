# Reviewing Code
Use when evaluating code, a diff, an implementation plan, an AI-generated patch, or a proposed refactor.

Reviews often drift into style preference or broad redesign while missing behavior drift, missing validation, duplicated knowledge, weak boundaries, and clean-looking code that increases coupling.

Answer:
- Did behavior change unintentionally?
- Is the change safe to validate?
- Does the code make future changes easier or harder?
- Is important knowledge duplicated, leaked, or hidden in the wrong place?
- Are new abstractions deep enough to justify their surface area?
- Are findings concrete, prioritized, and actionable?

Review priority:
1. Correctness, data loss, security, or behavior regression.
2. Unsafe refactor or behavior change hidden inside structure changes.
3. Missing validation for a risky behavior or structure change.
4. Change amplification, duplicated knowledge, or leaked assumptions.
5. Shallow abstractions, speculative generality, or needless indirection.
6. Comment, naming, or readability issues that affect future change.

A useful finding includes the affected location, specific risk, why it matters for correctness or future change, and the smallest credible fix direction.

Check for:
- Refactors that changed ordering, defaults, error handling, side effects, return shapes, persistence, or external calls.
- Business rules represented in multiple places.
- External API quirks leaking past the boundary.
- Callers required to know lifecycle ordering or internal state.
- Boolean flags that hide multiple behaviors.
- Pass-through services, managers, helpers, or interfaces that hide no knowledge.
- Long methods or large classes where a current change touches unrelated reasons to change.
- Comments that repeat code, preserve stale history, or state contracts the code does not enforce.
- Tests changed during a claimed refactor in a way that suggests behavior was not preserved.
- Behavior that appears to work only by coincidence, without an explicit invariant, contract, test, or validation path.

Avoid:
- Leading with summary before findings when the user asked for review.
- Treating personal style as a defect.
- Suggesting abstractions because code is ugly but stable and outside the change.
- Approving code only because it is shorter or cleaner-looking.
- Asking for tests generically without tying the request to a specific risk.
- Rewriting the implementation unless the user asked for fixes.

Stop when remaining comments are preference-only, further review needs unavailable product/domain/runtime facts, the next useful step is validation rather than commentary, or no findings remain and residual risk is stated.

Examples: [examples/review-findings.md](../examples/review-findings.md), [examples/abstraction-decisions.md](../examples/abstraction-decisions.md), [examples/ai-failure-modes.md](../examples/ai-failure-modes.md).
