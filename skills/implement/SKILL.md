---
name: implement
description: Implement every stacked pull request in the active PLAN.md through worker subagents, orchestrator review, validation, and publication.
disable-model-invocation: true
---

# Implement

Execute an explicitly supplied task's approved `PLAN.md` as a sequential stack of reviewable pull requests. A `worker` writes only production code and runs assigned non-test validation. Tests are created beforehand by `/create-tests`; production workers never read, modify, or run them. The orchestrator waits for every production worker and correction to finish, then performs a finding-free source and specification audit under `software-philosophy` before it compares tests with approved Gherkin, runs validation, and publishes the stack. It never writes implementation or test code itself.

Use the repository's current checkout and ordinary branches. Never use Git worktrees. Use one worker at a time because workers share the checkout; the worker may delegate only bounded read-only exploration.

## 1. Establish The Run

1. Resolve the exact supplied `task-NNN` using `AGENTS.md`; never infer or create one. Read `BRIEF.md` and `PLAN.md` in full and PR-relevant `RESEARCH.md`. Read `GHERKIN.md` and `<active-task>/TESTS.md` only as orchestrator-owned final-test inputs; never include them or test source in a production worker assignment.
2. Read repository instructions and relevant production documentation. Inspect the planned production source, git status, branch, remotes, and recent history enough to verify the plan still matches the checkout. Allow only the expected post-commit `TESTS.md` manifest update from `/create-tests`; stop on other ambiguous unrelated production changes, behavioral or architectural contradictions, an unsafe sequence, or drift between each published issue and its verbatim PR section.
3. When approved and audited Gherkin scenarios exist, require `/create-tests` evidence before production work: every approved scenario appears exactly once in `TESTS.md`, every recorded test path exists in a dedicated test root, every tester task ID is present, and `HEAD` equals the recorded local test checkpoint. Stop for `/create-tests` when evidence is absent or inconsistent. When no approved scenario exists, `TESTS.md` and test creation are not required.
4. Record every test root as excluded production-worker context and immutable during production stages. Establish the original base from `TESTS.md` when present, otherwise from repository evidence, and deterministic stage branches `task-NNN/pr-N`. Reconcile existing branches or PRs from evidence rather than repeating work. The test checkpoint is provisional local history, not a separate pull request; PR 1 ultimately contains the unchanged test inventory plus exactly one production-stage commit relative to the original base, and each later stage remains exactly one commit relative to its parent.

Treat `Human Review` as orchestrator context only; the detailed PR sections are authoritative. Stop on conflicts and exclude the summary from worker assignments.

This step is complete when the task, base, PR order, current progress, safety constraints, production boundaries, excluded test roots, optional test checkpoint, and every blocking escalation are resolved.

## 2. Implement Each Stage

Create each stage branch from its checkpointed parent. For PR 1, start from the `/create-tests` checkpoint when present; otherwise start from the original base. Start one production `worker` session for the stage, retain its task ID immediately, and reuse that session for every production correction. Provide only:

- the exact unchanged PR section, branch, base ref, and applicable plan-wide safety constraints,
- relevant brief criteria and production evidence not already contained in the PR section,
- exact production paths and symbols, every excluded test root, and assigned non-test validation commands,
- instructions to leave all git state, commits, pushes, and PRs to the orchestrator.

The supplied assignment is the worker's authoritative context. Do not provide `GHERKIN.md`, `TESTS.md`, test source, test commands, or test-failure output. Do not instruct it to reread `BRIEF.md`, `PLAN.md`, or `RESEARCH.md` when relevant production content is already supplied. Direct it to an artifact only when a specifically named unresolved production fact cannot be included safely.

The worker follows its own implementation process but treats the supplied PR section's `Steps` as its ordered assignment, completing every step without reordering or redesigning it unless repository evidence proves the sequence unsafe. Return material brief, plan, or source-reuse conflicts to the producing workflow rather than letting the worker redesign the assignment.

