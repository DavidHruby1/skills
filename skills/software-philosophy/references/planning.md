# Planning

Use when deciding what to build, comparing approaches, designing a change, decomposing work, or planning a refactor before implementation.

Planning fails when it either patches tactically while ignoring real pressure or invents architecture for imagined futures. A good plan improves optionality without delaying feedback.

## Answer

- What is the requested behavior or design problem?
- What current pressure makes structure relevant now?
- Which avoidable error can be made impossible by the design?
- Which approach makes the next likely change easier?
- Which assumption must be proven before the design is safe?

## Sequence

1. State the real problem and current pressure.
2. Read the likely affected files in full and inventory existing symbols, callers, tests, and behavior homes.
3. Apply the Abstraction Gate in [SKILL.md](../SKILL.md) to every proposed behavior home or structural boundary; record the result rather than restating the gate.
4. Design it twice for non-trivial choices: compare two credible shapes before committing.
5. Judge them by reuse, coupling, cohesion, depth, change amplification, cognitive load, reversibility, error prevention, and validation cost.
6. Choose the smallest coherent approach that keeps useful options open.
7. Sequence the work as small behavior and structure steps. Name the owning PR and assigned paths where work is distributed.
8. Require implementation to comply with the Comments contract in [writing-code.md](writing-code.md) for every new or materially changed non-trivial declaration.
9. Name validation and unresolved assumptions.

## Prefer

- tracer bullets when uncertainty is high
- designs that make invalid states, wrong ordering, or missing validation impossible where practical
- reversible decisions until current requirements justify commitment
- separating structure changes from behavior changes when practical

## Avoid

- provider, format, storage, tenant, policy, registry, or plugin abstractions for imaginary futures
- rewrites before feedback
- treating tidy-first as permission for a cleanup marathon

Stop when the chosen path is safe enough to implement or validate. More detail must reduce a real risk, not make the plan look more architectural.

## Example: Billing Provider Uncertainty

Bad: build the full provider interface, retry service, webhook router, reconciliation job, and test matrix before touching the provider.

Better: build one tracer bullet: create a test customer, receive one webhook, map it to an internal event, and persist enough state to inspect behavior.

Do not apply when the provider contract is already proven locally and the work is routine implementation.
