---
description: Synthesize accepted task documents into a concise, LLM-oriented implementation plan split into coherent PRs.
agent: build
---

# Create Plan

Invocation arguments: `$ARGUMENTS`.

Create `.opencode/tasks/task-xxx/PLAN.md` for the identified task. The plan is exclusively for LLM implementation agents: optimize its structure, precision, references, and density for reliable machine execution rather than narrative human reading. Produce only the plan, audit it, and reconcile its issue tracking after an audit `PASS`. Do not implement, modify other task artifacts, create branches or PRs/MRs, commit, merge, or start `/implement`.

Testing is outside this command. Preserve behavioral acceptance and invariants, but do not include test source, paths, commands, fixtures, assertions, or test implementation work.

## Establish Context

1. Read the project's governing instructions. Interpret `$ARGUMENTS` as a task identifier or path resolving to `.opencode/tasks/task-xxx/`, or as an input-document path or planning focus that unambiguously identifies that task. Ask rather than inventing an identifier or selecting the newest task. If `PLAN.md` already exists, read it and always ask before reconciling, replacing, or overwriting it.
2. Require and read the task's `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` in full; read `PROPOSAL.md` when present. Architecture and technical design are the binding design authorities. Use the proposal, when available, as secondary context for intended outcome, scope, constraints, and any supplied Definition of Done; do not revive proposal suggestions rejected by the accepted design.
3. If a required input is missing, or the documents conflict in a way that changes scope, behavior, contracts, or work sequencing, stop and resolve it with the normal question tool. Do not inspect source, delegate exploration, use `grilling` or `research`, or invent missing design decisions. The accepted documents must contain the context needed to plan their implementation.

Context is sufficient when the complete outcome can be divided into executable PRs without inventing a product or design decision.

## Build The Plan

Use the fewest small, coherent PRs that safely deliver the accepted design. One phase is exactly one PR and one stable `pr-id`. Prefer vertical behavior slices; create a prerequisite phase only for a real dependency and order every prerequisite before its consumers. Each phase must leave a valid intermediate state and may depend on completed predecessors, never on future phases for its own correctness.

Target at most about 500 affected code lines per PR, estimated as additions plus deletions of implementation code. Test, documentation, generated, and lock-file lines do not count. This is guidance, not a hard limit: keep an indivisible logical change together even around 600-700 lines, state why it should not be split, and keep every PR as small as its cohesive outcome permits.

Write a concise Markdown plan containing only applicable information:

- **Basis and completion:** Identify the input documents and the proposal when present, the intended outcome, scope, non-goals, binding cross-PR constraints, and coverage of every supplied Definition of Done item.
- **Tracking and PR map:** State the stable task ID and exact tracking repository as `host/namespace/project`. For every PR, provide its stable `pr-id`, outcome, repository-qualified `source`, `start`, `initial-target`, and `final-integration-target`, explicit dependency `pr-id` values, and exact target-transition rule. Write branch references as `host/namespace/project:branch` and use `none` where applicable.
- **One phase per PR:** Give the estimated affected code lines and any size rationale; affected paths or symbols and production ownership; ordered implementation steps; precise references to binding architecture and technical-design sections; dependencies and safe intermediate state; observable completion, acceptance criteria, and invariants.
- **Integrated completion and risks:** Map cross-PR behavior and Definition of Done coverage to the responsible phases. Include only concrete residual execution risks; do not defer missing contracts or decisions.

Reference the accepted documents instead of duplicating their architecture, signatures, snippets, or rationale. Keep steps concrete enough for an LLM to execute without this conversation while leaving routine local choices open. Use Mermaid diagrams, not ASCII, only when they make a non-trivial dependency, sequence, or state transition clearer; prose and explicit fields remain authoritative.

## Audit And Reconcile

Once blockers are resolved, write `PLAN.md` directly. Follow the input documents' language convention, or the user's language when none exists.

Invoke `plan-auditor` with the project root and exact paths to `PLAN.md`, `ARCHITECTURE.md`, and `TECHNICAL-DESIGN.md`, plus `PROPOSAL.md` when present. Correct evidence-backed `REWORK` findings without changing the inputs, then resume the same auditor after substantive corrections. If it reports conflicting inputs or a missing user-owned decision, ask the user. Stop on an unresolved `BLOCKED`; never claim a pass or substitute another agent.

After a verified audit `PASS`, invoke `ticket-master` with `Action: reconcile`, the project root, exact plan path, task ID, tracking repository, and complete PR map. `ticket-master` alone owns provider issue discovery and writes. Tracking failure does not invalidate the audited plan; report the exact partial or blocked outcome and stop.

Finish with the written path, concise PR map and dependencies, audit result, tracking result, and material residual risks. Do not start implementation or publication.
