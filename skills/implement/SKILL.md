---
name: implement
description: Implement every stacked pull request in the active PLAN.md through delegated work, risk-routed inspection, and orchestrator acceptance.
disable-model-invocation: true
---

# Implement

Execute the active task's approved `PLAN.md` as one sequential stack of reviewable pull requests. Workers write changes and may run typecheck only; inspectors provide selective scrutiny; this orchestrator manages the work without writing implementation code, accepts each stage, and owns git history, non-typecheck shell commands, and final validation.

Delegate every implementation edit, including production code, tests, migrations, scripts, and implementation configuration, to a `worker`. The orchestrator defines bounded assignments, manages sequencing and git state, inventories each resulting diff, runs tests and all non-typecheck validation, routes risk-based inspection, and makes the final acceptance decision.

Use read-only exploration and inspection subagents when they answer a concrete bounded question, preserve orchestrator context, or provide materially independent scrutiny. Parallelize independent assignments, but do not create subagents without a specific decision or validation need. Never parallelize tasks that depend on another unresolved result, mutate the same worktree or branch without isolation, or would make acceptance, validation, or git history ambiguous.

## 1. Establish The Run

Require an explicitly supplied `task-NNN` and resolve that exact task using the task-artifact convention in `AGENTS.md`. Accept numeric suffixes of at least three digits without an upper limit. Never infer, create, substitute, or recycle a task during implementation.

Read `BRIEF.md` and `PLAN.md` in full, plus `RESEARCH.md` and `GHERKIN.md` when present. Stop and request the producing workflow when either required artifact is absent. `BRIEF.md` is the behavioral authority, `RESEARCH.md` the evidence, `PLAN.md` the approved implementation and PR sequence, and approved `GHERKIN.md` sections are supplemental test contracts explicitly selected by the user. Require one checked `Published Issues` item per PR, fetch only those issues, and verify each issue's repository, task label, marker, verbatim PR section, dependency, and digest. Stop on an unchecked item or drift. Before changing anything, inspect repository instructions, onboarding documentation, relevant source and tests, git status, branch, remotes, and recent history.

When `GHERKIN.md` exists, stop for `/testing` if any section is `Status: Draft`, an execution mode is missing or invalid, a scenario ID is duplicated, or traceability does not name exactly one PR present in the published plan. Never invoke `test-auditor` from this workflow. Preserve approved sections verbatim and group their scenarios by owning PR. `Execution: Test-first` is valid only for Unit; Integration and End-to-End require `Execution: With implementation`. Do not create, select, infer, or expand a Gherkin test level during implementation. An absent section authorizes no supplemental testing workflow or test requirement for that level.

Testing is optional unless an approved `GHERKIN.md` section assigns scenarios to the current PR. When `GHERKIN.md` is absent, no approved scenario maps to the PR, or the repository has no tests or runnable test command for an otherwise test-free stage, do not invent tests, test infrastructure, dependencies, or a green-test completion gate. Record test validation as not applicable and continue with the stage's other evidence. Existing unrelated tests do not become mandatory merely because they are present in the repository.

Confirm every planned PR has an outcome, ordered work, validation, dependencies, and size limit; no blocking unknown remains; and the worktree is isolated from unrelated changes. Prefer a dedicated worktree when the current one is dirty; stop when safe isolation cannot be proven. Return to `/grilling task-NNN <reasons>` for a behavioral or architectural contradiction and `/create-plan` for an unsafe implementation sequence.

Determine the base branch from the invocation, repository conventions, and tracking state; ask one focused question only if these do not establish it. Perform a non-mutating publication preflight covering the remote and push target, connectivity, authenticated hosting identity, repository visibility, and PR command. Stop if push or PR creation capability is unavailable. Use the deterministic branch `opencode/task-NNN/pr-NN` for each stage; an existing name must be reconciled, never bypassed with another name. Record the base, PR order, plan-wide safety constraints, and validation ownership.

Reconstruct progress before invoking a worker. For each stage in order, inspect its deterministic local and remote branch, parent and stage commits, worktree diff, linked issue, and PR or merge request. A matching merged or open PR/MR is already implemented; a matching one-commit local branch is revalidated and its stage record rebuilt; an uncommitted diff is inventoried against the first incomplete stage before deciding whether to resume it. No branch starts new implementation. Stop on a closed-unmerged PR/MR, wrong parent, unexpected commits, issue drift, or ambiguous changes rather than repeating or guessing work.

This step is complete when one authoritative task, one safe base, every planned PR stage, every approved supplemental test scenario and execution mode, and every blocking escalation have been resolved from evidence.

## 2. Build The Stack

Implement only unreconciled PRs in dependency order without waiting for human review between them. Use one writing worker at a time per mutable worktree or branch; parallelize writing only when assignments are dependency-free, file-disjoint or otherwise safely isolated, and the orchestrator can still produce one exact accepted diff and one commit for the stage. Every planned PR has its own local branch and exactly one commit relative to its parent. For PR 1, create its deterministic branch from the established base. After locally accepting and committing each stage, create the next PR branch from that accepted commit. Do not push any implementation branch or open any pull request until the complete local stack passes Step 5.

