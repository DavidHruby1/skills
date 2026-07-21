---
name: research
description: Build RESEARCH.md from BRIEF.md using mapped internal investigation and required external evidence when repository facts are insufficient.
disable-model-invocation: true
---

# Research

Turn the active task's `BRIEF.md` into an evidence-backed `RESEARCH.md` for technical planning. Research establishes what is true and unknown; solution selection belongs to planning.

## 1. Frame The Investigation

Resolve the active task using `AGENTS.md` and read its `BRIEF.md` in full. Stop and request `/grilling` when no task or brief exists. Extract the questions needed to understand the current system, constraints, precedent, validation paths, and risks behind every material requirement and acceptance criterion.

Classify two independent axes:

- **Repository impact is localized** when the request stays inside one established ownership boundary and introduces no material cross-boundary flow, schema or migration concern, compatibility obligation, security or concurrency concern, or operational change.
- **Repository impact is broad** otherwise. Broad research may use several `internal-researcher` subagents, each assigned one independently researchable ownership boundary or cross-cutting concern.
- **External evidence is required** whenever material behavior depends on a third-party or platform runtime contract that repository evidence cannot establish. This includes version-specific transaction, isolation, retry, locking, concurrency, consistency, lifecycle, serialization, security, and failure semantics, as well as standards, protocols, current guidance, or conflicting external claims. Repository usage and tests can prove local behavior but do not define an external contract.

Record the classification and its evidence. This step is complete when every material brief item has at least one investigation question and both routing decisions have an explicit rationale.

## 2. Map Before Depth

Invoke one `code-mapper` subagent with the full brief and investigation questions. Require one report covering the narrowest useful set of entrypoints, ownership boundaries, flows, dependencies, tests, configuration, documentation, ADRs, and external integration surfaces.

Check the report before continuing. It is accepted only when every investigation question points to a relevant boundary or is explicitly marked unmapped, every listed file has a reason to inspect it, and the report names uncertainty. Resume the same mapper when the report misses any of these.

This step is complete when one accepted code map can divide deep investigation without requiring each researcher to rediscover repository scope.

## 3. Investigate The Repository

For localized impact, invoke one `internal-researcher`. For broad impact, divide the accepted map into non-overlapping ownership boundaries or cross-cutting concerns and invoke one `internal-researcher` per scope; run independent scopes in parallel. Give every researcher:

- the full brief,
- the full accepted code map,
- one explicit assigned scope,
- the investigation questions it owns.

Check each report against its assignment. Resume a researcher when an owned question lacks a supported answer or explicit unknown, a material claim lacks a repository source, or reported behavior and cited evidence conflict.

This step is complete when every investigation question has one internal owner, every owned question has a supported finding or explicit unknown, and overlaps or contradictions between reports are reconciled or recorded.

## 4. Resolve External Questions

Reassess the external-evidence classification from Step 1 against the accepted code map and internal reports. Add concrete external questions for every newly discovered runtime contract or external dependency. Skip the rest of this step only when external evidence is still not required after that reassessment, and record the updated rationale.

Convert externally dependent findings and unknowns into concrete questions. Include detected dependency or platform versions and the internal facts that determine applicability. For runtime contracts, require authoritative documentation or source applicable to that version. Invoke `external-researcher` with those questions; use separate parallel assignments when questions concern independent technologies or standards.

Accept a report only when every assigned question has an answer or explicit unresolved state, consequential claims cite authoritative sources, and version and applicability to this repository are stated. Resume the researcher when generic advice substitutes for an applicable answer.

This step is complete when every externally dependent planning fact is supported by applicable evidence or remains an explicit unknown with the missing evidence named.

## 5. Synthesize The Research

Read [`RESEARCH-FORMAT.md`](RESEARCH-FORMAT.md), then synthesize accepted reports into the active task's `RESEARCH.md` instead of concatenating them. Repository evidence governs repository behavior; authoritative version-matched evidence governs external contracts. Preserve material conflicts and unknowns.

The research is complete only when the artifact passes every completion check in `RESEARCH-FORMAT.md`, every material brief item is traceable to findings or an explicit unknown, and no subagent has written the artifact.
