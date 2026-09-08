---
name: create-pr
description: "Create or update GitHub PRs or GitLab MRs for the current branch, a named branch, or an explicitly identified task. Prepare commits and pushes, preserve planned stacks, and write Czech descriptions. Not for planning, implementation, testing, code review, merging, or releasing."
---

# Create PR

Publish existing changes in the selected scope. Below, PR also means GitLab MR. The user can invoke this skill directly, or an implementation command can call it with an explicit scope. This is publication, not an implementation-readiness gate.

## Select Scope

Read repository instructions and resolve the current invocation before changing Git state or PRs:

- **"Create a PR" / "for this branch":** Only the current Git branch to `stage`. Do not infer a task or expand to related branches.
- **"Create a PR for branch X":** Only X to `stage`, not the current branch. Both single-branch forms may explicitly name another target and require no plan.
- **"Create PRs for task-012":** Read that task's `PLAN.md`, normally `.opencode/task-012/PLAN.md`. Publish its PR set using the planned source branches, targets, and dependencies. Independent PRs target the integration branch; dependent PRs initially target their predecessor. A calling command must also supply the task identifier or exact task/plan path.

In task mode only, require one unambiguous marker-verified slice issue for every planned PR and the managed parent issue. Use `ticket-master reconcile` to resolve or repair tracking before publication, with explicit task, project, exact plan, verified tracking repository and full PR map. Stop on incomplete or conflicting tracking rather than invent issue IDs. A direct single-branch request does not require issues, task documents, execution state, tests, or review. An implementation caller supplies its actual gate outcome, including a third-round cap caveat when applicable; this skill neither reruns gates nor invents a final PASS.

Stop with a clear warning and request clarification when a stack/feature request has no task identifier or plan path, a source or task is missing or ambiguous, HEAD is detached without an explicit source, source equals target, or instructions conflict. Never choose the newest task, substitute the current branch after a failed lookup, or silently replace a missing target with `main`. Announce the resolved source-to-target map; no extra approval is needed when it is unambiguous.

## Boundaries

- Publication authorizes scoped branch preparation, commits, pushes, and PR creation/updates, subject to higher-priority instructions. Preserve unrelated local and staged changes; no blanket staging, automatic stashing, destructive resets, history rewrites, force-pushes, or publishing secrets.
- Do not implement, redesign the plan, or carve mixed changes into guessed PRs. Do not run or require tests, builds, type-checks, or code reviews. Supplied results or available CI may be reported but are not a publication gate. Do not dispatch or wait for checks; ordinary hooks and automatically triggered CI remain untouched.
- Do not merge, approve, close, release, enable auto-merge, delete branches, or change labels, reviewers, or assignees without a separate request. Preserve draft status and unrelated human-authored PR content.

## Process

1. Inspect status, staged/unstaged diffs, tracking, remotes, and recent commits. Select the exact source/target repositories, including forks; check authentication and fetch their remotes. Use `gh` for GitHub, `glab` for GitLab, and `git` locally. Do not assume `origin` or rely on an unverified CLI project default. Require the selected target or task integration branch to exist.
2. Reuse implementation branches. Only in task mode, prepare missing planned branches when existing changes make their contents unambiguous. Commit only attributable changes, inspecting the complete staged diff and repository commit conventions first. Never move the current checkout's changes onto a different requested branch by assumption. For stacks, verify ancestry and each planned increment; stop on mismatches or unexplained multi-parent dependencies. Do not invent or repartition the stack.
3. Push only selected source branches, in dependency order, to the selected repository. Never push directly to the integration/release branch. A predecessor must exist remotely before its child's PR is published. An existing stack tool may be used after checking its capabilities; do not install tools or assume automatic rebasing/retargeting from ordinary linked PRs.
4. Record remote source and target SHAs. Inspect the complete remote merge-base diff (`git diff <target-ref>...<source-ref>`) and all included commits. Use relevant source and documentation at that exact state to write the Czech title and template below, not to perform code review. Exclude unrelated local changes and unpushed commits from the description. Before publication, recheck both SHAs; if either moved, refresh the affected diff and description.
5. Create or update PRs in dependency order. Match the exact source/target projects and branches; update a matching open PR instead of duplicating it. Retarget an existing PR only when its identity and the requested correction are clear and the task plan explicitly permits that transition. Stop on ambiguous, closed, or merged matches; a merged predecessor needs a confirmed updated stack state. Use safe CLI argument/file handling. In task mode add `Tracked by #123` for the verified slice issue under `Kompatibilita / dependencies`, or a qualified issue URL for cross-repository tracking. Do not add `Closes`, `Fixes`, `Resolves`, or other automatic closing keywords. Preserve human content; flag an existing conflicting auto-close instruction rather than silently overwriting it. After each successful PR/MR, call `ticket-master link-prs` with its exact slice ID and URL, complete task inputs and planned branch map. Update the parent linkage; its checkbox means provider-verified merged, never merely published. A failed link is partial publication: preserve successful PRs and return their URLs and remaining linking work. Once URLs exist, complete dependency links without adding template headings or overwriting human notes.
6. Reread each PR and verify its URL, open state, projects, branches, remote SHAs, title, description, and platform diff against the inspected states. Refresh mismatches or report verification as pending; never claim unchecked publication succeeded. Return URLs, source-to-target pairs, created/updated status, stack review order, and any excluded local changes or partial failures. Do not roll back successful PRs by closing them.

Review proceeds bottom-up; implementation need not wait for it. Children target predecessors to isolate diffs, not to merge into unmerged parents. Retargeting/rebasing after merges, fixing implementation defects, and the later integration-to-release PR are separate workflows, not actions to initiate here.

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

### 1. <Název změny>

`<cesta/k/souboru>`

```<jazyk>
<krátký důležitý snippet z remote source větve>
```

**Jak to funguje:**

<Tok a pravidla.>

**Co je změna:**

<Rozdíl oproti cílové větvi tohoto PR.>

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

- Scale description length to the scope and complexity of the changes, with no fixed word, row, or subsection limit. `Overview` must cover every material change and its impact, not just highlights; use concise rows grouped by coherent behavior, splitting distinct changes rather than hiding them behind broad labels. Expand `Detail změn` as needed for important rules, exceptions, and technical details; keep small PRs brief and omit repetition, not substance.
- Before publication, cross-check the overview and details against the complete remote diff and all included commits. Ensure every material change is represented, including relevant behavior, API/data contracts, configuration, migrations, compatibility, and operational impacts; add missing coverage rather than compressing to a target length.
- Describe only the remote diff, grouped by behavior, not a file inventory. Use short representative snippets from the remote source; never whole files, generated code, or extensive tests. Explain changes relative to the actual PR target, not always the integration branch.
- Ground intent and explanations in the request, task plan, and repository evidence. Do not invent motives, excluded scope, deployment guarantees, or artificial runtime diagrams. State unknown migration, configuration, compatibility, or deployment impacts explicitly.
- `Ověření` and `Coverage` report only supplied or already available results, with their source, commit/state, and actual scope. They do not instruct this skill to run checks. If no results are available, say so and state that this publication skill did not run them; do not claim behavior was tested or require evidence to continue.
- For task PRs, put the target branch, predecessor/successor PR links, and review order under `Kompatibilita / dependencies`. Do not imply predecessors are reviewed or merged. When updating, summarize meaningful changes since the previous description without discarding review notes.
- Remove all placeholders and instructional text before publication. Keep every template heading, but do not manufacture content to fill it.
