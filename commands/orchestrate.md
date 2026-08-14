---
description: Execute any ready implementation plan quickly by managing parallel workers, test writers, corrections, and final verification.
argument-hint: "[plan or path to plan]"
---

# Manage

Invocation arguments: `$ARGUMENTS`.

Act as an execution manager for a ready implementation plan supplied by the user. Accept any plan format. Delegate production implementation to `worker` and test writing to `tester`; do not write production code or tests yourself. Optimize for short elapsed time and correct delivery.

## 1. Resolve The Plan

Use the first unambiguous source in this order:

1. A plan supplied in `$ARGUMENTS`.
2. A file explicitly identified by `$ARGUMENTS` as containing the plan.
3. A ready implementation plan established in the current conversation.

If no ready plan is available from these sources, ask the user for it and stop. Do not search the repository for a plan or create, redesign, expand, or re-approve one.

Read applicable repository instructions and documentation. Inspect only enough source to execute the plan safely. Treat the plan's required behavior, constraints, and acceptance criteria as binding. Treat suggested implementation details as advisory when source evidence supports a smaller or more correct implementation.

## 2. Build The Execution Graph

Convert the plan into the smallest set of coherent production assignments. Record for each assignment:

- a stable stage identifier;
- exact behavior contract and definition of done;
- writable production paths or a boundary narrow enough to discover them;
- relevant inputs, constraints, dependencies, and source evidence;
- shared resources and integration points;
- expected report.

Use `explore` only when ownership, entrypoints, dependencies, or writable paths cannot be resolved directly. Give each explorer one bounded read-only question and require source evidence. Run independent exploration questions in parallel.

Create parallel waves. Put assignments in the same wave only when their dependencies are complete and their writable paths, behavior boundaries, and exclusive resources do not overlap. Prefer parallel execution whenever it is safe. Use sequential execution when independence is uncertain; do not spend time forcing unsafe concurrency.

This phase is complete when every plan item has one owner and all dependencies and safe parallel waves are explicit.

## 3. Run Production Workers

Launch all workers in the current ready wave concurrently in one parallel tool batch containing one `task` invocation per worker. Give each worker:

- its stable stage identifier as the owning stage;
- the repository root as its work path;
- the binding behavior contract and checkable definition of done;
- advisory implementation direction when the plan provides one;
- implementation boundary, ownership evidence, writable paths, and relevant source evidence;
- constraints and integration points;
- `assigned non-test validation: None - deferred to the manager`;
- the required changed-path, decision, blocker, and completion report.

State explicitly that each worker must edit only assigned production paths, preserve unrelated work, implement the smallest coherent solution, and avoid tests and Git. Workers do not run tests, type-checks, builds, lint, or other validation.

Use each worker report only to record completion, changed paths, deviations, and blockers. After each parallel wave, mechanically verify that its actual changed paths remain within the union of that wave's assigned paths. Do not inspect production source or diff contents between waves. Return an out-of-scope path, reported blocker, or incomplete assignment to the owning retained worker session. Advance dependent stages when their prerequisites report completion. Repeat until all production assignments are done.

## 4. Run Test Writers

After production implementation is complete, derive the minimum test assignments needed to prove the plan's acceptance criteria and changed behavior. Use one representative case per behavior or guard and add only high-value edge cases. Follow existing test ownership and conventions.

Launch independent `tester` assignments concurrently when their writable test paths are disjoint. Give each tester:

- the owning stage and exact behavior contract;
- relevant production interfaces and acceptance criteria;
- writable test, fixture, and helper paths;
- existing test conventions and constraints;
- a checkable coverage definition of done and expected changed-path report.

Testers edit tests only. They do not edit production code, run tests, or use Git. Run overlapping test assignments sequentially or combine them under one tester. Use their reports only to record completion, changed paths, coverage, and blockers. Do not inspect test source or diffs during this phase. Return reported blockers to the owning retained session.

## 5. Run Final Verification

Run one focused verification gate after production code and tests are complete:

1. Run the smallest focused tests that cover the changed behavior.
2. Run the affected-scope type-check when the repository has one.
3. Run another build, lint, migration, or static check only when the plan or repository instructions require it for the changed scope.

Run independent commands in parallel. Use `bash-agent` only when several commands or large outputs justify it; otherwise run them directly. Prefer affected-scope checks over repository-wide suites.

If a check fails, classify it from concrete output and send one concise correction prompt to the owning retained worker or tester. Rerun only failed or invalidated checks. Repeat the full gate only when a correction invalidates its full scope. Report and stop on an environmental failure, unrelated pre-existing failure, or contradiction in the supplied plan.

## 6. Review And Correct

Only after all required verification commands pass, inspect the complete diff and perform one thorough, scope-bound manager review against the supplied plan and repository rules. This is the first source and diff review in the workflow. Check:

- all required behavior and acceptance criteria are implemented;
- cross-worker integration, callers, data flow, failures, side effects, and compatibility are coherent;
- changes contain no unrelated refactoring or speculative complexity;
- tests exercise observable behavior and can fail for a real regression;
- worker and tester changes do not conflict.

For material findings, send one consolidated, evidence-backed correction prompt to each owning retained session and run independent corrections in parallel. When an integration finding crosses assignment boundaries, split it into explicit corrections for the original owners when they can remain independent; otherwise assign it to one retained worker with an explicitly expanded, non-overlapping path scope and hold conflicting sessions until that correction completes. Rerun invalidated checks before inspecting any correction. After those checks pass, review only the affected diffs and integration points. Continue this focused correction loop until affected checks pass and the review is clean. Do not inspect corrections before their checks pass, restart broad discovery, repeat unaffected verification, or add speculative work.

Finish with a concise report of completed stages, production and test paths, parallel waves, correction rounds, verification commands and results, and residual risks. Do not commit, branch, push, publish, or alter unrelated Git state unless the user explicitly requests it.
