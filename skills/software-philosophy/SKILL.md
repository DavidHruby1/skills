---
name: software-philosophy
description: Use for non-mechanical source-code planning, implementation, refactoring, bug fixes, or review when design, abstraction, ownership, or maintainability decisions are required. Do not use for testing, documentation, investigation, configuration, CI, deployment, or mechanical edits.
---

# Software Philosophy

Use when writing code from scratch, implementing a feature, fixing a bug, refactoring, planning a change, or reviewing code where design and maintainability matter. The goal is software that is easier to change without making the current task larger than necessary.

Do not use for mechanical formatting, dependency installation, or straightforward commands. When a more specific workflow invokes it, apply only its design guidance while the invoking workflow continues to govern execution.

## Routing

Pick exactly one primary mode. Before acting, load exactly one matching reference:

- Planning, approach comparison, decomposition, or refactor design: [references/planning.md](references/planning.md).
- Code edits, implementation, local refactoring, or comments: [references/writing-code.md](references/writing-code.md).
- Code review, diff review, implementation review, or AI patch evaluation: [references/reviewing-code.md](references/reviewing-code.md).

Use a secondary mode only when the task clearly crosses boundaries.

## Source Map

- Ousterhout: fight complexity from dependencies and obscurity; watch change amplification, cognitive load, and unknown unknowns; prefer deep modules, obvious code, precise names, strategic design, and errors defined out of existence.
- Fowler: refactor by changing structure without changing observable behavior; use small safe steps, validation, and code smells as signals, not commands.
- Beck: separate behavior from structure; tidy only when it helps current or near-future work; keep tidyings small, reversible, and economically justified.
- Hunt/Thomas: keep knowledge DRY, components orthogonal, assumptions proven, decisions reversible, and feedback early through tracer bullets when uncertainty is high.

## Core Principles

- Complexity is anything that makes software hard to understand or modify; reduce change amplification, cognitive load, and unknown unknowns.
- Complexity comes from dependencies and obscurity; prefer orthogonal components, obvious code, precise names, and explicit contracts.
- Important knowledge has one authoritative owner; DRY knowledge, not repeated text.
- Prefer deep modules: simple interfaces hiding meaningful complexity and owned decisions.
- Pull complexity downward when the module owns it; keep related knowledge together when splitting would leak assumptions.
- Design strategically for current pressure: design non-trivial structure twice, keep decisions reversible, and define avoidable errors out of existence where practical.
- Refactoring preserves behavior and moves in small safe steps with concrete validation when feasible.
- Use comments as a navigation layer: preserve why classes, functions, significant blocks, and ambiguous lines exist or take their chosen approach so review is fast; do not merely narrate what ordinary statements do.
- Risky assumptions must be proven with code, tests, tools, measurements, tracer bullets, or focused clarification.

## Abstraction Gate

Bad abstractions make code look clean while spreading knowledge, increasing jumps, hiding behavior, or supporting imaginary future needs. Before changing structure, name the complexity symptom: change amplification, cognitive load, unknown unknowns, duplicated knowledge, leaked data shape, information leakage, temporal coupling, scattered special cases, repeated conditionals, behavior drift, or unsupported future flexibility.

Create an abstraction only when it does at least one real job:

- creates a deep module: simple interface, meaningful hidden complexity
- hides domain, policy, lifecycle, validation, formatting, mapping, caching, authorization, retry, ordering, or external-system knowledge
- represents duplicated business, data-shape, formatting, validation, or lifecycle knowledge once
- reduces caller cognitive load, makes the common path easier, or makes misuse harder
- pulls complexity into the module that owns it
- localizes a change required now or supported as near-term by approved requirements, repository evidence, or an established product commitment
- separates things that change for different reasons
- prevents callers from knowing external quirks, internal data shapes, or ordering rules

Reject an abstraction when it is a shallow module, pass-through layer, vague `manager`/`handler`/`processor`/`helper`/`utils` concept, speculative interface, one-off wrapper with no hidden knowledge, boolean mode flag, temporal decomposition that splits one cohesive workflow by execution order and makes callers remember phases, lifecycle order, or internal state, file split that fragments one idea, or cleanup that merely makes code look senior.

Reject it when callers still need to understand the internals, the name is imprecise, it only forwards arguments or returns the same result, it exists only to make code look tidy, it creates more files without reducing cognitive load, or one clear function is easier to read than several tiny ones.

Good fix directions: centralize duplicated business knowledge, move external data quirks to boundary code, replace real mode flags with explicit operations, encapsulate ordering rules inside one operation, rename vague concepts before extracting more code, inline shallow pass-through layers, and comment the purpose and reasoning that code alone does not preserve.

Boundary check: Which decision lives here? Which callers stop needing to know it? Which future change becomes local? Which misuse becomes harder?

## Refactor Gate

Behavior change alters observable results, ordering, errors, defaults, data shapes, persistence, side effects, or external calls. Structure change reorganizes code while preserving those things.

Never claim "no behavior change" after changing conditionals, ordering, error handling, defaults, return shapes, data conversion, side effects, or tests that encode behavior. Separate behavior and structure changes when practical.

## Stop Gate

Stop when the current plan, change, or review is clear, local, validated as far as feasible, and easy enough to change next.

Generated code often looks more senior while becoming harder for the next human to change. Treat fake abstractions, pass-through layers, speculative generality, mechanical line-by-line comments, broad rewrites, and refactors with behavior drift as stop signals unless current requirements justify them.

Common stop signals:

- fake abstraction: service, manager, helper, factory, interface, or strategy that hides no knowledge
- pass-through layer: same arguments in, same result out, more names and files
- speculative generality: imaginary providers, formats, storage engines, themes, policies, tenants, or plugin systems
- mechanical comments: line-by-line syntax narration that preserves no reason, decision, or constraint
- tactical patch: another special case while duplicated or hidden knowledge remains central to the task
- broad rewrite: unrelated code changes because the model can, not because the task needs it
- architecture theater: frameworks, registries, providers, or multi-phase designs before uncertainty has been reduced
- review theater: style preferences, generic test requests, or broad redesign ideas not tied to risk
- refactor with behavior drift: ordering, defaults, errors, side effects, or return shapes changed while calling it cleanup

Stop planning when more detail would invent requirements, the next useful step is code exploration or validation, or extra abstraction only preserves imaginary options.

Stop coding or refactoring when the behavior change is easy to make, cleanup spreads outside the changed area, unrelated behavior knowledge is needed to continue safely, validation is missing for a risky structural move, public interfaces would change without explicit need, or the next move is mostly style preference.

Stop abstracting when the abstraction would support imaginary needs, cannot be given a precise name, only forwards parameters, still requires callers to know hidden details, makes the common path harder, or fragments one clear function.

Stop adding comments only when they merely translate syntax, would become stale as soon as implementation changes, or try to justify confusing code instead of fixing it. Do not remove a useful reason just because it can eventually be reconstructed from the implementation or surrounding history.

Stop reviewing when remaining comments are preference-only, findings require unavailable product/domain/runtime facts, or the next useful step is validation rather than more commentary.

Leave imperfect code alone when it is outside the task, stable despite ugliness, requires product, architecture, testing, or performance decisions, or has no small safe improvement.

Hand off or ask when requirements are unclear, correctness cannot be judged after available validation, the architecture boundary is unclear, or performance is the issue but no measurement exists.

## Final Standard

Use the smallest correct change. Do not invent architecture without current pressure. Validate with tools when feasible; otherwise state what remains unverified.
