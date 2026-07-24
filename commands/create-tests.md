---
description: Create approved unit, integration, and end-to-end tests in parallel before production implementation
agent: build
---

Create every test authorized by the active task's approved `GHERKIN.md` before production implementation. `$ARGUMENTS` may name an exact `task-NNN`; otherwise resolve the active task using `AGENTS.md`. Write no production code, run no tests, and publish nothing.

## 1. Establish The Test Run

Read repository instructions, the full current `GHERKIN.md`, relevant test documentation and configuration, existing test layout, and only the production interfaces needed to identify real public boundaries. A section authorizes tests only when it contains `Status: Approved`, `Approved: YYYY-MM-DD`, and `Audit: Passed YYYY-MM-DD`. Ignore draft or unaudited sections. When no approved scenario exists, report that no tests are required and stop without changing files or Git state.

Require every approved scenario to have one level, stable ID, complete contract entry, and for planned behavior exactly one owning `PLAN.md` PR in `Traceability:`. Stop on duplicate IDs, missing ownership, contradictory entries, or ambiguous test roots rather than guessing.

Inspect Git status, branch, refs, and the index. Require no unaccounted source or test changes. Record the original base ref and create the deterministic local branch `task-NNN/tests`; reconcile an existing branch from evidence rather than repeating work. Never use worktrees.

## 2. Assign Parallel Layer Testers

Group approved scenarios into the non-empty Unit, Integration, and End-to-End layers. Resolve the repository's dedicated test root and exact owned paths for each layer before launching agents. Prefer established test directories. When no test root exists, use the repository's documented convention; stop for one location decision when no convention exists. Production paths are always out of scope.

Launch exactly one `tester` agent for each non-empty layer in one parallel tool call. Supply only:

- the layer and exact disjoint test paths it owns,
- every complete approved scenario entry assigned to that layer,
- the relevant public production interfaces and existing test infrastructure,
- repository test conventions and focused command syntax,
- explicit production, artifact, Git, shared-infrastructure, and other-layer exclusions.

Parallel agents must never own the same file. Assign an existing shared fixture or test helper to exactly one layer only when approved scenarios require changing it and the other layers can consume its final contract without concurrent edits. If path ownership cannot be made disjoint, run only the conflicting assignment after the parallel agents finish; never allow concurrent writes to one file.

Retain every tester task ID. Snapshot `HEAD`, refs, and the index before the calls and verify afterward that testers changed only their assigned test paths and did not mutate Git-owned state. Return any scenario contradiction or path escape to its tester once as a bounded correction. Do not perform a general test-code review and do not invoke `test-auditor` or `test-contract-auditor`.

## 3. Record And Checkpoint Tests

Create `<active-task>/TESTS.md` as the authoritative routing manifest with:

```markdown
# Test Implementation Manifest

- Original base: `<immutable ref>`
- Test branch: `task-NNN/tests`
- Test commit: `<commit after creation>`

| Scenario ID | Level | Owning PR | Test path | Test name or ID | Command | Tester task ID |
|---|---|---|---|---|---|---|
| `<ID>` | `<Unit | Integration | End-to-End>` | `PR N` | `<path>` | `<exact test name or parametrization ID>` | `<focused command>` | `<task ID>` |
```

Account for every approved scenario exactly once and every changed test path at least once. The manifest is orchestration evidence, not a test implementation artifact. Stage only the owned test inventory, inspect the staged paths, and create exactly one local test checkpoint commit using repository conventions. Do not run tests, push, or open a pull request. Update the manifest's test commit after committing without amending the checkpoint.

Finish by reporting the branch and commit, layer tester IDs, scenario count, changed test paths, and that execution and Gherkin-to-test comparison are deferred until all production implementation is complete.
