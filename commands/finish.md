---
description: Safely clean up a fully merged, explicitly identified task without changing publication or stack state.
agent: build
---

# Finish

Invocation arguments: `$ARGUMENTS`.

Require an explicit `task-xxx` or exact existing plan path. Never infer it from conversation, Git state, worktrees, or directory recency. The plan and `execution.json` must identify the same task; otherwise report usage and stop.

This command only removes verified local task resources and closes completed managed issues. It never implements, tests, documents, publishes, merges, rebases, retargets, changes or deletes remote branches, modifies task artifacts, or changes the primary checkout. All planned PRs/MRs must already be merged into their final integration targets.

## Bind And Lock

1. Read project instructions and the selected task's complete architecture, technical design, and plan, including the full PR map and dependency/closure order.
2. Resolve the canonical provider repository without assuming `origin`, the current branch, or CLI defaults. Read the installed `~/.config/opencode/commands/implement.md` and use its exact runtime identity, task-root, `execution.json`, common-directory binding, lock, atomic persistence, and resume contracts. Do not synthesize missing state or treat recorded state as stronger than current Git/provider evidence.
3. Require every recorded worktree to be a direct, non-symlinked child of the task root (`<pr-id>/` or `_combined/`), bound to the same Git common directory and expected branch or detached commit. Reject unknown, duplicate, escaped, mismatched, or ownership-incomplete resources. Preserve `.opencode/task-xxx/`.
4. Before cleanup, atomically acquire the shared task lock and record invocation ownership. If it exists, stop and report it. Remove only this invocation's verified lock, including after handled failures; leave it when ownership cannot be proven.

## Preflight

Complete every check before destructive cleanup or issue closure:

1. Snapshot the primary checkout and enumerate the bound repository's worktrees, HEADs, branches, and status. Anything not recorded as task-owned is out of scope.
2. For every planned `pr-id`, query the exact provider source repository and branch and require exactly one matching PR/MR. Verify actual GitHub `mergedAt`/`merged_at` or GitLab merged `state`/`merged_at`, the planned final repository/branch, predecessor-before-child merge order, and the exact source head that was merged. An initial stack target, local ancestry, merge-result SHA, or branch tip alone is not completion.
3. Reconcile each local source branch with the plan, execution ownership, worktree mapping, and merged source head. Its tip must equal that head with no later local work; legitimate post-publication updates are acceptable only when the same PR and planned branches remain proven. Exclude default, integration, protected, foreign, mismatched, or checked-out-elsewhere branches. Query provider branch protection and relevant permissions rather than inferring them.
4. Require every task worktree to be clean, including staged, unstaged, untracked, ignored, nested-repository, and recursive-submodule state. `_combined` must equal its recorded validated commit. Reconcile missing worktrees with current worktree metadata and recorded cleanup progress; absence without owned, independently verified completion is a blocker.
5. Following the installed `~/.config/opencode/agents/ticket-master.md` discovery rules without writes, verify provider authentication, issue-close permission, exact managed parent/child hierarchy, and no open removed-slice issue. Require the `ticket-master` agent and its `close-completed` capability.

Any missing, ambiguous, stale, conflicting, or unverifiable evidence blocks cleanup. Record no completed cleanup step until the full preflight passes.

## Clean Up

Immediately before each mutation, revalidate lock ownership and the consequential Git/provider state. If it changed, persist the remaining work and stop.

1. Reconfirm all task worktrees are clean, then remove only their recorded paths with non-forced `git worktree remove`. Never reset, stash, clean, use `rm -rf`, remove user files, or escalate to forced removal.
2. Inspect `git worktree prune` dry-run output immediately before pruning. Run the real prune only when every candidate is task-owned; never override expiry or prune unrelated metadata.
3. After worktrees are gone, delete only verified task source branches that are checked out nowhere. Try `git branch -d`; use `-D` only when verified squash/rebase merge evidence explains the ancestry failure and the unchanged local tip exactly equals the merged source head. Never delete a remote branch.
4. Atomically persist each successful step in `execution.json`. On failure, record completed and remaining work, release only this invocation's lock, and report a partial result. Repeated runs resume from recorded progress plus current authoritative evidence.
5. Only after Git cleanup succeeds and is revalidated, invoke `ticket-master close-completed` with the explicit task, project, plan, and verified repository/PR map. It owns fresh authorization/hierarchy checks and closes current children before the parent. Persist each result; any closure failure is partial completion.

## Complete

Verify that no recorded worktree or eligible local branch remains, the primary checkout snapshot is unchanged, and provider state still satisfies the plan. Atomically mark cleanup complete while retaining audit history, then remove this invocation's verified lock.

Report the task runtime path and `repo-id`, removed worktrees, deleted local branches, provider merge evidence, issue closures, preserved primary-checkout state, and any completed or remaining steps. For blocked or partial runs, identify the exact failed check or operation without claiming success.
