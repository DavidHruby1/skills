---
description: Implement every stacked pull request in an explicitly named task through production workers, optional contract tests, inspection, and publication.
argument-hint: "task-NNN"
agent: build
---

# Implement

Invocation arguments: `$ARGUMENTS`.

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /implement task-NNN` and stop without changing the repository or Git state. Resolve the task directly from `$1`; never infer or substitute another task. Require its approved `PLAN.md`.

The orchestrator owns branches, commits, tests, inspector findings, and publication. It never writes production or test code, judges source or diff quality, or performs source review. Use the shared checkout without worktrees and run one production `worker` at a time.

## 1. Establish The Run

1. Resolve `.opencode/artifacts/task-NNN/` directly. Read `BRIEF.md`, approved `PLAN.md`, optional `GHERKIN.md`, applicable repository instructions, and PR-relevant research. Treat each PR's binding `Implementation contract` as authoritative; `Implementation direction` is advisory.
2. Inspect Git state, remotes, existing task branches, and existing PRs. Require a safe worktree and reconcile completed work without repeating it.
3. Resolve the stage branch from repository instructions, configuration, and local and remote refs. Use it directly when exactly one candidate is supported. When several candidates remain, use the question tool and list their exact branch names; when none is supported, ask for the stage branch instead of guessing. Record its full current tip SHA. Determine whether `GHERKIN.md` contains any approved, audited scenario. Tests are optional: when none exists, do not require `task-NNN/tests`, test commits, or test routing.
4. When approved scenarios exist, require local `task-NNN/tests` and derive all test routing and static audit evidence only from approved scenario IDs plus that branch's commits and trailers. Before any cherry-pick, require every test commit to contain the same full `Test-Base`, require that value to equal the current stage tip exactly, and require the first test commit's parent to equal it. Verify every audited test file matches its owning commit and remains unchanged by later test commits. If stage differs, stop with: `Test stack was audited against <Test-Base>, but stage now points to <current stage SHA>. Run /create-tests task-NNN again against the current stage.` Ancestor status is insufficient.
5. When approved scenarios exist, mechanically map each one exactly once to its `Owning PR`, test commit, immutable test files, and a test command discovered from repository test configuration and conventions. Require every test commit to belong to exactly one PR. Stop for a new `/create-tests` run when required evidence is absent, ambiguous, contradictory, or unaudited.
6. Record each PR's binding contract, advisory direction, behavior home, assigned production paths, changed-logic limit, non-test validation, optional owned test commit, and parent checkpoint. A PR with no approved scenario has no test commit.

Completion criterion: the exact task, stage, stack, contracts, ownership, and validation are unambiguous; when approved scenarios exist, their immutable test evidence is also unambiguous.

## 2. Build Every Stage

Build the stack in plan order:

```text
<stage> -> task-NNN/pr-1 -> task-NNN/pr-2 -> ...
```

For each PR:

1. Create `task-NNN/pr-N` from the preceding checkpoint: stage for PR 1, otherwise `task-NNN/pr-(N-1)`.
2. When approved scenarios exist, recheck that the selected stage tip still equals `Test-Base`. If this PR owns scenarios, apply or cherry-pick only its test commit from local `task-NNN/tests`; otherwise skip the cherry-pick. On mismatch, use the Step 1 hard-stop message. When no approved scenario exists anywhere, skip all Test-Base and test-commit gates. Do not edit test files.
3. Launch one `worker` and retain its session for corrections. Supply only the Owning PR, binding Implementation contract, advisory Implementation direction, behavior home, assigned production paths and symbols, relevant production evidence, changed-logic limit, and assigned non-test validation.
4. Never supply a test path, test source, Gherkin, test command, test implementation detail, or test-failure detail to a worker.
5. Wait for the worker to finish production code and assigned non-test validation.
6. Mechanically verify only completion, assigned-path scope, unchanged Git refs and index, changed-logic size, and fresh non-test validation evidence. Do not review source or judge implementation quality.
7. Return a failed mechanical gate or worker-reported blocker to the same worker. A contradiction between source evidence and the binding contract blocks `/implement`; advisory direction may change when the worker provides concrete source evidence.
8. When tests exist, verify all audited test files remain byte-for-byte identical to their owned test commits. Create the provisional production stage commit and record its parent, optional test commit, production commit, worker session, size, and validation.

Do not run tests during stage construction. Every worker and mechanical stage gate must complete before any test runs.

## 3. Run Top-Stack Validation

On the top branch, run contract tests only when approved scenarios exist, using the audited trailers and repository-defined commands. Always run `Final Cross-PR Validation` and relevant repository-wide tests and final validation. Do not inspect test implementation.

For every contract-test failure, identify its scenario ID and Owning PR:

- If production behavior disagrees with the approved scenario, return it to that PR's retained worker with only the expected behavior, scenario ID, and observable runtime mismatch. Never reveal test source, path, command, assertion, fixture, or implementation detail.
- If evidence shows an audited test defect, stop `/implement`. Audited test files are immutable and correction requires a new `/create-tests` run.
- If the failure is environmental or ownership cannot be established, stop with the concrete blocker.

Classify a failure from repository-wide tests or other final validation by the affected planned behavior and Owning PR when evidence permits. Return only the observable mismatch to that worker; stop when ownership is ambiguous.

After a production correction, rebuild the affected stage, restack every descendant onto the corrected checkpoint, rerun invalidated non-test validation, verify test immutability when tests exist, and rerun every invalidated test or final check. All applicable tests and final validation must be green before inspection; a task without approved scenarios proceeds after its required non-test and final validation passes.

## 4. Inspect The Green Stack

Invoke one read-only `inspector` only after all applicable tests and final validation are green. A task without approved scenarios needs no contract-test evidence. Supply the exact task, stage and PR refs, approved `BRIEF.md` and `PLAN.md`, production diffs, validation evidence, and PR ownership. Exclude test source and test implementation details.

The inspector runs at most twice:

1. First `PASS`: proceed to publication.
2. First `REWORK`: assign every finding to its Owning PR's retained worker; rebuild that stage, restack descendants, rerun invalidated non-test validation and applicable tests, and invoke the inspector a second time only after the top is green.
3. Second `PASS`: proceed to publication.
4. Second `REWORK`: assign the findings, rebuild affected stages, restack descendants, and rerun invalidated validation and applicable tests. Do not invoke a third inspector. Publish when all applicable checks are green and every mechanical gate passes.

The two-pass limit is an explicit token-saving compromise. The orchestrator tracks and routes findings but never independently accepts, rejects, expands, or replaces them through source review.

## 5. Publish The Stack

Use the embedded `Pull Request Format` below and fetch. When approved scenarios exist, require the selected stage tip to still equal `Test-Base` before publication; if it moved, use the Step 1 hard-stop message and require a new `/create-tests`. When no approved scenarios exist and stage moved, invalidate the stack and rebuild it from the current stage through Sections 2-4. Never publish an implementation based on a stale stage.

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

`<changed logic>` / `<PLAN limit>` změněných řádků produkční logiky.

## Test Scope

<!-- When approved scenarios exist, use the table. Otherwise write `Testy nebyly pro tento task vytvořeny.` -->

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
- Production size and test scope are separate; a task without approved scenarios states that tests were not created.
- When tests exist, claims cite scenario IDs, commits, and results without reviewing or narrating test implementation.
- Validation and inspection claims match final evidence.
- The base and dependency are exact. The body contains no post-publication instructions.
