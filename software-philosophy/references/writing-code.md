# Writing Code
Use when adding implementation code, modifying existing structure, refactoring locally, or deciding whether a comment should exist.

New code often works locally but makes future changes harder by spreading knowledge, adding flags, inventing layers, or hiding simple behavior behind impressive structure. Refactoring should reduce risk for the current change, not become a redesign project.

Do:
- Put logic where the relevant knowledge already lives.
- Keep the common path direct and readable.
- Prefer precise names over clever compression.
- Use existing abstractions before creating new ones.
- Keep related decisions together when splitting them would leak assumptions.
- Represent business rules once.
- Convert external data shapes at boundaries instead of spreading API quirks.
- Prefer simple data flow over hidden mutation.
- Make invalid or unsupported states hard to represent when local code can do that simply.
- Follow nearby style unless it is actively causing complexity.

Refactoring rules:
- Behavior change means what the system does changes; structure change reorganizes code while observable behavior stays the same.
- Refactor only where it supports the current change.
- Make the smallest behavior-preserving structural move that relieves current pressure.
- Preserve public interfaces unless changing them is part of the task.
- Separate refactoring and feature changes in the explanation, commits, or patches when practical.
- Never claim “no behavior change” after altering conditionals, errors, ordering, data shapes, defaults, or side effects.

Comment rules:
- First improve code, then comment.
- Add comments for why this code exists, domain invariants, external constraints, edge cases, trade-offs, ownership, lifecycle assumptions, boundary contracts, or why a simpler-looking solution is wrong.
- Avoid comments that repeat code, narrate mechanics, compensate for bad names, preserve stale history, or state contracts the code does not enforce.
- Prefer a clearer name, smaller local shape, encoded invariant, type, validation, or API boundary when that removes the need for a comment.
- Keep comments close to the decision they explain and stable across likely implementation changes.
- Update or remove comments when modifying nearby behavior.

Avoid:
- Boolean flags that create hidden modes.
- One-line wrappers that do not hide knowledge.
- Config objects that merely avoid passing parameters explicitly.
- Premature plugin systems, factories, base classes, interfaces, or strategies.
- Splitting a simple sequence into many tiny functions where the reader must jump around to understand one idea.
- Duplicating business rules because two callers need similar behavior.
- Pushing domain decisions into UI, controllers, routes, or tests because it was convenient.
- Broad cleanup in files unrelated to the task.

Decision checks:
1. What fact, rule, or decision does this code own?
2. Who should not need to know that decision?
3. Would changing this rule require edits in one place or many?
4. Is the next likely change easier because of this shape?
5. Would a reader understand the common path without unrelated files?
6. Did the implementation add a concept that the task did not need?
7. What validation proves the behavior or structure is safe?

Stop when the implementation is clear, local, validated as far as feasible, and easy enough to change. More extraction, generality, commenting, or cleanup must reduce a current risk, not make the patch look more polished.

Examples: [examples/refactoring-small-steps.md](../examples/refactoring-small-steps.md), [examples/abstraction-decisions.md](../examples/abstraction-decisions.md), [examples/ai-failure-modes.md](../examples/ai-failure-modes.md).