For each PR, pass one `worker` its complete `PLAN.md` section unchanged, together with:

- the active task path and current PR section from `PLAN.md`,
- the branch and exact base ref that bound its diff,
- the relevant brief acceptance criteria, research evidence, and plan-wide safety constraints,
- every approved Gherkin scenario assigned to that PR, including its section heading, `Status: Approved`, `Approved:` date, execution mode, and traceability, plus an explicit instruction to invoke `testing` before editing tests and follow its worker router to the applicable `UNIT.md`, `INTEGRATION.md`, or `E2E.md`; omit this input when no approved scenario maps to the PR,
- the assignment's owned scope and validation commands the orchestrator will run,
- the requirement to leave test execution, lint, builds, formatting, non-typecheck bash commands, git commands, the index, commits, refs, branches, remotes, worktree registration, pushes, and PRs to the orchestrator.

Add only repository evidence, execution boundaries, and outcome-preserving clarifications. Never broaden, narrow, or redesign the PR; return material brief or plan conflicts to the producing workflow, Gherkin contract conflicts to `/testing`, and require the worker to report ambiguity rather than reinterpret it.

Before every worker invocation or resumption, snapshot `HEAD`, the index diff, and refs; verify all remain unchanged afterward. If the worker mutated git-owned state or ran non-typecheck bash commands, stop and report the exact mutation or command execution without accepting the work or repairing history.

For approved Unit scenarios marked `Execution: Test-first`, first invoke the stage's worker with a test-only precursor assignment containing the unchanged PR assignment and the full approved Unit section. Explicitly require the worker to invoke `testing`, route the section to `UNIT.md`, read it in full, and write the smallest tests that prove the mapped scenarios while preserving all production files and keeping scenario IDs in test names or adjacent parametrization IDs. Before running anything, inspect the worker's complete diff yourself and verify that every mapped scenario is correctly and meaningfully covered according to `UNIT.md`; resume the worker to correct defects until that inspection is satisfactory. Then run the focused tests and accept only a behavioral red state caused by the absent or incorrect planned behavior; collection, import, syntax, fixture, and environment failures are invalid. Never invoke `test-auditor` during implementation. Only after accepting the red tests, resume the same worker with the full production assignment and require it to preserve the approved test behavior while implementing the production change in the same PR.

For all remaining work, require production behavior plus a concise report naming typecheck results and the remaining validation the orchestrator must run. Require tests in the same PR only for approved scenarios mapped to it. For mapped scenarios marked `Execution: With implementation`, explicitly require the worker to invoke `testing`, route each approved section to its exact branch reference, read that reference in full, and write those tests with the production behavior. When no approved scenario maps to the PR, do not add or require tests. A worker may use read-only `explore` agents but must verify their reports against source. Workers must not run validation themselves except typecheck.

When the worker returns, collect its report, `git status --short`, the complete tracked diff from the PR base, every untracked path and its content. Before running tests or any other validation, inspect and reconcile this complete inventory against the assignment, approved Gherkin scenarios, routed testing references, production behavior, and PR scope. Verify that every mapped scenario has a meaningful traceable test, assertions can fail when required behavior is broken, fixtures exercise the intended boundary, and no required outcome is missing. Resume the same worker to correct concrete defects, then repeat the complete inventory and inspection before executing anything.

Only when approved Gherkin scenarios map to the PR and their tests exist, after the orchestrator's code inspection is satisfactory, run the narrowest affected tests and then every suite selected by those approved sections. On any failure, determine whether the defect is in production code, tests, fixtures, or controlled environment; resume the worker with the evidence, inspect the corrected diff again, and rerun every affected or invalidated test. Never invoke `test-auditor` during implementation. Such a tested PR stage is not accepted and the task is not complete while any mapped test is failing, skipped without explicit authorization, not runnable because of a change-owned defect, or lacks a fresh green result. When no approved Gherkin scenario or corresponding runnable test exists, this paragraph imposes no test requirement and does not block completion.

This step is complete for a worker pass when its implementation is present in the worktree and the orchestrator has inspected the complete tracked and untracked inventory. When approved Gherkin scenarios map to the PR, every mapped scenario must also be meaningfully traceable to test code in that PR and its runnable tests must have fresh green results after the final change; otherwise no test condition applies.

## 3. Run The Acceptance Loop

Invoke `inspector` for public contracts, persistence or migration, authentication or security, concurrency, recovery or failure semantics, cross-boundary flows, novel or high-risk designs, large or difficult diffs, worker uncertainty, weak orchestrator validation, or work the orchestrator cannot confidently assess. Otherwise accept low-risk, patterned, narrow, convincingly validated work directly. Record the routing evidence.

