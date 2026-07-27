---
description: Implement and statically audit Gherkin tests directly on their planned PR branches
agent: build
---

Create tests described by `GHERKIN.md`, plus directly justified coverage needed to prove the same behavior, directly on the planned PR stack. Invocation arguments: `$ARGUMENTS`.

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /create-tests task-NNN` and stop without changing the repository or Git state. Resolve the task directly from `$1`; never infer or substitute another task. Write no production code. Keep Git operations in this orchestrator. Never run tests, push, or open pull requests.

## 1. Establish Contract And Stack

Read repository instructions, full `BRIEF.md`, finalized and published `PLAN.md`, full `GHERKIN.md`, relevant test configuration and conventions, existing tests, and only the production interfaces needed to identify public boundaries. Require resolved plan audit records and verified publication metadata for every PR. Treat every current scenario as contract input. When no scenario exists, report that there is no test contract to implement.

Normalize harmless missing metadata from surrounding evidence. Preserve stable IDs and assign missing unique IDs consistently. Use `PLAN.md` and scenario traceability to resolve exactly one Owning PR for every scenario. Ask only when contradictory evidence leaves expected behavior or ownership materially ambiguous.

Resolve the stage branch from repository instructions, configuration, and local and remote refs. Use it directly when exactly one candidate is supported. When several candidates remain, use the question tool and list their exact branch names; when none is supported, ask for the stage branch instead of guessing.

Inspect Git status, current branch, refs, index, existing `task-NNN/pr-N` branches, and other worktrees. Ignore unrelated uncommitted or staged changes when Git can preserve them safely; never stage, unstage, stash, overwrite, or otherwise modify them. Stop only for changes overlapping assigned test paths, a task branch checked out in another worktree, or a Git operation that cannot proceed safely while preserving unrelated state.

Require every planned `task-NNN/pr-N` branch either to be absent or to contain only already accepted task-owned test commits above its planned predecessor. Stop rather than overwrite production work or unexplained commits. Build the stack in plan order: create `task-NNN/pr-1` from the stage and each later `task-NNN/pr-N` from `task-NNN/pr-(N-1)`. Use an existing branch only when its ancestry and own diff match the accepted tests for that PR. Never create a separate test branch or worktree.

## 2. Allocate And Discover Commands

Build an assignment table from scenario ownership. Resolve expected test and fixture areas before launching testers and give each writable file one owner to avoid conflicting edits. Shared test infrastructure belongs to the earliest plan PR that needs it.

Discover the focused test commands that `/implement` must later run from repository configuration, scripts, and existing test conventions; do not rely only on tester suggestions. Record the commands in the final report. Do not execute, collect, dry-run, or otherwise invoke any test.

## 3. Implement, Audit, And Commit Each PR

Process PRs in plan order. Create or reuse the current `task-NNN/pr-N` from the exact completed predecessor, check it out, and snapshot `HEAD`, refs, index, and worktree paths. When the PR owns scenarios, arrange `tester` agents in any safe grouping or sequence. Give each tester its scenarios, owning PR, writable test area, relevant public interfaces, infrastructure, and conventions. Keep concurrent writable paths disjoint. Testers may add or adjust related tests, fixtures, and helpers needed to prove the same behavior. Production paths, task artifacts, unrelated worktree state, and Git state remain excluded.

Explicitly prohibit every tester from running tests or executable validation. After they return, verify unambiguous test ownership, no production or artifact changes, and unchanged refs and index. Return a contract contradiction, path escape, or static defect to the responsible tester for correction.

Invoke `test-auditor` for the current PR with its scenarios, ownership, writable areas, complete owned tests, relevant inherited tests and fixtures, boundaries, substitutions, and justified supplemental coverage. Send supported findings to the responsible tester and rerun the static audit when corrections need verification. Never run tests during this workflow.

Recheck path ownership, Git state, scenario coverage, test commands, and static audit resolution. Stage only test paths owned by the current PR. Create one test-only commit when it owns tests, using these exact trailers with scenario IDs sorted and comma-separated without spaces:

```text
Task: $1
Owning-PR: 2
Scenarios: UT-002,E2E-001
```

Use the resulting tip as the exact parent of the next PR branch. A PR without owned scenarios still gets its branch at the predecessor tip and no empty commit.

## 4. Verify The Test Stack

Inspect the final local stack and require effective identifiable coverage of every scenario, tests physically present first on their Owning PR branch, exact backward ancestry through the planned stack, clean task-owned paths and index, and no production changes. One test may cover tightly coupled scenarios and supplemental tests may cover evidence-backed risks. Report supplemental coverage and focused commands as `NOT RUN - deferred to /implement`. Do not run tests, push, or open pull requests.
