---
description: Implement an accepted task through focused workers, validate it, review it, and publish a stacked PR set.
agent: build
model: openai/gpt-5.6-sol
variant: low
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require an explicit `task-xxx` or exact existing `PLAN.md` path. Implement, validate, review, and publish that task only. Never merge, retarget, approve, release, or enable auto-merge.

The accepted `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` are the design authorities. `PLAN.md` is the execution authority: one phase is one PR and defines scope, order, dependencies, acceptance, branches, and targets. Do not rewrite these documents or invent missing decisions. Workers edit production code only; tests are execution-only in this workflow.

## Prepare The Work

1. Read project instructions and the task's complete architecture, technical design, and plan. Require an unambiguous repository, task ID, phase/PR IDs, owned paths or symbols, dependencies, source branches, initial targets, and final `stage` targets. Stop on missing or conflicting inputs.
2. Inspect Git status, remotes, branches, and existing worktrees without disturbing unrelated work. The orchestrator owns Git, worktrees, commits, integration, validation, review coordination, and publication handoff.
3. Build the phase dependency graph. Start every ready independent phase in parallel only when its production ownership and worktree are isolated; otherwise run one phase. Plan order determines the final linear stack order between otherwise independent phases.

## Implement The Phases

1. Start a new `worker` for each phase. Give it only the assignment ID, exact worktree, the complete text of that plan phase, relevant architecture and technical-design sections, binding constraints, and a focused list of production files or symbols to read. Do not send unrelated task prose, tests, validation commands, or review history.
2. Inspect each worker's actual diff and untracked files. Reject changes outside its phase or to tests. Reports are context, not proof. Resume that phase's same worker session for corrections instead of starting another worker.
3. Checkpoint completed phase changes on task-owned branches. Before validation, restack unpublished branches in plan order so each child contains its predecessor and each PR diff contains only its own phase. Return production conflicts to the owning worker; never rewrite a published branch.
4. Start dependent phases only after their required predecessor implementation is available. Continue until every planned phase is implemented or a concrete blocker is found.

## Validate And Correct

After all phases are assembled, give `bash-agent` the repository's existing type-check and test commands, exact worktrees, and dependency order. Validate every PR state that must be independently mergeable and the complete top-of-stack state. Do not add tooling or ask the agent to choose commands.

For each failure, identify the owning phase and resume its worker with the exact production behavior or compile error that must be corrected. Do not send test source or ask workers to modify tests. Restack affected descendants and rerun only invalidated checks. Continue until all required checks pass or an environmental, test-contract, or design blocker is proven.

## Review At Most Three Rounds

Load `code-review` after validation passes and review the complete stack. Stop early when both Standards and Spec pass.

For verified findings, resume the owning phase workers with the exact findings, inspect their diffs, restack affected descendants, and rerun invalidated checks before the next review round. Complete at most three review rounds. After round three, never request a fourth; publish only when required checks pass and no proven defect remains unresolved, and report any final corrections not independently re-reviewed.

## Publish The Stack

Load `create-pr` for the complete task. It owns final scoped commits, pushes, and creation or update of every planned PR/MR. The first PR targets `stage`; every later PR initially targets its predecessor; every PR has `stage` as its final integration target. Verify the published source/target chain and that each platform diff contains only its phase.

Report worker phases, checks, review verdicts and round count, PR URLs, and stack order. Give the user the bottom-up review and merge order and state that, after each predecessor is merged, the next PR's target must be changed to `stage`. Do not perform that retargeting or any merge in this command.
