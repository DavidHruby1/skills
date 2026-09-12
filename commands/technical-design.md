---
description: Turn an accepted architecture into a source-backed low-level design with implementation contracts, types, and focused snippets.
agent: build
---

# Technical Design

Invocation arguments: `$ARGUMENTS`.

Create the active task's `.opencode/task-xxx/TECHNICAL-DESIGN.md` in the project. This document develops `ARCHITECTURE.md` into a low-level specification that a later plan can organize into implementation work. Produce only the design document. Do not invoke subsequent commands, implement code, change other task artifacts, commit, or publish anything.

Testing is completed before `/implement`. Preserve behavioral acceptance and invariants in the design, but do not include test source or paths, test commands, fixtures, assertions, test-change instructions, or test implementation details.

Load `software-philosophy` for design judgment. This command governs the required artifact, phase boundaries, and completion criteria.

## Establish Context

1. Read the project's governing instructions and relevant documentation. Read `docs/onboarding.md` when broader project context is needed and it exists.
2. Resolve the task directory from explicit arguments, the conversation, and project task conventions. Arguments may identify the task, its architecture document, or a focus within it. If these do not identify one task unambiguously, ask rather than selecting the newest directory or inventing a task identifier. The output belongs in the project's `.opencode/task-xxx/TECHNICAL-DESIGN.md`, not the global OpenCode configuration directory.
3. Read the task's `ARCHITECTURE.md`, authoritative requirements, supplied Definition of Done, and relevant existing artifacts, including any existing design. If the architecture is missing or its acceptance is unclear, ask for the intended architecture or confirmation before designing against it. Do not create an architecture as a substitute or require a new approval marker or status file.
4. Treat accepted scope, behavior, and architectural decisions as constraints. Use only the current conversation and available artifacts; do not assume memory of the architecture session. Reference requirements rather than duplicating them, and do not turn the Definition of Done into a generic engineering checklist.
5. Inspect the affected source, relevant callers, existing types, and dependency versions needed to establish implementation contracts and reusable patterns. Verify consequential or potentially stale claims against source. Do not inventory every function or inspect unrelated modules for completeness.

## Resolve Missing Context

Use the `grilling` skill when unclear requirements, conflicting assumptions, or consequential user-owned decisions need clarification. Use the `research` skill when a material implementation question needs repository or external evidence. Load the applicable skill and follow its instructions rather than duplicating its protocol.

If a needed skill is not discoverable, read its installed `SKILL.md` when available; if it is unavailable, report the limitation rather than claiming it ran. Skills and subagents supply context only. Synthesize the final document yourself, incorporating settled decisions and consequential evidence without creating separate research or grilling artifacts.

Reuse accepted evidence and settled decisions. Resolve local, reversible details from source and good existing conventions rather than asking the user to choose every name or helper. Neither skill is a mandatory ceremony when the necessary context is already grounded.

When factual or technical sources disagree, first check their applicability, versions, configuration, and primary evidence. Resolve the discrepancy when the evidence supports a conclusion, explain why, and continue; a discoverable fact does not require a user decision.

Pause the affected decision and do not finalize the document when requirements or accepted architectural decisions conflict, or when unresolved uncertainty could materially change required behavior, scope, a public contract, or safety. Present the conflicting claims, evidence for each, why the conflict matters, and the clarification or decision needed. Wait for the user's response before advancing that decision; independent investigation may continue. Do not silently redesign the architecture, treat authority alone as proof, or ask the user to guess unavailable facts. Report unresolved evidence honestly and unrelated inconsistencies separately without expanding scope.

Context is sufficient when the affected contracts, meaningful control flow, invariant enforcement, and non-trivial implementation choices are understood. Resolve blockers before writing; defer harmless local choices rather than seeking certainty about every line of code.

## Specify The Implementation

Always identify the architecture and requirements used, the affected implementation locations, and the concrete contracts being reused, changed, or introduced. Distinguish verified current behavior from proposed behavior and label proposed files and symbols that do not exist yet.

