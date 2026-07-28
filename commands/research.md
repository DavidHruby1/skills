---
description: Build RESEARCH.md from BRIEF.md using routed internal or external investigation and material assumption falsification.
argument-hint: "[task-NNN]"
agent: build
---

# Research

Invocation arguments: `$ARGUMENTS`.

Run only when the user explicitly invokes `/research`. Turn the active task's `BRIEF.md` into an evidence-backed `RESEARCH.md` for technical planning. BRIEF.md controls intended behavior. User-owned decisions remain binding, while factual assumptions must be challenged when repository or authoritative external evidence contradicts them.

## 1. Frame The Investigation

Resolve the active task using `AGENTS.md` and read its `BRIEF.md` in full. Stop and request `/grilling` when no task or brief exists. Extract planning-relevant unknowns and factual or technical assumptions whose failure could change planning, an implementation contract, ownership, compatibility, security, or validation. Do not reopen normative product decisions.

Classify two independent axes and derive the investigation route:

- **Repository investigation is not required** when every material research question is external and the brief already supplies enough repository context to establish applicability.
- **Repository impact is localized** when repository questions stay inside one established ownership boundary and introduce no material cross-boundary flow, schema or migration concern, compatibility obligation, security or concurrency concern, or operational change.
- **Repository impact is broad** otherwise. Broad research may use several `internal-researcher` subagents, each assigned one independently researchable ownership boundary or cross-cutting concern.
- **External evidence is required** whenever material behavior depends on a third-party or platform runtime contract that repository evidence cannot establish. This includes version-specific transaction, isolation, retry, locking, concurrency, consistency, lifecycle, serialization, security, and failure semantics, as well as standards, protocols, current guidance, or conflicting external claims. Repository usage and tests can prove local behavior but do not define an external contract.

Route the work as `repository-localized`, `repository-broad`, `external`, or `mixed`. An external route skips repository mapping and internal research. A mixed route separates independently researchable internal and external questions and runs them in parallel when their applicability context is already known.

Record the classification and its evidence. This step is complete when every material research gap has an investigation question and both routing decisions have an explicit rationale.

## 2. Map Broad Repository Scope

Skip this step when repository investigation is not required or localized. For broad repository impact, invoke one `code-mapper` subagent with the full brief and repository investigation questions. Require one report covering the narrowest useful set of entrypoints, ownership boundaries, flows, dependencies, tests, configuration, documentation, ADRs, and external integration surfaces.

Check the report before continuing. It is accepted only when every assigned repository investigation question points to a relevant boundary or is explicitly marked unmapped, every listed file has a reason to inspect it, and the report names uncertainty. Resume the same mapper when the report misses any of these.

This step is complete when mapping was correctly skipped or one accepted code map can divide deep investigation without requiring each researcher to rediscover repository scope.

## 3. Investigate The Repository

Skip this step when repository investigation is not required. For localized impact, invoke one `internal-researcher` with focused entrypoints or the narrow ownership boundary established during framing; no code map is required. For broad impact, divide the accepted map into non-overlapping ownership boundaries or cross-cutting concerns and invoke one `internal-researcher` per scope; run independent scopes in parallel. Give every researcher:

- the full brief,
- the full accepted code map for broad impact, or focused entrypoints and boundary evidence for localized impact,
- one explicit assigned scope,
- the investigation questions it owns.

Check each report against its assignment. Resume a researcher when an owned question lacks a supported answer or explicit unknown, a material claim lacks a repository source, or reported behavior and cited evidence conflict.

This step is complete when repository investigation was correctly skipped or every repository question has one internal owner, every owned question has a supported finding or explicit unknown, and overlaps or contradictions between reports are reconciled or recorded.

## 4. Resolve External Questions

Reassess the external-evidence classification from Step 1 against the accepted code map and internal reports when present. Add concrete external questions for every newly discovered runtime contract or external dependency. Skip the rest of this step only when external evidence is still not required after that reassessment, and record the updated rationale.

Convert externally dependent findings and unknowns into concrete questions. Include detected dependency or platform versions and the internal facts that determine applicability. For runtime contracts, require authoritative documentation or source applicable to that version. Invoke `external-researcher` with those questions; use separate parallel assignments when questions concern independent technologies or standards.

Accept a report only when every assigned question has an answer or explicit unresolved state, consequential claims cite authoritative sources, and version and applicability to this repository are stated. Resume the researcher when generic advice substitutes for an applicable answer.

This step is complete when every externally dependent planning fact is supported by applicable evidence or remains an explicit unknown with the missing evidence named.

## 5. Falsify Brief Assumptions

