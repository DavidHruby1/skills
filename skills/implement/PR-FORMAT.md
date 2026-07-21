# Pull Request Format

Build the pull-request description from the final accepted diff, not from `PLAN.md` alone. Explain the behavioral change, important implementation decisions, connections, and risks so a reviewer understands the change before reading code. Organize by coherent functionality, not by file order or every edited symbol. Include signatures only when they clarify a meaningful contract or flow; do not narrate trivial helpers, loops, or mechanical edits.

Write the pull-request title and the entire description in Czech, including all headings, prose, table headings, labels, risk statements, and validation summaries. Keep only code identifiers, paths, commands, provider keywords such as closing references, and established technical terms in their required or conventional form. Do not publish an English title or description even when the repository, source code, issue, or plan is written in English.

Use this structure. Omit only sections marked optional and replace every placeholder with concrete information.

```markdown
## Přehled

<Summarize the outcome, motivation, main behavior, and the most important implementation decision. Include the useful reading orientation here.>

## Kontext stacku

- Úkol: `task-NNN`
- Issue: <provider-supported closing reference and published issue URL, or a plain link when automatic closure is not guaranteed>
- Závisí na: <preceding pull request or `Žádný`>
- Fáze plánu: <PR N and outcome from PLAN.md>
- Digest sekce: <published PR-section SHA-256>

## Chování

### Před změnou

<Describe the relevant previous behavior or limitation.>

### Po změně

<Describe the new observable behavior and preserved invariants.>

## Mapa změn

| Oblast | Klíčové symboly | Změna | Důvod |
|---|---|---|---|
| `<path or boundary>` | `<symbols>` | <what changed> | <why it changed> |

## Podrobné změny

### <Coherent functionality or decision>

**Umístění:** `<path or boundary>`

**Klíčový kontrakt:** `<signature, schema, route, event, or `Interní`>`

**Co se změnilo:** <Describe the implemented behavior.>

**Jak to funguje:** <Explain the relevant control flow, data flow, state changes, or algorithm.>

**Proč toto řešení:** <Explain the decision, owned complexity, and accepted trade-off.>

**Vazby:** <Name entry points, callers, dependencies, persistence, side effects, and downstream consumers that matter.>

**Chování při selhání a invarianty:** <Explain relevant errors, fallback behavior, safety properties, and preserved contracts.>

<!-- Repeat for each coherent change. Do not create sections for trivial symbols or mechanical edits. -->

## Kontrakty a kompatibilita

- <API, type, schema, configuration, persistence, migration, or compatibility impact; or `None`>

## Rozhodnutí a kompromisy

<!-- Omit when the implementation followed an established pattern without a material design choice. -->

- **Rozhodnutí:** <chosen approach>
  **Důvod:** <concrete reason>
  **Zamítnutá alternativa:** <credible alternative and why it was not chosen>

## Rizika a omezení

- <residual risk, limitation, mitigation, or `None`>

## Migrace a nasazení

<!-- Omit when no data, deployment, operational, or rollout concern exists. -->

- <required migration, sequencing, compatibility window, rollback, or observability note>

## Vizuální doklady

<!-- Omit when the pull request has no user-visible change. -->

<Screenshots or other concise before-and-after evidence.>

## Mimo rozsah

<!-- Omit when no excluded work needs clarification. -->

- <work intentionally excluded from this pull request>
```

## Completion Checks

- The pull-request title and complete description are written in Czech; only required identifiers, code, paths, commands, provider syntax, and conventional technical terms remain untranslated.
- The description matches the final committed diff and contains no planned but unimplemented behavior.
- The overview explains the outcome, motivation, main behavior, and reading orientation without repeating the full body.
- Stack context matches the task's published issue and immediate PR dependency, without claiming unsupported automatic closure.
- Detailed sections represent coherent functionality or decisions, not a symbol-by-symbol or line-by-line inventory.
- Every non-obvious design choice states why it was selected and names a credible rejected alternative when one existed.
- Entry points, dependencies, state, side effects, failure behavior, and invariants are covered wherever they affect understanding.
- Contract, compatibility, migration, rollout, visual, risk, and out-of-scope information is present when applicable and omitted when it adds no information.
- The description is detailed enough to establish a correct working model before code review, but does not duplicate implementation mechanics already obvious from the diff.
