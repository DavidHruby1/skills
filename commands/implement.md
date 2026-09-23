---
description: Implement an accepted task through focused workers, validate it, review it, and publish a stacked PR set.
agent: build
model: openai/gpt-5.6-sol
variant: low
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require a task ID and accept an optional base-branch override in one of these forms: `/implement task-xxx`, `/implement task-xxx <base-branch>`, or `/implement task-xxx <repository-alias>: <base-branch>[, <repository-alias>: <base-branch> ...]`. Examples: `/implement task-001`, `/implement task-001 dh-stage`, and `/implement task-001 backend: dh-stage, frontend: main`. Resolve the task ID to `.opencode/tasks/task-xxx/` at the repository root. With no override, use `stage` for every repository. An unqualified branch applies to every repository, including multi-repository tasks. Use qualified entries only when repositories need different base branches; resolve each alias unambiguously to a repository named in `PLAN.md`, accepting an exact repository name or an established project alias. A qualified map must cover every repository containing a planned PR. Reject mixed qualified and unqualified syntax, unknown or duplicate aliases, and partial qualified maps rather than guessing. Never merge, retarget, approve, release, or enable auto-merge.

The accepted `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` are the design authorities. `PLAN.md` is the execution authority: one phase is one PR and defines scope, order, dependencies, acceptance, and source branches. The resolved base branch for each repository, whether the default `stage` or an invocation override, replaces `PLAN.md` only for that repository's branch starting point, first PR target, and final integration target. Later PRs in the same repository initially target their predecessor. This branch resolution is not a conflict and does not authorize rewriting the task documents or changing PR scope, order, dependencies, or source branch names. Workers edit production code only; tests are execution-only in this workflow.

Operate autonomously and keep the workflow moving. A small or locally resolvable blocker is not a reason to stop, ask the user, or merely report the problem: investigate it, choose the smallest correct fix consistent with the accepted task documents and repository conventions, apply the fix, and continue. This includes routine compile or test failures, formatting or lint failures, dependency or worktree setup issues, straightforward merge conflicts on unpublished task branches, and minor implementation ambiguities that do not change public behavior, scope, architecture, or safety. Exhaust reasonable local diagnosis and correction before declaring any blocker. Ask the user only when progress requires missing authority or information that cannot be recovered from the task documents or repository, a consequential product or architecture decision, a public-contract or scope change, credentials or access the agent cannot obtain, rewriting published history, or another hard-to-reverse action. When asking, state the evidence, attempts made, and the single decision or input required.

## Prepare The Work

1. Parse the task ID and optional branch syntax before doing work. Read project instructions and that task's `ARCHITECTURE.md`, `TECHNICAL-DESIGN.md`, and `PLAN.md` in full. Require unambiguous repositories, phase/PR IDs, owned paths or symbols, dependencies, and source branches. Build a complete effective repository-to-base-branch map using `stage` when no override was supplied, the unqualified branch for every repository when one was supplied, or the complete qualified map. Verify every effective base branch exists in its resolved repository. Each repository's first PR starts from and targets its effective base branch, later PRs start from their predecessor branch and initially target that predecessor, and every PR's final integration target is the effective base branch. Report the effective map before implementation. Resolve minor omissions from repository evidence and established conventions; stop only for genuinely missing or conflicting inputs that require one of the user decisions defined above.
2. Inspect Git status, remotes, branches, and existing worktrees without disturbing unrelated work. The orchestrator owns Git, worktrees, commits, integration, validation, review coordination, and publication handoff.
3. Build the phase dependency graph. Start every ready independent phase in parallel only when its production ownership and worktree are isolated; otherwise run one phase. Plan order determines the final linear stack order between otherwise independent phases.

## Implement The Phases

1. Start a new `worker` for each phase. Give it only the assignment ID, exact worktree, the complete text of that plan phase, relevant architecture and technical-design sections, binding constraints, and a focused list of production files or symbols to read. Do not send unrelated task prose, tests, validation commands, or review history.
2. Inspect each worker's actual diff and untracked files. Reject changes outside its phase or to tests. Reports are context, not proof. Resume that phase's same worker session for corrections instead of starting another worker.
3. Checkpoint completed phase changes on task-owned branches. Before validation, restack unpublished branches in plan order so each child contains its predecessor and each PR diff contains only its own phase. Return production conflicts to the owning worker; never rewrite a published branch.
4. Start dependent phases only after their required predecessor implementation is available. Continue until every planned phase is implemented. Diagnose and fix locally resolvable blockers yourself; stop only for a proven blocker that meets the user-decision criteria above.

## Validate And Correct

Reuse one dependency installation per repository across its worktrees (for example, a shared `node_modules` link or virtualenv) instead of reinstalling in every worktree. Establish it before validation, prefer non-emitting checks, and remove only known generated artifacts rather than using broad cleanup commands.

After all phases are assembled, give `bash-agent` the repository's existing type-check and test commands, exact worktrees, and dependency order. Validate every PR state that must be independently mergeable and the complete top-of-stack state. Do not add tooling or ask the agent to choose commands.

For each failure, identify the owning phase and resume its worker with the exact production behavior or compile error that must be corrected. Do not send test source or ask workers to modify tests. Restack affected descendants and rerun only invalidated checks. Investigate and repair environmental and test-contract failures when they are locally resolvable. Continue until all required checks pass or a blocker meeting the user-decision criteria above is proven after reasonable corrective attempts.

## Review At Most Three Rounds

Load `code-review` after validation passes and review the complete stack. Stop early when both Standards and Spec pass.

For verified findings, resume the owning phase workers with the exact findings, inspect their diffs, restack affected descendants, and rerun invalidated checks before the next review round. Complete at most three review rounds. After round three, never request a fourth; publish only when required checks pass and no proven defect remains unresolved, and report any final corrections not independently re-reviewed.

## Publish The Stack

Load `create-pr` for the complete task and supply the parsed task ID plus the complete effective branch map as an explicit integration-target map. It owns final scoped commits, pushes, and creation or update of every planned PR/MR. In each repository, the first PR targets its effective base branch; every later PR initially targets its predecessor; every PR has that effective base branch as its final integration target. Verify the published source/target chain and that each platform diff contains only its phase.

Report the effective branch map, worker phases, checks, review verdicts and round count, PR URLs, and stack order. Give the user the bottom-up review and merge order and state that, after each predecessor is merged, the next PR's target must be changed to that repository's effective base branch. Do not perform that retargeting or any merge in this command.
