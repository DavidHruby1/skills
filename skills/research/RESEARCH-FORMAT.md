# RESEARCH.md Format

Use this structure as a menu, not a completeness checklist. Keep `Basis`, then include only sections with planning-relevant information not already established by the brief or another section. Replace every retained placeholder with research specific to the brief.

```markdown
# Research: <Concise Outcome>

## Basis

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Repository impact: <localized | broad>
- External evidence: <required | not required>
- Routing rationale: <repository evidence supporting both decisions>

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

## Sources

<!-- Omit when every source is already cited at the finding it supports. -->

### Repository Sources

- `<path:symbol or line range>`: <what it proves>

### External Sources

<!-- Omit when no external sources were used. -->

- `<URL>`: <publisher, title, version/date, and what it proves>
```

## Completion Checks

- The artifact is grounded in the active task's `.opencode/artifacts/task-NNN/BRIEF.md`.
- Every investigation question maps to a new finding, material qualification or contradiction, or explicit unknown.
- Any included code map names only newly relevant files, symbols, responsibilities, tests, or validation surfaces.
- Findings cover the newly discovered behavior, boundaries, constraints, failure paths, or decisions needed for planning.
- Repository claims cite repository sources; consequential external claims cite authoritative sources with version or date context.
- Facts, inferences, conflicts, and unknowns are distinguishable.
- Conflicting evidence is preserved rather than silently resolved.
- Planning constraints do not propose, rank, recommend, or select solutions or prescribe implementation steps.
- Every material third-party or platform runtime contract is supported by authoritative evidence applicable to the repository's version, or recorded as an explicit blocking unknown.
- The artifact contains synthesis rather than concatenated subagent reports.
- The artifact treats `BRIEF.md` as imported context: it does not restate resolved scope, rules, acceptance criteria, repository evidence, or the same finding in multiple sections.
