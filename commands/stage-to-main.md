---
description: Create one verified task-specific GitHub PR or GitLab MR from merged stage work to the default branch
argument-hint: "task-NNN"
---

# Stage To Main

Invocation arguments: `$ARGUMENTS`.

Create one task-specific integration branch and publish one pull request or merge request containing every planned PR for exactly one task that has already been merged into its stage branch. The stage branch may contain other tasks; include only changes attributable to the selected task.

## 1. Resolve The Task And Provider

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /stage-to-main task-NNN` and stop without changing repository or provider state.

Resolve `.opencode/artifacts/$1/PLAN.md` directly and read it in full. Require a finalized plan with one ordered PR section and one verified Published Issues entry per planned PR. Do not infer another task or reconstruct a missing plan.

Inspect repository instructions, remotes, remote default branch, remote tracking branches, registered worktrees, and provider authentication. Fetch without modifying the user's checkout. Determine the provider from the authenticated repository remote:

- GitHub uses `gh` and pull requests.
- GitLab uses `glab` and merge requests.

Stop when provider identity, authentication, or repository identity is unavailable or contradictory. Never mix provider CLIs in one run.

Resolve the source stage from the finalized PLAN merge targets. When the plan records one concrete `stage` or `dh-stage`, require that exact remote branch. When every entry says `Resolve during /implement`, identify the branch from the published task PRs, preferring exact names `stage` and then `dh-stage`; ask one focused question only when their verified bases disagree or remain ambiguous. Require every task PR to target the same stage.

Resolve the target from the remote default branch, falling back to an unambiguous remote `main` or `master`. Stage and target must differ. Record immutable remote tip SHAs for stage and target.

Completion criterion: one task, provider, repository, stage branch and tip, and target branch and tip are exact.

## 2. Identify Every Task PR

For each planned PR section in PLAN order, locate exactly one merged provider PR/MR using combined evidence:

- task ID and planned PR number,
- head branch `task-NNN/pr-N`,
- exact stage base,
- Published Issues reference and section digest,
- task, issue, and digest metadata in the PR/MR body,
- merge commit or provider-reported commit set,
- changed files and actual diff.

Do not accept numbering, title similarity, issue linkage, or branch name alone. Verify each candidate from a fresh provider read and confirm its merged result is an ancestor of the recorded stage tip. Preserve PLAN order while also recording actual merge order.

For each accepted PR/MR, derive its task-owned merge delta:

- For a merge commit, use the first-parent-to-merge-result delta that the PR introduced to stage.
- For a squash or rebase merge, reconcile the provider-reported PR diff with its merged commit set.
- Exclude stage ancestry and commits that are not part of that PR/MR.

Stop before creating integration state when a planned PR has no match, has multiple credible matches, is not merged into the selected stage, or its task-owned delta cannot be established. Other tasks on stage are not a blocker and must not be included.

Completion criterion: every planned PR has exactly one verified merged PR/MR and one attributable delta, with no missing or unaccounted planned stage.

## 3. Build The Task Integration Branch

Use the branch `task-NNN/integration-to-main` and isolated worktree:

```text
/tmp/opencode-worktrees/<repository-name>/task-NNN/stage-to-main
```

Create the branch from the recorded target tip, not from stage. Materialize the verified task-owned deltas in their actual stage merge order and verify that this order satisfies every backward execution dependency in PLAN. Keep PLAN numbering for traceability and presentation. Prefer replaying exact task commits when they contain no unrelated ancestry; otherwise apply the verified PR/MR delta and create one traceable integration commit for that planned PR.

When the integration branch, worktree, or provider PR/MR already exists, reuse it only after verifying repository, task marker, branch ownership, base, commit set, and diff. Preserve a non-matching local tip under an unused archive ref. Never force-update, reset, overwrite, remove, or reuse ambiguous state.

Resolve a conflict only when the selected task's verified stage delta and target source make the intended result mechanical. Stop with the conflicting commits, paths, and evidence when resolution would require a product or implementation decision. Never satisfy a conflict by importing another task's commit or unrelated stage state.

After materializing all planned stages, verify:

- the branch is based on the recorded target tip,
- every planned task delta appears exactly once,
- no non-task commit or material change appears,
- the changed paths and patch content reconcile with the union of accepted task PR/MR deltas,
- the worktree is clean after committing,
- the remote stage and target tips still equal the recorded immutable SHAs.

If a remote tip moved, refetch and invalidate affected identification, replay, and prose. Reconcile from the new target without losing the verified task deltas, then repeat the affected checks before publication.

## 4. Build The Combined Overview

Build the title and body from the integration branch's final diff, the accepted PR/MR set, PLAN, and repository evidence. Describe the implemented result, never behavior present only in artifacts. Markdown headings are English; title and prose are Czech except for identifiers, paths, commands, provider syntax, and established technical terms.

Use this structure and omit only sections marked optional:

```markdown
## Overview

<Celkový výsledek tasku, motivace, hlavní změna chování a nejdůležitější implementační rozhodnutí.>

## Included PRs And MRs

| Plan stage | PR/MR | Merge commit(s) | Outcome |
|---|---|---|---|
| PR N | [#123](URL) | `<SHA>` | <Výsledek ověřený proti diffu> |

## Behavior

### Before

<Původní relevantní chování nebo omezení.>

### After

<Nové pozorovatelné chování a zachované vlastnosti.>

## Change Map

| Area | Location | Change | Reason |
|---|---|---|---|
| `<boundary>` | `<path>` | <Materiální změna> | <Důvod> |

## Design

<Jak spolu změny jednotlivých PR souvisejí a proč výsledná implementace používá toto řešení.>

## Contracts And Compatibility

- <Dopad na API, typy, schema, konfiguraci, persistenci nebo kompatibilitu; nebo `None`>

## Validation

- `<command or check>`: <výsledek doložený finálním taskem nebo jednotlivým PR>

## Risks And Limitations

- <Zbývající riziko, omezení a mitigace; nebo `None`>

## Migration And Rollout

<!-- Omit when not applicable. -->

- <Migrace, pořadí nasazení, rollback nebo observability požadavek>

## Included Commits

- `PR N`: `<task-owned commits or integration commit>`

## Context

- Task: `task-NNN`
- Plan: `.opencode/artifacts/task-NNN/PLAN.md`
- Stage evidence: `<stage>@<SHA>`
- Integration base: `<target>@<SHA>`

<!-- opencode-stage-to-main:task-NNN -->
```

The overview must contain every and only the selected task's planned PRs in PLAN order. Validation claims must distinguish fresh integration evidence from evidence reported by constituent PRs.

## 5. Publish And Verify

Before pushing, fetch and repeat the immutable-tip and task-only diff checks. Push the integration branch without force.

Search open and closed provider PRs/MRs for the exact task marker and head/base pair before creating anything:

- Reuse one matching open PR/MR only when repository, head, base, marker, commit set, diff, title, and body can be reconciled safely; update it when needed.
- Return one matching merged PR/MR only when it already represents the exact verified integration result.
- Stop on a closed-unmerged match, multiple matches, or conflicting task ownership.
- Otherwise create one PR with `gh pr create` or one MR with `glab mr create` from `task-NNN/integration-to-main` to the selected target.

Immediately reread the resulting PR/MR through the same provider and verify URL, repository, state, head, base, title, body, task marker, head SHA, commit set, and changed files against the accepted integration evidence. A successful CLI response alone is insufficient.

Finish by reporting the PR/MR URL, provider, target and stage evidence, integration branch and commits, ordered included PRs/MRs, task-only diff proof, validation evidence, and residual risks. Do not merge the PR/MR or remove its worktree.
