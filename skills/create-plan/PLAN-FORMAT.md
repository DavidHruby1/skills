# PLAN.md Format

## How To Build The Plan

Design the PR sequence before filling in the format. Divide work at coherent responsibility boundaries, not by file count, architectural layer, or arbitrary line ranges.

1. Map every approved behavior, acceptance criterion, structural change, migration, test change, and operational concern to required work and validation.
2. Identify complete building blocks, then combine adjacent blocks unless keeping them separate materially reduces risk or cognitive load, preserves useful standalone value, or is required by the hard size limit. Aim for the fewest coherent PRs, not the greatest possible decomposition.
3. Arrange the blocks as a dependency graph. No PR may depend on a later PR or leave deliberate breakage for a later PR to repair.
4. Keep production behavior and the tests that prove it in the same PR. Split test infrastructure only when it is a large, independently useful and mergeable building block with its own validation; never defer a behavior's required tests.
5. Group tightly coupled work when splitting would duplicate context or produce an incomplete contract. Split independent workflows, migrations, reusable foundations, or behavior-preserving structural preparation when each remains useful alone.
6. Estimate additions plus deletions for all logic, including production, migration, configuration, and test code. Repartition when the size rules require it.
7. Audit the result against the brief: every acceptance criterion has one implementation and validation owner, intermediate states remain tested and safe, and no blocking decision or assumption remains.

## PR Size Rules

- Target at most 500 changed logic lines per PR; never exceed 750.
- Count additions plus deletions. Rewrites and moved logic still count.
- Logic includes handwritten source, scripts, migrations, runtime or test configuration, and tests. Blank lines, comments, documentation, generated files, vendored code, lockfiles, and snapshots do not count, but substantial excluded diffs must be disclosed.
- A 501-750 line PR is valid only when a named split would increase cognitive load or break a coherent responsibility. State the estimate, rejected split, and reason.
- If production plus required tests exceeds 750 lines, split the behavior into smaller complete outcomes rather than deferring tests.
- Estimates are evidence-based, not promises. The implementation agent must measure the actual diff and repartition before opening a PR when it exceeds the hard maximum.

Use this structure. Omit only sections marked optional and replace every placeholder with project-specific content.

```markdown
# Plan: <Concise Outcome>

## Approved Solution

<Describe the approved direction, why it was selected, and its accepted trade-offs. Do not repeat the brief or research.>

## Inputs

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Research: `.opencode/artifacts/task-NNN/RESEARCH.md` <!-- Omit when absent. -->
- Relevant documentation: `<paths>`
- Relevant ADRs: `<paths>` <!-- Omit when absent. -->

## Plan-Wide Safety

- <Invariant, compatibility property, ownership rule, or cross-PR constraint that every PR must preserve>

## Pull Requests

### PR 1: <Reviewable Outcome>

**Outcome:** <Observable, independently mergeable result>

**Work:**

- `<path or boundary>`: <Concrete production and test changes>

**Steps:**

1. <First concrete assignment and why it must precede dependent work>
2. <Next safely ordered assignment with enough context for an implementation agent>

**Traceability and validation:**

- [ ] <Brief acceptance criterion or supporting contract>: `<command or check>` proves <expected behavior>

**Dependencies:** <Earlier PRs or `None`>

**Size limit:** <Estimated additions plus deletions for all logic. State target compliance, justify 501-750 lines, and disclose substantial excluded changes.>

<!-- Repeat the PR section as needed. -->

## Final Cross-PR Validation

<!-- Omit when no validation remains beyond checks already owned by individual PRs. -->

- [ ] <End-to-end, migration, compatibility, security, or operational behavior not fully proved inside one PR>

## Residual Risks

- <Known non-blocking risk, impact, mitigation, and owner>

## Unresolved

- <Non-blocking unknown, owner, and required resolution point>

<!-- Omit Unresolved when empty. Blocking unknowns are not allowed in PLAN.md. -->
```

## Completion Checks

- The plan matches the solution explicitly approved during solution planning and does not silently change the brief.
- Every brief acceptance criterion has one implementation owner and a concrete validation path.
- Every PR is independently mergeable after its dependencies and completes its stated outcome.
- The sequence uses the fewest coherent PRs; every split has a concrete benefit beyond technical separability.
- Tests remain with the production behavior they prove. Any separate test-infrastructure PR is independently useful, validated, and consumed by later PRs.
- Every PR targets at most 500 changed logic lines; no PR exceeds 750; every over-target PR justifies the rejected split.
- Work items name evidence-backed boundaries, and steps give a concrete safe implementation order rather than vague phases or repeated requirements.
- Behavior and structural preparation are separated only when both remain coherent and safe alone.
- Risky premises are supported by repository or authoritative external evidence before irreversible dependent work.
- Validation covers relevant failure, concurrency, migration, and rollback paths in addition to the happy path.
- Final cross-PR validation contains only checks that cannot be owned by one PR; it does not repeat every acceptance criterion.
- No blocking product, architecture, or external-contract unknown is delegated to implementation.
- The plan contains no implementation code, speculative work, or restatement of research that does not guide execution.
