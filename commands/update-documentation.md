---
description: Reconcile concise, source-backed documentation and ADR history with all merged PRs in the active task plan.
---

# Update Documentation

Update only documentation affected by all merged pull requests represented in the active task's `PLAN.md`. Take no arguments. This is a targeted reconciliation, not a full-codebase rewrite or a new architecture decision process.

## Resolve the Change Set

1. Read repository instructions, existing documentation conventions, and `docs/onboarding.md` when present. Resolve the active task using `.opencode/task-xxx/` and conversation context. Ask if multiple tasks remain plausible; do not choose by modification time alone.
2. Read `PLAN.md` when available and enumerate its PR slice list (typically `## Pull Requests`). If the plan or list is missing, derive the change set from merged PRs and conversation context instead of stopping. Read the task's `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` for relevant intended contracts and recorded decisions. Treat the plan as a locator, not evidence that behavior shipped.
3. Use Git history and `gh` to match each entry to exactly one merged PR. Corroborate title or outcome with order, planned paths, and actual changed files. Pin PR numbers, target branches, exact base/head commits, and merge evidence. Account for squash/rebase merges; do not assume original PR commits remain on the target branch. Stop before editing if an entry is missing, unmerged, ambiguous, or its actual diff is unavailable. Missing Git, remote access, or task artifacts are explicit blockers, not a pass.
4. Inspect the current branch, worktree, and sources. Ensure the documentation target contains the merged changes or evidenced successor implementations. If it does not, ask which revision to document rather than switching branches or mixing current source with another revision. Preserve unrelated changes; ask when overlapping worktree edits make the intended behavior ambiguous. Do not commit, push, or publish without explicit authorization.

## Find Documentation Impact

Read the actual PR diffs and trace affected callers, contracts, and current implementation. Reconcile the combined result of all planned PRs, including changes later superseded, rather than documenting each PR as a separate historical snapshot.

Use direct reads for small scopes. For broad independent areas, delegate read-only discovery to `explore`, supplying exact PR/diff scope, current source paths, and related docs. Require implemented behavior, affected pages, changes needing no documentation, supporting sources, and uncertainty. Do not require one agent per area or file when it adds no value.

Build a compact impact list: changed behavior or contract, evidence, canonical documentation target, and required action or reason no update is needed. Include applicable changes to:

- Frontend routing/rendering, state ownership, data fetching/cache, forms, errors, shared UI, and accessibility conventions.
- Backend domain rules, data ownership, authorization, transactions, jobs, retries, and external integrations.
- Frontend/backend contracts, authentication flows, error semantics, compatibility, and client generation.
- Setup, configuration, test commands, migrations, deployment, observability, troubleshooting, and rollback.
- Significant architectural decisions, current architecture explanations, and navigation to new or removed behavior.

Read scripts, manifests, tests, CI, and deployment configuration when they establish a maintainer workflow. Do not turn dependency inventories, generated code, or tooling internals into standalone documentation. A bug fix or refactor may require no prose changes when the documented contract is unchanged; state that explicitly.

If implementation contradicts an accepted ADR or task contract, report the conflict with evidence and ask before changing that contract. Do not turn a code discrepancy into an approved architectural decision.

## Make the Smallest Update

- Keep documentation under repository-root `docs/` and preserve established paths, language, and useful structure. The root `README.md` may need a quick-start or navigation correction. Do not reorganize the docs tree merely to follow a template.
- Update each fact in its canonical home. Link to existing API schemas, generated reference, scripts, and source entrypoints rather than manually duplicating endpoints, types, or commands across pages. Never manually edit generated documentation or change application code to make documentation true.
- Create a page only for a new reader need that does not fit an existing page: a meaningful boundary, complex flow, task guide, or operational procedure. Do not require a page per new module. Update existing indexes/onboarding only when navigation or the starting path changes; avoid competing indexes and empty placeholders.
- Write short, concrete, task-focused prose with descriptive headings. Keep how-to steps separate from lengthy explanations and exact reference. Procedures need prerequisites, working directory, supported commands, expected results, and relevant safety/recovery notes. Do not execute destructive workflows to check the text or expose secrets in examples.
- Preserve unrelated intentional content. Remove obsolete instructions only with evidence; distinguish removal of current guidance from preservation of historical ADRs. If removing or moving a page is necessary, update its affected inbound links. A verified no-op is a valid outcome.

Work directly for localized edits. When separate writing context materially helps, assign `docu-writer` source-backed code explanations with exact evidence, audience, target under `docs/`, required sections, and non-overlapping ownership. The caller owns navigation, workflow guides, ADR handling, and final validation. Inspect delegated files and consequential claims, not just reports.

## ADR Handling

Current architecture describes how the system works now; ADRs explain significant decisions and their historical context. Follow the repository's ADR convention; otherwise use `docs/adr/NNNN-short-title.md` with unique increasing numbers.

1. Check whether a documentation-impacting architectural decision already has an ADR. Link to it instead of duplicating it. Ordinary fixes and refactors do not require ADRs.
2. Create a new ADR only when decision evidence establishes the context, choice, and status. Capture actually considered alternatives, consequences including costs, and links to the decision evidence. Use the verified decision date or explicitly label a retrospective recording date. A merged PR can establish a decision only if its content/review actually records it; code or merge status alone does not prove rationale or approval.
3. If an existing decision was explicitly replaced, create or link the replacement ADR, mark the old one `superseded by ADR-NNNN`, and add reciprocal links. Preserve accepted/rejected historical reasoning. Do not silently change the old decision or invent alternatives to justify it.
4. Update current architecture independently of the historical record. If approval, rationale, or supersession is unclear, ask or report a candidate ADR gap; do not fabricate acceptance or introduce a new technical choice.

## Verify and Report

Verify changed claims against current source and the pinned change set. Check local links, command definitions, navigation, and the final diff, including newly created files. Confirm that every documentation-impacting change has a verified update or a clearly reported unresolved gap. Ensure unrelated user changes remain untouched.

Run existing relevant documentation lint/build/link checks when available; do not introduce tooling for this command. Configuration inspection is not execution evidence, and a successful link check does not prove behavior. Do not run migrations or deployment procedures just to validate documentation.

Finish with at most five concise bullets: matched PRs, updated paths, changes needing no docs, checks actually run, and unresolved gaps. Say explicitly when blocked or only partially verified. If nothing needs updating, report the verified no-op without creating files. This command is a catch-up mechanism; related docs should normally ship in the same PR as code.
