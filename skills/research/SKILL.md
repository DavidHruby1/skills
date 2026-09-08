---
name: research
description: Use proactively during Architecture or Technical Design when a consequential technical question or assumption needs repository or external evidence. Investigate focused questions, verify applicability, and return source-backed findings; also use when the user explicitly requests research.
---

# Research

Gather the missing evidence needed by the current Architecture or Technical Design decision. Supply findings to the calling agent, not a separate deliverable.

## Scope

- Start from the current question, source documents, and existing findings. Identify the decision the research could change and investigate only the evidence needed for it.
- Architecture research concerns system boundaries, responsibilities, integrations, constraints, and consequential trade-offs. Technical Design research concerns implementation contracts, concrete behavior, failure paths, and non-trivial details within the approved architecture.
- Do not create or modify files, manage task folders, choose solutions, implement code, or advance the workflow. The calling command owns its decisions and document.
- Do not repeat research already supported by applicable evidence. Stop when the question is adequately answered or the available sources cannot resolve it.

## Investigation

- Use the smallest sufficient method. Read known files and perform simple lookups directly. Use an `explore` subagent for broad repository discovery, uncertain ownership, or cross-file flows. Use a `researcher` subagent for substantial external investigation and direct DuckDuckGo tools for simple external lookups.
- Run delegated work in the background only when the caller can make useful independent progress without its result. Give every subagent a bounded question, relevant context and versions, expected evidence, and required unresolved uncertainties. Do not duplicate delegated work.
- Prefer the source that owns the claim: repository source, tests, documentation, and ADRs for local behavior; official documentation, specifications, first-party source, and first-party APIs for external contracts. Secondary sources may help discovery but should not establish a consequential claim when an applicable primary source is available.
- Check version, date, configuration, and repository context where they affect applicability. Repository usage does not by itself establish an external platform guarantee.
- Test factual and technical assumptions that could change the current decision. Distinguish verified facts, evidence-based inferences, and unresolved unknowns. Never manufacture certainty when evidence is missing or inaccessible.

## Contradictions

When applicable sources, repository behavior, source documents, or material assumptions contradict each other, stop the current research and workflow before recommending a resolution or producing the phase document.

Tell the user in normal chat:

- what the conflicting claims are;
- the evidence for each claim, with repository locations or full URLs;
- why the conflict matters to the current decision;
- what clarification or decision is needed.

Wait for the user's response before continuing. Do not silently choose one side, average conflicting claims, reinterpret a user-owned decision, or treat the contradiction as resolved because one source appears more authoritative. This gate applies to conflicts relevant to the assigned question; unrelated inconsistencies should be reported separately without expanding scope.

## Return

Return a concise synthesis to the calling agent containing:

- the answer to the research question;
- sources next to the material claims they support;
- applicability to the current repository, versions, and phase;
- implications for the current decision;
- unresolved unknowns and unavailable evidence.

Synthesize findings instead of concatenating subagent reports. Do not create a standalone research artifact: the calling Architecture or Technical Design command is responsible for preserving consequential findings and sources in its own document.
