---
description: Turn an accepted architecture into a source-backed low-level design with implementation contracts, types, and focused snippets.
agent: build
---

# Technical Design

Invocation arguments: `$ARGUMENTS`.

Create `.opencode/tasks/task-xxx/TECHNICAL-DESIGN.md` for the identified task. The document develops its accepted `ARCHITECTURE.md` into a low-level specification that a later plan can organize into implementation work. Produce only the technical design; do not implement code, modify other task artifacts, invoke later workflow commands, commit, or publish.

Testing is not a concern of this command. Do not include or perform test work.

Load `software-philosophy` for design judgment and `anti-over-engineering` to keep scope, abstractions, state, and complexity justified. They are decision lenses; this command defines the artifact, phase boundary, and completion criteria.

## Establish Context

1. Read the project's governing instructions and the documentation and ADRs under `docs/` relevant to this task.
2. Interpret `$ARGUMENTS` as either:
   - a task identifier or path resolving to `.opencode/tasks/task-xxx/`; or
   - an architecture path or design focus that unambiguously identifies that task.

   Resolve the output task directory from the explicit argument, conversation, and project conventions. If one task cannot be identified unambiguously, ask instead of inventing an identifier or selecting the newest task. If `TECHNICAL-DESIGN.md` already exists, read it and always ask the user before reconciling, replacing, or overwriting it.
3. Require and read the task's `ARCHITECTURE.md`; read `PROPOSAL.md` when present. Treat the accepted architecture as the primary technical authority and the proposal, when available, as secondary context for the intended outcome, scope, constraints, and any supplied Definition of Done. If `ARCHITECTURE.md` is missing, stop and ask for it. Do not substitute conversation text or another artifact. If the inputs conflict in a way that could change the intended outcome, scope, behavior, or technical contract, present the conflict and resolve it with the user rather than silently overriding either input.
4. Treat accepted architectural decisions as constraints. Do not redesign the architecture, add product behavior, or assume memory of prior sessions. Distinguish verified current behavior from proposed behavior and verify consequential or potentially stale claims against source.
5. Inspect enough source to understand affected implementation locations, callers, types, control flow, state ownership, integrations, and reusable patterns. For broad or uncertain areas, launch independent `explore` agents for distinct flows or boundaries; use none for a small, well-located change. Ask each agent primarily for a prioritized list of relevant files and symbols, why each matters, and supporting source locations. After they return, personally read the consequential files and verify their claims. Subagent reports are navigation, not source context or authority.
6. Resolve discoverable facts from source and documentation. Use `grilling` for unclear requirements, conflicting assumptions, or consequential user-owned decisions. Use `research` only for a concrete external uncertainty. Resolve blockers before writing; leave harmless local choices to implementation.

Context is sufficient when the affected contracts, meaningful control flow, state ownership, invariant enforcement, and consequential implementation choices are understood.

## Specify The Implementation

Lead with the implementation approach and key contract changes. Identify the architecture and, when present, the proposal used, affected paths and symbols, and contracts being reused, changed, or introduced. Label proposed files and symbols that do not exist yet.

Give each consequential implementation choice enough adjacent context for a reviewer to understand its purpose without reconstructing it from later sections. Briefly state what uses it, what role it serves in the flow, and the concrete reason for its chosen boundary or representation. Keep obvious context to one sentence or a few bullets; expand only where reuse, differing semantics, or a non-obvious trade-off makes the choice risky. Avoid generic rationale such as "for reuse" or "for consistency" without naming the relevant usage.

Include only relevant material, combining sections where that improves readability:

