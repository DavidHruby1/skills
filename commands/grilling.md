---
description: Start a grill from an optional specification or resume an explicitly named task, crystallize BRIEF.md, and recommend the next workflow.
argument-hint: "[specification | task-NNN [reason-or-specification]]"
agent: build
---

# Grilling

Invocation arguments: `$ARGUMENTS`.

Start a numbered task from an optional specification or resume an explicitly named task and turn the input into `BRIEF.md` through a relentless interview of one complete text batch and, only for newly emerged branches, at most one follow-up batch. Assess whether research would help, then classify the resolved work as small, medium, or large so the user knows the recommended next workflow.

## Interaction Contract

Ask every user-facing question in normal assistant text. Never invoke the `question` tool, an `ask` tool, or any other interactive prompt tool during this workflow.

Before sending questions, investigate and reason through the entire known design tree. Then send one comprehensive questionnaire containing every known material question, including dependent questions phrased conditionally. Do not split known questions across messages or hold questions back for a later round.

The entire grill has a budget of one complete questionnaire and at most one follow-up questionnaire for newly emerged branches. Any opening questionnaire in Step 2 consumes the complete questionnaire; any later questionnaire is the single permitted follow-up.

Number the questions. Under each question, present every materially credible, non-dominated choice, labeled sequentially `a)`, `b)`, and so on. Do not invent choices to reach a fixed count. Describe each choice neutrally and with comparable specificity: its behavior, main benefit, main cost, and the realistic condition under which it is preferable. When technical expertise or evidence supports a recommendation, place it after the options under a separate `Recommendation:` label and cite the basis; keep the options neutral. If only one credible choice remains, explain the evidence-backed conclusion instead of asking a performative question. Tell the user they can reply compactly, for example `1a, 2c`, and may replace any choice with their own answer.

## 1. Resolve The Task

Parse the invocation deterministically. When its first whitespace-delimited token exactly matches `^task-[0-9]+$`, treat it as a resume request and all remaining text as the reason or new specification to investigate. Otherwise treat all arguments as the specification for a new task. An empty invocation starts a new task from the current request and preceding conversation.

Apply the task-artifact convention from `AGENTS.md`. For a resume request, require that exact direct child of `.opencode/artifacts/` to exist; stop for a corrected ID rather than falling back or creating a task when it is missing or ambiguous. Treat following text as a claim and focus for reopening the grill, not as an approved decision.

When no task is named, inspect the directories directly under `.opencode/artifacts/`, find the greatest numeric suffix among names matching `^task-[0-9]+$`, and create the next `task-NNN`, padded to at least three digits. Start with `task-001`; never fill a gap or reuse an existing directory. If creation collides with another process, scan again and retry with the new maximum.

Use the selected directory for the entire grill. This step is complete when exactly one existing or newly created task is selected and its path is known.

## 2. Ground The Grill

Choose the grounding branch from the invocation:

- For a new task, treat the full invocation specification, the user's current request, and preceding conversation as its seed. If they do not establish a concrete problem and desired outcome, ask all opening questions needed to establish them in the complete text questionnaire following the Interaction Contract before searching the repository. Do not invent a topic or resume the previously greatest task.
- For `/grilling task-NNN <reason>`, first read the existing `BRIEF.md` in full and then every task artifact relevant to the stated reason. Use the reason as a claim to investigate, not as proof that the brief is wrong.

Once the subject is known, read relevant documentation, ADRs, source, and tests. Answer factual questions and resolve technically dominant choices from evidence; ask the user only for product or design decisions that depend on their priorities.

Treat user-owned normative product decisions as binding. Test factual and technical assumptions, including those already recorded in `BRIEF.md`, against repository evidence. Show contradictions to the user and obtain their decision on the resulting product implications; preserve that decision in the brief rather than silently rewriting it.

Infer the narrowest reasonable scope that achieves the user's stated outcome. Treat adjacent improvements discovered during investigation as outside that scope unless they are necessary to achieve the outcome; ask before expanding into them.

Build the design tree from the grounded facts. This step is complete when the new or resumed subject is explicit, factual questions are answered, and the unresolved decision branches and their dependencies are known.

## 3. Grill In One Batch

