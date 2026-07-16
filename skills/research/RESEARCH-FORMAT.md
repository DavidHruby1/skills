# RESEARCH.md Format

Use this structure. Omit only sections marked optional and replace every placeholder with research specific to the brief.

```markdown
# Research: <Concise Outcome>

## Basis

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Repository impact: <localized | broad>
- External evidence: <required | not required>
- Routing rationale: <repository evidence supporting both decisions>

## Questions Investigated

- <Question derived from a brief requirement or acceptance criterion>

## Code Map

### Start Here

- `<path or symbol>`: <responsibility and relevance>

### Boundaries And Flow

<Relevant ownership boundaries, dependencies, and control or data flow>

### Validation Surface

- `<test, command, fixture, or environment>`: <what it can prove>

## Current System

<Verified behavior and implementation details needed for planning, with source citations>

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

- <Evidence-backed requirement, constraint, risk, or question that later solution evaluation must address>

## Conflicts And Unknowns

- <Conflict or unknown, why it matters, and evidence needed to resolve it>

<!-- Write `None.` when there are no material conflicts or unknowns. -->

## Sources

### Repository Sources

- `<path:symbol or line range>`: <what it proves>

### External Sources

<!-- Omit when no external sources were used. -->

- `<URL>`: <publisher, title, version/date, and what it proves>
```

## Completion Checks

- The artifact is grounded in the active task's `.opencode/artifacts/task-NNN/BRIEF.md`.
- Every material brief requirement and acceptance criterion maps to a finding or explicit unknown.
- The code map names the narrowest useful files and symbols, their responsibilities, and relevant tests or validation surfaces.
- Current behavior, boundaries, flows, constraints, failure paths, and existing decisions needed for planning are covered.
- Repository claims cite repository sources; consequential external claims cite authoritative sources with version or date context.
- Facts, inferences, conflicts, and unknowns are distinguishable.
- Conflicting evidence is preserved rather than silently resolved.
- Planning constraints do not propose, rank, recommend, or select solutions or prescribe implementation steps.
- Every material third-party or platform runtime contract is supported by authoritative evidence applicable to the repository's version, or recorded as an explicit blocking unknown.
- The artifact contains synthesis rather than concatenated subagent reports.
