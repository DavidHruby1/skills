# PLAN.md Format

Design the smallest safe PR dependency graph before filling the format. Divide work at coherent behavior boundaries. An **Owning PR** implements a behavior or acceptance criterion; a **behavior home** is the code location holding a rule; **Assigned paths** define edit scope.

## Size Rules

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

## Completion Checks

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
