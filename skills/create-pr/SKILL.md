---
name: create-pr
description: "Create or update GitHub PRs or GitLab MRs for the current branch, a named branch, or an explicitly identified task. Prepare commits and pushes, preserve planned stacks, and write source-backed Czech descriptions covering every changed function. Not for planning, implementation, testing, code review, merging, or releasing."
---

# Create PR

Publish existing changes in the selected scope. Below, PR also means GitLab MR. The user can invoke this skill directly, or an implementation command can call it with an explicit scope. This is publication, not an implementation-readiness gate.

## Select Scope

Read repository instructions and resolve the current invocation before changing Git state or PRs:

- **"Create a PR" / "for this branch":** Only the current Git branch to `stage`. Do not infer a task or expand to related branches.
- **"Create a PR for branch X":** Only X to `stage`, not the current branch. Both single-branch forms may explicitly name another target and require no plan.
- **"Create PRs for task-012":** Read that task's `PLAN.md`, normally `.opencode/task-012/PLAN.md`. Publish its PR set using the planned source branches, targets, and dependencies. Independent PRs target the integration branch; dependent PRs initially target their predecessor. A calling command must also supply the task identifier or exact task/plan path. When `/implement` supplies its complete effective repository-to-integration-branch map, use it instead of the plan's start, initial-target, and final-integration-target branch names; this map may contain the default `stage` or user overrides. Preserve planned repositories, source branches, PR scope, order, and dependencies. Reject partial or ambiguous maps.

In task mode only, require one unambiguous marker-verified slice issue for every planned PR and the managed parent issue. Use `ticket-master reconcile` to resolve or repair tracking before publication, with explicit task, project, exact plan, verified tracking repository, full effective PR map, and any `/implement` integration-branch override. Stop on incomplete or conflicting tracking rather than invent issue IDs. A direct single-branch request does not require issues, task documents, execution state, tests, or review. An implementation caller supplies its actual gate outcome, including a third-round cap caveat when applicable; this skill neither reruns gates nor invents a final PASS.

Stop with a clear warning and request clarification when a stack/feature request has no task identifier or plan path, a source or task is missing or ambiguous, HEAD is detached without an explicit source, source equals target, or instructions conflict. A complete effective integration-target map supplied by `/implement` is not a conflict with the plan's branch fields. Never choose the newest task, substitute the current branch after a failed lookup, or silently replace a missing target with `main`. Announce the resolved source-to-target map; no extra approval is needed when it is unambiguous.

## Boundaries

- Publication authorizes scoped branch preparation, commits, pushes, and PR creation/updates, subject to higher-priority instructions. Preserve unrelated local and staged changes; no blanket staging, automatic stashing, destructive resets, history rewrites, force-pushes, or publishing secrets.
- Do not implement, redesign the plan, or carve mixed changes into guessed PRs. Do not run or require tests, builds, type-checks, or code reviews. Supplied results or available CI may be reported but are not a publication gate. Do not dispatch or wait for checks; ordinary hooks and automatically triggered CI remain untouched.
- Do not merge, approve, close, release, enable auto-merge, delete branches, or change labels, reviewers, or assignees without a separate request. Preserve draft status and unrelated human-authored PR content.

## Process

