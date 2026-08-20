---
description: Implement every planned pull request in an explicitly named task through production workers, optional contract tests, inspection, and publication.
argument-hint: "task-NNN"
agent: build
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /implement task-NNN` and stop without changing the repository or Git state. Resolve the task directly from `$1`; never infer or substitute another task. Require its finalized, published `PLAN.md` with resolved audit records.

The orchestrator owns worktrees, branches, commits, test routing, inspector findings, and publication. It never writes production or test code, judges source or diff quality, or performs source review. Production changes go to `worker`; test creation and correction go to `tester`. Keep the user's checkout untouched and run production workers only in isolated worktrees.

## 1. Establish The Run

1. Resolve `.opencode/artifacts/task-NNN/` directly. Read `BRIEF.md`, finalized `PLAN.md`, optional `GHERKIN.md`, applicable repository instructions, and PR-relevant research. Treat each PR's binding `Implementation contract` as authoritative; `Implementation direction` is advisory.
2. Inspect Git state, remotes, existing `task-NNN/pr-N` branches, registered worktrees, and existing PRs. Reconcile completed work without repeating it. Never stage, unstage, stash, overwrite, revert, remove, prune, or otherwise modify unrelated state. Reuse an existing task worktree only after verifying its repository, branch, ownership, and preserved diff. If a required branch is attached outside its managed task path, use the question tool rather than touching that checkout; never overwrite or remove an ambiguous, foreign, or dirty worktree.
3. Resolve the merge branch only from exact local or remote branches named `stage` or `dh-stage`. Use it when exactly one exists; when both exist, use the question tool to choose between them; when neither exists, use the question tool to ask for the merge branch. Require it to match each concrete PLAN merge target, record its full current tip SHA, and resolve any `Resolve during /implement` entry to it. Every task branch starts from this checkpoint and every PR targets this branch directly. Determine whether `GHERKIN.md` contains scenarios. Tests are optional: when none exists, no pre-created test commits are required.
4. When scenarios exist, use the planned `task-NNN/pr-N` test stack from `/create-tests` when present. Missing tests or a missing test stack are not blockers: invoke `tester` and `test-auditor` directly to create the required scenario-owned tests and commits on the appropriate PR branches, then continue this workflow. Verify that every scenario maps to exactly one Owning PR, every owned test first appears in that PR's own diff, test commits contain no production changes, ancestry follows plan order, and repository-defined focused commands are known. Resolve harmless missing metadata mechanically; ask only when contradictory evidence leaves expected behavior or ownership materially ambiguous.
5. Record each PR's binding contract, advisory direction, implementation boundary and ownership status, assigned production paths, advisory changed-logic target, execution dependencies, optional parallel group, shared-resource constraints, non-test validation, optional tests already committed on its branch, and stage checkpoint. Require every PR to be implementable from stage without another task branch.

Completion criterion: the exact task, stage checkpoint, branches, execution graph, contracts, ownership, validation, and current controlled test evidence are unambiguous.

## 2. Build Every Stage

Create every branch from the recorded stage checkpoint and attach its isolated worktree:

```text
<stage> -> task-NNN/pr-1
        -> task-NNN/pr-2
        -> ...

