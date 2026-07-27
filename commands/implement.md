---
description: Implement every stacked pull request in an explicitly named task through production workers, optional contract tests, inspection, and publication.
argument-hint: "task-NNN"
agent: build
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /implement task-NNN` and stop without changing the repository or Git state. Resolve the task directly from `$1`; never infer or substitute another task. Require its finalized, published `PLAN.md` with resolved audit records.

The orchestrator owns branches, commits, test routing, inspector findings, and publication. It never writes production or test code, judges source or diff quality, or performs source review. Production changes go to `worker`; test creation and correction go to `tester`. Use the shared checkout without worktrees and run one production `worker` at a time.

## 1. Establish The Run

1. Resolve `.opencode/artifacts/task-NNN/` directly. Read `BRIEF.md`, finalized `PLAN.md`, optional `GHERKIN.md`, applicable repository instructions, and PR-relevant research. Treat each PR's binding `Implementation contract` as authoritative; `Implementation direction` is advisory.
2. Inspect Git state, remotes, existing `task-NNN/pr-N` branches, and existing PRs. Reconcile completed work without repeating it. Ignore unrelated uncommitted or staged changes when Git can preserve them safely; never stage, unstage, stash, overwrite, revert, or otherwise modify them. Stop only for changes overlapping the current PR's assigned production or test paths, a task branch checked out in another worktree, or a Git operation that cannot proceed safely while preserving unrelated state.
3. Resolve the stage branch from repository instructions, configuration, and local and remote refs. Use it directly when exactly one candidate is supported. When several candidates remain, use the question tool and list their exact branch names; when none is supported, ask for the stage branch instead of guessing. Record its full current tip SHA. Determine whether `GHERKIN.md` contains scenarios. Tests are optional: when none exists, no pre-created test commits are required.
4. When scenarios exist, require `/create-tests` to have created the planned `task-NNN/pr-N` stack. Verify that every scenario maps to exactly one Owning PR, every owned test first appears in that PR's own diff, test commits contain no production changes, ancestry follows plan order, and repository-defined focused commands are known. Resolve harmless missing metadata mechanically; ask only when contradictory evidence leaves expected behavior or ownership materially ambiguous.
5. Record each PR's binding contract, advisory direction, behavior home, assigned production paths, advisory changed-logic target, non-test validation, optional tests already committed on its branch, and parent checkpoint.

Completion criterion: the exact task, stage, stack, contracts, ownership, validation, and current controlled test evidence are unambiguous.

## 2. Build Every Stage

Build the stack in plan order:

```text
<stage> -> task-NNN/pr-1 -> task-NNN/pr-2 -> ...
```

For each PR:

1. Use the preceding checkpoint: stage for PR 1, otherwise the completed `task-NNN/pr-(N-1)`.
2. Reconcile `task-NNN/pr-N` onto that checkpoint while preserving its accepted own test commits from `/create-tests` and any accepted corrections. When tests are absent, create the branch directly from the checkpoint. Preserve every replaced local tip under an unused archive ref and never force-update, reset, or overwrite it. The orchestrator and production workers never edit tests; every necessary test change is delegated to `tester` and statically audited.
3. Launch one `worker` and retain its session for corrections. Supply only the Owning PR, binding Implementation contract, advisory Implementation direction, behavior home, assigned production paths and symbols, relevant production evidence, advisory changed-logic target, and assigned non-test validation. State explicitly that the target never overrides correctness, clarity, or the smallest coherent implementation.
4. Never supply a test path, test source, Gherkin, test command, test implementation detail, or test-failure detail to a worker.
5. Wait for the worker to finish production code and assigned non-test validation.
6. Mechanically verify only completion, assigned-path scope, unchanged Git refs and index, changed-logic size, and fresh non-test validation evidence. Size is reporting evidence, not a pass/fail gate. Never request deletion, compression, indirection, or repartitioning solely to meet the target; record a concise reason when the coherent implementation exceeds it. Do not review source or judge implementation quality.
7. Return a failed mechanical gate or worker-reported blocker to the same worker. A contradiction between source evidence and the binding contract blocks `/implement`; advisory direction may change when the worker provides concrete source evidence.
8. When tests exist, verify that the branch still contains only its accepted inherited and owned tests. Route unexpected test changes through the test-correction procedure; never include them in a production commit. Create the provisional production stage commit and record its parent, test commits, production commit, worker session, size, and validation.

Do not run tests during stage construction. Every worker and mechanical stage gate must complete before any test runs.

## 3. Run Top-Stack Validation

On the top branch, run contract tests when scenarios exist, using repository-defined commands. Always run `Final Cross-PR Validation` and relevant repository-wide tests and final validation. Inspect test source only as needed to classify a failure; never edit it directly.

For every contract-test failure, identify its scenario ID and Owning PR:

- If production behavior disagrees with the contract, check out its Owning PR branch, return it to that PR's retained worker with only the expected behavior, scenario ID, and observable runtime mismatch, and commit the accepted production correction on that branch. Restack every descendant so it inherits the correction, then rerun invalidated checks. Never reveal test source, path, command, assertion, fixture, or implementation detail.
- If evidence shows a test defect, check out its Owning PR branch and invoke one `tester` session with the scenario, observed failure, concrete defect evidence, writable test paths, and relevant fixtures. Invoke `test-auditor` on the correction, return supported findings to the same tester until resolved, and commit the accepted correction directly on that Owning PR as test-only work. Restack every descendant so it inherits the correction, then rerun invalidated checks. Do not ask the user and do not send test details to `worker`.
- If the failure is environmental or ownership cannot be established, stop with the concrete blocker.

Classify a failure from repository-wide tests or other final validation by the affected planned behavior and Owning PR when evidence permits. Check out that Owning PR branch, return only the observable mismatch to its retained worker, commit the accepted production correction there, and restack every descendant before rerunning invalidated checks. Stop when ownership is ambiguous.

After any production or test correction, rebuild the affected stage, restack every descendant onto the corrected checkpoint, rerun invalidated non-test validation and tests, and verify each test correction first appears in its Owning PR's own diff. All applicable tests and final validation must be green before inspection; a task without scenarios proceeds after required non-test and final validation passes.

## 4. Inspect The Green Stack

Invoke one read-only `inspector` only after all applicable tests and final validation are green. A task without scenarios needs no contract-test evidence. Supply the exact task, stage and PR refs, authoritative `BRIEF.md` and finalized `PLAN.md`, production diffs, validation evidence, and PR ownership. Exclude test source and test implementation details.

The inspector runs at most twice:

1. First `PASS`: proceed to publication.
2. First `REWORK`: process affected PRs in plan order. Check out each finding's Owning PR branch, assign it to that PR's retained worker, commit the accepted production correction there, then rebuild that stage and restack descendants. Rerun invalidated non-test validation and applicable tests, and invoke the inspector a second time only after the top is green.
3. Second `PASS`: proceed to publication.
4. Second `REWORK`: process affected PRs in plan order. Check out each finding's Owning PR branch, assign it to that PR's retained worker, commit the accepted production correction there, then rebuild affected stages and restack descendants. Rerun invalidated validation and applicable tests. Do not invoke a third inspector. Publish when all applicable checks are green and every mechanical gate passes.

The two-pass limit is an explicit token-saving compromise. The orchestrator tracks and routes findings but never independently accepts, rejects, expands, or replaces them through source review.

## 5. Publish The Stack

Use the embedded `Pull Request Format` below and fetch. If the stage moved, rebuild the PR stack from the current stage while preserving each PR's accepted own test and production commits, then repeat Sections 2-4. Preserve replaced tips under archive refs and never publish an implementation based on a stale stage.

Push without force and open, but never merge, each PR with these bases:

```text
task-NNN/pr-1 -> <stage>
task-NNN/pr-2 -> task-NNN/pr-1
task-NNN/pr-3 -> task-NNN/pr-2
```

Verify every remote head, base, body, commit set, and own diff against its preceding branch. Finish when every planned PR is open and verified. Report only the ordered PR URLs and bases, outcomes, applicable test evidence, validation evidence, inspector verdicts, corrections, and residual risks, then stop. Do not perform or describe any post-publication operation.

## Pull Request Format

Build each description from that PR's final own diff against its preceding branch. Write every Markdown heading in English. Write the title and all body content in Czech except identifiers, paths, commands, provider syntax, and established technical terms.

Use this structure and omit only optional sections:

````markdown
## Changes

| Oblast | Umístění | Změna |
|---|---|---|
| `<behavior boundary>` | `<path>` | <Materiální produkční změna a její účel.> |

## Production Size

`<changed logic>` / `<PLAN target>` změněných řádků produkční logiky. <Při překročení stručně vysvětlete, proč je výsledná změna stále nejmenší koherentní implementací.>

## Test Scope

<!-- When scenarios exist, use the table. Otherwise write `Testy nebyly pro tento task vytvořeny.` -->

| Scenario ID | Úroveň | Test commit | Výsledek |
|---|---|---|---|
| `<scenario ID>` | `<unit/integration/end-to-end>` | `<SHA>` | `PASS` |

<!-- Keep test scope separate from production size. Describe audited scope and evidence, not test implementation. -->

## Design

<!-- Optional. Explain only a consequential ownership decision, unusual control flow, compatibility choice, or deviation from advisory Implementation direction. -->

## Impacts

<!-- Optional. Keep only applicable lines. -->

- **Kontrakty:** <dopad>
- **Kompatibilita:** <dopad>
- **Migrace:** <požadavky>
- **Rizika:** <zbývající riziko a mitigace>

## Validation

- `<non-test or final command/check>`: `PASS` - <stručný důkaz>
- **Implementation inspection:** `<PASS | REWORK twice followed by green mechanical publication gate>`

## Context

`task-NNN` · <issue reference and URL> · `PR N` · základ `<stage or preceding task branch>` · digest `<published PR-section SHA-256>`

## Visual Evidence

<!-- Optional. Include only for user-visible changes. -->

<Stručný before-and-after důkaz.>
````

### Pull Request Completion Checks

- Headings are English; the title and body are Czech with only required technical exceptions.
- The body describes only the PR's own final diff.
- Production size and test scope are separate; a task without scenarios states that tests were not created.
- When tests exist, claims cite scenario IDs, commits, and results without reviewing or narrating test implementation.
- Validation and inspection claims match final evidence.
- The base and dependency are exact. The body contains no post-publication instructions.
