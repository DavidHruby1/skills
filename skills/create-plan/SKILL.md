---
name: create-plan
description: Create and publish an approved PLAN.md from an authoritative brief. Use when a defined problem needs critical solution planning and tracked implementation issues.
---

# Solution Planning

Treat the active task's `BRIEF.md` as authoritative, brainstorm the best solution with the user, and write its `PLAN.md` only after the user approves a direction.

## 1. Load The Brief And System Context

Gather evidence before deciding whether the task must return to grilling. Follow this order:

1. Resolve the active task using the task-artifact convention in `AGENTS.md`. Inventory the task artifacts without judging their adequacy yet.
2. Read the task's `BRIEF.md` in full when it exists, then read its `RESEARCH.md` in full when present. The brief's problem and outcome, canonical domain terms, scope, constraints, invariants, resolved decisions, rejected alternatives, and acceptance criteria are authoritative claims to verify, not assumptions that the repository already satisfies.
3. Inspect the relevant system. Query an existing `graphify-out/` when broad architecture, relationships, ownership, data flow, or scope narrowing is needed, then verify claims in source. Use read, glob, or grep directly for known files, names, strings, and localized questions; use `ast-grep` for syntax-aware implementation searches only when structure improves precision. Trace the brief and research claims into source code, tests, documentation, and ADRs to establish what already exists, what is missing, and where either input is incorrect or inconsistent with the system.
4. Evaluate the brief only after that investigation. Check that it is coherent, decision-complete, technically grounded, and consistent with both `RESEARCH.md` and repository evidence.

Use bounded, path-scoped Git history when it can explain a non-obvious design, prior attempt, revert, recurring regression, migration, compatibility constraint, or co-change pattern that could alter the solution or its risk. Start with recent logs for the relevant boundaries and inspect historical patches only when a commit is materially relevant. Treat history as evidence of prior intent and change risk, not proof that a decision remains correct.

Only after completing the available investigation may you choose an escalation:

- If no task or `BRIEF.md` exists, request `/grilling` and state exactly what artifact discovery established.
- If the brief is incomplete, contradictory, or disproven by the system, stop planning and request `/grilling task-NNN <reasons>` with concrete evidence-backed reasons. Do not correct the authoritative brief or write `PLAN.md`.
- If material behavior depends on a third-party or platform runtime contract and `RESEARCH.md` lacks applicable authoritative external evidence, stop and request `/research`, naming the unresolved contract.
- Otherwise, continue to solution exploration.

This step is complete when every available brief and research input has been read in full, the relevant system has been inspected with tools appropriate to the questions, and the decision to continue or escalate is supported by concrete source evidence.

## 2. Explore The Solution Space

Invoke the `software-philosophy` skill before evaluating solutions and apply its design principles throughout planning.

Map the relevant current behavior, ownership boundaries, dependencies, data flow, failure paths, and validation options. Gather enough evidence to evaluate designs against the actual system.

Before accepting the requested mechanism or repository precedent, identify the root cause, the decision the changed boundary should own, and whether the request addresses the cause or only a symptom. Treat analogous code as evidence rather than validation: test whether its assumptions and invariants apply, and consider whether a simpler boundary can eliminate the mechanism instead of reproducing it. Surface a deeper defect or materially simpler direction to the user rather than silently preserving it or expanding scope.

Compare materially different solutions only when more than one credible approach could change ownership, risk, compatibility, or operational behavior. Do not tunnel into the first workable idea, but do not invent alternatives when repository constraints leave one sensible local approach; state that constraint and proceed.

For each credible solution, assess:

- coverage of the brief, including correctness and failure behavior,
- architectural fit, ownership, coupling, and change amplification,
- relevant compatibility, security, performance, and operational consequences,
- concrete trade-offs, risks, and assumptions that must be proven.

## 3. Conduct Critical Solution Planning

Present the credible solutions and their trade-offs to the user before writing any plan. Give a reasoned recommendation when the evidence supports one, but remain maximally neutral about preferences and maximally critical about claims.

