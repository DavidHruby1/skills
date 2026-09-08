---
description: Implement an explicit task in persistent dependency-wave worktrees, run prepared checks, review at most three rounds, and publish tracked PRs.
agent: build
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require an explicit `task-xxx` or exact existing plan path. Never infer the task from conversation, current branch, newest directory, or previous session. An explicit invocation authorizes scoped local checkpoints and task publication unless excluded by the user, subject to higher-priority permissions. Never merge, release, auto-merge, or delete remote branches.

The orchestrator owns integration, Git, execution evidence, diagnosis, review coordination, and publication handoff. Workers own production edits. Tests are complete before this command: nobody in this workflow creates, changes, evaluates test design, or assesses test coverage. Only execute prepared checks and interpret their results. Do not dispatch test authoring or test-quality review. If existing tests or their expectations need changing, stop and return the problem to the user outside this command.

## Establish The Task

1. Resolve the plan and explicitly referenced or unambiguous sibling architecture and technical design. Read all three and applicable project instructions. They remain binding; do not rewrite them during implementation. Require a stable task ID, tracking repository, stable PR IDs, production ownership, behavioral acceptance criteria, exact repository-qualified source/start/initial-target/final-integration-target map, and explicit dependencies/target transitions. Task documents must contain no test source, paths, fixtures, assertions, commands, or test-authoring instructions. Report incompatible existing documents; never silently filter or rewrite them.
2. Verify the provider and canonical source/target repository identities from actual remotes and provider responses, including forks. Never assume `origin` or CLI defaults. Check credentials and remote branch existence. Inspect primary checkout status, staged/unstaged/untracked changes, worktrees, branch ancestry and recent commits; preserve unrelated work without stashing, resetting, moving, or switching the main checkout.
3. Resolve prepared validation commands from explicit user input or established repository instructions and configured scripts/CI, without inspecting test source or assessing coverage. Require prerequisites to be available in each isolated worktree or an explicitly configured external harness. Prepared tests must already be accessible from the pinned base/checkpoints or that harness; never move, copy, commit, or stage uncommitted tests from the main checkout to manufacture availability. If commands are ambiguous, absent, or require test work, ask rather than inventing a suite or skipping checks. Configured type-checks are required where present; do not introduce new tooling.
4. Invoke `ticket-master reconcile` with its complete required inputs. Tracking failure preserves the valid plan but blocks new implementation work; report the exact failed tracking operation.

## Persistent Runtime Contract

