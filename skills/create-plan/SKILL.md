---
name: create-plan
description: Create and publish an audited, source-backed PLAN.md for a medium-to-large implementation that needs implementation planning and tracked issues.
disable-model-invocation: true
---

# Implementation Planning

Turn the active task's authoritative `BRIEF.md` and optional `RESEARCH.md` into an approved, implementation-ready `PLAN.md`, then publish its PR stages as issues. This workflow is for medium-to-large implementations; do not invoke it autonomously for a small local change.

## Authority

User product decisions in task artifacts and planning clarifications are binding. Repository and external evidence govern factual claims. When evidence challenges a factual assumption in authoritative context, present the exact contradiction and ask the user to reconcile it; do not silently override either source.

## 1. Establish Context

1. Resolve the active task using `AGENTS.md`. Require and read `BRIEF.md`; read `RESEARCH.md` when present, plus governing documentation and ADRs.
2. Trace each requested behavior through its current behavior home, callers, dependencies, state changes, failure paths, side effects, compatibility boundaries, and existing validation. Read materially likely affected files in full and verify claims in source.
3. Identify the safest behavior home for each change. Prefer reuse when an existing location holds the rule. Recommend a new behavior home only when source evidence shows why relevant existing locations are unsuitable; do not reject every theoretical owner.
4. Use bounded path-scoped history only when it can explain a relevant design, revert, migration, compatibility constraint, or recurring regression.
5. Resolve factual questions through evidence. Ask the user one focused batch of remaining material product, architecture, compatibility, ownership, or external-contract questions. Record answers not already present in task artifacts under `Planning Clarifications`.

This step is complete when behavior homes, safety-relevant boundaries, safe PR order, existing static and non-test validation, and all material decisions are known. Source evidence is required where behavior ownership or safety matters; exhaustive symbol or class inventories are not.

## 2. Complete The Draft

Write the complete `PLAN.md` at the active task path using [`PLAN-FORMAT.md`](PLAN-FORMAT.md). Use English except for `Human Review`, whose prose must be Czech while preserving code identifiers and established technical terms. Set `Status: Draft`, leave the approval date placeholder unchanged, select `<!-- plan-auditor: not-run -->`, and set the adjacent findings record to `pending`.

Use the fewest coherent PRs that remain safe, reviewable, independently mergeable after their dependencies, and within the production-logic size limit. Assign each brief acceptance criterion to exactly one Owning PR. Preserve explicit dependencies, safe intermediate states, plan-wide constraints, existing validation, assigned paths, and out-of-scope boundaries.

For each PR, make the implementation contract binding and its implementation direction advisory. The worker may deviate from the direction when concrete source evidence supports a better route, but must preserve the contract. Recommend reuse or a new behavior home from evidence without prescribing detailed symbol-by-symbol steps.

The draft is complete only when every format check passes and a worker can implement every contract without inventing a material product or external-contract decision.

## 3. Audit Exactly Once

Consult the durable plan-auditor marker. If it is `not-run`, change it to `invoked` immediately before invoking `plan-auditor` exactly once over the lifetime of the active task with the task artifacts, planning clarifications, full draft, and relevant repository evidence. Immediately after it returns, persist its unresolved findings verbatim in the adjacent findings record before doing other work. Never invoke it a second time, including after clarification, manual edits, or a resumed workflow. A resumed plan uses the persisted findings.

Resolve every finding in `PLAN.md` and remove it from the findings record as its resolution is reflected. Use evidence for factual or planning findings and ask the user only when a finding exposes a missing binding decision or an evidence-backed contradiction. Set the record to `None` and the marker to `resolved` only when every finding is resolved and the complete draft remains internally consistent.

## 4. Obtain Approval

Tell the user explicitly to open and read `PLAN.md` in their editor. Then use the question tool with exactly this question, substituting the absolute path:

`PLAN.md je připravený v <absolute path>. Schvaluješ aktuální plán a publikaci ticketů?`

Offer exactly these choices:

- `Schvaluji a publikuj`
- `Neschvaluji`

On `Neschvaluji`, retain `Status: Draft`, publish nothing externally, and stop. The user may edit the plan and resume later; do not re-audit.

On `Schvaluji a publikuj`, reread the current `PLAN.md` from disk and treat that exact version, including manual edits, as publication authority. Mechanically verify the `resolved` audit marker, `None` findings record, required sections, unresolved placeholders, PR numbering, one Owning PR per acceptance criterion, dependencies, constraints, validation, out-of-scope boundaries, and cross-section consistency. If manual edits remove either audit record or introduce a material contradiction that cannot be resolved mechanically, stop with `Status: Draft`, publish nothing, and report the contradiction; do not re-audit. Otherwise set `Status: Approved`, replace `Approved: YYYY-MM-DD` with the current date, and only then continue.

## 5. Publish Issues

Preflight the instructed provider, authentication, repository, and task label. Compute each complete approved PR section's SHA-256 digest and invoke `ticket-master` with the ordered sections and digests. Reread `PLAN.md` and verify its publication metadata against every resulting issue.

Finish only when every current PR has one verified issue and removed open stages were verified as superseded and closed. Do not implement code.
