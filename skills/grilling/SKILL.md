---
name: grilling
description: Use when unclear requirements, conflicting assumptions, or consequential open decisions need an evidence-backed interactive discussion. Also use when the user explicitly requests grilling or a decision stress-test.
---

# Grilling

Build shared understanding through a focused, evidence-backed conversation.

## Boundaries

- Infer the active goal and decision scope from the current assignment and context. Stay within that scope. Ask only when an ambiguity could materially change it.
- Do not reopen settled decisions without new evidence, a concrete contradiction, or an explicit user request.
- Do not expand the task, create or modify files, produce a separate deliverable, implement code, or start another workflow.

## Grounding

- Reuse existing research and supplied evidence. Read only the documentation, ADRs, source, and tests needed to resolve facts that could materially affect the current decision.
- Use `explore` subagents for broad codebase discovery, uncertain ownership, or cross-file flow investigation. Give each a bounded question and require source locations and unresolved uncertainty. Read a known file or look up a specific symbol directly; do not delegate every lookup or duplicate delegated work.
- If broader research is necessary, use the available Research skill when applicable. Do not assume a skill or agent exists. A missing tool is not evidence that an unknown is resolved.
- Distinguish verified facts, evidence-based inferences, and unverified assumptions. Cite concrete sources for claims that determine the choice; verify consequential subagent claims against their cited evidence as needed.
- Treat user-owned goals and priorities as binding. Evaluate factual and technical claims neutrally by looking for supporting, conflicting, and missing evidence. Challenge a claim only when concrete evidence or a concrete failure scenario materially contradicts it; a trade-off or hypothetical edge case is not automatically a defect. Ask about the implications rather than silently rewriting decisions.
- Find discoverable facts yourself. Ask the user for unavailable context or priorities, not information already accessible in the repository. Admit missing or conflicting evidence; never fabricate certainty to unblock a decision.
- Stop investigating when the material choices are sufficiently grounded. Do not explore adjacent improvements or hypothetical variants for completeness.

## Question Rounds

Track unresolved material decisions and their dependencies internally. A question is material when its answer could change required behavior, scope, a contract, implementation boundaries, validation, or safety.

Classify each unresolved decision before asking about it:

- **Critical:** The answer could materially change behavior, scope, contracts, ownership, invariants, safety, or another consequential decision. Ask an open question without options or a recommendation.
- **Non-critical:** The decision is local, low-risk, and reversible. Resolve it from evidence and established conventions when possible. When user input is useful, options and a recommendation are allowed.

When the current task defines required decision areas or a coverage checklist, use them to guide the conversation. Cover every applicable area, but follow decision dependencies rather than a rigid section order. Do not repeat areas already resolved by source or previous answers.

The frontier contains questions whose prerequisites are settled. Ask the currently answerable questions in coherent batches, not one interactive prompt at a time. Do not impose a fixed question count or unnecessarily split a coherent batch. Questions that depend on unanswered questions belong to a later round.

If an independent investigation is running, ask the ready questions while its dependent questions wait. Do not present choices that require evidence you have not received.

For each question:

- State the concrete current situation, the exact decision needed from the user, the observable consequence of that decision, and the expected shape of the answer. Explain unfamiliar symbols and terminology in context. Challenge vague terms and conflicting assumptions with concrete evidence or a concrete scenario.
- For a critical decision, ask the user to supply the decision. Do not anchor the answer with options, a proposed design, or a recommendation.
- For a non-critical decision, first identify the right number of genuinely distinct and credible options for the decision and its real trade-offs. There is no fixed count. Avoid both omitting material alternatives and padding the list with weak or minor variations. Describe the options neutrally and with comparable detail, then evaluate them and put the recommendation after the options.
- Never use a safe local default to conceal a critical decision.

Ask every question in normal assistant chat. Never use `question`, `ask`, or another interactive prompt tool. Use this format, in the user's language:

For a critical question, use this format:

```markdown
❓ **Q1** - **<question title>**: <concrete context, the decision needed, its consequence, and the expected answer>
```

For a non-critical question with credible alternatives, put each option on its own line so the user can answer compactly:

```markdown
❓ **Q2** - **<question title>**: <concrete context, the decision needed, and its consequence>

a) **<option>**: <behavior, benefit, cost, and when it fits>
b) **<option>**: <behavior, benefit, cost, and when it fits>
<additional options when needed>

=> <recommended answer, its basis, and main trade-off>
```

Tell the user once that compact answers such as `2b` are welcome for questions with options and that they can always provide their own answer instead. Wait for their answers before advancing dependent decisions. After each response, update only unresolved material branches; reopen answered questions only when new evidence changes their implications.

## Completion

Finish when all material questions and ambiguities are resolved, the resulting decisions are mutually consistent, and no material contradiction remains.