1. Inspect status, staged/unstaged diffs, tracking, remotes, and recent commits. Select the exact source/target repositories, including forks; check authentication and fetch their remotes. Use `gh` for GitHub, `glab` for GitLab, and `git` locally. Do not assume `origin` or rely on an unverified CLI project default. Require the selected target or task integration branch to exist.
2. Reuse implementation branches. Only in task mode, prepare missing planned branches when existing changes make their contents unambiguous. Commit only attributable changes, inspecting the complete staged diff and repository commit conventions first. Never move the current checkout's changes onto a different requested branch by assumption. For stacks, verify ancestry and each planned increment; stop on mismatches or unexplained multi-parent dependencies. Do not invent or repartition the stack.
3. Push only selected source branches, in dependency order, to the selected repository. Never push directly to the integration/release branch. A predecessor must exist remotely before its child's PR is published. An existing stack tool may be used after checking its capabilities; do not install tools or assume automatic rebasing/retargeting from ordinary linked PRs.
4. Record remote source and target SHAs. Inspect the complete remote merge-base diff (`git diff <target-ref>...<source-ref>`) and all included commits. Before drafting, build the function-level coverage ledger defined below; read the changed functions at the inspected base and source states, not just commit messages or diff hunk headings. Use relevant source and documentation at that exact state to write the Czech title and template below, not to perform code review. Exclude unrelated local changes and unpushed commits from the description. Complete the description coverage check before publication. Recheck both SHAs; if either moved, refresh the affected diff, ledger, and description.
5. Create or update PRs in dependency order. Match the exact source/target projects and branches; update a matching open PR instead of duplicating it. Retarget an existing PR only when its identity and the requested correction are clear and the task plan explicitly permits that transition. Stop on ambiguous, closed, or merged matches; a merged predecessor needs a confirmed updated stack state. Use safe CLI argument/file handling. In task mode add `Tracked by #123` for the verified slice issue under `Kompatibilita / dependencies`, or a qualified issue URL for cross-repository tracking. Do not add `Closes`, `Fixes`, `Resolves`, or other automatic closing keywords. Preserve human content; flag an existing conflicting auto-close instruction rather than silently overwriting it. After each successful PR/MR, call `ticket-master link-prs` with its exact slice ID and URL, complete task inputs and planned branch map. Update the parent linkage; its checkbox means provider-verified merged, never merely published. A failed link is partial publication: preserve successful PRs and return their URLs and remaining linking work. Once URLs exist, complete dependency links without adding template headings or overwriting human notes.
6. Reread each PR and verify its URL, open state, projects, branches, remote SHAs, title, description, and platform diff against the inspected states. Reconcile the saved description with the function-level ledger too; a correct local draft does not prove the published body is complete. Refresh mismatches or report verification as pending; never claim unchecked publication succeeded. Return URLs, source-to-target pairs, created/updated status, stack review order, and any excluded local changes or partial failures. Do not roll back successful PRs by closing them.

Review proceeds bottom-up; implementation need not wait for it. Children target predecessors to isolate diffs, not to merge into unmerged parents. Retargeting/rebasing after merges, fixing implementation defects, and the later integration-to-release PR are separate workflows, not actions to initiate here.

## Function-Level Coverage

The description must explain each changed function, not merely the themes of the PR. Build a private ledger from the complete diff before writing prose:

- Inventory every added, modified, and removed hand-written function or method, including endpoint handlers, extracted helpers, callbacks, and test functions. Identify each by path and qualified name (or enclosing symbol/location for anonymous functions). Inspect bodies and changed signatures/decorators; diff hunk headings alone are not a reliable function inventory.
- For each entry record change kind, base/source line ranges, previous behavior, new behavior, relevant branches and effects, evidence for the reason, and its intended `Detail změn` subsection and snippet(s). Map every material non-function change and non-trivial commit as well, so schemas, configuration, migrations, and secondary fixes cannot disappear.
- Distinguish extraction from new behavior. When logic moves from an endpoint into a helper, cover both the helper's responsibility and the endpoint's changed orchestration. Do not describe preserved validation as newly introduced. Pure moves and whitespace-only edits with no contract or behavior change may be explicitly noted together instead of receiving full subsections; this exception does not apply to extracted helpers or changed callers.
- Each changed function needs its own named detail entry, its own relevant source excerpt, and its own explanation. Related entries may be adjacent, but one representative snippet or a list of names for several functions is not coverage. Test entries may be short and show the changed assertion/setup; never infer that they were executed from their presence in the diff.

This ledger checks description completeness, not implementation correctness. It does not authorize tests or code review.

## Description Format

Use this template for every PR/MR, including its title heading and section order. Write natural Czech while preserving code, identifiers, paths, commands, and technical terms. Replace every placeholder; use `Neuplatňuje se` for genuinely irrelevant content, not for unknown facts. Keep content proportional to the published increment.

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

### 1. `<název funkce>`: <konkrétní změna>

`<cesta/k/souboru>` · `<kvalifikovaný název funkce>`

<U endpointu HTTP metoda a ověřená route; u helperu relevantní volající. Odkaz na zdrojové řádky v konkrétním commitu.>

```<jazyk>
<skutečný výřez změněného mechanismu z této funkce v remote source větvi>
```

**Jak to funguje:**

<Konkrétní průchod funkcí: relevantní vstupy, větvení, volání, zápisy a návratová hodnota nebo chyba. U složitější funkce přidej další výřez, pokud první neukazuje další podstatnou změnu.>

**Co je změna:**

<Předtím: původní mechanismus. Nyní: nový mechanismus a jeho pozorovatelný dopad. Odliš změněné chování od zachovaného kontraktu a pouhého přesunu kódu.>

**Proč je to tak:**

<Konkrétní problém nebo požadavek a jak jej tento mechanismus řeší. Důvod dolož zadáním, plánem nebo zdrojovým kódem; nedoložený důvod označ jako neznámý.>