During production stages, do not read test source, invoke a tester or test auditor, compare tests with Gherkin, or run any command that collects or executes tests. Assign only production lint, typecheck, build, schema, or static checks. All test execution and inspection is deferred until every production worker has finished.

Snapshot `HEAD`, refs, and the index before every worker call and verify that the worker did not mutate git-owned state afterward. Stop and report any such mutation rather than repairing it implicitly.

## 3. Checkpoint The Stage

After the worker returns, perform only a bounded stage gate. Do not invoke review mode, reread all changed source, search the repository again for duplicate behavior, or rerun successful worker validation. Verify:

- the worker completed the assignment without a blocker or reported contradiction,
- tracked and untracked changed paths stay within the PR scope,
- `HEAD`, refs, and the index were not changed by the worker,
- every assigned non-test validation command has fresh passing evidence,
- the actual changed logic size does not violate the plan limit.

Resolve a failed gate through the retained worker before continuing. Otherwise stage only the production inventory and verify every test path remains byte-for-byte equal to the `/create-tests` checkpoint. For PR 1, reconstruct one provisional commit relative to the original base containing the unchanged test checkpoint inventory and accepted PR 1 production inventory; do not edit or regenerate test content. For later PRs, create exactly one provisional local commit relative to the preceding stage. Inspect the staged summary and unexpected paths, record the branch, commit, parent, size, worker task ID, non-test validation evidence, and residual risks, then branch the next PR from that checkpoint. Do not push yet.

Do not treat the checkpoint as final acceptance. Deep source review and independent stack validation happen only after all workers finish. Do not start review while any planned stage lacks a returned worker result, a passing stage gate, or its provisional commit, or while any worker or correction call is still active.

## 4. Review And Accept The Stack

This is a hard barrier. Enter it only after every planned production stage has completed Section 3 and no worker call is active. On the top branch, reread the complete approved `BRIEF.md` and `PLAN.md` from disk; do not review from assignments, summaries, worker reports, or memory. Invoke `software-philosophy` in review mode and keep its review guidance governing the entire audit and correction loop.

Build an explicit traceability ledger before accepting code. Account separately for every brief requirement, acceptance criterion, non-goal, constraint, and edge case, and every plan-wide constraint plus each PR's outcome, ordered step, dependency, safety constraint, and validation requirement. For each item, record exact source or diff evidence and validation evidence, or mark it missing, contradictory, or unverifiable. A grouped assertion such as "all criteria pass" is not evidence. Resolve every mismatch with the authoritative specs before proceeding.

Inventory every tracked and untracked path. Review every provisional commit's complete diff against its parent line by line, then inspect enough unchanged surrounding code, owners, callers, callees, data flow, error paths, and repository-wide equivalents to judge behavior and design rather than diff appearance. Verify across the stack:

- every item in the traceability ledger is demonstrably satisfied by production behavior exactly as specified in `BRIEF.md` and `PLAN.md`,
- no worker silently omitted, weakened, broadened, reordered, or reinterpreted a required behavior or plan step,
- every changed path and behavior is in scope and no required outcome is missing,
- observable behavior, ordering, defaults, errors, data shapes, persistence, side effects, external calls, authorization, and compatibility agree with the specs and do not regress unaffected paths,
- added logic does not duplicate an existing function, method, class, rule, transformation, or call path in the affected files or repository,
- every new abstraction is necessary and each new symbol is placed with the existing owner of its knowledge,
- every new or materially changed non-trivial function, method, and class has an accurate interface comment explaining its responsibility, rationale, and important constraints or behavior,
- each stage complies with the changed-logic limits in [`../create-plan/PLAN-FORMAT.md`](../create-plan/PLAN-FORMAT.md).