- **Functions and methods:** Use language-appropriate signatures and specify parameters, results, sync or async behavior, preconditions, errors, side effects, and callers as relevant. Add a short purpose and identify the main caller or caller category so the signature has immediate context. Explain the boundary or effects only when they are non-obvious or consequential. Do not inventory every call site or unrelated private helpers.
- **Types and data shapes:** Specify relevant fields, optionality, nullability, defaults, units, identifiers, valid states, validation, and representation conversions. For every introduced or materially changed type, add a short note stating its purpose, main producer, main consumer, and why it has that shape. When one type is shared across multiple semantic roles or API directions (for example form output, create request, update request, or backend response), list those roles next to the type and explain briefly why sharing is valid. Matching fields alone do not justify reuse; specify separate types when the meanings or change reasons differ. Do not leave important additional roles to be discovered only later in the flow description.
- **Structures and dependencies:** Specify constructors, injected dependencies, ownership, lifecycle, and method contracts for classes or equivalent structures when relevant. Briefly explain non-obvious dependency and ownership boundaries.
- **State variables:** List state introduced or materially changed by the design. For each variable, give its language-appropriate declaration or type, owner, initial value when meaningful, lifecycle or transitions, relevant invariants, and a brief reason the state is necessary. Do not inventory unchanged state or routine local variables.
- **Control and data flow:** Describe the main path, meaningful branches, transformations, state changes, side effects, and failure handling. State where validation, authorization, invariants, and transaction boundaries are enforced, explaining only boundaries whose placement is consequential or non-obvious. Keep this consistent with the usages stated next to the relevant contracts.
- **Non-trivial implementation details:** Include focused code in the project's language only when a tricky algorithm, framework interaction, concurrency rule, or error path would remain consequentially ambiguous in prose and signatures. Explain the constraint each snippet resolves, label omitted context, distinguish binding behavior from illustrative choices, and follow project and language formatting.
- **Persistence and integrations:** Specify only changed schema fields, constraints, serialization, queries, indexes, external calls, error mapping, compatibility behavior, and transition constraints. Cite applicable versioned evidence for consequential third-party guarantees.
- **Behavioral acceptance and invariants:** State observable outcomes, boundary conditions, failure behavior, invariants, and their owners without adding product behavior.
- **Risks:** Record only concrete residual risks or material non-blocking implementation discretion and their impact. Do not disguise unresolved behavior, safety, or contract decisions as local choice.

Use Markdown code fences with the correct language. Use only small ASCII diagrams, and only when they clarify a non-trivial interaction better than prose. Make the surrounding text authoritative.

Elaborate the accepted architecture without replacing or duplicating it. Specify consequential contracts and behavior, not routine method bodies, task breakdowns, PR stages, estimates, or implementation order. Keep the document usable without this conversation while leaving harmless local choices to implementation and work sequencing to the later plan.

Optimize for fast human review. Use short sections and direct language, omit irrelevant topics instead of writing `N/A`, remove repetition, and stop at the shortest document that fully specifies the implementation.

## Write And Verify

Once blockers are resolved, write `TECHNICAL-DESIGN.md` directly without another approval round. Follow the project's documentation language, or the user's language when none exists.

Read it back and correct concrete issues. Verify that it:

- follows the accepted architecture and preserves the proposal's intended outcome, scope, constraints, and any supplied Definition of Done when a proposal is available;
- is consistent across signatures, types, state, callers, snippets, control flow, errors, and side effects;
- gives consequential choices enough adjacent context to understand their purpose, usage, and concrete rationale without unnecessary narration;
- states the purpose and main producer and consumer for introduced or materially changed contracts, and identifies all distinct semantic roles when a contract is shared across them;
- never shares a type merely because shapes match, and briefly justifies reuse when meanings or API directions could differ;
- assigns ownership for relevant state, invariants, validation, authorization, and external effects;
- distinguishes existing and proposed symbols, binding contracts and examples, and verified evidence and residual risk;
- contains no blocking decisions, speculative abstractions, unnecessary catalogs, duplicated architecture, or implementation plan;
- remains concise, self-contained, and grounded in valid task, source, and external references.

Verify content and references only. Do not claim proposed code was compiled, executed, implemented, or runtime-validated. Finish with the written path, a brief note on the chosen depth, and material residual risks.
