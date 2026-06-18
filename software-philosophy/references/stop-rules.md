# Stop Rules
Use before expanding planning, cleanup, abstraction, commenting, refactoring, or review feedback beyond the user's actual need.

This skill's biggest risk is over-expansion: a local plan becomes architecture theater, a local change becomes a broad rewrite, or a review becomes preference noise.

Core rule: stop when the current plan, change, or review is clear, useful, and safe enough for the next step.

Generated code often looks more senior while becoming harder for the next human to change. Treat fake abstractions, pass-through layers, speculative generality, comment spam, broad rewrites, and refactors with behavior drift as stop signals unless current requirements justify them.

Common AI failure modes to stop:
- fake abstraction: service, manager, helper, factory, interface, or strategy that hides no knowledge
- pass-through layer: same arguments in, same result out, more names and files
- speculative generality: imaginary providers, formats, storage engines, themes, policies, or plugin systems
- comment spam: comments narrate obvious code to make output look careful
- tactical patch: another special case without addressing duplicated or hidden knowledge
- broad rewrite: unrelated code changes because the model can, not because the task needs it
- architecture theater: frameworks, registries, providers, or multi-phase designs before uncertainty has been reduced
- review theater: style preferences, generic test requests, or broad redesign ideas not tied to risk
- refactor with behavior drift: ordering, defaults, errors, side effects, or return shapes changed while calling it cleanup

Stop planning when:
- the chosen approach is clear enough to implement or validate
- more detail would invent requirements instead of reducing risk
- the next useful step is code exploration, a tracer bullet, prototype, test, benchmark, or focused user question
- additional abstraction would only preserve imaginary options

Stop refactoring when:
- the behavior change is now easy to make
- more cleanup would spread outside the changed area
- you need unrelated behavior knowledge to continue safely
- the next step would require public API changes without explicit need
- validation is missing and the structural change is no longer obviously reversible
- you are renaming or moving code mainly for style preference

Stop abstracting when:
- the abstraction would support imaginary future needs
- you cannot give it a precise name
- it only forwards parameters
- the caller still needs to know the hidden details
- one clear function is easier to read
- the new boundary would make the common path harder

Stop commenting when the comment repeats code, explains mechanics instead of reasoning, would become stale as soon as implementation changes, or tries to justify confusing code instead of fixing it.

Leave imperfect code alone when the defect is real but outside the task, fixing it needs product/architecture/testing decisions, the code is ugly but stable, or no small safe improvement is visible.

Hand off when requirements are unclear, correctness cannot be judged after available validation, the architecture boundary is unclear, or performance is the issue but no measurement exists.

Examples: [examples/ai-failure-modes.md](../examples/ai-failure-modes.md), [examples/refactoring-small-steps.md](../examples/refactoring-small-steps.md), [examples/planning-tradeoffs.md](../examples/planning-tradeoffs.md), [examples/review-findings.md](../examples/review-findings.md).
