---
description: Develop and audit a source-backed implementation specification through user-led design.
argument-hint: <task-xxx or task directory>
agent: build
---

# Spec Design

Invocation arguments: `$ARGUMENTS`.

Create and audit `.opencode/tasks/task-xxx/SPEC.md`. Produce only the specification; do not implement, plan PRs, commit, publish, or start `/implement`.

## Establish Context

1. Resolve exactly one task from `$ARGUMENTS`. Require its `PROPOSAL.md` and template `SPEC.md`; ask before replacing specification content beyond the generated template.
2. Treat the proposal's outcome, scope, constraints, and non-goals as binding, and its design hypothesis as unverified. Evaluate the hypothesis neutrally: confirm supported parts, investigate uncertain parts, and challenge only concrete contradictions or reachable failures supported by source. Do not manufacture objections or alternatives.
3. Use bounded `explore` agents for distinct affected flows or boundaries when discovery is broad enough to benefit. Require each report to separate:
   - **Must read:** runtime or user-flow entrypoints; owners of the main business or domain logic; public or cross-module contracts, types, interfaces, and schemas; state and persistence owners; validation, authorization, and invariant enforcement; integration boundaries and error mapping; and direct callers or consumers that constrain the design. For each file or symbol, state why the main agent must read it and which decision it constrains.
   - **Summary sufficient:** repetitive callers, conventional wiring, generated code, incidental helpers, unchanged neighboring modules, and other files whose relevant facts can be stated with exact source locations without hiding a consequential decision.
   - **Uncertainty:** facts or ownership that source discovery did not establish reliably.
4. Personally read the complete consequential source identified as must-read. Treat summaries as navigation, not authority; read any summary-only source before relying on it for a consequential decision. Resolve discoverable facts yourself rather than asking the user.

## Align The Design

Load `grilling` before asking the first design question. Load `software-philosophy` when evaluating module responsibilities, interfaces, dependency boundaries, data guarantees, or architectural trade-offs. Load `anti-over-engineering` before accepting added abstractions, dependencies, guards, retries, fallbacks, scope expansion, or other additional complexity. Do not load a skill when its decision lens is not relevant.

Use the existing `SPEC.md` template as the required grilling agenda. Work through its sections in order. For each applicable section, combine the proposal, verified source, and settled decisions; identify its remaining material questions and ambiguities; and use grilling until they are resolved before advancing. Skip an inapplicable section rather than manufacturing content. Follow a dependency into another section when necessary, then return to the current section. Revisit an earlier section when a later decision changes it.

The user owns every consequential decision: behavior and scope; responsibilities, boundaries, and ownership; introduced or materially changed public or cross-module types, functions, methods, classes, and state; invariants; validation and authorization; errors, side effects, persistence, concurrency, compatibility, and acceptance. Ask an open question before suggesting an answer. Explain in plain language the concrete context, scenario, decision needed, and why it matters; do not use unexplained contract terminology. Test the user's answer against source and settled decisions. If it fails, show the evidence and failure mechanism, then let the user revise it or explicitly accept the consequence. Do not replace it with your own design unless asked.

For non-consequential, reversible choices, resolve established conventions directly or follow grilling's option and recommendation rules.

Keep questions focused enough for roughly thirty minutes: batch related questions, never ask for source facts, and avoid harmless private mechanics. Do not trade completeness for the time budget: if consequential decisions remain, leave the specification in `draft` rather than inventing them.

After the last section, check the complete decision set across sections. Return to targeted grilling if contracts, flows, state, errors, acceptance, or other decisions conflict. Grilling is complete only under its completion rule.

## Write And Audit

After alignment, write the complete `SPEC.md` directly from the resolved decisions and verified source. Do not delegate any part of its writing. Supply factual current state, references, connective prose, traceability, and harmless local discretion, but introduce no new consequential design. Remove inapplicable template sections, keep the document as short as completeness allows, and mark it `draft`.

Read the complete written specification back and verify it against the proposal, inspected source, and decisions from grilling. Correct transcription, consistency, and evidence defects directly. Return to targeted grilling if correction requires a new consequential decision.

Invoke `spec-auditor` in fresh context with the project root and exact `PROPOSAL.md` and `SPEC.md` paths. For `REWORK`, correct evidence-backed document defects directly and use a short, section-targeted grilling round only when a missing consequential decision requires the user. Then resume the same auditor. Stop on unresolved `BLOCKED`; never substitute another reviewer or claim a pass.

After audit `PASS`, mark the specification `accepted` and finish with only its path and audit result.
