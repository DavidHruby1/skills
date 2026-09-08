---
description: Create a source-backed high-level architecture for a feature or refactor, with depth proportional to its scope and risk.
agent: build
---

# Architecture

Invocation arguments: `$ARGUMENTS`.

Create the active task's `.opencode/task-xxx/ARCHITECTURE.md` in the project. This document defines the high-level solution and the reasons behind it. A later `/technical-design` command will develop the low-level specification; a subsequent plan will organize implementation. Produce only the architecture document. Do not invoke those commands, implement code, change other task artifacts, commit, or publish anything.

## Establish Context

1. Read the project's governing instructions and relevant documentation. Read `docs/onboarding.md` when broader project context is needed and it exists.
2. Resolve the task directory from explicit arguments, the conversation, and project task conventions. If these do not identify one task unambiguously, ask rather than selecting the newest directory or inventing a task identifier. The output belongs in the project's `.opencode/task-xxx/ARCHITECTURE.md`, not the global OpenCode configuration directory.
3. Read the task's requirements and relevant existing artifacts, including any existing architecture. Use the supplied Definition of Done as the description of how the completed change must behave. Do not invent additional outcomes or turn it into a generic engineering checklist. Reference authoritative requirements rather than duplicating them unnecessarily.
4. Inspect enough source to establish the current behavior, affected boundaries, relevant callers, data ownership, infrastructure, and constraints. Reuse existing research where it is sufficient; verify consequential or potentially stale claims in source. Do not inventory the entire repository or map every function.
5. Resolve factual questions from source and documentation. Ask a focused batch of questions only when missing information affects required behavior, scope, ownership, public contracts, safety, or an architectural tradeoff. If evidence contradicts a requirement or prior decision, explain the conflict and ask rather than silently overriding it. Use the `grilling` skill for this alignment. Use the `research` skill only when a concrete external uncertainty warrants it.

Context is sufficient when the intended outcome, relevant current state, affected boundaries, and material architectural decisions are understood. Low-level implementation details need not be resolved. Do not write a finalized architecture while a blocking question remains, but do not seek certainty about every implementation detail.

## Scale The Work

Use the smallest investigation and document that make the change understandable and support the later technical design. Judge complexity by behavioral breadth, coupling, uncertainty, and risk, not file count or estimated lines alone.

- For a local change using established patterns, a few short sections or paragraphs can be sufficient. Do not force diagrams, alternatives, or a separate section for every topic.
- For changes crossing module boundaries, explain ownership, interactions, and the contracts those boundaries must preserve.
- For changes involving public APIs, persistence, authorization, asynchronous work, external systems, or deployment transitions, expand only the relevant architectural consequences and failure scenarios. A small code change can still require this depth.

Combine related sections and omit irrelevant topics rather than filling a fixed template with `N/A`. Do not impose word counts, diagram quotas, exhaustive edge-case lists, mandatory external research, or mandatory subagent reviews. Delegate or research externally only when a concrete uncertainty warrants it. Stop investigating once there is enough evidence for the architectural decisions.

## Design The Architecture

Always make the problem, scope, proposed approach, affected responsibilities, and rationale clear, even when combined into a short narrative. Distinguish the existing state from the proposed change. Identify what is reused, changed, or introduced without documenting unaffected infrastructure.

Select additional content according to relevance:

- **Scope and constraints:** Explicit exclusions and binding technical, operational, or product restrictions. Include quality requirements such as latency or availability only when required or evidenced; do not invent targets.
- **Structure and responsibilities:** Module or system boundaries, dependency direction, responsibility for business rules, data ownership, and sources of truth. Use repository paths to anchor existing components where useful. Clearly label proposed components that do not exist yet.
- **Runtime and data flow:** The main scenario from trigger through processing, state changes, side effects, and result. Explain meaningful synchronous or asynchronous boundaries and important failure paths. Include retries, duplicate handling, ordering, or partial failure only where they affect this change.
- **Invariants:** Properties that must remain true, where they must hold, and which boundary enforces them. Distinguish immediate guarantees from eventual consistency. For a pure refactor, identify the relevant observable behavior and contracts that must remain unchanged.
- **API and data contracts:** Architecturally significant operations, data meanings, relationships, compatibility requirements, trust boundaries, and transaction boundaries. Describe schema shape only where it determines the design; leave complete field catalogs and implementation schemas to technical design.
- **Decisions and tradeoffs:** State the chosen approach, why it fits the requirements and current infrastructure, and its meaningful costs or limitations. Compare real alternatives when a material choice exists; do not invent alternatives for routine reuse. Link relevant existing ADRs rather than creating separate decision documents as part of this command.
- **Transition and operation:** Where needed, explain safe coexistence, migration, rollout, rollback constraints, and observability at an architectural level. Do not assume rollback is possible after an irreversible data change. Leave execution steps to the plan.
- **Risks and remaining questions:** Record concrete residual risks and non-blocking uncertainties with their impact. Separate questions safely deferred to technical design from decisions that must be resolved before writing this document.

Use Markdown and Mermaid diagrams when they explain something more clearly than prose. Structural diagrams show boundaries and dependencies; flow or sequence diagrams show runtime interactions. Include only the views needed for this change, label important arrows, and keep diagrams consistent with the text. A simple change may need no diagram.

Prefer the simplest solution that meets the requirements and fits good existing patterns. Do not add layers, services, dependencies, extension points, compatibility mechanisms, or future-proofing without a current need. Do not copy an unsafe pattern merely for consistency; surface material scope or contract tradeoffs before proceeding.

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
