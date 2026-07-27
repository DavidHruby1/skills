# Pull Request Format

Build each description from that PR's final own diff against its preceding branch. Write every Markdown heading in English. Write the title and all body content in Czech except identifiers, paths, commands, provider syntax, and established technical terms.

Use this structure and omit only optional sections:

````markdown
## Changes

| Oblast | Umístění | Změna |
|---|---|---|
| `<behavior boundary>` | `<path>` | <Materiální produkční změna a její účel.> |

## Production Size

`<changed logic>` / `<PLAN limit>` změněných řádků produkční logiky.

## Test Scope

<!-- When approved scenarios exist, use the table. Otherwise write `Testy nebyly pro tento task vytvořeny.` -->

| Scenario ID | Úroveň | Test commit | Výsledek |
|---|---|---|---|
| `<scenario ID>` | `<unit/integration/end-to-end>` | `<SHA>` | `PASS` |

<!-- Keep test scope separate from production size. Describe audited scope and evidence, not test implementation. -->

## Design

<!-- Optional. Explain only a consequential ownership decision, unusual control flow, compatibility choice, or deviation from advisory Implementation direction. -->

## Impacts

<!-- Optional. Keep only applicable lines. -->

- **Kontrakty:** <dopad>
- **Kompatibilita:** <dopad>
- **Migrace:** <požadavky>
- **Rizika:** <zbývající riziko a mitigace>

## Validation

- `<non-test or final command/check>`: `PASS` - <stručný důkaz>
- **Implementation inspection:** `<PASS | REWORK twice followed by green mechanical publication gate>`

## Context

`task-NNN` · <issue reference and URL> · `PR N` · základ `<stage or preceding task branch>` · digest `<published PR-section SHA-256>`

## Visual Evidence

<!-- Optional. Include only for user-visible changes. -->

<Stručný before-and-after důkaz.>
````

## Completion Checks

- Headings are English; the title and body are Czech with only required technical exceptions.
- The body describes only the PR's own final diff.
- Production size and test scope are separate; a task without approved scenarios states that tests were not created.
- When tests exist, claims cite scenario IDs, commits, and results without reviewing or narrating test implementation.
- Validation and inspection claims match final evidence.
- The base and dependency are exact. The body contains no post-publication instructions.
