---
name: create-plan
description: Create and publish an approved, source-backed PLAN.md for a medium-to-large implementation that needs solution planning and tracked implementation issues.
disable-model-invocation: true
---

# Solution Planning

Turn the active task's authoritative `BRIEF.md` into an explicitly approved, implementation-ready `PLAN.md`. Research the affected code deeply enough that the plan reuses what exists and leaves no material product, architecture, ownership, reuse, or external-contract decision to implementation. This workflow is for medium-to-large implementations where that planning effort materially reduces risk; do not invoke it autonomously for a small local change.

## 1. Prove The Current System

1. Resolve the active task using `AGENTS.md`. Read `BRIEF.md` and optional `RESEARCH.md` in full, plus governing repository documentation and ADRs.
2. Trace each requested behavior from entry points through current owners, dependencies, data flow, failure paths, callers, and tests, verifying every material claim in source.
3. Read every materially likely affected source file in full, not only matching snippets. Inventory existing functions, methods, classes, types, and tests that implement all or part of the requested behavior. Search both names and behavior: domain terms, transformations, conditions, side effects, call sites, and analogous paths.
4. Build a source-reuse map for each changed behavior. When an owner exists, name the exact existing `path:symbol`, its relevant callers, how planned code will call, extend, modify, move, or remove it, and which parallel implementation must not be created. When none exists, record the searched boundaries and credible candidates before proposing a new behavioral symbol, then state the concrete mismatch that prevents each candidate from satisfying the requirement cleanly. Merely mentioning similar code without directing its reuse or explaining its rejection is incomplete.
5. Use bounded path-scoped Git history only when it can explain a relevant design, revert, migration, compatibility constraint, or recurring regression.

Treat repository precedent as evidence, not authority. If the brief is missing, contradictory, incomplete, or disproven by source, stop and request `/grilling task-NNN <evidence-backed reasons>` rather than correcting it in the plan. Use bounded external research only for concrete unresolved third-party questions.

This step is complete only when the material affected boundaries, existing behavioral owners, relevant callers, and validation paths are known; every changed behavior has an explicit reuse direction or evidence that no owner exists, plus a parallel-implementation guard; and every proposed new behavioral symbol has a source-backed necessity.

## 2. Approve A Solution

Invoke `software-philosophy` in planning mode. Identify the root cause and the boundary that should own each changed decision. Prefer reusing or deepening an existing owner over adding parallel behavior, helpers, wrappers, or layers.

Compare different solutions only when credible alternatives materially change ownership, risk, compatibility, or operations. Judge each by brief coverage, reuse of current code, coupling, change amplification, failure behavior, validation, and concrete security, performance, compatibility, or operational consequences.

Present the evidence, options, trade-offs, and a reasoned recommendation. Challenge the requested mechanism and your own recommendation equally. Use the question tool until the user explicitly approves one technically credible direction and no product, architecture, reuse, or external-contract decision remains for implementation.

## 3. Write The Plan

Write `PLAN.md` using [`PLAN-FORMAT.md`](PLAN-FORMAT.md). Preserve the approved solution and populate one pending `Published Issues` item per PR for the repository-instructed GitHub or GitLab provider.

Make each PR pass `PLAN-FORMAT.md`'s source-evidence, reuse, symbol ownership, ordering, traceability, and validation gates.

Use the fewest coherent PRs that remain safe, reviewable, independently mergeable after dependencies, and within size limits. Keep production behavior with tests that prove it. Do not implement code or silently alter the approved direction; return to solution approval if the design changes materially.

The draft is complete when every `PLAN-FORMAT.md` check passes and a worker can implement it without inventing material product, architecture, ownership, reuse, or external-contract decisions. Do not prescribe local coding mechanics unless that detail prevents a concrete ownership, ordering, compatibility, or safety risk.

## 4. Audit Once

Invoke `plan-auditor` exactly once with the task artifacts, approved solution and trade-offs, full draft, source-reuse map, affected-file inventory, and relevant repository evidence.

Fix meaning-preserving `MECHANICAL` and `PLANNING` findings directly. Present substantive design, evidence, scope, sequencing, or acceptance findings to the user without silently reopening planning. Never invoke the auditor again in the same planning session.

## 5. Publish Issues

Preflight the instructed provider, authentication, repository, issue creation, and task label. Compute each complete PR section's SHA-256 digest and invoke `ticket-master` with the ordered sections and digests. Reread `PLAN.md`, fetch every issue, and verify title, verbatim section, label, dependency, marker, digest, and checked item. Resume partial publication through `ticket-master`; never repair it by inference.

Finish only when every PR has one verified published issue. Do not implement code.
