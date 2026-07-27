---
description: Propose, audit, obtain approval for, then write and publish a source-backed PLAN.md for a medium-to-large implementation.
argument-hint: "[task-NNN]"
agent: build
---

# Implementation Planning

Invocation arguments: `$ARGUMENTS`.

Turn the active task's authoritative `BRIEF.md` and optional `RESEARCH.md` into an audited implementation proposal. Write `PLAN.md` and publish its PR stages as issues only after explicit user approval. This workflow is for medium-to-large implementations; do not invoke it autonomously for a small local change.

## Authority

User product decisions in task artifacts and planning clarifications are binding. Repository and external evidence govern factual claims. When evidence challenges a factual assumption in authoritative context, present the exact contradiction and ask the user to reconcile it; do not silently override either source.

## 1. Establish Context

1. Resolve the active task using `AGENTS.md`. Require and read `BRIEF.md`; read `RESEARCH.md` when present, plus governing documentation and ADRs.
2. Trace each requested behavior through its current behavior home, callers, dependencies, state changes, failure paths, side effects, compatibility boundaries, and existing validation. Read materially likely affected files in full and verify claims in source.
3. Identify the safest behavior home for each change. Prefer reuse when an existing location holds the rule. Recommend a new behavior home only when source evidence shows why relevant existing locations are unsuitable; do not reject every theoretical owner.
4. Use bounded path-scoped history only when it can explain a relevant design, revert, migration, compatibility constraint, or recurring regression.
5. Resolve factual questions through evidence. Ask the user one focused batch of remaining material product, architecture, compatibility, ownership, or external-contract questions. Record answers not already present in task artifacts under `Planning Clarifications`.

This step is complete when behavior homes, safety-relevant boundaries, safe PR order, existing static and non-test validation, and all material decisions are known. Source evidence is required where behavior ownership or safety matters; exhaustive symbol or class inventories are not.

## 2. Complete The Proposal

Compose the complete proposed `PLAN.md` in memory using the embedded `PLAN.md Format` below. Do not create or modify `PLAN.md` yet. Use English except for `Human Review`, whose prose must be Czech while preserving code identifiers and established technical terms. Select `<!-- plan-auditor: not-run -->` and set the adjacent findings record to `pending` in the proposal.

Use the fewest coherent PRs that remain safe, reviewable, and independently mergeable after their dependencies. Use the production-logic size target as planning guidance, not a reason to split a coherent outcome. Assign each brief acceptance criterion to exactly one Owning PR. Preserve explicit dependencies, safe intermediate states, plan-wide constraints, existing validation, assigned paths, and out-of-scope boundaries.

For each PR, make the implementation contract binding and its implementation direction advisory. Later implementation may deviate from the direction when concrete source evidence supports a better route, but must preserve the contract. Recommend reuse or a new behavior home from evidence without prescribing detailed symbol-by-symbol steps.

The proposal is complete only when every format check passes and every contract can be implemented without inventing a material product or external-contract decision.

## 3. Audit Exactly Once

Consult the marker in the in-memory proposal. Change it from `not-run` to `invoked` immediately before invoking `plan-auditor` exactly once for this proposal with the task artifacts, planning clarifications, full proposal, and relevant repository evidence. Immediately after it returns, place its unresolved findings verbatim in the adjacent findings record before doing other work. Never invoke it a second time for this proposal, including after clarification or corrections.

Resolve every finding in the proposal and remove it from the findings record as its resolution is reflected. Use evidence for factual or planning findings and ask the user only when a finding exposes a missing binding decision or an evidence-backed contradiction. Set the record to `None` and the marker to `resolved` only when every finding is resolved and the complete proposal remains internally consistent.

## 4. Obtain Approval Before Writing

Present the complete `Human Review` from the audited proposal in normal assistant text. Then use the question tool with exactly this question:

`Schvaluješ předložený plán, vytvoření PLAN.md a publikaci ticketů?`

Offer exactly these choices:

- `Schvaluji a publikuj`
- `Neschvaluji`

On `Neschvaluji`, do not create or modify `PLAN.md`, publish nothing externally, and stop.

On `Schvaluji a publikuj`, mechanically verify the in-memory proposal's `resolved` audit marker, `None` findings record, required sections, unresolved placeholders, PR numbering, one Owning PR per acceptance criterion, dependencies, constraints, validation, out-of-scope boundaries, and cross-section consistency. Write that exact verified proposal to the active task's `PLAN.md`, reread it, and verify byte-equivalent material content before continuing. If verification fails, publish nothing and report the blocker; do not re-audit. Do not invoke or select `ticket-master` before the user gives this approval and the written file passes verification.

## 5. Publish Issues

Only after Step 4 has recorded `Schvaluji a publikuj` and successfully written and verified `PLAN.md`, preflight the instructed provider, authentication, repository, and task label. Compute each complete finalized PR section's SHA-256 digest and invoke `ticket-master` with the ordered sections and digests. Reread `PLAN.md` and verify its publication metadata against every resulting issue.

Finish only when every current PR has one verified issue and removed open stages were verified as superseded and closed. Do not implement code.

## PLAN.md Format

Design the smallest safe PR dependency graph before filling the format. Divide work at coherent behavior boundaries. An **Owning PR** implements a behavior or acceptance criterion; a **behavior home** is the code location holding a rule; **Assigned paths** define edit scope.

### Size Rules

- Target at most 500 changed production-logic lines per PR. Larger coherent PRs are allowed when splitting would increase risk, obscure ownership, or create unsafe intermediate states.
- Count additions plus deletions in handwritten production source, scripts, migrations, runtime configuration, and generated-source definitions. Moves and rewrites count.
- Tests, documentation, comments, generated output, vendored code, lockfiles, and snapshots do not count toward this limit. The implementation report must measure and report test scope separately.
- When a PR materially exceeds the target, briefly explain why the chosen boundary remains the smallest safe coherent outcome. The implementation reports actual size but does not delete, compress, or repartition correct code solely to satisfy the estimate.

Use exactly this section order. Omit only content explicitly marked optional, and replace every placeholder before approval.

```markdown
# Plan: <Outcome>
<!-- plan-auditor: not-run | invoked | resolved -->
<!-- plan-audit-findings: pending | None | <verbatim unresolved findings> -->

## Human Review

### PR 1

<Česky popište výsledek PR, mechanismus změny a důvod tohoto řešení. Nepoužívejte inventář symbolů ani detailní kroky implementace.>

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
- Later implementation may deviate from this direction on concrete source evidence while preserving the implementation contract.

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

- The file starts exactly with the title and single selected plan-auditor and findings records shown.
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
- Writing requires user approval, `<!-- plan-auditor: resolved -->`, and `<!-- plan-audit-findings: None -->`. No unresolved placeholder remains, no blocking decision is delegated to implementation, and no duplicate execution sections appear.
