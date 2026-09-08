---
description: Start a grill from an optional specification or resume an explicitly named task, crystallize BRIEF.md, and recommend the next workflow.
argument-hint: "[specification | task-NNN [reason-or-specification]]"
agent: build
---

# Grilling

Invocation arguments: `$ARGUMENTS`.

Start a numbered task from an optional specification or resume an explicitly named task and turn the input into `BRIEF.md` through a focused, evidence-backed interview. Assess whether research would help, then classify the resolved work as small, medium, or large so the user knows the recommended next workflow.

## Interaction Contract

Ask every user-facing question in normal assistant text. Never invoke the `question` tool, an `ask` tool, or any other interactive prompt tool during this workflow.

Reach the user's stated goal by the shortest, simplest coherent path. Keep the grill strictly within the scope required for that outcome: do not explore speculative extensions, hypothetical future needs, or edge cases that are implausible or immaterial to the requested behavior. Ask a question only when its answer can materially change the smallest valid solution; prefer a reasonable evidence-backed default when the choice is low-risk and reversible. If evidence does not show a material consequence, use the simplest reasonable default and do not ask about it. Do not seek completeness for its own sake or turn the grill into architecture design.

Before sending each questionnaire, identify only unresolved decision branches whose outcome could materially change the requested behavior, implementation boundary, validation, or safety. Investigate enough to distinguish material branches from hypothetical or low-impact ones, but do not enumerate every conceivable branch or design variation. Include currently known questions that are necessary to avoid a materially wrong outcome, with dependent questions phrased conditionally. Do not split questions that can already be asked together or hold material questions back for a later round. Use as few focused questionnaires as the necessary decision tree permits; there is no fixed round limit.

Number the questions. Under each question, present only materially credible, non-dominated choices that would change the requested behavior or a user-owned product decision, labeled sequentially `a)`, `b)`, and so on. Do not list hypothetical alternatives, internal implementation variations, or choices that differ only in unnecessary complexity. Do not invent choices to reach a fixed count. Describe each choice neutrally and with comparable specificity: its behavior, main benefit, main cost, and the realistic condition under which it is preferable. When technical expertise or evidence supports a recommendation, place it after the options under a separate `Recommendation:` label and cite the basis; keep the options neutral. If only one credible choice or a safe default remains, explain the evidence-backed conclusion instead of asking a performative question. Tell the user they can reply compactly, for example `1a, 2c`, and may replace any choice with their own answer.

## 1. Resolve The Task

Parse the invocation deterministically. When its first whitespace-delimited token exactly matches `^task-[0-9]+$`, treat it as a resume request and all remaining text as the reason or new specification to investigate. Otherwise treat all arguments as the specification for a new task. An empty invocation starts a new task from the current request and preceding conversation.

When the parsed specification is non-empty, preserve it verbatim in `BRIEF.md` under `## User Spec`, and make that the first section in the file. For a resume request, preserve only the text after `task-NNN`, not the task ID. Create this section only when it does not already exist; never overwrite or duplicate an existing `## User Spec`. An empty invocation does not create the section.

Apply the task-artifact convention from `AGENTS.md`. For a resume request, require that exact direct child of `.opencode/artifacts/` to exist; stop for a corrected ID rather than falling back or creating a task when it is missing or ambiguous. Treat following text as a claim and focus for reopening the grill, not as an approved decision.

When no task is named, inspect the directories directly under `.opencode/artifacts/`, find the greatest numeric suffix among names matching `^task-[0-9]+$`, and create the next `task-NNN`, padded to at least three digits. Start with `task-001`; never fill a gap or reuse an existing directory. If creation collides with another process, scan again and retry with the new maximum.

Use the selected directory for the entire grill. This step is complete when exactly one existing or newly created task is selected and its path is known.

## 2. Ground The Grill

Choose the grounding branch from the invocation:

- For a new task, treat the full invocation specification, the user's current request, and preceding conversation as its seed. If they do not establish a concrete problem and desired outcome, ask the opening questions needed to establish them following the Interaction Contract before searching the repository. Do not invent a topic or resume the previously greatest task.
- For `/grilling task-NNN <reason>`, first read the existing `BRIEF.md` in full and then every task artifact relevant to the stated reason. Use the reason as a claim to investigate, not as proof that the brief is wrong.