Select additional content according to relevance, combining sections and omitting irrelevant topics rather than filling a template with `N/A`. Do not impose class inventories, snippet quotas, exhaustive checklists, mandatory external research, or mandatory subagent reviews.

- **Function and method contracts:** Language-appropriate signatures, parameter and return types, synchronous or asynchronous behavior, preconditions, results, errors, side effects, and callers. For changed cross-module contracts, specify both sides and their connection, not unrelated functions or every private helper.
- **Types and data shapes:** Fields, optionality, nullability, defaults, units, identifiers, valid states, validation rules, and required representation conversions. Reuse existing types by reference.
- **Classes or equivalent structures:** Constructors, dependencies, state ownership, lifecycle, and method signatures when the design uses them.
- **Control and data flow:** The main path, significant branches, transformations, state changes, side effects, and failure handling. Specify where validation, authorization, invariants, and transaction boundaries are enforced.
- **Non-trivial implementation details:** Include focused code snippets or pseudocode for tricky algorithms, framework interactions, concurrency, or error handling that prose and signatures would leave ambiguous. Explain the constraint or gotcha each snippet addresses. Label illustrative pseudocode and omitted context; distinguish binding behavior from illustrative local choices. Keep signatures, types, and snippets mutually consistent and use four spaces for indentation.
- **Persistence and integration details:** Changed schema fields, constraints, serialization, queries, indexes, external calls, error mapping, and compatibility behavior. Cite applicable versioned evidence for third-party guarantees. Describe transition constraints, but leave migration generation, execution commands, and rollout steps to implementation and planning.
- **Behavioral acceptance and invariants:** Identify the observable outcomes, invariants, boundary conditions, and failure behavior the implementation must preserve or establish. State their owner and required result without prescribing test work, fixtures, assertions, commands, or coverage changes.
- **Risks and deferred details:** Record concrete residual risks and non-blocking uncertainties with their impact. State which local choices remain open. Do not hide unresolved behavior, safety, or contract decisions as implementation discretion.

Use Markdown code fences with the correct language for signatures and snippets. Use a diagram only when it clarifies a non-trivial interaction better than prose; do not repeat architecture diagrams without adding useful implementation detail.

## Keep The Phase Boundary

- Elaborate the accepted architecture rather than replacing it. Explain how proposed implementation contracts satisfy its responsibilities and invariants without restating the whole architecture.
- Specify enough detail to remove consequential ambiguity, not a complete implementation embedded in Markdown. Leave routine method bodies and harmless local naming choices to implementation.
- Do not produce task breakdowns, PR stages, estimates, or ordered implementation instructions. Necessary runtime or transition ordering belongs in the design; the work sequence belongs in the later plan.
- Keep the document usable without this conversation. Link task inputs and relevant repository paths, symbols, and external sources next to consequential claims. Do not copy large source excerpts or concatenate subagent reports.

## Write And Verify

Once the necessary context is available and blocking questions are resolved, write `TECHNICAL-DESIGN.md` directly without a separate approval round. Follow the project's documentation language convention, or the user's language when none exists. If the file already exists, reconcile the request with its current content and preserve unrelated user decisions; ask if they conflict.

Review the written document for:

- Alignment with the accepted architecture, authoritative requirements, supplied Definition of Done, behavioral acceptance, and invariants, without new product behavior.
- Consistency among signatures, types, callers, snippets, control flow, and error behavior.
- Concrete ownership of relevant invariants, validation, authorization, state changes, and side effects.
- Clear distinctions between existing and proposed symbols, binding contracts and examples, and verified evidence and unresolved uncertainty.
- No blocking implementation decisions, speculative abstractions, unnecessary catalogs, duplicated architecture, or implementation plan.
- Correct output location and valid references to task inputs, inspected source, and applicable external evidence.

For this documentation-only command, verify content and references only. Testing is complete before `/implement` and is not described or executed here. Do not claim proposed snippets were compiled or otherwise executed. Correct concrete issues and stop when the document is sufficient for planning and implementation.

Finish with the written path, a brief explanation of the chosen depth, and any material residual risks or non-blocking questions. Do not claim the design was implemented or runtime-validated.
