---
name: software-philosophy
description: Use for non-trivial software design judgment during planning, implementation, refactoring, or code review. Avoid for simple mechanical tasks.
---
# Software Philosophy
Use when the task needs judgment about design, maintainability, refactoring, or review risk. The goal is software that is easier to change without making the current task larger than necessary.

Do not use when the task is a simple one-file fix, mechanical formatting, dependency installation, a straightforward command, or already governed by a more specific skill.

Core ideas:
- Good design reduces change amplification, cognitive load, and unknown unknowns.
- Important knowledge should have one authoritative representation.
- Useful boundaries hide real decisions behind simple interfaces.
- Coupling raises the cost of change; cohesion lowers it.
- Refactoring preserves behavior and happens in small safe steps.
- Comments should preserve design reasoning, not narrate mechanics.
- Do not rely on behavior that merely seems to work; prove risky assumptions with code, tests, tools, measurements, or focused clarification.
- AI-generated work must be checked for impressive-looking complexity that makes future human changes harder.
- Before changing structure, name the complexity symptom: change amplification, cognitive load, unknown unknowns, duplicated knowledge, leaked data shape, temporal coupling, or behavior drift.

This skill does not replace product research, domain research, testing strategy, deployment design, performance benchmarking, or security review. It may identify when those are needed. Do not claim verification, test results, benchmarks, or safety checks unless a tool or another skill actually performed them.

## Choose One Mode
Pick one primary mode before applying advice. Use a secondary mode only when the task clearly crosses boundaries.

### Planning
Use when deciding what to build, comparing approaches, designing a change, decomposing work, or planning a refactor.
Primary question: Which approach makes the next change safer and easier without inventing architecture before it is needed?
Do:
- Understand the problem and existing code before proposing structure.
- For non-trivial choices, compare two plausible approaches before recommending one.
- Prefer a tracer-bullet slice when uncertainty is high.
- Identify which knowledge each module or boundary should own.
- Keep decisions reversible unless current requirements justify commitment.
- Name the validation path and assumptions that must be proven.
Avoid:
- Architecture from vague future possibilities.
- Plans that require broad rewrites before feedback.
- Moving complexity to callers through flags, ordering rules, or leaked data shapes.
Load: primary [references/planning.md](references/planning.md); optional [references/abstraction-decisions.md](references/abstraction-decisions.md). Examples: [examples/planning-tradeoffs.md](examples/planning-tradeoffs.md), [examples/abstraction-decisions.md](examples/abstraction-decisions.md).

### Implementation
Use when writing code, editing existing code, refactoring as part of a change, or outputting code snippets intended to be used directly.
Primary question: What is the smallest clear change that satisfies the requested behavior without avoidable accidental complexity?
Do:
- Build context from existing code before editing.
- Keep the change as narrow as the requested behavior allows.
- Put logic where the relevant knowledge already lives.
- Represent business rules once and convert external data shapes at boundaries.
- Separate behavior changes from structure changes when practical.
- Run available tests, type checks, or linters when feasible; if not run, say what remains unverified.
Avoid:
- Creating abstractions without current pressure.
- Splitting code into shallow modules that hide no knowledge.
- Boolean flags that create hidden modes.
- Unrelated cleanup, broad rewrites, style-only churn, or performance work without evidence.
Load: primary [references/writing-code.md](references/writing-code.md); optional [references/stop-rules.md](references/stop-rules.md). Examples: [examples/refactoring-small-steps.md](examples/refactoring-small-steps.md), [examples/abstraction-decisions.md](examples/abstraction-decisions.md), [examples/ai-failure-modes.md](examples/ai-failure-modes.md).

### Review
Use when evaluating code, a diff, an implementation plan, an AI-generated patch, or a proposed refactor.
Primary question: What risks, regressions, coupling, hidden knowledge, or needless complexity should be fixed or called out before accepting this work?
Do:
- Lead with findings, ordered by severity.
- Distinguish behavior changes from structure changes.
- Treat refactors as suspicious if ordering, errors, defaults, data shapes, side effects, or public behavior changed.
- Tie each finding to correctness, safety, maintainability, or future change.
- Prefer concrete local fixes over broad redesign advice.
- If no findings are found, say so and name residual risk or unverified areas.
Avoid:
- Rewriting code inside the review unless asked.
- Treating preference, naming taste, or style churn as a defect.
- Asking for tests generically without tying them to a specific risk.
Load: primary [references/reviewing-code.md](references/reviewing-code.md); optional [references/abstraction-decisions.md](references/abstraction-decisions.md). Examples: [examples/review-findings.md](examples/review-findings.md), [examples/ai-failure-modes.md](examples/ai-failure-modes.md).

## Progressive Disclosure
Load the smallest relevant reference for the primary mode. Load the optional reference only when the decision depends on boundaries, complexity, stopping, or validation risk. Use examples only when the decision is subtle, ambiguous, or matches the example name.

Reference routing:
- Planning, approach comparison, or decomposition: [references/planning.md](references/planning.md).
- Code edit, local implementation, comments, or small refactor: [references/writing-code.md](references/writing-code.md).
- Function, module, class, hook, component, or boundary decision: [references/abstraction-decisions.md](references/abstraction-decisions.md).
- Review, diff evaluation, or AI patch evaluation: [references/reviewing-code.md](references/reviewing-code.md).
- Scope is expanding, cleanup is spreading, or polish is tempting: [references/stop-rules.md](references/stop-rules.md).

Changed-code gate: before finalizing code you touched, check only that touched code for fake abstractions, duplicated rules, behavior drift, comment noise, and scope creep.

## Final Standard
Use the smallest correct change. Do not invent architecture without current pressure. Validate with tools when feasible, otherwise state the limitation. If the safest action is to leave surrounding imperfect code unchanged, leave it unchanged.