Do not accept worker reports, passing tests, compilation, or clean-looking code as proof that a spec item is implemented correctly. Send every valid defect back to that stage's retained worker as a bounded correction with exact source and spec evidence plus the required direction. If that worker cannot complete the assignment, use at most one replacement worker for the stage and retain its task ID for all remaining work. Wait for the correction worker to return, rerun the stage gate, reconstruct the corrected one-commit stage, and restack every descendant before reviewing again.

Every correction invalidates the affected ledger entries, diffs, call paths, and cross-stage assumptions. Reinspect all of them under `software-philosophy`, update their evidence, and repeat until a complete pass produces no findings and no missing, contradictory, or unverifiable ledger item. Stop when the result remains incorrect, needs an absent decision, or cannot be validated safely. Section 5 is blocked until this acceptance condition is met.

## 5. Validate Tests Against Gherkin

After all production workers finish and production review corrections are stable, use the approved `GHERKIN.md` and `TESTS.md` directly. Do not invoke `test-auditor`, `test-contract-auditor`, or any other test-review agent. For every manifest row, read the named test and compare only the mapped approved scenario contract:

- the exact scenario ID appears in the test name or parametrization ID,
- setup reaches the `Given` state,
- the action performs the `When`,
- assertions detect every observable `Then`, `And`, or `But` outcome,
- the exercised boundary matches `Test scope` and the declared level,
- the test adds no behavior outside that scenario.

Require every approved scenario exactly once and every manifest path to remain inside its dedicated test root. This is a contract comparison, not a general test-code, style, coverage, abstraction, or edge-case review. Do not request scenarios or assertions beyond approved Gherkin.

Run every unique test command recorded in `TESTS.md` only after that comparison, plus test commands explicitly required by `Final Cross-PR Validation`. Classify each failure before correction:

- When the test does not faithfully implement its mapped Gherkin, resume the recorded tester task ID with the scenario entry, exact mismatch, owned test path, and failing evidence. The tester may change only its recorded test paths. Recompare the corrected test and rerun only invalidated commands.
- When the test faithfully implements Gherkin and production behavior disagrees, resume the production worker task ID for the scenario's owning PR with the brief or plan behavior, scenario ID, observable mismatch, and runtime evidence, but never test source or test implementation details. Wait for it to finish, rebuild that stage's one commit, restack descendants, return the changed stack through Section 4's acceptance barrier, and rerun invalidated non-test and test commands.
- When failure comes from collection, import, syntax, fixture, infrastructure, or environment rather than asserted behavior, route it to the tester only when its test change caused the failure; otherwise stop and report the external blocker. Never weaken a faithful test to make production pass.

Retain at most one replacement tester per layer and one replacement production worker per stage when a recorded session cannot finish. Stop on a Gherkin contradiction, missing ownership, unresolved failure, or absent decision. Preserve one final PR commit per stage; test corrections remain part of PR 1 and require restacking descendants.

## 6. Validate And Publish

After test corrections are stable, run every remaining `Final Cross-PR Validation` check and necessary repository-wide non-test check once on the top branch. Do not repeat successful checks unless a later correction invalidated them. Fix an earlier stage through its retained production worker, wait for it to finish, restack, return the changed stack through Section 4's acceptance barrier, and rerun only invalidated checks. Preserve one commit per branch.

After the stack is stable, read [`PR-FORMAT.md`](PR-FORMAT.md), preflight authentication and remote state, and restack if the remote base moved. If that restack changes any reviewed diff, return the changed stack through Section 4's acceptance barrier and rerun invalidated checks. Push branches without force and open PRs in dependency order, basing each later PR on the preceding branch. Build titles and bodies from final evidence according to `PR-FORMAT.md`; verify each remote tip, base, body, and diff.

Finish when every planned PR is one accepted remote commit relative to its parent, every feasible final check passes, every remote diff matches its reviewed local diff, and no blocking defect remains. Report the ordered stack, URLs, outcomes, validation, corrections, residual risks, and unavailable external-only checks.
