---
description: Implement and statically audit approved Gherkin tests by owning PR
agent: build
---

Create or reconcile every test authorized by approved `GHERKIN.md`. Require exactly `/create-tests task-NNN`; never infer the task. Write no production code. Keep Git operations in this orchestrator. Never run tests, push, or open a test pull request.

## 1. Establish Contract And Branch

Read repository instructions, full `GHERKIN.md`, relevant test configuration and conventions, existing tests, and only the production interfaces needed to identify public boundaries. A section authorizes tests only with `Status: Approved`, `Approved: YYYY-MM-DD`, and `Audit: Passed YYYY-MM-DD`. Ignore all other sections. If none qualify, stop without changes.

Require each approved scenario to have one level, one unique stable ID, a complete internally consistent contract entry, and exactly one `Owning PR: N` in its Gherkin traceability. For planned behavior, require `PLAN.md` with `Status: Approved` and verify that the named PR exists and owns the behavior. Stop on missing, duplicate, contradictory, or ambiguous contract data.

Resolve the stage branch from repository instructions, configuration, and local and remote refs. Use it directly when exactly one candidate is supported. When several candidates remain, use the question tool and list their exact branch names; when none is supported, ask for the stage branch instead of guessing. Record the selected branch's full current commit SHA as `Test-Base` before creating any test branch or commit. Inspect Git status, current branch, refs, index, and commits already on `task-NNN/tests`; require no unaccounted source or test changes and no branch checked out in another worktree. Reuse an existing test branch only when its first commit parent and every `Test-Base` trailer equal the current full stage SHA and its contents match the approved contract.

When `task-NNN/tests` exists but cannot be reused, preserve it automatically before rebuilding. Record its exact tip, rename the local branch to the first unused `task-NNN/tests-archive-<old-tip-short>` name, adding `-2`, `-3`, and so on only on collision, then verify the archive points to the recorded tip and `task-NNN/tests` no longer exists. Never delete, reset, rebase, force-update, or overwrite the old branch. Stop if clean-state, rename, or verification fails. Create the new `task-NNN/tests` directly from the current `Test-Base`; never create per-PR test branches or worktrees.

## 2. Allocate And Implement

Build an assignment table in memory from each scenario's `Owning PR`. Resolve every exact test and fixture path before launching testers. One test file belongs to exactly one owning PR. For planned behavior, a shared fixture or helper belongs to the earliest approved plan PR that needs it. For existing behavior, always use ascending numeric `Owning PR` order, whether or not a plan file is present. It has one tester owner and later PRs consume it without writing it.

Arrange `tester` agents in any safe grouping or sequence. Give each tester its complete approved scenario entries, owning PR, exact disjoint writable paths, relevant public interfaces and test infrastructure, repository conventions, and explicit exclusions. No concurrent or sequential assignments may overlap writable paths. Production paths, task artifacts, Git state, and unassigned test infrastructure are always excluded.

Snapshot `HEAD`, refs, index, and worktree paths before testers. Explicitly prohibit every tester from running tests or any other executable validation. After all testers return, verify that each changed path had exactly one assigned owner, every test file maps to one owning PR, no production or artifact path changed, and no tester mutated Git state. Return a contract contradiction, path escape, or static test defect to the responsible original tester for bounded correction.

## 3. Discover Commands And Audit Statically

Discover the focused test commands that `/implement` must later run from repository configuration, scripts, and existing test conventions; do not rely only on tester suggestions. Record the commands in the final report. Do not execute, collect, dry-run, or otherwise invoke any test.

Invoke `test-auditor` exactly once with the approved scenario entries, owning PRs, assigned paths, complete test implementations and relevant fixtures, declared boundaries, and substitutions. If it returns `REWORK`, send each finding to the responsible original tester and accept only corrections within that tester's assigned paths. Never invoke the auditor again and never run tests after corrections. The orchestrator must verify statically that every exact finding is resolved; stop without commits when any finding remains.

## 4. Commit The Ordered Test Stack

Recheck path ownership, Git state, scenario-to-test mapping, test commands, and static audit resolution. Every approved scenario must have exactly one test whose name or parametrization ID contains the exact scenario ID. Stage only paths owned by one PR at a time, including shared fixtures only with their earliest owning PR.

Create or retain exactly one final test commit per owning PR, ordered by the approved plan stack for planned behavior and by ascending numeric `Owning PR` for existing behavior. Each commit contains only that PR's owned test inventory and these exact trailers, with scenario IDs sorted and comma-separated without spaces:

```text
Task: task-NNN
Owning-PR: 2
Scenarios: UT-002,E2E-001
Test-Audit: passed
Test-Base: <full stage SHA>
```

Inspect the final local stack and require one-to-one scenario coverage, one commit per owning PR, correct ordering, a first test commit whose parent is exactly `Test-Base`, the same full `Test-Base` trailer on every test commit, clean Git state, and no production changes. Report the selected stage branch and SHA, test branch, ordered commits and owning PRs, scenario IDs, changed paths, and focused commands as `NOT RUN - deferred to /implement`. Do not run tests, push, or open a test PR.