Apply these standards throughout solution planning:

- Accuracy outranks agreement. Never endorse the user's proposal merely because the user prefers it.
- Challenge weak solution assumptions, hidden costs, unnecessary complexity, and architecture unsupported by current requirements.
- Apply the same scrutiny to your own recommendation and name evidence that could disprove it.
- Separate facts, inferences, preferences, and unknowns.
- Compare alternatives by the same criteria; do not frame the preferred option more favorably.
- State uncertainty directly instead of manufacturing confidence.
- Prefer the smallest coherent design that fully meets the brief, not the smallest patch and not the most elaborate architecture.
- Prefer the fewest PRs that keep each PR coherent, reviewable, safe to merge, and within the size limits. Do not split a feature merely because parts could be merged independently; every additional PR must materially reduce risk or cognitive load, preserve a useful standalone contract, or satisfy a hard size boundary.
- Change the recommendation when stronger evidence or reasoning warrants it.

Use the question tool to let the user select, reject, combine, or revise the proposed directions. Continue exploring and criticizing the design until the user explicitly approves a solution. Agreement means the user has selected a direction with its important trade-offs understood; passive assent or lack of objection is insufficient.

This step is complete only when one technically credible solution is explicitly approved, all decisions required for implementation planning are resolved, and no blocking assumption is deferred to implementation.

## 4. Write The Plan

After approval, write `PLAN.md` in the same active task used throughout this workflow by following [`PLAN-FORMAT.md`](PLAN-FORMAT.md). Base it on the approved solution, repository evidence, the authoritative `BRIEF.md`, and `RESEARCH.md` from that task when present.

Populate `Published Issues` before audit. Read the required GitHub or GitLab provider from repository instructions and derive its repository from the Git remote; stop on a missing, conflicting, or mismatched instruction rather than selecting a provider. Add one pending item per planned PR in stack order.

Do not implement code. Do not silently alter the approved solution while translating it into steps. If planning exposes a material flaw in the selected design, stop writing, explain the flaw, and resume solution planning.

This step is complete when the draft `PLAN.md` passes every completion check in `PLAN-FORMAT.md` and appears executable without requiring an implementation agent to invent product or architecture decisions. Do not declare planning complete yet.

## 5. Audit The Plan

Invoke `plan-auditor` exactly once with the active task path, full `BRIEF.md`, `RESEARCH.md` when present, the explicitly approved solution and accepted trade-offs, full draft `PLAN.md`, and relevant repository and Git-history evidence. Treat the auditor only as a final source of feedback, not as a workflow gate. Ignore any `READY` or `REWORK` verdict except as context for the findings.

Use the single audit result as follows:

- Fix clear `MECHANICAL` findings and `PLANNING` findings that preserve the brief and explicitly approved solution directly in `PLAN.md` without asking the user.
- Present every substantive finding about solution design, missing evidence, brief defects, scope, sequencing, risk, or acceptance alignment to the user as final audit feedback. Do not resume solution planning, request `/grilling`, request `/research`, or ask another questionnaire unless the user explicitly asks to continue refining the plan.
- Never invoke `plan-auditor` again for the same planning session, even after user answers or plan edits prompted by the audit feedback.

This step is complete after the single audit result has been handled and the active task's `PLAN.md` contains the current material outcome. Do not implement code.

## 6. Publish The Issues

Perform a non-mutating preflight for the instructed provider covering CLI availability, authentication, repository access, issue creation, and the task label. Compute a SHA-256 digest for each complete PR section exactly as written. Invoke `ticket-master` with the active task path, provider, repository, task label, ordered complete PR sections, and their digests.

After it returns, reread `PLAN.md` and fetch every listed issue. Verify that every PR has one checked item in stack order and that its remote title, verbatim PR section, label, dependency, marker, and digest match. Resume partial publication through `ticket-master`; do not repair remote issues or checklist entries by inference.

The workflow is complete only when every planned PR has one verified checked issue. Do not implement code.