After internal and external evidence gathering, perform exactly one explicit falsification pass over each material factual or technical assumption extracted from the brief. An assumption is material only when its failure would change planning, an implementation contract, ownership, compatibility, security, or validation. Seek disconfirming evidence, classify each included assumption as supported, contradicted, or unresolved, and cite the applicable evidence.

Preserve evidence-backed contradictions and present any product implication to the user for decision. Never overwrite a user-owned product decision unilaterally. This step is complete when every extracted material assumption has a cited status and every contradiction is retained for user resolution.

## 6. Synthesize The Research

Use the embedded `RESEARCH.md Format` below, then synthesize accepted reports and the falsification pass into the active task's `RESEARCH.md` instead of concatenating them. Write the entire artifact in English, preserving exact source-code identifiers and established technical terms. Write the delta from `BRIEF.md`: cite the brief rather than restating its scope, rules, acceptance criteria, or repository evidence, and state each finding once where it is most useful. Repository evidence governs repository behavior; authoritative version-matched evidence governs external contracts. Preserve material conflicts, contradictions, and unknowns, including those awaiting user decision.

The research is complete only when the artifact passes every completion check in the embedded format, every investigation question is answered or remains an explicit unknown, every included finding adds planning-relevant information beyond the brief, and no subagent has written the artifact.

## RESEARCH.md Format

Use this structure as a menu, not a completeness checklist. Keep `Basis` and `Brief Assumption Falsification`, then include only sections with planning-relevant information not already established by the brief or another section. Replace every retained placeholder with research specific to the brief.

```markdown
# Research: <Concise Outcome>

## Basis

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Repository impact: <not required | localized | broad>
- External evidence: <required | not required>
- Routing rationale: <evidence supporting both routing decisions>

## Questions Investigated

<!-- Omit when the findings make the questions self-evident. -->

- <Question derived from a material research gap in the brief>

## Code Map

<!-- Omit when it would only repeat the brief's repository evidence. -->

### Start Here

- `<path or symbol>`: <responsibility and relevance>

### Boundaries And Flow

<Relevant ownership boundaries, dependencies, and control or data flow>

### Validation Surface

- `<test, command, fixture, or environment>`: <what it can prove>

## Current System

<Only newly verified behavior, qualifications, or contradictions needed for planning, with source citations>

## Constraints And Invariants

- <Source-backed constraint or invariant and why it matters>

## Existing Patterns And Decisions

- <Reusable repository pattern, documentation, or ADR and its applicability>

## Failure And Operational Paths

- <Relevant failure, recovery, observability, migration, or deployment behavior>

## External Findings

<!-- Omit when external evidence was not required. -->

- <Finding, repository applicability, relevant version/date, and citation>

## Planning Constraints

- <New evidence-backed constraint, risk, or question that later solution evaluation must address; do not restate the brief or earlier findings>

## Conflicts And Unknowns

- <Conflict or unknown, why it matters, and evidence needed to resolve it>

<!-- Write `None.` when there are no material conflicts or unknowns. -->

## Brief Assumption Falsification

- <Brief factual or technical assumption>: <supported | contradicted | unresolved>; <evidence and product implication, if any>

## Sources

<!-- Omit when every source is already cited at the finding it supports. -->

### Repository Sources

- `<path:symbol or line range>`: <what it proves>

### External Sources

<!-- Omit when no external sources were used. -->

- `<URL>`: <publisher, title, version/date, and what it proves>
```

### Format Completion Checks

- The artifact is grounded in the active task's `.opencode/artifacts/task-NNN/BRIEF.md`.
- Every investigation question maps to a new finding, material qualification or contradiction, or explicit unknown.
- Any included code map names only newly relevant files, symbols, responsibilities, tests, or validation surfaces.
- Findings cover the newly discovered behavior, boundaries, constraints, failure paths, or decisions needed for planning.
- Repository claims cite repository sources; consequential external claims cite authoritative sources with version or date context.
- Facts, inferences, conflicts, and unknowns are distinguishable.
- Conflicting evidence is preserved rather than silently resolved.
- Every material brief factual or technical assumption is recorded as supported, contradicted, or unresolved with evidence; contradictions and their product implications remain visible for user decision.
- Planning constraints do not propose, rank, recommend, or select solutions or prescribe implementation steps.
- Every material third-party or platform runtime contract is supported by authoritative evidence applicable to the repository's version, or recorded as an explicit unknown.
- The artifact contains synthesis rather than concatenated subagent reports.
- The artifact treats `BRIEF.md` as the source of intended behavior without treating its factual assumptions as unquestionable; it does not restate resolved scope, rules, acceptance criteria, repository evidence, or the same finding in multiple sections.
