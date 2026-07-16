---
name: implement
description: Implement every stacked pull request in the active PLAN.md through delegated work, risk-routed inspection, and orchestrator acceptance.
disable-model-invocation: true
---

# Implement

Execute the active task's approved `PLAN.md` as one sequential stack of reviewable pull requests. Workers produce changes, inspectors provide selective independent scrutiny, and this orchestrator alone accepts each stage and owns git history.

## 1. Establish The Run

Resolve the active task using the task-artifact convention in `AGENTS.md`: use an explicitly supplied `task-NNN`; otherwise use the direct `.opencode/artifacts/task-NNN/` child with the greatest numeric suffix. Never create or substitute a task during implementation.

Read `BRIEF.md` and `PLAN.md` in full, plus `RESEARCH.md` when present. Stop and request the producing workflow when either required artifact is absent. Treat `BRIEF.md` as the behavioral authority, `RESEARCH.md` as evidence, and `PLAN.md` as the approved implementation and PR sequence. Inspect repository instructions, onboarding documentation when present, current source, tests, git status, current branch, remotes, and recent history before changing anything.

Confirm that every planned PR has an outcome, ordered work, validation, dependencies, and a size limit; that no blocking unknown remains; and that implementation can proceed in a clean worktree isolated from unrelated changes. Prefer a dedicated worktree when the current one is dirty; stop rather than carry unrelated or overlapping changes across stacked branches when safe isolation cannot be proven. Return to `/grilling task-NNN <reasons>` for a behavioral or architectural contradiction and `/create-plan` for an implementation sequence that cannot safely produce the approved outcome.

Determine the intended base branch from the invocation, repository conventions, and current tracking state. Ask one focused question only when those sources do not establish it. Before implementation, perform a non-mutating publication preflight: confirm the git remote and push target, remote connectivity, authenticated hosting identity, repository visibility through the hosting CLI, and availability of the command used to open pull requests. Stop early when push or pull-request creation capability cannot be established. Record the base, planned PR order, one collision-free local branch per planned PR, plan-wide safety constraints, and validation ownership before delegation.

This step is complete when one authoritative task, one safe base, every planned PR stage, and every blocking escalation have been resolved from evidence.

## 2. Build The Stack

Implement planned PRs in dependency order without waiting for human review between them. Use one writing worker at a time in the isolated worktree. Every planned PR has its own local branch and exactly one commit relative to its parent. For PR 1, create its branch from the established base. After locally accepting and committing each stage, create the next PR branch from that accepted commit. Do not push any implementation branch or open any pull request until the complete local stack passes Step 5.

For each PR, treat its complete `PLAN.md` section as the authoritative implementation assignment. Pass that section to one `worker` in full, without replacing it with a summary or reinterpretation, together with:

- the active task path and current PR section from `PLAN.md`,
- the branch and exact base ref that bound its diff,
- the relevant brief acceptance criteria, research evidence, and plan-wide safety constraints,
- the assignment's owned scope and validation commands,
- the requirement to leave commits, branches, pushes, and pull requests to the orchestrator.

The orchestrator may add repository evidence, execution boundaries, and clarifications that preserve the planned outcome, but must not silently broaden, narrow, or redesign the PR. `PLAN.md` governs the PR's implementation scope, order, dependencies, and validation; `BRIEF.md` remains the behavioral authority. Stop and return to the producing workflow when they materially conflict. Require the worker to report an ambiguity instead of choosing a new interpretation.

Immediately before every worker invocation or resumption, snapshot `HEAD`, the index diff, and repository refs. Immediately after it returns, verify that all three are unchanged. Package-script validation is permitted, but it does not transfer git ownership to the worker. If a worker changed a commit, ref, branch, tag, remote, worktree registration, or staged state, stop and report the exact mutation; do not accept the implementation or silently repair repository history.

Require the worker to implement production behavior and its tests together, run focused validation, and return its concise report. A worker may invoke read-only `explore` agents to map unfamiliar code, but remains responsible for verifying their reports against source before editing.

When the worker reports completion, collect its report, `git status --short`, the complete tracked worktree diff from the PR base, every untracked path and its content, and validation evidence. Reconcile this inventory with the complete planned PR assignment, then perform risk triage. The orchestrator owns this decision: use independent inspection where specialist scrutiny adds confidence, and accept straightforward work directly when scope, precedent, diff, and validation make correctness confidently assessable without it.

This step is complete for a worker pass when its implementation is present in the worktree and the orchestrator has a complete tracked and untracked change inventory.

## 3. Run The Acceptance Loop

Route inspection strategically instead of invoking it after every worker or replacing specialist review with orchestrator review. Invoke `inspector` when the change touches a public contract, persistence or migration, authentication or security, concurrency, recovery or failure semantics, a cross-boundary flow, a novel or high-risk design, a large or difficult diff, worker-reported uncertainty, weak validation evidence, or an area the orchestrator cannot confidently assess. Skip inspection when the change is low-risk, mechanical or strongly patterned, narrowly scoped, and convincingly covered by validation; record the evidence supporting that routing decision.

When inspection is selected, give the inspector the active task path and the complete current PR section from `PLAN.md` without substituting a summary, plus the exact base ref, relevant brief criteria and safety constraints, latest worker report, complete tracked diff, explicit untracked-file inventory, and validation evidence. Require a source-backed findings report with stable severity IDs and the simplest proposed correction for each finding. Resume an `Inspection Blocked` response with corrected evidence; blocked input or correction of an incomplete report does not consume inspection budget. Only a complete findings report counts. Each PR stage has a permanent budget of at most two complete inspection passes across the entire run, including later ancestor repair; the budget never resets.

