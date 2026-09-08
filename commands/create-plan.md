---
description: Turn architecture and technical design into an implementation plan split into coherent PRs, audit it, and reconcile its issue tracking.
agent: build
---

# Implementation Planning

Invocation arguments: `$ARGUMENTS`.

Create the active task's `.opencode/task-xxx/PLAN.md` in the project from its accepted `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md`. Cover the whole feature or refactor with concrete implementation steps grouped into reviewable PRs. Produce the plan document, invoke its consistency audit, and, only after an audit `PASS`, invoke issue reconciliation. Do not implement code, change other task artifacts, create branches, publish or write PRs/MRs, commit, merge, or start the implementation workflow. Human approval of the plan belongs before implementation, not before writing this document.

Tests are prepared before `/implement`; this is not a claim that their execution has passed. Planning artifacts retain behavioral acceptance and invariants, but must not contain test source or paths, test commands, fixtures, assertions, test-change instructions, or a test implementation plan.

## Establish Context

1. Read the project's governing instructions and relevant documentation. Read `docs/onboarding.md` when broader project context is needed and it exists.
2. Resolve the task directory from explicit arguments, the conversation, and project task conventions. Arguments may identify the task, an input document, or a planning focus. If these do not identify one task unambiguously, ask rather than selecting the newest directory or inventing a task identifier. Write in the project's `.opencode/task-xxx/PLAN.md`, not the global OpenCode configuration directory. A focus does not silently exclude the rest of the feature.
3. Read `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` in full, their authoritative requirements and supplied Definition of Done, and any existing plan. If an input is missing or its acceptance is unclear, ask for the intended input or confirmation. Do not substitute historical brief/research artifacts, invent missing design decisions, or require approval markers or status files.
4. Reuse the inputs' decisions and applicable evidence. Inspect source and relevant callers only to ground implementation steps, dependencies, safe intermediate states, or potentially stale claims. Do not repeat broad architecture research or redesign accepted contracts. Use only the current conversation and available artifacts, not assumed memory of prior phases.
5. Resolve factual gaps from source. Ask a focused batch of questions only for missing decisions that affect scope, behavior, safety, contracts, or the PR sequence. When relevant evidence or input documents contradict each other, present both claims, their sources, the impact, and the decision needed; wait for the user rather than silently selecting a side or recommending a resolution first. Record settled planning clarifications without modifying the input documents.

Context is sufficient when the whole outcome can be assigned to concrete implementation work, the PR dependencies and safe intermediate states are understood, and no blocking product or design decision remains. Keep harmless local implementation choices open.

## Divide The Work

Use the fewest small, coherent PRs that remain understandable and safe. A local change may need only one PR. Apply these rules directly:

- Prefer vertical slices: one concrete behavior with the necessary layers. Do not default to all models, then all services, then all endpoints. A separate prerequisite is justified only by an actual dependency and an independently reviewable, safe result.
- Each PR must be assessable from its own incremental diff, description, and predecessors. Its correctness must not depend on a future PR. Include required authorization and invariant enforcement with the behavior they protect, not in a later hardening stage.
- Size is guidance, not a line-count limit. Do not split a cohesive change, compress code, or invent abstractions just to shrink a diff. Explain a larger slice only when its boundary needs justification.
- Identify actual dependencies. Independent branches use the exact start and target values recorded for that PR; use a stack only when changes depend on one another. If project instructions or repository evidence require a different integration branch, resolve that conflict before finalizing the branch graph rather than silently substituting it.
- In a stack, record each dependent branch's exact predecessor start point, exact initial target, exact final integration target, and target-transition condition. Do not claim an unmerged dependency is present on the final integration target.
- When a PR needs work from multiple independent branches, explain how those prerequisites become available on its base, for example after they merge into `stage`. Do not invent a branch with multiple bases or hide an integration dependency. Include the implementation that connects independently developed slices and preserves their combined behavioral contracts.
- Plan branch creation as part of implementing each PR, not as slicing up one completed feature diff afterward. Independent work may run in parallel only when dependencies, overlapping edits, and shared resources permit it. Do not force parallelism.
- Implementation of a dependent PR may proceed on its predecessor without waiting for human review. Human review and merging proceed from the bottom of a stack. A target move is allowed only when the PR's recorded transition condition is met, and moves only from its exact initial target to its exact final integration target; do not merge a child into an unmerged parent as a substitute.
- Corrections belong to the PR that introduced the defect, with affected descendants updated and required behavioral contracts preserved. Do not assume ordinary linked PRs automatically rebase or retarget; leave stack-tool selection and commands to the execution workflow.
- State behavioral completion for each PR and the integrated feature, including interactions between independent branches. A later `stage -> main` release is separate, includes all staged changes, and is not a fresh feature-wide review or a release operation owned by this command.

Keep scope, required invariants, and technical contracts binding. Reference the relevant architecture/design sections rather than copying signature catalogs or snippets. Implementation steps may settle routine mechanics left open by the design, but may not weaken or replace its chosen contracts.

## Compose The Plan

Use Markdown and scale the detail to the work. Make the following information easy to find, combining related sections where useful instead of filling an oversized template:

