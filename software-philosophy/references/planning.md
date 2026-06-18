# Planning
Use when deciding what to build, comparing approaches, designing a change, decomposing work, or planning a refactor before implementation.

Planning often fails in two opposite ways: tactical patching that ignores structural pressure, or speculative architecture that solves imaginary future problems. A good plan improves optionality without delaying feedback.

Answer:
- What is the real change pressure?
- Which knowledge should live behind which boundary?
- Which design makes the next likely change easier?
- Which decision must remain reversible?
- What is the smallest useful slice that creates feedback?
- What validation is needed before the plan is safe?

Do:
- Name the current change pressure before proposing structure.
- Design it twice for non-trivial choices: compare at least two credible approaches before choosing.
- Compare approaches by coupling, cohesion, change amplification, cognitive load, reversibility, and validation cost.
- Prefer tracer bullets when uncertainty is high.
- Put each important rule, data-shape conversion, lifecycle order, or policy in one owner.
- Prefer deep modules with simple interfaces over shallow layers that only forward calls.
- Sequence structure changes separately from behavior changes when practical.
- Do not build on behavior that only seems to work; name assumptions and prove them before deeper design depends on them.

Avoid:
- Architecture based on imagined future providers, formats, storage engines, tenants, or policies.
- Plans that require a rewrite before delivering any behavior or feedback.
- Generic abstractions when the real domain concept is unclear.
- Moving knowledge into callers through boolean flags, ordering requirements, or leaked external data shapes.
- Treating tidy-first as permission for a cleanup marathon.

Planning sequence:
1. State the requested behavior or design problem.
2. Identify current pressure and the next likely change.
3. List knowledge that must have a single owner.
4. Compare two credible approaches when the choice is non-trivial.
5. Choose the smallest coherent approach that keeps useful options open.
6. Sequence work as small, reviewable behavior and structure steps.
7. Name validation and unresolved assumptions.

Stop when the chosen path is clear enough to implement safely, more detail would guess unknown requirements, the next step should be code exploration/validation/clarification, or additional abstraction would only preserve imaginary options.

Examples: [examples/planning-tradeoffs.md](../examples/planning-tradeoffs.md), [examples/abstraction-decisions.md](../examples/abstraction-decisions.md), [examples/refactoring-small-steps.md](../examples/refactoring-small-steps.md).