/tmp/opencode-worktrees/<repository-name>/task-NNN/pr-N
```

Schedule PRs by their execution metadata. Parallel execution is optional: launch a ready safe group concurrently in one task call only when every dependency is complete and its PRs have disjoint assigned paths and implementation boundaries, no shared exclusive resource, and no need for another task branch. Otherwise process them sequentially; never weaken ownership or dependencies to create concurrency.

For each ready PR:

1. Create or reconcile `task-NNN/pr-N` from the recorded stage checkpoint while preserving accepted own test commits and corrections. Preserve every replaced local tip under an unused archive ref and never force-update, reset, or overwrite it. Attach only that branch at `/tmp/opencode-worktrees/<repository-name>/task-NNN/pr-N`; the basename of the repository root is `<repository-name>`. The orchestrator and production workers never edit tests; every necessary test change is delegated to `tester` and statically audited.
2. Launch one `worker` in that worktree and retain its session through inspection. Supply its worktree path, Owning PR, binding Implementation contract, advisory Implementation direction, implementation boundary and ownership status, assigned production paths and symbols, relevant production evidence, any preserved candidate production diff in those paths, advisory changed-logic target, and assigned non-test validation. Instruct it to preserve correct existing work and avoid unrelated hunks. State explicitly that the target never overrides correctness, clarity, or the smallest coherent implementation.
3. Never supply a test path, test source, Gherkin, test command, test implementation detail, or test-failure detail to a worker.
4. Wait for every worker in the current safe group to finish production code and assigned non-test validation.
5. Mechanically verify each worktree's completion, assigned-path scope, unchanged Git refs and index, changed-logic size, and fresh non-test validation evidence. Size is reporting evidence, not a pass/fail gate. Never request deletion, compression, indirection, or repartitioning solely to meet the target; record a concise reason when the coherent implementation exceeds it. Do not review source or judge implementation quality.
6. Return a failed mechanical gate or worker-reported blocker to the same worker. A contradiction between source evidence and the binding contract blocks `/implement`; advisory direction may change when the worker provides concrete source evidence.
7. When tests exist, verify that the branch still contains only its accepted tests plus uncommitted production work. Route unexpected test changes through the test-correction procedure. Record the stage checkpoint, test commits, worker session, worktree path, size, and validation; create no production commit before inspection.

Do not run tests during stage construction. Every worker and mechanical stage gate must complete before any test runs. Keep every worktree and its uncommitted production diff intact through validation and inspection.

## 3. Run Validation

In each applicable worktree, run contract tests when scenarios exist, using repository-defined commands, plus relevant repository-wide tests and final validation. Inspect test source only as needed to classify a failure; never edit it directly.

For every contract-test failure, identify its scenario ID and Owning PR:

- If production behavior disagrees with the contract, return it to its Owning PR's retained worker with only the expected behavior, scenario ID, and observable runtime mismatch, then rerun invalidated checks. Never reveal test source, path, command, assertion, fixture, or implementation detail or create a production commit before inspection.
- If evidence shows a test defect, invoke one `tester` session in its Owning PR worktree with the scenario, observed failure, concrete defect evidence, writable test paths, and relevant fixtures. Invoke `test-auditor` on the correction, return supported findings to the same tester until resolved, and commit the accepted correction as test-only work. Rerun invalidated checks. Do not ask the user and do not send test details to `worker`.
- If the failure is environmental or ownership cannot be established, stop with the concrete blocker.

Classify a failure from repository-wide tests or other final validation by the affected planned behavior and Owning PR when evidence permits. Return only the observable mismatch to its retained worker and rerun invalidated checks without creating a production commit. Stop when ownership is ambiguous.

After any production or test correction, rerun invalidated non-test validation and tests, and verify each correction remains in its Owning PR worktree. All applicable tests and final validation must be green before inspection; a task without scenarios proceeds after required non-test and final validation passes.

## 4. Inspect The Green Implementation

Invoke one read-only `inspector` only after every worker is done and all applicable tests and final validation are green. A task without scenarios needs no contract-test evidence. Supply the exact task, stage checkpoint, every PR and worktree path, authoritative `BRIEF.md` and finalized `PLAN.md`, uncommitted production diffs, validation evidence, and PR ownership. Exclude test source and test implementation details.

The inspector runs at most twice:

1. First `PASS`: proceed to publication.
2. First `REWORK`: assign each finding to its Owning PR's retained worker in the existing worktree. Rerun invalidated non-test validation and applicable tests, and invoke the inspector a second time only after every affected worktree is green.
3. Second `PASS`: proceed to publication.
4. Second `REWORK`: assign each finding to its Owning PR's retained worker, rerun invalidated validation and applicable tests, and mechanically verify every correction. Do not invoke a third inspector. Continue only when all applicable checks are green and every mechanical gate passes.

The two-pass limit is an explicit token-saving compromise. The orchestrator tracks and routes findings but never independently accepts, rejects, expands, or replaces them through source review.

## 5. Commit And Publish

Use the embedded `Pull Request Format` below and fetch. If stage moved, reconcile every affected worktree from its new tip without losing its accepted diff, then repeat invalidated parts of Sections 2-4. Preserve replaced tips under archive refs and never publish an implementation based on stale stage.

Only now partition each PR's complete accepted production diff into one or more coherent commits. Never combine PRs into one commit. Stage every task-owned non-ignored change, preserve unrelated state, and require an empty `git status --porcelain` in every worktree after committing. Push without force and open, but never merge, every PR directly against the selected merge branch:

```text
task-NNN/pr-1 -> <stage>
task-NNN/pr-2 -> <stage>
task-NNN/pr-3 -> <stage>
```

Verify every remote head, exact stage base, body, commit set, own diff, and clean worktree. Finish when every planned PR is open and verified. Report the ordered PR URLs, bases, outcomes, worktree paths, commits, cleanliness, applicable test and validation evidence, inspector verdicts, corrections, and residual risks, then stop. Never remove or prune a worktree, delete its directory, or detach its branch; cleanup is a separate explicit workflow after user review and merge.

## Pull Request Format

Build each description from that PR's final own diff against stage. Write every Markdown heading in English. Write the title and all body content in Czech except identifiers, paths, commands, provider syntax, and established technical terms.

Use this structure and omit only optional sections:

````markdown
## Purpose

<Popište původní zadání, problém, který PR řeší, a konkrétní cílový stav. Reviewer musí pochopit důvod a zamýšlený výsledek změny bez čtení ticketu nebo diffu.>

## Changes

| Oblast | Umístění | Změna |
|---|---|---|
| `<behavior boundary>` | `<path>` | <Materiální produkční změna a její účel.> |

## Key Code

<!-- Optional. Include only snippets that materially help review. Use 1-3 short excerpts from the final diff; identify each path and explain the behavior, purpose, and review significance. Do not reproduce whole files or narrate obvious code. -->

`<path>`

```<language>
<short excerpt>
```

<Co ukázka dělá, proč je řešení zvolené právě takto a na co se má reviewer zaměřit.>

## Design

<!-- Optional. Explain only a consequential ownership decision, unusual control flow, compatibility choice, or deviation from advisory Implementation direction. -->

## Impacts

<!-- Optional. Keep only applicable lines. -->

- **Kontrakty:** <dopad>
- **Kompatibilita:** <dopad>
- **Migrace:** <požadavky>
- **Rizika:** <zbývající riziko a mitigace>

## Context

`task-NNN` · <issue reference and URL> · `PR N` · základ `<stage>` · digest `<published PR-section SHA-256>`

## Visual Evidence

<!-- Optional. Include only for user-visible changes. -->

<Stručný before-and-after důkaz.>
````

### Pull Request Completion Checks

- Headings are English; the title and body are Czech with only required technical exceptions.
- Purpose makes the original assignment, problem, and intended outcome understandable without the ticket or diff.
- Changes and any Key Code excerpts describe only the PR's own final diff.
- Key Code is omitted unless short, explained excerpts materially improve the review.
- Design and Impacts are included only when they add relevant review context.
- The base and dependency are exact. The body contains no post-publication instructions.