<Stejnou strukturu zopakuj pro každou další změněnou funkci. Změny mimo funkce popiš v samostatných pojmenovaných podsekcích s relevantním výřezem, pokud jde o kód nebo konfiguraci.>

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

- Let the changed functions and mechanisms determine description length. There is no fixed word, subsection, snippet-count, or total snippet-line cap. A small PR remains short; a PR changing ten functions needs ten function entries, not two thematic paragraphs or a sample of the most interesting functions. Remove repetition and irrelevant context, never required function coverage.
- `Overview` is a concise navigation table covering material behaviors and impacts. Name the affected functions or endpoints where useful; split independent contracts, lifecycle rules, race handling, migrations, and secondary user-visible changes instead of hiding them behind broad labels. The table does not replace function-level details.
- `Detail změn` is the main body. Use a numbered subsection for each changed function with its path, exact symbol, source link, snippet(s), and the three explanations in the template. Explain relevant inputs, return values/status codes, validation, access checks, side effects, transaction ownership, and error handling. For preserved behavior, explain only what is needed to understand the change. A label such as "shared create" or "concurrency protection" is not an explanation of how a function changed.
- Show enough code to expose each changed mechanism, using several focused excerpts for a complex function rather than pasting its whole body. For locking/reload loops, show the lock inputs, authoritative read, repeat/exit condition, and explain the subsequent validation/mutation and lock lifetime. For transaction changes, show who calls the helper and who commits or rolls back, including materially different early-return/error paths. A bare `lock(...)` or `create(..., commit=False)` cannot stand in for the surrounding behavior.
- Copy excerpts verbatim from the inspected remote source, preserving identifiers, arguments, and statement order; common leading indentation may be trimmed. Include source links pinned to the inspected commit and line ranges. Show separated ranges as separate blocks, never splice them into an apparently contiguous block. Do not simplify or invent code to make it shorter. For removed code use a clearly labeled excerpt from the inspected base; add a labeled before excerpt when prose alone would obscure the change. Request/response examples or pseudocode must be labeled and can only supplement actual function excerpts.
- Never paste whole files, generated code, lockfiles, repetitive plumbing, or large test bodies. Select the important portion of each changed function, not its entire implementation by default. Do not use a signature, a call from another function, or a mention in a table as a substitute for that function's changed mechanism. For signature/decorator-only changes, show the changed contract itself and explain its effect on callers. Documentation-only changes need no artificial code snippets.
- Describe only the remote diff. Arrange related function entries in runtime/data-flow order when useful, but do not collapse them into a file inventory or thematic summary. Explain changes against the inspected merge base with the actual PR target, not an assumed integration branch.
- Ground intent and explanations in the request, task plan, and repository evidence. Do not invent motives, excluded scope, deployment guarantees, or artificial runtime diagrams. State unknown migration, configuration, compatibility, or deployment impacts explicitly.
- `Ověření` and `Coverage` report only supplied or already available results, with their source, commit/state, and actual scope. They do not instruct this skill to run checks. If no results are available, say so and state that this publication skill did not run them; do not claim behavior was tested or require evidence to continue.
- For task PRs, put the target branch, predecessor/successor PR links, and review order under `Kompatibilita / dependencies`. Do not imply predecessors are reviewed or merged. When updating, summarize meaningful changes since the previous description without discarding review notes.
- Remove all placeholders and instructional text before publication. Keep every template heading, but do not manufacture content to fill it.

## Description Coverage Check

Before publishing, reconcile the draft against the ledger and the full remote diff:

- Every changed function has a named entry, a source-backed snippet from that function, and concrete explanations of how it works, what changed, and why. Every inventory entry is accounted for; only the explicitly noted pure-move/whitespace exception may omit the full entry. Shared-helper coverage does not cover its changed callers, nor vice versa.
- Each function's distinct changed branches and effects are explained, not just its headline. Every material non-function change and non-trivial commit also maps to the description. Missing code/function coverage means the draft is incomplete: expand it before publication rather than shortening the inventory.
- Compare every snippet directly with its recorded source range. Check exact names, conditions, call arguments, and order; reject plausible-looking reconstructions and unlabeled omissions. Verify that "before" claims match the base and that preserved behavior is not advertised as new.
- Read each function entry as a reviewer: can they explain the relevant input, main path, changed edge/error paths, output, state/transaction owner, old-versus-new behavior, and reason without opening the diff? If not, add the missing code and explanation. Generic sentences repeated under all three labels do not pass.

Repeat the coverage check on the saved PR/MR body. This is a description-quality check only, not a test or implementation-review gate.
