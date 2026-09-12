---
name: research
description: Use for explicitly requested research or source-backed investigation of a consequential uncertainty affecting the current task or decision. Not for routine lookups, ordinary explanations, or questions already answered by available evidence.
---

# Research

Gather the evidence needed to answer the current research question. Report findings to the user for standalone requests or to the calling agent when supporting another task or workflow.

## Scope

- Start from the current question, supplied context, source documents, and existing findings. Identify the answer or decision the research could change and investigate only the evidence needed for it.
- Match the investigation to the requested subject and scope; no software project or workflow phase is required. When supporting Architecture, investigate system boundaries and consequential trade-offs; when supporting Technical Design, investigate implementation contracts and behavior within the approved architecture.
- Do not create or modify files, manage task folders, make user-owned decisions, implement code, or advance a workflow. A calling workflow owns its decisions and documents.
- Do not repeat research already supported by applicable evidence. Stop when the question is adequately answered or the available sources cannot resolve it.

## Investigation

- Use the smallest sufficient method. Read known files and perform simple lookups directly. Use an `explore` subagent for broad repository discovery, uncertain ownership, or cross-file flows. Use a `researcher` subagent for substantial external investigation and direct DuckDuckGo tools for simple external lookups.
- Run delegated work in the background only when the caller can make useful independent progress without its result. Give every subagent a bounded question, relevant context and versions, expected evidence, and required unresolved uncertainties. Do not duplicate delegated work.
- Prefer the source that owns the claim: original research, official records, or primary data for general questions; repository source, tests, documentation, and ADRs for local behavior; official documentation, specifications, first-party source, and first-party APIs for external contracts. Secondary sources may help discovery but should not establish a consequential claim when an applicable primary source is available.
- Check date, population, jurisdiction, version, configuration, or repository context where they affect applicability. Repository usage does not by itself establish an external platform guarantee.
- Test factual and technical assumptions that could change the answer or decision. Distinguish verified facts, evidence-based inferences, and unresolved unknowns. Never manufacture certainty when evidence is missing or inaccessible.

## Contradictions

When factual or technical sources disagree, first investigate their applicability, dates, versions, configuration, and primary evidence. Resolve the discrepancy when that evidence supports a conclusion, explain why, and continue without asking the user to decide a discoverable fact. Authority alone is not a substitute for checking applicability.

Pause only the affected decision when requirements or accepted user-owned decisions conflict, or when unresolved uncertainty could materially change required behavior, scope, a public contract, or safety. Tell the user:

- what the conflicting claims are;
- the evidence for each claim, with repository locations or full URLs;
- why the conflict matters to the current answer or decision;
- what clarification or decision is needed.

Wait for the user's response before advancing that dependent decision; independent research may continue. Do not silently reinterpret a user-owned decision or manufacture certainty by averaging conflicting claims. If unavailable evidence cannot be resolved by user input, report the uncertainty and its implications rather than asking the user to guess. Report unrelated inconsistencies separately without expanding scope.

## Return

Return a concise synthesis to the user or calling agent containing:

- the answer to the research question;
- sources next to the material claims they support;
- applicability to the user's context and, where relevant, the repository, versions, or phase;
- implications for the current question or decision;
- unresolved unknowns and unavailable evidence.

Synthesize findings instead of concatenating subagent reports. For standalone requests, answer in chat without requiring task artifacts. When supporting a workflow, return findings to its caller, which is responsible for preserving consequential evidence and sources in its own document.
