---
description: Create one verified staging-to-main pull request for a planned task
---

Publish one integration pull request containing every planned pull request for the task `$1` that has already been merged into the repository's staging branch.

Invocation arguments: `$ARGUMENTS`

Require exactly one argument matching `task-NNN`. If it is absent or invalid, print `Usage: /stage-to-main task-NNN` and stop without changing the repository or GitHub state.

## 1. Resolve The Task And Branches

Work in the current repository. Resolve `.opencode/artifacts/$1/PLAN.md` directly; do not substitute another task. Read it in full. Stop if it is absent, incomplete, or does not define an ordered sequence of pull requests with outcomes.

Inspect repository instructions, onboarding documentation when present, git status, remotes, remote tracking branches, and recent history. Fetch the relevant remote without modifying local branches. Require a clean worktree and authenticated `gh` access to the current repository.

Detect the staging branch from repository evidence, preferring a remote branch named `staging`. Detect the target branch from the remote default branch, `main`, or `master`. The staging and target branches must be distinct. If either branch is absent or the evidence is ambiguous, ask one focused question and continue only after receiving an explicit answer. Record immutable remote refs for both tips and use those refs for every subsequent comparison.

Stop before making changes when remote connectivity, repository identity, branch visibility, pull-request access, or permission to create a pull request cannot be established.

## 2. Identify The Planned Pull Requests

Extract every planned PR stage from `PLAN.md` in order, including its number, outcome, scope, dependencies, and validation. Query GitHub for pull requests merged into the staging branch and inspect their title, body, head branch, base branch, merge commit, commits, changed files, and diff.

Match each planned stage to exactly one merged pull request using combined evidence from its plan-stage metadata, outcome, title, body, branch, commits, files, and actual diff. Never accept numbering or title similarity alone. Confirm that each matched pull request was merged into the detected staging branch and that its merge result is an ancestor of the recorded staging tip. Preserve the PLAN order even when GitHub returns another order.

Stop and report concrete candidates and missing evidence if any planned stage has no match, multiple credible matches, is not merged into staging, or cannot be verified from source and GitHub evidence. Do not guess.

## 3. Prove The Integration Diff

Inspect the complete three-dot diff, commit range, changed-file list, and diff statistics from the recorded target tip to the recorded staging tip. Reconcile them against all matched pull requests and every planned stage.

Require all of these invariants:

- Every planned PR has exactly one verified merged PR.
- Every verified PR's merged changes are represented in the staging-to-target diff, accounting for legitimate overlap or conflict resolution.
- Every material change in the staging-to-target diff is explained by the verified PRs and `PLAN.md`.
- The combined diff contains no unrelated task, unplanned behavior, unexplained commit, or unexplained file change.
- The target is an ancestor of staging, so the integration can be reviewed as a forward change without divergent target-only history.
- The remote branch tips still equal the immutable refs recorded in Step 1.

Use diffs and commit ancestry as authority; PR labels and prose are supporting evidence only. If any invariant fails, stop without creating or modifying a pull request. Report the exact extra, missing, divergent, or ambiguous commits, files, and PRs.

Check whether an open or closed pull request already exists for the same staging head and target base. If an open PR exists, verify it and return its URL instead of creating a duplicate. If a merged or closed unmerged PR makes the requested action ambiguous, stop and report it.

## 4. Build The Pull Request Description

Build the title and description from the final remote diff, matched pull requests, `PLAN.md`, and repository evidence. Do not describe planned but absent behavior. The title must summarize the complete feature or refactor rather than say only "merge staging".

Explain the behavioral change, important implementation decisions, connections, and risks so a reviewer understands the integrated change before reading code. Organize by coherent functionality, not by file order or every edited symbol. Include signatures only when they clarify a meaningful contract or flow; do not narrate trivial helpers, loops, or mechanical edits.

Use this structure. Omit only sections marked optional and replace every placeholder with concrete information.

```markdown
## Overview

<Summarize the complete outcome, motivation, main behavior, and most important implementation decision. Include a useful reading orientation.>

## Included Pull Requests

| Plan stage | Pull request | Outcome |
|---|---|---|
| PR N | [#123](URL) | <Outcome from PLAN.md, verified against the merged diff> |

<Include every planned PR exactly once and in PLAN order.>

## Behavior

### Before

<Describe the relevant previous behavior or limitation on the target branch.>

### After

<Describe the new observable behavior on staging and preserved invariants.>

## Change Map

| Area | Key symbols | Change | Reason |
|---|---|---|---|
| `<path or boundary>` | `<symbols>` | <what changed> | <why it changed> |

## Detailed Changes

### <Coherent functionality or decision>

**Location:** `<path or boundary>`

**Key contract:** `<signature, schema, route, event, or Internal>`

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

## Validation

- `<command or check>`: <result supported by current evidence>

<Distinguish checks run for the combined staging tip from checks reported by constituent PRs. Never claim a check was run when it was not.>

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

Before publication, verify that:

- The description matches the final remote diff and contains no planned but unimplemented behavior.
- The overview explains the outcome, motivation, main behavior, and reading orientation without repeating the full body.
- The included-PR table contains every and only the matched planned PRs, in order, with working links.
- Detailed sections represent coherent functionality or decisions, not a symbol-by-symbol or line-by-line inventory.
- Every non-obvious design choice states why it was selected and names a credible rejected alternative when one existed.
- Entry points, dependencies, state, side effects, failure behavior, and invariants are covered wherever they affect understanding.
- Contract, compatibility, migration, rollout, visual, validation, risk, and out-of-scope information is present when applicable and omitted when it adds no information.
- Validation claims distinguish fresh combined validation from historical constituent-PR evidence.
- The description is detailed enough to establish a correct working model before code review without duplicating mechanics obvious from the diff.

## 5. Create And Verify The Pull Request

Immediately before creation, fetch again and prove that both remote branch tips still equal the refs accepted in Step 3. If either moved, invalidate all matching, diff analysis, and prose; repeat Steps 2 through 4 against the new immutable refs. Never publish stale analysis.

Create exactly one pull request with the detected target as base and staging as head using `gh pr create`. Do not create branches, commits, tags, merges, pushes, releases, or local file changes. Do not alter an existing pull request.

After creation, query the pull request from GitHub and verify its URL, repository, state, base, head, title, body, head SHA, base SHA, commit range, and changed files against the accepted evidence. If creation succeeds but verification finds a discrepancy, report it prominently; do not silently edit or close the PR.

Finish by reporting the PR URL, target and staging refs, the ordered included PRs, the verified combined outcome, validation evidence, and residual risks.
