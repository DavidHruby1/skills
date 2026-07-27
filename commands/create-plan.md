---
description: Create and publish an audited, source-backed PLAN.md for a medium-to-large implementation that needs implementation planning and tracked issues.
argument-hint: "[task-NNN]"
agent: build
---

# Implementation Planning

Invocation arguments: `$ARGUMENTS`.

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

Write the complete `PLAN.md` at the active task path using the embedded `PLAN.md Format` below. Use English except for `Human Review`, whose prose must be Czech while preserving code identifiers and established technical terms. Set `Status: Draft`, leave the approval date placeholder unchanged, select `<!-- plan-auditor: not-run -->`, and set the adjacent findings record to `pending`.

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

## PLAN.md Format

Design the smallest safe PR dependency graph before filling the format. Divide work at coherent behavior boundaries. An **Owning PR** implements a behavior or acceptance criterion; a **behavior home** is the code location holding a rule; **Assigned paths** define edit scope.

### Size Rules

- Target at most 500 changed production-logic lines per PR; never exceed 750.
- Count additions plus deletions in handwritten production source, scripts, migrations, runtime configuration, and generated-source definitions. Moves and rewrites count.
- Tests, documentation, comments, generated output, vendored code, lockfiles, and snapshots do not count toward this limit. The implementation report must measure and report test scope separately.
- A 501-750 line PR must name a rejected split and explain why it would break a coherent outcome or increase risk. Implementation must repartition before publication if actual production logic exceeds 750 lines.

Use exactly this section order. Omit only content explicitly marked optional, and replace every placeholder before approval except the draft approval-date placeholder.

```markdown
# Plan: <Outcome>
Status: Draft | Approved
Approved: YYYY-MM-DD
<!-- plan-auditor: not-run | invoked | resolved -->
<!-- plan-audit-findings: pending | None | <verbatim unresolved findings> -->

## Human Review

### PR 1

<Česky popište výsledek PR, mechanismus změny a důvod tohoto řešení. Nepoužívejte inventář symbolů, detailní kroky implementace ani instrukce pro workera.>

<!-- Zopakujte jednou pro každý PR v pořadí stacku. Zachovejte přesné identifikátory a technické termíny. -->

## Inputs

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Research: `.opencode/artifacts/task-NNN/RESEARCH.md` <!-- Omit when absent. -->
- Relevant documentation: `<paths or None>`
- Relevant ADRs: `<paths or None>`

## Planning Clarifications

- <Material user decision not already recorded in the inputs> <!-- Use `None` when absent. -->

## Plan-Wide Constraints

- <Invariant, compatibility property, ordering rule, or cross-PR constraint>

## Pull Requests

### PR 1: <Reviewable Outcome>

**Outcome:** <Observable result that is safe and mergeable after its dependencies>

**Implementation contract:**

- Behavior: <Binding behavior this Owning PR must implement>
- Invariants: <Binding invariants and safety properties it must preserve>
- Failure, side effects, and compatibility: <Binding failure behavior, side-effect boundaries, and compatibility requirements>

**Implementation direction:**

- `<likely path:symbol>`: <Evidence-backed advisory recommendation, including why this existing behavior home should be reused or why a new behavior home belongs here>
- Assigned paths: `<edit scope>`
- The worker may deviate from this direction on concrete source evidence while preserving the implementation contract.

**Dependencies:** <Earlier PRs or `None`>

**Validation:**

- Existing static validation: `<existing command/check or None>`
- Existing non-test validation: `<existing command/check or None>`
- [ ] <Brief acceptance criterion owned by this PR>

**Out of scope:** <Explicit exclusion or `None`>

**Size:** <Estimated additions plus deletions of production logic; target compliance; rejected split and reason when 501-750 lines; substantial excluded diffs>

<!-- Repeat the PR section as needed. -->

## Final Cross-PR Validation

- [ ] `<existing combined check or operational verification>` <!-- Use `None` when no check spans PRs. -->

## Residual Risks

- <Known non-blocking risk, impact, mitigation, and owner; or `None`>

## Published Issues

- Provider: <GitHub or GitLab>
- Repository: `<owner/repository or group/project>`
- Task label: `task-NNN`

- [ ] PR 1: `<pending>`
- [ ] PR 2: `<pending>`; depends on PR 1
```

### Plan Format Completion Checks

- The file starts exactly with the title, status, approval, and single selected plan-auditor and findings records shown. Drafts retain `Approved: YYYY-MM-DD`; approval replaces only the date placeholder and status.
- Human Review has `### PR N` for every PR and Czech prose explaining outcome, mechanism, and reason without symbol inventories or detailed implementation steps.
- The plan matches binding user product decisions. Factual assumptions are evidence-backed or reconciled with the user.
- Every brief acceptance criterion appears once under the Validation section of exactly one Owning PR.
- Every implementation contract binds behavior, invariants, failure behavior, side effects, and compatibility. Direction is advisory and evidence-backed.
- Every recommendation identifies a likely `path:symbol` behavior home and explains reuse or the need for a new home without requiring rejection of every theoretical owner.
- Dependencies point only backward, intermediate states are safe, assigned paths do not conflict, and every PR has explicit out-of-scope work.
- Plan-wide constraints and source evidence capture ownership or safety facts that matter across PRs without duplicating PR contracts.
- Existing static and non-test validation is recorded when available. Existing tests need not prove new behavior.
- Size estimates count production logic only. Tests are excluded and their scope is reported separately by implementation.
- Final validation contains only genuinely cross-PR checks. Published Issues has one pending or verified item per current PR in stack order.
- Approval requires `<!-- plan-auditor: resolved -->` and `<!-- plan-audit-findings: None -->`. No unresolved placeholder remains at approval, no blocking decision is delegated to implementation, and no duplicate execution sections appear.
