---
description: Create a source-backed high-level architecture for a feature or refactor, with depth proportional to its scope and risk.
agent: build
---

# Architecture

Invocation arguments: `$ARGUMENTS`.

Create the active task's `.opencode/task-xxx/ARCHITECTURE.md` in the project. This document defines the high-level solution and the reasons behind it. A later `/technical-design` command will develop the low-level specification; a subsequent plan will organize implementation. Produce only the architecture document. Do not invoke those commands, implement code, change other task artifacts, commit, or publish anything.

Load `software-philosophy` for design judgment. This command governs the required artifact, phase boundaries, and completion criteria.

## Establish Context

1. Read the project's governing instructions and relevant documentation. Read `docs/onboarding.md` when broader project context is needed and it exists.
2. Resolve the task directory from explicit arguments, the conversation, and project task conventions. If these do not identify one task unambiguously, ask rather than selecting the newest directory or inventing a task identifier. The output belongs in the project's `.opencode/task-xxx/ARCHITECTURE.md`, not the global OpenCode configuration directory.
3. Read the task's requirements and relevant existing artifacts, including any existing architecture. Use the supplied Definition of Done as the description of how the completed change must behave. Do not invent additional outcomes or turn it into a generic engineering checklist. Reference authoritative requirements rather than duplicating them unnecessarily.
4. Inspect enough source to establish the current behavior, affected boundaries, relevant callers, data ownership, infrastructure, and constraints. Reuse existing research where it is sufficient; verify consequential or potentially stale claims in source. Do not inventory the entire repository or map every function.
5. Resolve factual questions from source and documentation. Ask a focused batch of questions only when missing information affects required behavior, scope, ownership, public contracts, safety, or an architectural tradeoff. If evidence contradicts a requirement or prior decision, explain the conflict and ask rather than silently overriding it. Use the `grilling` skill for this alignment. Use the `research` skill only when a concrete external uncertainty warrants it.

Context is sufficient when the intended outcome, relevant current state, affected boundaries, and material architectural decisions are understood. Low-level implementation details need not be resolved. Do not write a finalized architecture while a blocking question remains, but do not seek certainty about every implementation detail.

## Design The Architecture

Always make the problem, scope, proposed approach, affected responsibilities, and rationale clear, even when combined into a short narrative. Distinguish the existing state from the proposed change. Identify what is reused, changed, or introduced without documenting unaffected infrastructure.

Select additional content according to relevance, combining sections and omitting irrelevant topics rather than filling a template with `N/A`. Do not impose length or diagram quotas, exhaustive checklists, mandatory external research, or mandatory subagent reviews.

- **Scope and constraints:** Explicit exclusions and binding product, technical, operational, and quality requirements.
- **Structure and responsibilities:** Module or system boundaries, dependency direction, responsibility for business rules, data ownership, and sources of truth. Use repository paths to anchor existing components where useful. Clearly label proposed components that do not exist yet.
- **Runtime and data flow:** The main scenario, state changes, side effects, synchronous or asynchronous boundaries, and architecturally significant failure paths.
- **Invariants:** Required properties, their scope and enforcing boundaries, and observable contracts preserved by a refactor.
- **API and data contracts:** Architecturally significant operations, data meanings, relationships, compatibility requirements, trust boundaries, and transaction boundaries. Describe schema shape only where it determines the design; leave complete field catalogs and implementation schemas to technical design.
- **Decisions and tradeoffs:** The choice, rationale, accepted costs, and relevant alternatives. Link existing ADRs rather than creating separate decision documents as part of this command.
- **Transition and operation:** Coexistence, migration, rollout, rollback constraints, and observability at an architectural level; leave execution steps to the plan.
- **Risks and remaining questions:** Record concrete residual risks and non-blocking uncertainties with their impact. Separate questions safely deferred to technical design from decisions that must be resolved before writing this document.

Use Markdown, adding Mermaid diagrams only when they clarify the design. Label important arrows and keep diagrams consistent with the text.

## Keep The Abstraction Boundary

The architecture must let technical design proceed without inventing product behavior or reopening an unresolved architectural choice. It must also leave local implementation choices open.

- Describe responsibilities and contracts, not function signatures, class inventories, method bodies, implementation snippets, or detailed algorithms.
- Cite existing symbols only when they help locate evidence or identify an important boundary; do not prescribe a symbol-by-symbol change list.
- Include only architectural failure modes and gotchas. Leave local coding pitfalls and detailed test cases to technical design.
- Do not produce task breakdowns, PR stages, estimates, or ordered implementation instructions. A necessary migration ordering constraint is architectural; the steps to execute it belong in the plan.
- Make binding requirements and chosen architectural decisions distinguishable from illustrative examples and deferred implementation choices.
- Keep the artifact self-contained enough for another agent to use without this conversation. Link the task inputs and relevant source or documentation supporting consequential claims; do not copy large source excerpts.

## Write And Verify

Once the necessary context is available and blocking questions are resolved, write `ARCHITECTURE.md` directly without a separate approval round. Follow the project's documentation language convention, or the user's language when none exists. If the file already exists, reconcile the new request with its current content and preserve unrelated user decisions; ask if they conflict.

Review the written document for:

- Alignment with the supplied requirements and Definition of Done, without new product behavior.
- Consistency between the current-state evidence, proposed responsibilities, flows, contracts, diagrams, and decisions.
- Explicit ownership of relevant invariants and meaningful side effects.
- No unresolved architectural blockers disguised as implementation details.
- No unnecessary sections, duplicated requirements, speculative infrastructure, or low-level specification.
- Correct output location and valid references to the task inputs and inspected source.

For this documentation-only command, verify content and references; do not run application tests or builds unless a specific architectural uncertainty requires execution. Correct concrete issues and stop when the document is sufficient for technical design.

Finish with the written path, a brief explanation of the chosen depth, and any material residual risks or non-blocking questions. Do not claim the architecture was implemented or runtime-validated.
