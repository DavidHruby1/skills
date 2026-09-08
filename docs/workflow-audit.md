# Workflow Audit

Audit date: 2026-09-05.

## Scope

Reviewed the active global OpenCode configuration: `AGENTS.md`, `commands/`, `agents/`, `skills/` and companion files, `opencode.jsonc`, plugin workflow references, and relevant `docs/`. Also reconciled the workflow section of `/home/hruby/data/ai/ai-workflow.md`. Dependencies, generated logs, and the separate `/home/hruby/data/ai/harness` project were excluded.

This was a workflow-contract audit, not a security or runtime audit of every plugin.

## Current Contract

- Project artifacts: `.opencode/task-xxx/ARCHITECTURE.md`, `TECHNICAL-DESIGN.md`, and `PLAN.md` only as required planning inputs.
- Sequence: `/architecture` -> `/technical-design` -> `/create-plan` -> `/implement`.
- Architecture owns high-level decisions, technical design owns implementation contracts, and plan owns PR slices and execution. A downstream document cannot silently override an accepted upstream decision.
- Workers own production edits. The orchestrator owns tests, Git, integration, and validation.
- `code-review` invokes two parallel inspectors for Standards and Spec, with all planned PRs and combined-state evidence for task completion. Standalone review needs no task package.
- Review repeats for corrections or concrete unresolved risk, not a difficulty-based quota. Publication follows implementation gates; direct `/create-pr` retains its independent publication-only contract.

## Corrections

- Replaced obsolete artifact requirements and all-gates-only behavior in `agents/inspector.md` with explicit axis and standalone/task modes.
- Added `skills/code-review/SKILL.md` and the `/code-review` entrypoint, including pinned scopes, WIP/untracked handling, complete task packages, and separate reports.
- Added `/implement` as the canonical implementation entrypoint, removing dependence on an unavailable test agent and manager-only completion review.
- Replaced the old artifact-producing `/research` workflow with an entrypoint to the installed research skill.
- Updated the grilling phase terminology and technical-design reference, removed the obsolete standalone review-notes definition, and removed the worker's legacy artifact name.
- Added `/create-pr` as an entrypoint to the existing publication skill and aligned global workflow instructions and the external workflow description.

## Validation

Read back the changed contracts and checked referenced agents, skills, commands, and task paths. A read-only inspector reviewed the implementation/review/publication contract integration and reported no defects. A separate discovery pass checked the active configuration for retired artifact prerequisites and unavailable workflow dependencies and found none remaining.

No application tests, type-checks, or end-to-end implementation/publication runs were executed: these changes are Markdown prompts and workflow configuration, not application code. The new definitions need an OpenCode restart before runtime behavior can be verified. The workspace is not a Git repository, so no Git diff or commit was available.

## Residual Observations

- `commands/elaborate.md:16` invokes `i-have-adhd` unconditionally, contrary to that skill's keyword-only trigger. Left unchanged as unrelated to the architecture/design migration.
- `docs/large-read-guard.md:33` names `tests/large-read-guard.test.js`, which was absent during the audit. No plugin validation is claimed.
- The external workflow document's separate Testing section remains `Coming Soon`; it was edited concurrently and was preserved. The implementation command already defines test ownership and validation, but a fuller testing policy is not supplied by that placeholder.
- The external document recommends Astra for orchestration while the configured `build` agent defaults to Sol. This is not an unavailable-agent defect: model selection can be overridden per session. No model settings were changed.
