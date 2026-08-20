---
name: software-philosophy
description: Use for non-mechanical source-code planning, code or test implementation, refactoring, and code review; not for test-contract authoring. Use only where the task clearly crosses boundaries.
---

# Software Philosophy

When a more specific workflow invokes this skill, apply only its design guidance while that workflow continues to govern execution.

## Routing

Pick exactly one primary mode and read its matching reference in full before acting:

- Planning, approach comparison, decomposition, or refactor design: [references/planning.md](references/planning.md).
- Code edits, implementation, local refactoring, or comments: [references/writing-code.md](references/writing-code.md).
- Unit, integration, or end-to-end test implementation: [references/writing-tests.md](references/writing-tests.md).
- Code review, diff review, implementation review, or AI patch evaluation: [references/reviewing-code.md](references/reviewing-code.md).

Use a secondary mode only when the task clearly crosses boundaries. Reading each selected reference in full is mandatory on every invocation; never act from this summary, a prior invocation, or memory. Stop as blocked if a selected reference cannot be read.

## Source Map

- Ousterhout: fight complexity from dependencies and obscurity; watch change amplification, cognitive load, and unknown unknowns; prefer deep modules, obvious code, precise names, strategic design, and errors defined out of existence.
- Fowler: refactor by changing structure without changing observable behavior; use small safe steps, validation, and code smells as signals, not commands.
- Beck: separate behavior from structure; tidy only when it helps current or near-future work; keep tidyings small, reversible, and economically justified.
- Hunt/Thomas: keep knowledge DRY, components orthogonal, assumptions proven, decisions reversible, and feedback early through tracer bullets when uncertainty is high.

## Core Principles

- Complexity is anything that makes software hard to understand or modify; reduce change amplification, cognitive load, and unknown unknowns.
- Complexity comes from dependencies and obscurity; prefer orthogonal components, obvious code, precise names, and explicit contracts.
- Each concrete rule has one behavior home; callers invoke it rather than copying it.
- Prefer deep modules: simple interfaces hiding meaningful complexity and decisions.
- Pull complexity downward into the behavior home; keep related knowledge together when splitting would leak assumptions.
- Design strategically for current pressure: design non-trivial structure twice, keep decisions reversible, and define avoidable errors out of existence where practical.
- For code changes, apply the full Syntax Simplicity Gate and Comments contract in [references/writing-code.md](references/writing-code.md).
- Risky assumptions must be proven with code, tests, tools, measurements, tracer bullets, or focused clarification.

## Terminology

- **Behavior home**: the sole code location where a concrete rule is implemented. Callers invoke it; they do not duplicate the rule.
- **Owning PR**: the PR that implements the behavior.
- **Assigned paths**: the files an agent may edit.

Use **behavior home**, not ambiguous phrases such as behavioral owner, existing owner, source owner, or owner of knowledge, when this is the intended meaning.

## Abstraction Gate

Apply this gate before planning, creating, extending, moving, or reviewing an abstraction.

1. Find the same or a closely related rule in the codebase.
2. Decide whether the change naturally fits that existing behavior home.
3. If it fits, extend that behavior home. Otherwise create one clearly named behavior home for the different rule.
4. Never create a second implementation of the rule. Callers must invoke the behavior home.
5. Do not introduce a wrapper, helper, service, or manager that merely forwards arguments and hides no decision.

An existing behavior home fits only when:

- it implements the same rule
- the change matches its current purpose
- its name remains true
- it does not gain mixed, unrelated responsibilities
- callers need no extra knowledge of internal ordering or details
- its interface remains simpler than the mechanism it hides

Create a new behavior home when:

- this is a different rule or responsibility
- the existing location would have two unrelated reasons to change
- the existing name would become false
- callers would otherwise need to know order, an external format, or hidden state
- a new boundary hides real domain, validation, lifecycle, or external-system decisions
- common use becomes simpler or misuse becomes harder

A similar name or nearby lines do not prove two pieces of code implement the same rule. Looking architectural is not a reason to create an abstraction.

Check:

1. What concrete rule lives here?
2. Which code stops knowing or copying that rule?
3. Is the name still truthful?
4. Will the next change to this rule happen in one place?
5. Does this abstraction make a decision, or merely forward work?

## Refactor Gate

Behavior change alters observable results, ordering, errors, defaults, data shapes, persistence, side effects, or external calls. Structure change reorganizes code while preserving those things.

Never claim "no behavior change" after changing conditionals, ordering, error handling, defaults, return shapes, data conversion, side effects, or tests that encode behavior. Separate behavior and structure changes when practical.

## Stop Gate

Stop when the current plan, change, or review is clear, local, validated as far as feasible, and easy enough to change next.

Treat fake abstractions, pass-through layers, speculative generality, broad rewrites, and refactors with behavior drift as stop signals unless current requirements justify them.

Common stop signals:

- fake abstraction: service, manager, helper, factory, interface, or strategy that hides no knowledge
- speculative generality: imaginary providers, formats, storage engines, themes, policies, tenants, or plugin systems
- tactical patch: another special case while duplicated or hidden knowledge remains central to the task
- broad rewrite: unrelated code changes because the model can, not because the task needs it
- architecture theater: frameworks, registries, providers, or multi-phase designs before uncertainty has been reduced

Stop coding or refactoring when the behavior change is easy to make, cleanup spreads outside the changed area, unrelated behavior knowledge is needed to continue safely, validation is missing for a risky structural move, public interfaces would change without explicit need, or the next move is mostly style preference.

Stop abstracting when the abstraction would support imaginary needs, cannot be given a precise name, only forwards parameters, still requires callers to know hidden details, makes the common path harder, or fragments one clear function.

Leave imperfect code alone when it is outside the task, stable despite ugliness, requires product, architecture, testing, or performance decisions, or has no small safe improvement.

Hand off or ask when requirements are unclear, correctness cannot be judged after available validation, the architecture boundary is unclear, or performance is the issue but no measurement exists.
