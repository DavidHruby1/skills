---
name: grilling
description: Start or resume a relentless grill that crystallizes a plan or design into BRIEF.md.
disable-model-invocation: true
argument-hint: "[task-NNN] [reason]"
---

# Grilling

Start or resume a numbered task and turn an uncertain plan or design into its authoritative `BRIEF.md` through a relentless, decision-by-decision interview.

## 1. Resolve The Task

Apply the task-artifact convention from `AGENTS.md`. When the invocation names one `task-NNN`, require that exact direct child of `.opencode/artifacts/` to exist and resume it; stop for a corrected ID rather than falling back or creating a task when it is missing or ambiguous. Treat any following reason as the focus for reopening the grill, not as an approved decision.

When no task is named, inspect the directories directly under `.opencode/artifacts/`, find the greatest numeric suffix among names matching `^task-[0-9]+$`, and create the next `task-NNN`, padded to at least three digits. Start with `task-001`; never fill a gap or reuse an existing directory. If creation collides with another process, scan again and retry with the new maximum.

Use the selected directory for the entire grill. This step is complete when exactly one existing or newly created task is selected and its path is known.

## 2. Ground The Grill

Choose the grounding branch from the invocation:

- For `/grilling` without a task ID, treat the user's current request and preceding conversation as the seed for the new task. If they do not establish a concrete problem and desired outcome, ask exactly one opening question to establish them before searching the repository. Do not invent a topic or resume the previously greatest task.
- For `/grilling task-NNN <reason>`, first read the existing `BRIEF.md` in full and then every task artifact relevant to the stated reason. Use the reason as a claim to investigate, not as proof that the brief is wrong.

Once the subject is known, read relevant documentation and ADRs under `docs/`. Query an existing `graphify-out/` when broad architecture, relationships, data flow, or scope narrowing is needed, then verify claims in source. Use read, glob, or grep directly for known files, names, strings, and localized questions; use `ast-grep` only when syntax-aware structure improves implementation evidence. Answer factual questions from evidence; ask the user only for product or design decisions.

Build the design tree from the grounded facts. This step is complete when the new or resumed subject is explicit, factual questions are answered, and the unresolved decision branches and their dependencies are known.

## 3. Grill One Branch At A Time

Resolve prerequisite decisions before dependent ones. Ask exactly one question per turn and wait for the answer. Each question includes:

- why the decision matters,
- a concrete scenario or edge case when useful,
- your recommended answer and its main trade-off.

Challenge vague or conflicting terms and propose precise domain language. When a claim conflicts with evidence, show the evidence and ask which intended behavior governs. Probe only material branches: scope, behavior, boundaries, failure cases, invariants, compatibility, security, operations, validation, and acceptance criteria.

This step is complete when every material branch is resolved.

## 4. Crystallize The Brief

Create or update `BRIEF.md` in the active task as answers crystallize. Keep it concise and implementation-neutral, recording:

- the problem and desired outcome,
- canonical domain terms,
- scope, constraints, and invariants,
- resolved decisions and important rejected alternatives,
- concrete acceptance criteria.

As soon as every known branch is resolved and the draft `BRIEF.md` records the resulting design, invoke `brief-auditor` with the active task path, full brief, resolved design tree, and relevant evidence. Do this immediately instead of performing a final self-audit or declaring the grill complete.

Act on the auditor's verdict:

- On `READY`, finish the grilling session.
- On `REWORK`, process every finding by its reported kind. Fix `MECHANICAL` findings such as typos, grammar, formatting, or meaning-preserving wording directly in `BRIEF.md` without asking the user. For each `DECISION` finding involving logic, behavior, scope, contradictions, invariants, or acceptance criteria, return to Step 3 and ask exactly one question at a time until the required decisions are resolved.
- When `REWORK` contains both kinds, apply all mechanical fixes first, then grill the decision findings one at a time.

The grill is complete only when the latest auditor verdict is `READY`, and every material outcome is recorded consistently in the active task's `BRIEF.md`. Stop there; implementation belongs to a later workflow.