- **Basis and scope:** Links to both input documents and authoritative requirements, the intended outcome, material planning clarifications, and applicable cross-PR constraints or exclusions. Do not restate the entire design.
- **Tracking identity and PR overview:** State the stable task ID and one exact tracking provider repository as `host/namespace/project`. For every PR, give a stable, never-reused `pr-id`; outcome; exact repository-qualified `source`, `start`, `initial-target`, and `final-integration-target`; explicit dependency `pr-id` values; and an explicit target-transition rule. Write every branch reference as `host/namespace/project:branch`. `source` identifies the source repository and branch; `start` names the exact repository and branch it starts from; both targets include their repository and branch. Use `none` for no dependencies or no transition. Do not rely on a default repository, branch, or implicit later retarget. Order prerequisites before consumers and explain the split and useful parallel groups; proposed branch names are not existing branches.
- **Per-PR implementation:** State what changes and why, cite the design contracts it implements, and identify affected paths or symbols. Give ordered, actionable steps covering the required production changes and applicable documentation or migrations. Each step should name the intended change and result rather than merely say "implement the design". Do not include full code, duplicate the low-level specification, or break routine edits into line-by-line instructions.
- **Per-PR behavioral completion:** Define the observable result, safe intermediate state, relevant behavioral acceptance criteria, and invariants. State the result required after a planned target transition without prescribing test work or commands.
- **Feature completion:** Account for every required behavior, invariant, and supplied Definition of Done item across the PRs. Identify which PRs deliver a cross-cutting outcome and the required combined behavior at stack tips or after independent branches integrate, rather than forcing it into one artificial owner.
- **Residual risks:** Include only concrete non-blocking risks or deferred local details that affect execution. Do not defer missing contracts, unsafe intermediate states, or unresolved dependencies to implementation.

The plan must be usable by an implementation agent with these artifacts and the repository, without this conversation. Keep steps specific enough to execute while leaving routine local choices to the implementer. Do not add work, infrastructure, compatibility mechanisms, or cleanup absent from the accepted scope or its direct prerequisites. Do not add test material of any kind; behavioral acceptance and invariants are the required planning evidence.

## Write And Check

Once blocking questions are resolved, write `PLAN.md` directly without a separate approval round. Follow the project's documentation language convention, or the user's language when none exists. If the file already exists, reconcile the request with its current content and preserve unrelated user decisions; ask if they conflict.

Read back the written plan and check:

- It covers the whole accepted scope and supplied Definition of Done without adding or changing product behavior.
- Each PR has a coherent outcome, concrete steps, affected locations, behavioral acceptance and invariant criteria.
- Every `pr-id` is stable and unique; its source, start, initial target, final integration target, dependencies, and any target-transition condition are exact and mutually consistent. Dependencies are acyclic and intermediate states are safe.
- Required authorization and invariant enforcement accompany their behavior, and no PR relies on a future PR for correctness.
- The proposed work follows binding architecture and technical-design contracts and preserves the inputs' distinction between requirements and illustrative examples.
- Paths, symbols, input references, provider repository identity, and PR map are grounded; proposed names are labeled and no blocking placeholders remain.

These checks, including completeness and PR quality, belong to you, not the narrow consistency auditor. For this documentation-only command, verify content and references only. Testing is complete before `/implement` and is not planned or executed here.

## Audit The Written Plan

After the written plan passes your checks, invoke `plan-auditor` with the project location and exact paths to the complete `PLAN.md`, `ARCHITECTURE.md`, and `TECHNICAL-DESIGN.md`. Its only assignment is to identify contradictions between the plan and those two inputs, not to judge the PR split, redesign the feature, or edit files.

Verify each returned finding against the cited passages. Correct demonstrated plan deviations without changing the inputs. If a finding exposes conflicting inputs or a missing user-owned decision, explain the conflict and wait for clarification. Do not rewrite architecture or technical design just to make the audit pass.

After substantive corrections, recheck the changed plan and resume the auditor to verify the corrected document against both inputs. Do not rerun an unchanged successful audit or add rounds to meet a quota. If findings cannot be resolved or the audit cannot run, retain the plan as incomplete and report the blocker; never claim an audit passed, silently substitute another agent, or advance to implementation.

Only after a verified `plan-auditor` `PASS`, invoke `ticket-master` with `Action: reconcile`, the project root, the exact written `PLAN.md` path, the plan's task ID, verified tracking provider repository and complete PR map. `ticket-master` owns all provider issue discovery and writes. Do not create issues yourself, create or update PRs/MRs, or use a local issue manifest.

If reconciliation passes, report its result with the audit result. If reconciliation is partial, blocked, conflicted, unavailable, or uncertain, the audit-passed plan remains valid but tracking is a partial failure: report the ticket-master evidence and stop. Do not start implementation, publication, or PR/MR work as a fallback.

Finish with the written path, a brief explanation of the PR split, exact PR map, and dependencies; the actual audit outcome; the tracking outcome; and any material residual risks. Stop with the plan ready for human review, not with implementation or publication started. An audit finding no contradictions is not proof that the feature has been implemented or runtime-validated.
