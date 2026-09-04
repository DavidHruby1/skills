---
description: Create or update a Czech GitLab MR from the pushed current branch to dh-stage
---

# Create Merge Request

Create or update one GitLab merge request from the pushed current branch to `dh-stage`. Take no arguments and use `glab` only.

## Process

1. Read repository instructions. Fetch the GitLab remote and require both the current branch and `dh-stage` to exist remotely.
2. Use only the remote diff `origin/dh-stage...origin/<current-branch>`. Ignore and do not push local changes or unpushed commits.
3. Inspect the diff, relevant source, tests, and documentation. Derive a concise Czech title and the description below from verified repository evidence.
4. Run focused tests and the affected type-check against the remote source state when practical. Report only commands and results observed during this run.
5. Update an existing open MR with the same source and target, otherwise create it. Stop on an already merged or ambiguous matching MR. Never merge, approve, close, or modify labels and assignees.
6. Reread the MR and verify its URL, open state, source branch, target `dh-stage`, remote source SHA, description, and diff. Report the URL and whether the MR was created or updated.

Do not modify repository files or Git history. If the working tree or local `HEAD` differs from the remote source, exclude those differences and mention this in the final report.

## Description Format

Write Czech prose while preserving code, identifiers, paths, commands, and established technical terms. Keep all headings in this order. Replace every placeholder. Use `Neuplatňuje se` where a section has no relevant content; never invent facts.

````markdown
# MR Overview

## Overview

| Oblast | Co se změnilo | Dopad |
|---|---|---|
| <oblast> | <konkrétní změna> | <pozorovatelný dopad> |

## Kontext a pozadí

<Původní chování, důvod změny, zachované kontrakty a případné legacy nebo migrační souvislosti.>

## Stavové hodnoty a důležité proměnné

| Hodnota / proměnná | Umístění | Význam |
|---|---|---|
| `<název>` | `<umístění>` | <význam pro změněné chování> |

## Detail změn

### 1. <Název změny>

`<cesta/k/souboru>`

```<jazyk>
<krátký důležitý snippet z remote source větve>
```

**Jak to funguje:**

<Tok a pravidla.>

**Co je změna:**

<Rozdíl oproti dh-stage.>

**Proč je to tak:**

<Důvod řešení.>

<Stejnou strukturu zopakuj jen pro další podstatné změny.>

## Ověření

### Provedené ověření

```text
<spuštěné příkazy, nebo důvod neprovedení>
```

**Výsledek:**

- <pozorovaný výsledek nebo omezení>

### Coverage

Ověřeno zejména:

- <skutečně pokryté chování>

## Nasazení

<Migrace, konfigurace, dependencies, pořadí nasazení nebo `Neuplatňuje se`.>

## Kompatibilita / dependencies

<Kompatibilita a vazby na jiné části nebo MR; nebo `Neuplatňuje se`.>

## Data-flow diagram

```text
<stručný diagram skutečného toku, nebo Neuplatňuje se>
```

**Jak číst tok:**

- <stručné vysvětlení>

## Reviewer focus

Při review má smysl zaměřit se hlavně na:

- <nejrizikovější pravidlo nebo rozhodnutí>

## Out of scope

Tento MR záměrně neřeší:

- <vědomě nezahrnutá související oblast; nebo `Neuplatňuje se`>
````

## Content Rules

- Popisuj pouze změny v remote diffu, seskupené podle chování, ne podle seznamu souborů.
- V `Detail změn` použij krátké reprezentativní snippets z výsledného remote kódu. Nevkládej celé soubory, generated code ani rozsáhlé testy.
- Tvrzení o ověření musí odpovídat skutečně spuštěným kontrolám. Test files samy o sobě nejsou důkazem úspěšného testu.
- Data-flow přizpůsob skutečné změně; nevytvářej umělý diagram pro změnu bez runtime toku.
- Explicitně uveď dopad na migrace, konfiguraci, kompatibilitu a pořadí nasazení.
- Před publikací odstraň všechny placeholders a instrukční text.