Check the inspection against its assignment. Resume the same inspector when it misses part of the diff, lacks evidence, evaluates work outside the current PR, misclassifies severity, or violates the report format. Personally validate every finding against the diff, brief, plan, repository evidence, and test results. For each finding, accept it, reject it with evidence, or correct its diagnosis, severity, or proposed solution. Prefer the smallest correction that resolves the underlying problem without expanding scope; do not forward an inspector's proposed solution merely because the finding itself is valid.

When valid findings remain, send the same worker a curated correction assignment containing the unchanged complete planned PR assignment, accepted finding IDs, verified problems, concrete evidence, and orchestrator-approved correction direction. Resume the same worker, then refresh the complete tracked and untracked inventory and validation evidence. The orchestrator must assess the correction delta against the original assignment and accepted findings before deciding how to close the stage.

Close a small, localized correction through orchestrator acceptance without another inspector when it only resolves accepted findings, preserves the planned design and boundaries, introduces no material new risk, and has convincing focused validation. Use the second inspection pass only when the correction changes design or a public contract, crosses another boundary, affects security, persistence, concurrency, recovery or failure semantics, is materially broader than assigned, creates new uncertainty, or still cannot be confidently assessed by the orchestrator. Never invoke a second inspector mechanically.

After the second complete inspection pass, do not invoke an inspector again for that PR stage. The orchestrator has the final acceptance decision: direct the current worker to resolve verified remaining findings when the correction is clear and bounded, then personally assess the resulting delta and validation. If the worker cannot perform that correction, invoke at most one fresh `worker` session with the unchanged complete planned PR assignment, complete current diff, accepted unresolved findings, concrete evidence, and orchestrator-approved correction direction. No inspection follows this replacement worker. If the result remains incorrect, requires an absent product or architecture decision, or cannot be validated safely, stop with concrete evidence instead of creating another loop.

After delegation ends, perform final acceptance rather than a redundant specialist review: inspect the complete tracked diff and every untracked file for conformance to the planned assignment, reconcile each path with scope, run every planned and repository-required check, measure actual changed logic lines according to [`../create-plan/PLAN-FORMAT.md`](../create-plan/PLAN-FORMAT.md), and compare the result with the brief, current PR outcome, dependencies, plan-wide safety, and regression surface. Send any additional implementation defect to the current worker only within the remaining bounded process; when the one replacement worker has already been used and its result remains incorrect, stop instead of delegating again. After every resulting code change, rerun typecheck, affected tests, and every invalidated planned check before using their results. This step is complete only when no valid finding remains unresolved and this orchestrator has accepted the complete assignment using fresh evidence.

## 4. Commit Each Local Stage

After accepting a PR stage, enforce its actual size before staging. More than 750 changed logic lines blocks acceptance and returns to `/create-plan`; 501-750 lines is accepted only when the plan names the rejected split and the final diff still supports that justification. Stage every intended tracked and untracked file and no unrelated path, inspect the complete staged diff, and verify that it exactly matches the accepted inventory.

Create exactly one local commit for the planned PR stage using repository conventions. Verify that the branch is exactly one commit ahead of its parent, its diff equals the accepted staged diff, and the worktree contains no unaccounted changes. Workers and inspectors never commit. Do not push or open a pull request yet.

Record the local branch, commit, parent branch and commit, actual size, fresh validation evidence, worker task ID, inspector task ID when used, inspection-pass count and routing rationale, and unresolved non-blocking risk before creating the next stacked branch.

This step is complete when the accepted stage exists locally as exactly one commit on its own branch, its parent and evidence are recorded, and no implementation branch has been pushed.

## 5. Validate, Publish, And Hand Off The Stack

On the top branch, run every `Final Cross-PR Validation` check from `PLAN.md` and any repository-wide checks made necessary by the combined stack. If a failure belongs to an earlier PR, check out the earliest owning branch, repair it through that PR's remaining bounded worker process and remaining portion of its permanent two-pass inspection budget, rerun affected validation, and amend its single local commit. Restack every descendant branch in dependency order onto the new parent tip while preserving exactly one commit per PR branch. Treat every descendant commit ID, diff, size measurement, validation result, inspection result, and local record as stale; rebuild and reaccept each one before rerunning final cross-PR validation. A PR stage may receive at most one replacement worker across the entire run; stop when the bounded process cannot converge.

Only after the full local stack is stable and every final check passes, read [`PR-FORMAT.md`](PR-FORMAT.md). Reconfirm remote connectivity, authentication, expected remote tips, and branch-name availability. If the established remote base tip differs from the recorded base commit, do not publish: restack the complete local stack onto the new base, invalidate every stage's commit ID, diff, size, validation, inspection, and record, then reaccept every stage and rerun final cross-PR validation before repeating publication preflight.

When the remote base still matches, push all stack branches in dependency order without force. Then open their pull requests in dependency order, using the established base for PR 1 and the immediately preceding PR branch as the base for each later PR. Build every title and body from its final committed diff, accepted decisions, task artifacts, dependencies, and residual risks according to `PR-FORMAT.md`; do not describe absent behavior. Verify every remote branch tip, PR base, PR body, and remote diff against the final local record before continuing.

Finish only when every planned PR exists on its own remote branch as exactly one commit relative to its parent, every descendant is based on the final accepted parent tip, final cross-PR validation passes, every PR body passes `PR-FORMAT.md`, every remote diff matches its accepted local diff, and no blocking finding remains. Report the ordered stack with bases, URLs, outcomes, fresh validation, strategic inspection coverage and resolved findings, residual risks, and any checks that could not run. Human review and merge proceed from the bottom of the stack upward.