Use only `~/.local/state/opencode/worktrees/<repo-id>/<task-id>/`. Define `repo-id` identically for all callers as lowercase provider hostname with non `[a-z0-9.-]` characters replaced by `_`, followed by `-` and the full lowercase SHA-256 hex digest of UTF-8 `<provider>:<immutable-repository-id>` (provider is `github` or `gitlab`, ID is the canonical target/tracking repository's numeric ID). Verify hostname and identity with the provider. Reject unsafe task/PR path components, reserved `parent` and `_combined` PR IDs, symlinks, duplicate mappings, and paths escaping this root.

Each PR owns `<pr-id>/`; `_combined/` is a detached integration worktree, not a published branch. `execution.json` is runtime evidence, not another planning prerequisite or an issue manifest. Bind it to the resolved Git common directory so another clone cannot adopt the same resources.

Before creating parents, verify their location. Acquire one shared task lock `<task-root>/.execution.lock` by atomic directory creation before any local task mutation; `/finish` uses the same lock. Record invocation ownership and never remove an existing lock by guessing it is stale. Only release this invocation's verified lock, including handled failures. Reconciliation calls must be serialized; issues have no cross-machine atomic uniqueness guarantee. Do not start a second mutating task run while the lock exists.

Persist version `1`, verified host/provider/repository ID, task ID, canonical common directory, exact document paths and content hashes, integration branch/SHA, per-PR source/target repository and branch map, owned worktree paths, actual base/checkpoint/published-head SHAs, validation commands/results and state fingerprints, review rounds with both axis results and reviewed fingerprints, publication progress, and cleanup progress. Do not store credentials or a local issue-ID lookup table. Use a same-directory temporary file and atomic replace; a checkpoint is recorded only after the operation succeeds.

On resume, read state and verify current Git/provider facts rather than trusting flags. Missing evidence is not success. Changed task documents or unexplained branch/worktree drift require clarification; do not repin integration, reset review count, overwrite state, or adopt unknown resources. Recognize an operation completed before a state-write crash only from exact recorded ownership and independently verified effects. An unowned existing path/branch is a blocker, not reusable merely by name. If the locked or corrupt state cannot be recovered safely, report it without automatic destructive recovery.

## Execute Dependency Waves

1. Build an acyclic PR DAG including ancestry and execution dependencies. Pin the integration SHA once. Independent branches start from that SHA; a child starts only from its predecessor's completed validated checkpoint and initially targets that predecessor. An extra dependency must actually be present on the base. For a join needing multiple independent prerequisites, follow the plan's explicit integration rule or wait for required merges; never invent multi-parent ancestry or merge a provider PR.
2. Reuse only verified task-owned branches/worktrees. Create missing ones with scoped Git operations and record ownership. Parallelize ready assignments only when ancestry, writable production paths, worktrees, and shared resources do not conflict. Git common-directory mutations and state writes are serialized. Do not validate/review worktrees still being edited.
3. Give each worker task-workflow mode, assignment/PR ID, exact worktree and assigned production paths/symbols, all three document paths, production context, and binding constraints. The worker must read all three for this assignment; its generic standalone interface remains available outside this workflow. Do not supply test source, paths, commands, assertions, or failure logs.
4. Inspect actual worker diffs, changed-path scope, untracked production files, and source integration. Reports are not proof. Inventory paths before reading diff contents; exclude prepared test source from all source reads and inspector diffs while retaining its path/state inventory and check evidence. If a worker touched tests or another owner's paths, stop and resolve ownership without reverting someone else's changes or treating test changes as authorized.
5. Run the already prepared checks after production implementation of each ready wave, in the appropriate PR worktrees, before any dependent checkpoint is released. Give `bash-agent` exact commands, working directories, dependency order, and required exit-status evidence; it does not choose or repair checks. No test authoring, coverage assessment, or test-source review. Small non-test Git operations remain with the orchestrator.
6. Translate production failures into behavioral counterexamples for the retained worker without test details. If the failure exposes contradictory expected behavior, a test defect, or an environmental blocker, report it rather than modifying tests or contracts. Repeat only failed or invalidated checks.
7. After required checks pass, inspect status, full scoped diff, `git log --oneline -10`, secrets and staged scope. Commit explicit attributable paths only. Record checkpoint SHA and actual validation evidence, then release dependents. Never amend, rebase, reset, or force-push implicitly. A committed checkpoint without valid checks is not a completed predecessor.

## Combined State And Documentation

After all slices complete, prepare a deterministic isolated combined state in `_combined/` from the pinned integration SHA and recorded branch tips. Follow the plan's integration strategy; mechanical local merges in this detached worktree may establish validation evidence but must never update shared or published branches. Record the exact inputs/order/result SHA. A conflict needing product/design decisions is a blocker, not permission to improvise production changes here. Assign corrections to owning production workers and propagate predecessor corrections to affected descendants without unauthorized history rewrites. Rebuild combined state and rerun invalidated checks.

Once implementation is complete, update documentation affected by actual behavior before final review and publication, in its owning PR. Respect invocation exclusions such as no documentation changes. Never invoke `/update-documentation` or postpone documentation to `/finish`. Recheckpoint any documentation changes and refresh affected combined-state evidence. No documentation-only PR unless the accepted plan requires it.

## Review At Most Three Rounds

Run this section for every `/implement` task after all required prepared checks pass. This is the mandatory post-validation review gate for `/implement`; it does not require a separate user request. Load `code-review` and run the review loop before publication. Do not dispatch inspectors as a substitute for loading the skill.

Load `code-review` and supply task mode, the complete three-document package, all PRs with incremental and full diffs, immutable checkpoints, assigned paths, worker reports, exclusions, untracked inventory, and actual per-slice/combined validation. Explicitly pass `Prepared tests: execution-only; no test-source or coverage review`. Both inspectors review production/spec/standards and actual check evidence, not existing test implementations.

One round is completed only when both independent Standards and Spec inspectors return valid results on the same unchanged complete state. Persist both results and the round number in execution state before acting on them. Incomplete inspector work is a blocker or resumable incomplete round, never a fabricated pass and never grounds for starting endless fresh rounds.

- Round 1: initial review. If both axes pass and validation is current, stop reviewing.
- Round 2: after verified findings, owning-worker corrections and invalidated checks. Stop early when both pass.
- Round 3: final review. Correct verified findings and rerun invalidated checks, but never launch round 4.

The maximum is three completed rounds for this task execution, including resumed sessions. Only retry incomplete/invalidated parts of an unfinished round; do not reset the counter after corrections or publication failures. After third-round fixes, publication may continue without a new PASS when all verified findings have been addressed and required checks pass. Label it `review-cap reached; final corrections not independently re-reviewed`, preserving actual earlier axis verdicts. Never claim review-complete PASS on an unreviewed state. Exhausting the cap alone is not BLOCKED; unresolved proven defects, failed checks, missing agents/evidence, credentials, and authoritative contradictions remain real blockers. Material unexpected state changes after the cap require user resolution, not a fourth automatic review or blind publication.

## Publication And Report

Invoke `create-pr` only for the exact complete task after the above gates, with verified slice issues, exact source/target mapping, validation state and truthful review/cap outcome. Publish in dependency order. The skill owns scoped final commit/push/PR mechanics and calls `ticket-master link-prs` after each successful PR/MR. A failed link is a partial publication, not permission to create a duplicate PR. Record published head SHAs and URLs for resume, not an issue manifest. If the remote code/base changes materially, stop and resolve invalidated evidence before claiming success.

Report completed PRs/branches/worktrees, execution-state path, actual checks/results, both review verdicts and completed round count, any unreviewed final corrections, published URLs, excluded work, and blockers/remaining steps. Never claim tests were authored or assessed. Explain that human bottom-up review/merge and planned retargeting remain separate; `/finish task-xxx` performs cleanup only after all planned final-target merges.
