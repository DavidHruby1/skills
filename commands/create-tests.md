---
description: Implement and statically audit Gherkin tests by owning PR
agent: build
---

Create or reconcile tests described by `GHERKIN.md`, plus directly justified coverage needed to prove the same behavior. Invocation arguments: `$ARGUMENTS`.

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /create-tests task-NNN` and stop without changing the repository or Git state. Resolve the task directly from `$1`; never infer or substitute another task. Write no production code. Keep Git operations in this orchestrator. Never run tests, push, or open a test pull request.

## 1. Establish Contract And Branch

Read repository instructions, full `GHERKIN.md`, relevant test configuration and conventions, existing tests, and only the production interfaces needed to identify public boundaries. Treat every current scenario as contract input without status, approval, or audit metadata gates. When no scenario exists, report that there is no test contract to implement.

Normalize harmless missing metadata from surrounding evidence. Preserve stable IDs and assign missing unique IDs consistently. For planned behavior, use the approved `PLAN.md` to infer PR ownership. Ask only when contradictory evidence leaves expected behavior or ownership materially ambiguous.

Resolve the stage branch from repository instructions, configuration, and local and remote refs. Use it directly when exactly one candidate is supported. When several candidates remain, use the question tool and list their exact branch names; when none is supported, ask for the stage branch instead of guessing. Record the selected branch's full current commit SHA as `Test-Base` before creating any test branch or commit. Inspect Git status, current branch, refs, index, and commits already on `$1/tests`; require no unaccounted source or test changes and no branch checked out in another worktree. Reuse an existing test branch only when its first commit parent and every `Test-Base` trailer equal the current full stage SHA and its contents match the approved contract.

When `$1/tests` exists but cannot be reused, preserve it automatically before rebuilding. Record its exact tip, rename the local branch to the first unused `$1/tests-archive-<old-tip-short>` name, adding `-2`, `-3`, and so on only on collision, then verify the archive points to the recorded tip and `$1/tests` no longer exists. Never delete, reset, rebase, force-update, or overwrite the old branch. Stop if clean-state, rename, or verification fails. Create the new `$1/tests` directly from the current `Test-Base`; never create per-PR test branches or worktrees.

## 2. Allocate And Implement

Build an assignment table from scenario ownership. Resolve expected test and fixture areas before launching testers and give each writable file one owner to avoid conflicting edits. For planned behavior, shared infrastructure belongs to the earliest plan PR that needs it; for existing behavior, infer a coherent ownership split from traceability and existing tests.

Arrange `tester` agents in any safe grouping or sequence. Give each tester its scenarios, owning PR, writable test area, relevant public interfaces, infrastructure, and conventions. Keep concurrent writable paths disjoint. Testers may add or adjust related tests, fixtures, and helpers needed to prove the same behavior. Production paths, task artifacts, and Git state remain excluded.

Snapshot `HEAD`, refs, index, and worktree paths before testers. Explicitly prohibit every tester from running tests or executable validation. After all testers return, verify unambiguous test ownership, no production or artifact changes, and unchanged Git state. Return a contract contradiction, path escape, or static defect to the responsible tester for correction.

## 3. Discover Commands And Audit Statically

Discover the focused test commands that `/implement` must later run from repository configuration, scripts, and existing test conventions; do not rely only on tester suggestions. Record the commands in the final report. Do not execute, collect, dry-run, or otherwise invoke any test.

Invoke `test-auditor` with the scenarios, ownership, writable areas, complete tests, relevant fixtures, boundaries, substitutions, and justified supplemental coverage. Send supported findings to the responsible tester and rerun the static audit when corrections need verification. Never run tests during this workflow.

## 4. Commit The Ordered Test Stack

Recheck path ownership, Git state, scenario coverage, test commands, and static audit resolution. Every scenario must have effective identifiable coverage; one test may cover tightly coupled scenarios and supplemental tests may cover evidence-backed risks. Stage only paths owned by one PR at a time.

Create or retain exactly one final test commit per owning PR, ordered by the approved plan stack for planned behavior and by ascending numeric `Owning PR` for existing behavior. Each commit contains only that PR's owned test inventory and these exact trailers, with scenario IDs sorted and comma-separated without spaces:

```text
Task: $1
Owning-PR: 2
Scenarios: UT-002,E2E-001
Test-Base: <full stage SHA>
```

Inspect the final local stack and require complete scenario coverage, one commit per owning PR, correct ordering, a first test commit whose parent is exactly `Test-Base`, the same full `Test-Base` trailer on every test commit, clean Git state, and no production changes. Report supplemental coverage and focused commands as `NOT RUN - deferred to /implement`. Do not run tests, push, or open a test PR.
