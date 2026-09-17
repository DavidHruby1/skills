---
description: Clean up a fully merged task, close its tracked issues, and archive its task documents.
agent: build
---

# Finish

Invocation arguments: `$ARGUMENTS`.

Require an explicit `task-xxx` or exact active `PLAN.md` path under `.opencode/tasks/`. Never infer the task from conversation, branches, or directory recency. This command only finishes an already merged task; it never implements, validates, reviews, retargets, or merges code.

Use `gh` for GitHub and `glab` for GitLab. Resolve the provider, host, canonical repositories, and remotes from the plan and actual provider data; never assume `origin`, a CLI default, or a branch naming convention.

## Verify Completion

1. Read project instructions and the task's complete `PLAN.md`. Require its task ID, tracking repository, every PR ID, exact source branch, final integration target, and target-transition rule.
2. Query every planned PR/MR in its exact repository. Require one unambiguous matching PR/MR, provider-confirmed merged state, the planned source head, and the final `stage` target. An open PR, an initial predecessor target, local ancestry, or a closed-unmerged PR is not complete.
3. Inspect Git status, worktrees, local branches, and source remotes. Map task resources only from the plan's exact source branches. Before any deletion, require task worktrees to be clean and each local or remote source branch to have no commits beyond the head merged by its PR/MR. Preserve unrelated resources and stop on ambiguity.

## Clean Up

1. Remove clean worktrees that check out planned task source branches using non-forced `git worktree remove`. Never remove the primary checkout, an unrelated worktree, or a worktree with staged, unstaged, or untracked changes.
2. Delete verified local task branches. Prefer `git branch -d`; use `-D` only when provider merge evidence proves a squash or rebase merge and the unchanged local tip exactly matches the merged PR/MR source head.
3. Delete every still-existing planned remote source branch from its verified source repository using `gh` for GitHub or `glab` for GitLab, including their provider API command when required. Verify the branch is not protected, default, `stage`, or used by another open PR/MR, and verify deletion afterward. Treat an already absent provider-auto-deleted source branch as complete.
4. Invoke `ticket-master` with `Action: close-completed`, the project root, exact active plan path, task ID, tracking repository, and complete PR map. It must independently verify final-target merges and close current slice issues before the parent. Stop on a partial or blocked result.
5. Create `.opencode/archive/` when absent, then move the complete `.opencode/tasks/task-xxx/` directory to `.opencode/archive/task-xxx/`. Refuse to overwrite or merge with an existing archive destination. Do not modify the archived documents.

## Report

Verify that planned worktrees and local and remote source branches are gone, managed issues are closed, and the archived task exists at the exact destination. Report the merged PR/MR URLs, removed worktrees and branches, closed issues, archive path, preserved unrelated work, and any partial failure. Never claim full completion before archival succeeds.