Use the grounded design tree to send the questionnaire defined by the Interaction Contract. If Step 2 already consumed the complete questionnaire, this questionnaire is permitted only for material branches newly emerged from its answers and repository grounding, and it consumes the single follow-up. Before including a choice, verify that a reasonable user could prefer it under a concrete condition; remove choices that are merely weaker versions of another choice. Explain why each decision matters and add a concrete scenario when useful. Challenge vague or conflicting terms, propose precise domain language, and show contrary evidence. Probe only material behavior, boundaries, failures, invariants, compatibility, security, operations, validation, and acceptance criteria within scope.

After the user responds, re-evaluate the whole decision tree. If the answers are sufficient, proceed to the assessments and crystallize the brief. If the follow-up budget remains, ask it only when an answer introduced a material branch that could not reasonably have been anticipated; include every newly material question in that single text message and follow the Interaction Contract again. Never use the follow-up to ask a known question that should have been included in the first questionnaire.

This step is complete when every material branch is resolved.

## 4. Assess Research Need

Determine whether `/research` is recommended from the brief, delivery size, and grounding evidence; do not ask the user:

- **Recommended:** material planning or implementation facts remain unresolved and would benefit from mapped repository investigation or authoritative external evidence. This includes uncertain ownership or cross-boundary flows and third-party or platform contracts that repository evidence cannot establish.
- **Not recommended:** repository evidence already establishes the relevant system behavior, ownership, constraints, validation paths, and external contracts well enough to proceed without a separate research artifact.

Research is optional and never a blocking gate. Record exactly this block in `BRIEF.md`:

```markdown
## Research Assessment
- Research: Recommended | Not recommended
- Rationale: <evidence>
- Recommended next workflow: /research | Direct implementation | /create-plan
```

Account for delivery size when selecting the workflow: recommend `/research` when its evidence benefit warrants a separate research artifact; otherwise recommend Direct implementation for small delivery or `/create-plan` for medium or large delivery.

## 5. Assess Delivery Size

Classify the resolved work from the initial request, decisions, and repository evidence; do not ask the user or rely on line count alone:

- **Small:** one narrow behavior home or boundary; one focused implementation. Recommend direct implementation.
- **Medium:** coordinated symbols, callers, or one component boundary. Recommend `/create-plan`.
- **Large:** multiple ownership or component boundaries, migration, public contracts, rollout, or dependent stages. Recommend `/create-plan`.

Record the size, concise evidence, and delivery workflow in `BRIEF.md`. Use the highest category supported by a concrete coordination risk, not a hypothetical one.

## 6. Crystallize The Brief

Create or update `BRIEF.md` in the active task as answers crystallize. Write the entire artifact in English, preserving exact source-code identifiers and established technical terms. Keep it concise and implementation-neutral, recording:

- the problem and desired outcome,
- canonical domain terms,
- scope, constraints, and invariants,
- resolved decisions and important rejected alternatives,
- concrete acceptance criteria,
- a `Delivery Assessment` containing `Size: Small | Medium | Large`, concise evidence, and `Delivery workflow: Direct implementation | /create-plan`,
- the exact `Research Assessment` block from Step 4.
- exactly one durable `<!-- brief-auditor: not-run | invoked | resolved -->` marker with one selected state,
- one adjacent `<!-- brief-audit-findings: pending | None | <verbatim unresolved findings> -->` record with one selected value.

When every known branch is resolved and recorded, consult the marker. If it is `not-run`, change it to `invoked` immediately before invoking `brief-auditor` exactly once over the lifetime of the active task with the full brief, design tree, and evidence. Immediately after it returns, persist its unresolved findings verbatim in the adjacent findings record before doing other work. `REWORK` is a hard gate. Correct every `MECHANICAL` and `EVIDENCE` finding from evidence; obtain a user decision for every `DECISION` finding; reflect each resolution in `BRIEF.md` and remove it from the record. Set the record to `None` and the marker to `resolved` only after all findings are resolved. Never rerun `brief-auditor`, including after corrections or resumed refinement. A resumed task uses the persisted findings. The grill cannot complete while the findings record is not `None` or the marker is not `resolved`.

The grill is complete after every finding from the single audit is resolved and the active task's `BRIEF.md` contains the current material outcome and evidence-backed research and delivery assessments. Report the research recommendation, size, and recommended next workflow to the user, then stop; research remains an optional, explicit user-invoked workflow, and planning and implementation belong to later workflows.
