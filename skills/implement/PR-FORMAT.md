# Pull Request Format

Build a concise pull-request description from the final accepted diff. Optimize it for fast review: identify the material boundaries, explain consequential decisions once, and omit code narration that the diff already makes clear.

Write every Markdown section heading (`##`, `###`, and deeper) in English. Write the pull-request title and all other description content in Czech, including prose, table headings, labels, risks, and impact statements. Keep only code identifiers, paths, commands, provider syntax, and established technical terms in their required or conventional form.

Use this structure. Omit optional sections when they add no information and replace every placeholder with concrete evidence from the final diff.

````markdown
## Changes

| Oblast | Umístění | Změna |
|---|---|---|
| `<symbol or behavior boundary>` | `<path>` | <Jedna věta popisující materiální změnu a její účel.> |

<!-- Group closely related symbols into one boundary. Include material behavior, contract, schema, configuration, migration, or route changes. Exclude trivial helpers and mechanical edits. -->

## Design

<!-- Optional. -->

<Vysvětli pouze neobvyklý control flow, vlastnictví pravidla, kompatibilitní rozhodnutí nebo významný kompromis, který nelze rychle vyčíst z diffu. Sekci vynech, pokud by pouze opakovala tabulku nebo kód.>

## Impacts

<!-- Optional. Keep only applicable lines; omit the section when none apply. -->

- **Kontrakty:** <dopad na API, typy, schema, eventy nebo persistenci>
- **Kompatibilita:** <dopad na kompatibilitu nebo požadované pořadí změn>
- **Migrace:** <požadavky na data, deployment, rollout nebo rollback>
- **Rizika:** <zbývající riziko nebo omezení a jeho mitigace>

## Context

`task-NNN` · <provider-supported issue reference and URL> · závisí na <preceding pull request or `Žádný`> · digest `<published PR-section SHA-256>`

## Visual Evidence

<!-- Optional. Include only for user-visible changes. -->

<Stručné screenshoty nebo jiné before-and-after doklady.>
````

## Completion Checks

- Every Markdown section heading is in English.
- The pull-request title and all other description content are in Czech; only required identifiers, code, paths, commands, provider syntax, and conventional technical terms remain untranslated.
- The description matches the final accepted diff and contains no planned but unimplemented behavior.
- The changes table accounts for every material behavior boundary, contract, schema, configuration, migration, or route change without listing trivial helpers separately.
- Design explanation appears only for consequential decisions that the diff does not make obvious; representative code snippets are not required.
- Contract, compatibility, migration, risk, and visual information appears only when applicable.
- Information is stated once and the description can be scanned quickly before reading the diff.
