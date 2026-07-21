---
name: implement
description: Implement every stacked pull request in the active PLAN.md through worker subagents, orchestrator review, validation, and publication.
disable-model-invocation: true
---

# Implement

Execute an explicitly supplied task's approved `PLAN.md` as a sequential stack of reviewable pull requests. A `worker` writes all production and test code. The orchestrator owns assignments, source-backed review, corrections, validation, git state, acceptance, and publication; it never writes implementation code itself.

Use the repository's current checkout and ordinary branches. Never use Git worktrees. Use one worker at a time because workers share the checkout; the worker may delegate only bounded read-only exploration.

## 1. Establish The Run

1. Resolve the exact supplied `task-NNN` using `AGENTS.md`; never infer or create one. Read `BRIEF.md` and `PLAN.md` in full, PR-relevant `RESEARCH.md`, and approved and audited `GHERKIN.md` sections when present. Stop for the producing workflow when required artifacts, approvals, decisions, audit evidence, or published issue evidence are absent or inconsistent.
2. Read repository instructions and relevant documentation. Inspect the planned source, tests, git status, branch, remotes, and recent history enough to verify the plan still matches the checkout. Stop on ambiguous unrelated changes, behavioral or architectural contradictions, an unsafe sequence, or drift between each published issue and its verbatim PR section.
3. Treat approved Gherkin as the only supplemental test contract and route mapped scenarios through `testing`. Without mapped scenarios, do not invent Gherkin-specific tests, infrastructure, or dependencies; implement and validate every test and check required directly by `PLAN.md`.
4. Establish the base branch and deterministic stage branches `task-NNN/pr-N`. Reconcile existing branches or PRs from evidence rather than repeating work. Every stage must end as exactly one commit relative to its parent.

This step is complete when the task, base, PR order, current progress, safety constraints, source boundaries, approved tests, and every blocking escalation are resolved.

## 2. Implement Each Stage

Create each stage branch from its accepted parent. Give one `worker`:

- the active task path, exact unchanged PR section and digest, branch, and base ref,
- relevant brief criteria, research evidence, source evidence and reuse decisions from the plan, and plan-wide safety constraints,
- the owned paths and symbols, explicit out-of-scope work, and validation commands,
- every approved Gherkin section mapped to the PR, including approval, audit evidence, execution mode, and traceability,
- instructions to leave all git state, commits, pushes, and PRs to the orchestrator.

The worker follows its own implementation process. Return material brief, plan, or source-reuse conflicts to the producing workflow rather than letting the worker redesign the assignment.

For approved test-first Unit scenarios, first assign only the tests to the worker. Require `testing`, inspect the diff, then run the focused command yourself and accept only a behavioral red caused by missing planned behavior; collection, import, syntax, fixture, and environment failures are invalid. Then resume the worker for production code. For approved with-implementation scenarios, require `testing` and implement tests with production behavior. Workers report mapped test commands without running them. After implementation, independently run the narrowest relevant command and every suite selected by approved sections; all mapped tests must pass. Never invoke `test-auditor` during implementation. No mapped scenario removes only Gherkin-specific requirements; tests required directly by `PLAN.md` remain required.

Snapshot `HEAD`, refs, and the index before every worker call and verify that the worker did not mutate git-owned state afterward. Stop and report any such mutation rather than repairing it implicitly.

## 3. Review And Accept

The orchestrator reviews the output itself. Invoke `software-philosophy` in review mode, inventory every tracked and untracked path, and inspect the complete diff path by path before accepting it. Verify:

- every brief criterion, PR outcome, dependency, safety constraint, and mapped scenario is satisfied,
- every changed path and behavior is in scope and no required outcome is missing,
- added logic does not duplicate an existing function, method, class, rule, transformation, or call path in the affected files or repository,
- every new abstraction is necessary and each new symbol is placed with the existing owner of its knowledge,
- every new or materially changed non-trivial function, method, and class has an accurate interface comment explaining its responsibility, rationale, and important constraints or behavior,
- tests are traceable, meaningful, and capable of failing when mapped behavior breaks,
- validation evidence is fresh after the final change.

Do not accept the worker report as proof. Verify consequential claims in source and run planned and repository-required checks yourself. When no approved Gherkin scenario maps to the PR, planned tests and applicable repository checks remain acceptance gates; do not create an additional Gherkin-specific gate.

Send every valid defect back to the same worker as a bounded correction with exact evidence and direction. Reinspect the correction and rerun invalidated checks. If that worker cannot complete the assignment, use at most one replacement worker for the stage. Stop when the result remains incorrect, needs an absent decision, or cannot be validated safely.

## 4. Commit The Stage

Measure changed logic lines using [`../create-plan/PLAN-FORMAT.md`](../create-plan/PLAN-FORMAT.md). More than 750 blocks acceptance and returns to `/create-plan`; 501-750 is allowed only when the plan's rejected split remains valid.

Stage only the accepted inventory, inspect the complete staged diff, and create exactly one local commit using repository conventions. Verify the branch is one commit ahead of its parent and the worktree has no unaccounted changes. Record the branch, commit, parent, size, final validation, worker task IDs, corrections, and residual risks. Then branch the next PR from that accepted commit. Do not push until the full local stack passes final validation.

## 5. Validate And Publish

On the top branch, run every `Final Cross-PR Validation` check and necessary repository-wide check. Fix an earlier stage on its own branch through a worker, reaccept and recommit it, then restack and revalidate every descendant. Preserve one commit per branch.

After the stack is stable, read [`PR-FORMAT.md`](PR-FORMAT.md), preflight authentication and remote state, and restack if the remote base moved. Push branches without force and open PRs in dependency order, basing each later PR on the preceding branch. Build titles and bodies from final evidence according to `PR-FORMAT.md`; verify each remote tip, base, body, and diff.

Finish when every planned PR is one accepted remote commit relative to its parent, every feasible final check passes, every remote diff matches its reviewed local diff, and no blocking defect remains. Report the ordered stack, URLs, outcomes, validation, corrections, residual risks, and unavailable external-only checks.
