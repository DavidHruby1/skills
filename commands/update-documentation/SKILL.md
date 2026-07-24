---
name: update-documentation
description: Update documentation for all merged pull requests represented in the active PLAN.md.
disable-model-invocation: true
---

# Update Documentation

Update only documentation affected by all merged pull requests represented in the active task's `PLAN.md`. Take no arguments.

## Process

1. Resolve the active task using the artifact convention in `AGENTS.md`, then read its `PLAN.md`. Enumerate every entry under `## Pull Requests`. Completion: every planned PR has its title, outcome, order, and planned source scope recorded.
2. In the current repository, use Git history and `gh` to match every planned entry to its merged PR. Match on title or outcome, order, planned paths, and actual changed files; do not rely on one signal alone. Stop if any entry is unmerged, missing, or ambiguous. Completion: every planned entry maps to exactly one merged PR and exact base and head commits.
3. Partition the actual PR diffs into coherent changed areas and launch parallel `@explore` subagents, one per area. Give each agent the matched PRs, exact diff scope, current source scope, and related docs; require a source-backed report covering implemented behavior, affected documentation, changes requiring no docs, and uncertainty. Treat the plan as a locator, not evidence of behavior. Completion: every changed application, library, or domain area has one exploration report.
4. Check every report against the assigned diff and named sources. When `graphify-out/graph.json` exists, use `graphify affected` to resolve unclear relationships; otherwise use direct search and source reads. Ask the same subagent to correct incomplete or inconsistent findings. Completion: every report is accepted and every documentation-impacting change has a target document or an explicit reason no document applies.
5. Only after all reports are accepted, update documentation from their findings and named source evidence. Make the smallest source-grounded change and preserve unrelated intentional content. Create a new document only for a genuinely new module or architecture concern; update relevant `index.md` and `onboarding.md` files only when navigation changed. Completion: affected docs match current source and no unrelated docs changed.
6. Verify links, changed claims, and the final diff. Report matched PRs, exploration reports, updated docs, changes requiring no docs, and uncertainty. Completion: all edits are verified or the run fails explicitly.

## Grounding

- Document implemented behavior and structure, not assumptions or roadmap.
- Ignore generated files, dependencies, repository metadata, and tooling configuration as documentation subjects.
- Use repository terminology and cite source paths in documentation where useful.
- Never rewrite the whole documentation set for a localized merge.
- State uncertainty instead of inventing missing facts.
