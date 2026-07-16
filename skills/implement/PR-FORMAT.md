# Pull Request Format

Build the pull-request description from the final accepted diff, not from `PLAN.md` alone. Explain the behavioral change, important implementation decisions, connections, and risks so a reviewer understands the change before reading code. Organize by coherent functionality, not by file order or every edited symbol. Include signatures only when they clarify a meaningful contract or flow; do not narrate trivial helpers, loops, or mechanical edits.

Use this structure. Omit only sections marked optional and replace every placeholder with concrete information.

```markdown
## Overview

<Summarize the outcome, motivation, main behavior, and the most important implementation decision. Include the useful reading orientation here.>

## Stack Context

- Depends on: <preceding pull request or `None`>
- Plan stage: <PR N and outcome from PLAN.md>

## Behavior

### Before

<Describe the relevant previous behavior or limitation.>

### After

<Describe the new observable behavior and preserved invariants.>

## Change Map

| Area | Key symbols | Change | Reason |
|---|---|---|---|
| `<path or boundary>` | `<symbols>` | <what changed> | <why it changed> |

## Detailed Changes

### <Coherent functionality or decision>

**Location:** `<path or boundary>`

**Key contract:** `<signature, schema, route, event, or `Internal`>`

**What changed:** <Describe the implemented behavior.>

**How it works:** <Explain the relevant control flow, data flow, state changes, or algorithm.>

**Why this design:** <Explain the decision, owned complexity, and accepted trade-off.>

**Connections:** <Name entry points, callers, dependencies, persistence, side effects, and downstream consumers that matter.>

**Failure behavior and invariants:** <Explain relevant errors, fallback behavior, safety properties, and preserved contracts.>

<!-- Repeat for each coherent change. Do not create sections for trivial symbols or mechanical edits. -->

## Contracts And Compatibility

- <API, type, schema, configuration, persistence, migration, or compatibility impact; or `None`>

## Decisions And Trade-offs

<!-- Omit when the implementation followed an established pattern without a material design choice. -->

- **Decision:** <chosen approach>
  **Why:** <concrete reason>
  **Rejected alternative:** <credible alternative and why it was not chosen>

## Risks And Limitations

- <residual risk, limitation, mitigation, or `None`>

## Migration And Rollout

<!-- Omit when no data, deployment, operational, or rollout concern exists. -->

- <required migration, sequencing, compatibility window, rollback, or observability note>

## Visual Evidence

<!-- Omit when the pull request has no user-visible change. -->

<Screenshots or other concise before-and-after evidence.>

## Out Of Scope

<!-- Omit when no excluded work needs clarification. -->

- <work intentionally excluded from this pull request>
```

## Completion Checks

- The description matches the final committed diff and contains no planned but unimplemented behavior.
- The overview explains the outcome, motivation, main behavior, and reading orientation without repeating the full body.
- Detailed sections represent coherent functionality or decisions, not a symbol-by-symbol or line-by-line inventory.
- Every non-obvious design choice states why it was selected and names a credible rejected alternative when one existed.
- Entry points, dependencies, state, side effects, failure behavior, and invariants are covered wherever they affect understanding.
- Contract, compatibility, migration, rollout, visual, risk, and out-of-scope information is present when applicable and omitted when it adds no information.
- The description is detailed enough to establish a correct working model before code review, but does not duplicate implementation mechanics already obvious from the diff.