When selected, give the inspector the active task path, complete unchanged PR section, exact base ref, relevant brief criteria and safety constraints, worker report, complete tracked and untracked inventory, and validation evidence. Require source-backed findings with stable severity IDs and the simplest correction. Resume blocked or incomplete reports with corrected evidence; only complete reports count toward each stage's permanent two-pass inspection budget, including later ancestor repair.

Check the report against its assignment; resume the same inspector to correct omissions, unsupported or out-of-scope claims, severity errors, or format violations. Validate every finding against the artifacts, repository, diff, and tests, then accept, evidence-backed reject, or correct it. Choose the smallest scope-preserving correction independently of the inspector's proposal.

For valid findings, resume the same worker with the unchanged assignment, accepted finding IDs, verified problems, evidence, and approved correction direction. Refresh the complete inventory and validation, then assess the correction delta against the assignment and findings.

Accept a localized, validated correction directly when it only resolves accepted findings without changing boundaries or risk. Use the second pass only when the correction meets the inspection criteria above or remains uncertain.

After two complete passes, the orchestrator decides acceptance without further inspection. It may direct the current worker to make clear bounded corrections. If that worker cannot, use at most one replacement worker per stage, supplying the unchanged assignment, current diff, unresolved accepted findings, evidence, and approved direction; no inspection follows. Stop with evidence if the result remains incorrect, needs an absent decision, or cannot be validated safely.

Final acceptance requires the orchestrator to inspect all tracked and untracked changes, reconcile every path with scope, run applicable planned and repository-required non-test checks, measure changed logic lines per [`../create-plan/PLAN-FORMAT.md`](../create-plan/PLAN-FORMAT.md), and compare the result with the brief, PR outcome, dependencies, safety constraints, and regression surface. Handle defects only within the remaining worker budget. After every change, rerun applicable typecheck and invalidated checks. Rerun tests and require fresh green evidence only for tests mapped from approved Gherkin scenarios; the absence of `GHERKIN.md`, mapped tests, or an existing runnable test command is not a blocker. Complete when all applicable evidence is fresh and no valid finding remains unresolved.

## 4. Commit Each Local Stage

After accepting a PR stage, enforce its actual size before staging. More than 750 changed logic lines blocks acceptance and returns to `/create-plan`; 501-750 lines is accepted only when the plan names the rejected split and the final diff still supports that justification. Stage every intended tracked and untracked file and no unrelated path, inspect the complete staged diff, and verify that it exactly matches the accepted inventory.

Create exactly one local commit for the planned PR stage using repository conventions. Verify that the branch is exactly one commit ahead of its parent, its diff equals the accepted staged diff, and the worktree contains no unaccounted changes. Workers and inspectors never commit. Do not push or open a pull request yet.

Before creating the next branch, record the stage's branch and commit, parent branch and commit, size, fresh validation, worker and inspector task IDs, inspection count and rationale, and non-blocking risks. This is the authoritative **stage record**.

This step is complete when the accepted stage exists locally as exactly one commit on its own branch, its parent and evidence are recorded, and no implementation branch has been pushed.

## 5. Validate, Publish, And Hand Off The Stack

On the top branch, run every `Final Cross-PR Validation` check and any necessary repository-wide checks. Repair an earlier PR on its own branch within its remaining permanent worker and inspection budgets, rerun affected validation, and amend its single commit. Restack descendants in order while preserving one commit per branch; invalidate, rebuild, and reaccept each descendant stage record before rerunning final validation. Stop if the bounded process cannot converge.

Only after the local stack is stable and every final check passes, read [`PR-FORMAT.md`](PR-FORMAT.md) and reconfirm connectivity, authentication, remote tips, and branch-name availability. If the remote base moved, restack onto it, invalidate and rebuild every stage record, reaccept every stage, and rerun final validation before repeating preflight.

When the remote base still matches, push all stack branches in dependency order without force. Then open their pull requests in dependency order, using the established base for PR 1 and the immediately preceding PR branch as the base for each later PR. Build every title and body from its final committed diff, accepted decisions, task artifacts, linked issue, dependencies, and residual risks according to `PR-FORMAT.md`; do not describe absent behavior. Use a provider-supported closing reference only when it closes the issue after the change reaches the default branch; otherwise link the issue and report that manual closure remains. Verify every remote branch tip, PR base, PR body, and remote diff against the final local record before continuing. Issues remain as history; never delete them.

Finish only when every planned PR exists on its own remote branch as exactly one commit relative to its parent, every descendant is based on the final accepted parent tip, final cross-PR validation passes, every PR body passes `PR-FORMAT.md`, every remote diff matches its accepted local diff, and no blocking finding remains. Report the ordered stack with bases, URLs, outcomes, fresh validation, strategic inspection coverage and resolved findings, residual risks, and any checks that could not run. Human review and merge proceed from the bottom of the stack upward.
