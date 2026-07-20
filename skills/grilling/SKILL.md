---
name: grilling
description: Start or resume a relentless grill that crystallizes a plan or design into BRIEF.md.
disable-model-invocation: true
argument-hint: "[task-NNN] [reason]"
---

# Grilling

Start or resume a numbered task and turn an uncertain plan or design into its authoritative `BRIEF.md` through a relentless, single-batch interview.

## Interaction Contract

Ask every user-facing question in normal assistant text. Never invoke the `question` tool, an `ask` tool, or any other interactive prompt tool during this workflow.

Before sending questions, investigate and reason through the entire known design tree. Then send one comprehensive questionnaire containing every known material question, including dependent questions phrased conditionally. Do not split known questions across messages or hold questions back for a later round.

Number the questions. Under each question, provide concrete answer choices labeled exactly `a)`, `b)`, `c)`, and add further lettered choices only when materially necessary. Mark the recommended choice and its main trade-off in the same text. Tell the user they can reply compactly, for example `1a, 2c, 3b`, and may replace any choice with their own answer.

## 1. Resolve The Task

Apply the task-artifact convention from `AGENTS.md`. When the invocation names one `task-NNN`, require that exact direct child of `.opencode/artifacts/` to exist and resume it; stop for a corrected ID rather than falling back or creating a task when it is missing or ambiguous. Treat any following reason as the focus for reopening the grill, not as an approved decision.

When no task is named, inspect the directories directly under `.opencode/artifacts/`, find the greatest numeric suffix among names matching `^task-[0-9]+$`, and create the next `task-NNN`, padded to at least three digits. Start with `task-001`; never fill a gap or reuse an existing directory. If creation collides with another process, scan again and retry with the new maximum.

Use the selected directory for the entire grill. This step is complete when exactly one existing or newly created task is selected and its path is known.

## 2. Ground The Grill

Choose the grounding branch from the invocation:

- For `/grilling` without a task ID, treat the user's current request and preceding conversation as the seed for the new task. If they do not establish a concrete problem and desired outcome, ask all opening questions needed to establish them in one text questionnaire following the Interaction Contract before searching the repository. Do not invent a topic or resume the previously greatest task.
- For `/grilling task-NNN <reason>`, first read the existing `BRIEF.md` in full and then every task artifact relevant to the stated reason. Use the reason as a claim to investigate, not as proof that the brief is wrong.

Once the subject is known, read relevant documentation and ADRs under `docs/`. Query an existing `graphify-out/` when broad architecture, relationships, data flow, or scope narrowing is needed, then verify claims in source. Use read, glob, or grep directly for known files, names, strings, and localized questions; use `ast-grep` only when syntax-aware structure improves implementation evidence. Answer factual questions from evidence; ask the user only for product or design decisions.

Infer the narrowest reasonable scope that achieves the user's stated outcome. Treat adjacent improvements discovered during investigation as outside that scope unless they are necessary to achieve the outcome; ask before expanding into them.

Build the design tree from the grounded facts. This step is complete when the new or resumed subject is explicit, factual questions are answered, and the unresolved decision branches and their dependencies are known.

## 3. Grill In One Batch

First think through the grounded facts, every unresolved decision branch, and their dependencies. Send one comprehensive text questionnaire following the Interaction Contract. Include dependent questions in that same questionnaire using explicit conditions such as "If you choose 2a..." rather than postponing them. Each question includes:

- why the decision matters,
- a concrete scenario or edge case when useful,
- your recommended answer and its main trade-off.

Challenge vague or conflicting terms and propose precise domain language. When a claim conflicts with evidence, show the evidence and ask which intended behavior governs. Probe only material branches within that scope: behavior, boundaries, failure cases, invariants, compatibility, security, operations, validation, and acceptance criteria.

After the user responds, re-evaluate the whole decision tree. If the answers are sufficient, proceed directly to crystallizing the brief. Ask a follow-up questionnaire only when an answer introduced a material branch that could not reasonably have been anticipated; include every newly material question in that single text message and follow the Interaction Contract again. Never use follow-ups to ask a known question that should have been included in the first questionnaire.

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
- On `REWORK`, process every finding by its reported kind. Fix `MECHANICAL` findings such as typos, grammar, formatting, or meaning-preserving wording directly in `BRIEF.md` without asking the user. For `DECISION` findings involving logic, behavior, scope, contradictions, invariants, or acceptance criteria, return to Step 3 and ask all unresolved decision questions in one text questionnaire following the Interaction Contract.
- When `REWORK` contains both kinds, apply all mechanical fixes first, then put every decision finding into one text questionnaire following the Interaction Contract.

The grill is complete only when the latest auditor verdict is `READY`, and every material outcome is recorded consistently in the active task's `BRIEF.md`. Stop there; implementation belongs to a later workflow.
