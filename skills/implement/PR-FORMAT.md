# Pull Request Format

Build the pull-request description from the final accepted diff. Optimize it for fast review: lead with a symbol index, explain only material implementation details, and state each fact once.

Write every Markdown section heading (`##`, `###`, and deeper) in English. Write the pull-request title and all other description content in Czech, including prose, table headings, labels, risks, and impact statements. Keep only code identifiers, paths, commands, provider syntax, and established technical terms in their required or conventional form.

Use this structure. Omit optional sections when they add no information and replace every placeholder with concrete evidence from the final diff.

````markdown
## Change Index

| Symbol | Stav | Umístění | Účel |
|---|---|---|---|
| `<ClassName, function(), or method()>` | `Přidáno`, `Změněno`, `Přejmenováno` nebo `Odstraněno` | `<path>` | <Jedna věta popisující odpovědnost nebo materiální změnu a její účel.> |

<!-- Include every new or materially changed class, function, and method, plus important renamed or removed symbols. Add a row for a material route, schema, configuration, or other behavior that has no symbol. Exclude trivial helpers and mechanical edits. -->

## How and Why

### `<ClassName, function(), or method()>`

**Umístění:** `<path>`

**Jak:** <V několika přímých větách vysvětli relevantní control flow, data flow, změnu stavu, algoritmus, chování při selhání nebo invariant.>

**Proč:** <Vysvětli, proč bylo zvoleno toto řešení, a uveď významný kompromis pouze tehdy, pokud existuje.>

```<language>
<5-15 řádků reprezentativního kódu z finálního přijatého diffu>
```

<!-- Repeat only for non-trivial symbols. Give a class its own section only when its overall responsibility needs explanation; otherwise document the relevant methods. Do not repeat the index or narrate code already obvious from the snippet. -->

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
- The index accounts for every new or materially changed class, function, and method, every important renamed or removed symbol, and every material non-symbol change.
- Trivial helpers and mechanical edits do not receive index rows or detail sections.
- Every non-trivial indexed symbol has one concise detail section explaining how and why it works, with a representative snippet from the final diff.
- Contract, compatibility, migration, risk, and visual information appears only when applicable.
- Information is stated once and the description can be scanned from index to implementation detail without reading the diff first.
