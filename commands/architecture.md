---
description: Create a concise, source-backed architecture for a feature or refactor.
agent: build
---

# Architecture

Invocation arguments: `$ARGUMENTS`.

Create `.opencode/tasks/task-xxx/ARCHITECTURE.md` for the identified task. The document defines the accepted high-level solution and the reasons behind it. A later `/technical-design` command will specify implementation details. Produce only the architecture document; do not implement code, modify other task artifacts, invoke later workflow commands, commit, or publish.

Load `software-philosophy` for design judgment and `anti-over-engineering` to keep scope and complexity justified. They are decision lenses; this command defines the artifact, phase boundary, and completion criteria.

## Establish Context

1. Read the project's governing instructions and the documentation under `docs/` relevant to this task.
2. Interpret `$ARGUMENTS` as either:
   - a task identifier or path resolving to `.opencode/tasks/task-xxx/`, in which case read its `PROPOSAL.md` when present; or
   - the proposal text itself.

   Resolve the output task directory from the explicit argument, conversation, and project conventions. If proposal text is supplied but one task directory cannot be identified unambiguously, ask instead of inventing an identifier or selecting the newest task. If `ARCHITECTURE.md` already exists, read it and always ask the user before reconciling, replacing, or overwriting it.
3. Treat any proposal (document or supplied text) as the user's intended outcome, scope, constraints, and suggested solution, not as proof that its technical assumptions are correct. When no proposal is available, derive the intended outcome from the conversation and existing task artifacts and resolve gaps with the user. Do not silently add product behavior or discard a stated requirement. Surface conflicts with source or existing decisions and resolve them with the user.
4. Inspect enough source to understand current behavior, affected boundaries, callers, data ownership, integrations, and constraints. For broad or uncertain areas, launch independent `explore` agents for distinct flows or boundaries; use none for a small, well-located change. Ask each agent primarily for a prioritized list of relevant files and symbols, why each matters, and source locations supporting its map. After they return, personally read the consequential files and verify their claims before using them. Subagent summaries are navigation, not source context or authority.
5. Resolve discoverable facts from source and documentation. Use `grilling` for unclear requirements, conflicting assumptions, or consequential decisions that need the user. Use `research` only for a concrete external uncertainty. Resolve every architectural blocker before writing; leave only local implementation choices to technical design.

Context is sufficient when the intended outcome, verified current state, affected boundaries, and consequential architectural decisions are understood.

## Design The Architecture

Lead with the proposed change and key decisions. Clearly distinguish verified current behavior from the proposed design and label components that do not exist yet.

Include only relevant material, combining sections where that improves readability:

- **Problem and scope:** Intended outcomes, non-goals, binding constraints, and observable success.
- **Current state:** Only the existing behavior and boundaries needed to evaluate the change.
- **Structure and responsibilities:** Ownership, module or system boundaries, dependency direction, reused and proposed components, data ownership, and sources of truth.
- **Runtime and data flow:** Main scenarios, state changes, side effects, sync or async boundaries, and architecturally significant failures.
- **Invariants and contracts:** Required guarantees, enforcing boundaries, trust boundaries, and compatibility or transaction semantics where relevant.
- **Decisions and trade-offs:** Consequential choices, rationale, accepted costs, and credible rejected alternatives. Link applicable ADRs rather than creating new ones.
- **Transition and operation:** Migration, coexistence, rollout, rollback, and observability only when they affect the architecture.
- **Relevant files:** Repository-relative files that are important for understanding or implementing the feature, with a short reason for each. Mark proposed paths when the architecture requires a new file. Keep the list focused on architectural ownership and boundaries.
- **Risks:** Concrete residual risks, their impact, and mitigation or verification direction. Do not include remaining questions; resolve them before finalizing the document.

Use only ASCII diagrams, and only when they make a boundary or flow clearer than prose. Keep them small, label important arrows, and make the surrounding text authoritative.

Keep the document at architecture level: define responsibilities, boundaries, flows, guarantees, and decisions without function signatures, class inventories, implementation snippets, detailed algorithms, test cases, task breakdowns, PR stages, or ordered implementation steps. It must be self-contained enough for technical design without repeating source excerpts or prescribing harmless local choices.

Optimize for fast human review. Use short sections and direct language, omit irrelevant topics instead of writing `N/A`, remove repetition, and stop at the shortest document that fully communicates the architecture. If the design cannot remain reviewable, narrow or split the task rather than producing an exhaustive repository narrative.

## Write And Verify

Once blockers are resolved, write `ARCHITECTURE.md` directly without another approval round. Follow the project's documentation language, or the user's language when none exists.

Read it back and correct concrete issues. Verify that it:

- preserves the proposal's accepted outcomes, scope, and constraints when a proposal is available, without inventing behavior;
- is consistent with inspected source, flows, contracts, decisions, and diagrams;
- assigns ownership for relevant invariants, data, and side effects;
- contains no unresolved architectural decisions or disguised blockers;
- stays concise, high-level, self-contained, and grounded in valid references.

Do not run application tests or builds unless execution is necessary to resolve a specific architectural fact. Finish with the written path, a brief note on the chosen depth, and material risks. Do not claim implementation or runtime validation.