Once the subject is known, read only the documentation, ADRs, source, and tests needed to establish facts that can affect the requested outcome. Answer factual questions and resolve technically dominant choices from evidence; ask the user only for product or design decisions that depend on their priorities. Stop investigating when the material decision surface and smallest valid solution are sufficiently grounded.

Treat user-owned normative product decisions as binding. Test factual and technical assumptions that can materially affect the requested outcome, including those already recorded in `BRIEF.md`, against repository evidence. Show contradictions to the user and obtain their decision on the resulting product implications; preserve that decision in the brief rather than silently rewriting it.

Infer the narrowest reasonable scope that achieves the user's stated outcome. Treat adjacent improvements discovered during investigation as outside that scope unless they are necessary to achieve the outcome; ask before expanding into them.

Build the design tree from the grounded facts. This step is complete when the new or resumed subject is explicit, factual questions are answered, and the unresolved decision branches and their dependencies are known.

## 3. Grill In Focused Batches

Use the grounded design tree to send the questionnaire defined by the Interaction Contract. Before including a choice, verify that a reasonable user could prefer it under a concrete condition; remove choices that are merely weaker versions of another choice. Explain why each decision matters and add a concrete scenario when useful. Challenge vague or conflicting terms, propose precise domain language, and show contrary evidence. Probe behavior, boundaries, failures, invariants, compatibility, security, operations, validation, and acceptance criteria only when the category is relevant to the current scope and there is a concrete, credible consequence. Treat these categories as possible impact areas, not a completeness checklist. A failure or edge case is material only when it is reachable under supported inputs or environments, explicitly required, likely in actual use, or capable of causing meaningful harm to correctness, data, security, compatibility, operations, or acceptance. Otherwise use a reasonable default or record it as out of scope.

After each user response, re-evaluate only the unresolved material branches. If the answers establish the smallest coherent solution and its acceptance criteria, proceed to the assessments and crystallize the brief even if hypothetical branches remain. Otherwise ask another focused questionnaire containing every currently unresolved material question. Do not repeat a resolved question unless new evidence creates a concrete contradiction or changes its implications.

This step is complete when every material branch supported by a concrete requirement, repository fact, reachable supported scenario, or credible consequential risk is resolved. Hypothetical, unreachable, low-impact, and safely defaulted branches do not block completion.

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

- the invocation specification under `## User Spec` as the first section when required by Step 1,
- the problem and desired outcome,
- canonical domain terms,
- scope, constraints, and invariants,
- resolved decisions and important rejected alternatives,
- concrete acceptance criteria,
- a `Delivery Assessment` containing `Size: Small | Medium | Large`, concise evidence, and `Delivery workflow: Direct implementation | /create-plan`,
- the exact `Research Assessment` block from Step 4.
- exactly one durable `<!-- brief-auditor: not-run | invoked | resolved -->` marker with one selected state,
- one adjacent `<!-- brief-audit-findings: pending | None | <verbatim unresolved findings> -->` record with one selected value.

When every material branch is resolved and recorded, consult the marker. A material branch must be supported by a concrete requirement, repository fact, reachable supported scenario, or credible consequential risk; speculative, unreachable, low-impact, and safely defaulted cases are not findings. If the marker is `not-run`, change it to `invoked` immediately before invoking `brief-auditor` exactly once over the lifetime of the active task with the full brief, design tree, and evidence. Immediately after it returns, persist its unresolved findings verbatim in the adjacent findings record before doing other work. `REWORK` is a hard gate for material findings only. Correct every `MECHANICAL` and `EVIDENCE` finding from evidence; obtain a user decision for every `DECISION` finding; reflect each resolution in `BRIEF.md` and remove it from the record. Set the record to `None` and the marker to `resolved` only after all findings are resolved. Never rerun `brief-auditor`, including after corrections or resumed refinement. A resumed task uses the persisted findings. The grill cannot complete while the findings record is not `None` or the marker is not `resolved`.

The grill is complete after every finding from the single audit is resolved and the active task's `BRIEF.md` contains the current material outcome and evidence-backed research and delivery assessments. Report the research recommendation, size, and recommended next workflow to the user, then stop; research remains an optional, explicit user-invoked workflow, and planning and implementation belong to later workflows.
