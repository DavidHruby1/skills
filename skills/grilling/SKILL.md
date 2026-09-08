---
name: grilling
description: Use proactively during Architecture or Technical Design when unclear requirements, conflicting assumptions, or consequential open decisions need user input. Gather grounded context through focused batches of questions; also use when the user explicitly requests grilling or a decision stress-test.
---

# Grilling

Build shared understanding through a focused, evidence-backed conversation. Supply context to the calling agent, not a separate deliverable.

## Scope

- Architecture and Technical Design are separate, isolated commands. Use only the current conversation and available source documents; never assume access to a previous phase's conversation.
- Establish the current goal, phase, relevant inputs, and settled decisions from that context. If the subject is unclear, ask opening questions before exploring the codebase.
- Stay within the current phase: Architecture resolves system boundaries, responsibilities, flows, and consequential trade-offs; Technical Design resolves implementation contracts and non-trivial details needed to implement the approved architecture.
- Do not reopen settled decisions without new evidence, a concrete contradiction, or an explicit user request. Ask before expanding scope.
- Do not create or modify files, produce a standalone brief or report, manage task folders, implement code, or select or start another workflow. The calling command owns its documentation and continuation.

## Grounding

- Reuse existing research and supplied evidence. Read only the documentation, ADRs, source, and tests needed to resolve facts that could materially affect the current decision.
- Use `explore` subagents for broad codebase discovery, uncertain ownership, or cross-file flow investigation. Give each a bounded question and require source locations and unresolved uncertainty. Read a known file or look up a specific symbol directly; do not delegate every lookup or duplicate delegated work.
- If broader research is necessary, use the available Research skill when applicable. Do not assume a skill or agent exists. A missing tool is not evidence that an unknown is resolved.
- Distinguish verified facts, evidence-based inferences, and unverified assumptions. Cite concrete sources for claims that determine the choice; verify consequential subagent claims against their cited evidence as needed.
- Treat user-owned goals and priorities as binding, but test factual and technical claims, including those in approved documents. Show contradictions and ask about their product or design implications rather than silently rewriting decisions.
- Find discoverable facts yourself. Ask the user for unavailable context or priorities, not information already accessible in the repository. Admit missing or conflicting evidence; never fabricate certainty to unblock a decision.
- Stop investigating when the material choices are sufficiently grounded. Do not explore adjacent improvements or hypothetical variants for completeness.

## Question Rounds

Track unresolved material decisions and their dependencies internally. A question is material when its answer could change required behavior, scope, a contract, implementation boundaries, validation, or safety. Ask about consequential trade-offs that depend on user priorities; resolve low-risk, reversible local details from evidence and established conventions.

The frontier contains questions whose prerequisites are settled. Ask the currently answerable questions in coherent batches, not one interactive prompt at a time. Do not impose a fixed question count or unnecessarily split a coherent batch. Questions that depend on unanswered questions belong to a later round.

If an independent investigation is running, ask the ready questions while its dependent questions wait. Do not present choices that require evidence you have not received.

For each question:

- Explain what needs deciding and why it matters. Challenge vague terms and conflicting assumptions; use a concrete scenario when helpful.
- Offer choices only when useful, labeled `a)`, `b)`, and so on. Include only credible alternatives that a reasonable user could prefer under a concrete condition. Describe them neutrally, with comparable detail about behavior, benefit, cost, and when they fit.
- Do not invent alternatives to reach a count. If evidence establishes one technically dominant choice or a safe local default, explain the conclusion instead of asking a performative question. Do not use a default to conceal a consequential user-owned decision.
- Put the recommendation after the question and options. State its evidence or reasoning and main trade-off. Make it conditional when priorities are unknown; if no recommendation is justified, say what is missing instead of guessing.

Ask every question in normal assistant chat. Never use `question`, `ask`, or another interactive prompt tool. Use this format, in the user's language:

```markdown
❓ **Q1** - **<question title>**: <question body and why it matters; include choices when useful>

➡️ <recommended answer, its basis, and main trade-off; or why a recommendation is not yet justified>

---

❓ **Q2** - **<question title>**: <question body and optional choices>

➡️ <recommended answer, its basis, and main trade-off; or why a recommendation is not yet justified>
```

Tell the user once that compact answers such as `1a, 2c` are welcome and that they can provide their own answer instead. Wait for their answers before advancing dependent decisions. After each response, update only unresolved material branches; reopen answered questions only when new evidence changes their implications.

## Completion

Finish when no material uncertainty blocks the current phase. Hypothetical, unreachable, low-impact, safely defaulted, and explicitly deferred details do not block completion. A missing fact that could materially change the decision still blocks that decision; do not relabel it as a harmless assumption.

Briefly confirm the resolved understanding and any consequential assumptions or deferred topics in chat, and let the user confirm or correct it before the calling command continues. This is conversational confirmation, not a separate artifact or formal report. If the user's latest response already explicitly confirms that understanding, do not ask for redundant approval. Return control to the current command without writing its document or transitioning to another phase.
