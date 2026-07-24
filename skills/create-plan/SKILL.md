---
name: create-plan
description: Create and publish an audited, source-backed PLAN.md for a medium-to-large implementation that needs implementation planning and tracked issues.
disable-model-invocation: true
---

# Implementation Planning

Turn the active task's authoritative `BRIEF.md` and optional `RESEARCH.md` into an audited, implementation-ready `PLAN.md`, then publish its tracked issues without a plan-approval gate. Treat their resolved decisions as authoritative imported context. Inspect the affected code deeply enough that the plan reuses what exists and leaves no material product, architecture, ownership, reuse, or external-contract decision to implementation. This workflow is for medium-to-large implementations; do not invoke it autonomously for a small local change.

## 1. Establish The Planning Context

1. Resolve the active task using `AGENTS.md`. Read `BRIEF.md` and optional `RESEARCH.md` in full, plus governing repository documentation and ADRs.
2. Trace each requested behavior from entry points through current owners, dependencies, data flow, failure paths, callers, and tests, verifying every material claim in source.
3. Read every materially likely affected source file in full, not only matching snippets. Inventory existing functions, methods, classes, types, and tests that implement all or part of the requested behavior. Search both names and behavior: domain terms, transformations, conditions, side effects, call sites, and analogous paths.
4. Build a source-reuse map for each changed behavior. When an owner exists, name the exact existing `path:symbol`, its relevant callers, how planned code will call, extend, modify, move, or remove it, and which parallel implementation must not be created. When none exists, record the searched boundaries and credible candidates before proposing a new behavioral symbol, then state the concrete mismatch that prevents each candidate from satisfying the requirement cleanly. Merely mentioning similar code without directing its reuse or explaining its rejection is incomplete.
5. Use bounded path-scoped Git history only when it can explain a relevant design, revert, migration, compatibility constraint, or recurring regression.
6. After reading all available context and evidence, identify only material questions that remain unanswered. Resolve factual repository questions through source investigation and concrete third-party questions through bounded external research. Ask the user the remaining product, architecture, compatibility, ownership, or external-contract questions in one focused batch; do not present alternative solutions or ask for decisions already recorded in the brief or research.

Treat repository precedent as evidence, not authority. Stop for a missing brief. When the brief, research, repository evidence, or user clarification conflict, ask the user to reconcile the exact evidence-backed contradiction rather than silently choosing one account or correcting an authoritative artifact in the plan. Record material answers not already present in task artifacts as planning clarifications in `PLAN.md`.

This step is complete only when the material affected boundaries, existing behavioral owners, relevant callers, and existing validation commands are known; every changed behavior has an explicit reuse direction or evidence that no owner exists, plus a parallel-implementation guard; every proposed new behavioral symbol has a source-backed necessity; and no blocking question or contradiction remains.

## 2. Write The Plan

Write `PLAN.md` using [`PLAN-FORMAT.md`](PLAN-FORMAT.md). Write the entire artifact in English except for the content under `## Human Review`, which must be in Czech while preserving exact source-code identifiers and established technical terms. Translate the authoritative context and any planning clarifications directly into implementation work, give the user a plain-language `Human Review` of every PR, and populate one pending `Published Issues` item per PR for the repository-instructed GitHub or GitLab provider.

Make each PR pass `PLAN-FORMAT.md`'s source-evidence, reuse, symbol ownership, ordering, traceability, and existing-validation gates.

Use the fewest coherent PRs that remain safe, reviewable, independently mergeable after dependencies, independently verifiable with existing commands, and within size limits. Inspect existing tests and record applicable validation commands, but do not plan new test behavior, coverage, levels, scenarios, or test implementation. Do not implement code, silently alter authoritative context, or invent an answer to an unresolved question; return to Step 1 when planning exposes a material gap or contradiction.

The draft is complete when every `PLAN-FORMAT.md` check passes, the user can understand each PR and its important connections from `Human Review`, and a worker can implement it without inventing material product, architecture, ownership, reuse, or external-contract decisions. `Human Review` is explanatory; the detailed PR sections remain the implementation authority. Do not prescribe local coding mechanics unless that detail prevents a concrete ownership, ordering, compatibility, or safety risk.

## 3. Audit Once

Invoke `plan-auditor` exactly once with the task artifacts, planning clarifications, full draft, source-reuse map, affected-file inventory, and relevant repository evidence.

Apply every finding that can be resolved from the authoritative artifacts, repository evidence, or external evidence directly to `PLAN.md`, including meaning-changing corrections required to restore alignment with that evidence. When a finding exposes a genuinely missing product, architecture, compatibility, ownership, or external-contract decision, return to Step 1 and obtain only that decision; this is clarification, not plan approval. Never invoke the auditor again in the same planning session.

The audit is complete only when every finding is either corrected in `PLAN.md` or resolved through the Step 1 clarification path and reflected in `PLAN.md`. Continue directly to publication without presenting the plan for confirmation or requesting approval; human review happens after this workflow completes.

## 4. Publish Issues

Preflight the instructed provider, authentication, repository, issue creation, and task label. Compute each complete PR section's SHA-256 digest and invoke `ticket-master` with the ordered sections and digests. Reread `PLAN.md`, fetch every issue, and verify title, verbatim section, label, dependency, marker, digest, and checked item. Resume partial publication through `ticket-master`; never repair it by inference.

Finish only when every PR has one verified published issue. Do not implement code.
