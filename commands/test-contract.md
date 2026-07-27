---
description: Create and explicitly approve an evidence-backed GHERKIN.md test contract
agent: build
---

Create or revise the active task's `GHERKIN.md` as the human-reviewed contract for what tests must prove. `$ARGUMENTS` may name the task, behavior, evidence basis, or constraints. This command implements and publishes no production code, test code, plan, issue, branch, commit, or dependency.

Resolve the active task using `AGENTS.md`. Determine the evidence basis from explicit arguments first, then repository evidence:

- **Planned behavior:** Require the task's full `BRIEF.md` and published `PLAN.md`, plus `RESEARCH.md` when present. `PLAN.md` must contain `Status: Approved`; otherwise stop. Read relevant documentation, source, existing tests, configuration, and manifests. `BRIEF.md` governs behavior and the approved `PLAN.md` governs implementation ownership.
- **Existing behavior:** `BRIEF.md` and `PLAN.md` are optional. Read the relevant source in full, existing tests when present, governing documentation, and only bounded path-scoped Git history needed to recover intent. Treat implementation as evidence, not unquestionable intent; stop on a material disagreement among evidence or with the request.

Ask one focused question if the basis remains ambiguous. Record `Basis: Planned behavior` or `Basis: Existing behavior` in each changed section. Select the smallest non-duplicative set of unit, integration, and end-to-end scenarios that proves all material behavior and risk; do not ask the user to choose levels.

Create or update `## Unit`, `## Integration`, and/or `## End-to-End` sections in `<active-task>/GHERKIN.md`. Preserve approved sections outside scope verbatim. Each changed section starts, in order, with `Status: Draft`, its `Basis:`, and `Audit: Pending`.

For every scenario:

- Add a heading with one unique stable ID and descriptive title, such as `### UT-001: Rejecting quantity above stock`. Use `UT`, `IT`, or `E2E` for the exercised boundary; preserve existing IDs and assign the next unused ID.
- Add `**What this test does:**` with two or three plain sentences describing the starting situation, action, and observable result without test jargon or implementation details.
- Add `**Test scope:**` with one short explanation of the real participating boundary and any evidence-backed material limitation.
- Add one fenced `gherkin` block containing `Feature`, optional `Rule`, level and ID tags, one scenario, and declarative `Given`, `When`, `Then`, `And`, or `But` steps. Describe observable behavior.
- Add exactly one `Traceability:` line immediately after the fence. Every scenario implemented by `/create-tests` must name exactly one `Owning PR: N`. For planned behavior, also cite at least one relevant `BRIEF.md` criterion and verify that the named PR exists in the approved `PLAN.md` and owns the behavior. Existing behavior must cite concrete source, test, documentation, or commit evidence; its PR number provides test-commit ownership and does not claim planned production behavior.

Cover each applicable criterion and material invariant, including representative success, rejection, boundary, and consequential failure behavior. Add scenarios for distinct risks, not duplicate confidence. The explanation, scope, Gherkin, level, basis, ownership, and traceability must agree.

Invoke `test-contract-auditor` after the complete substantive draft and at most once more if supported blocking corrections materially change behavior, scope, level, Gherkin, or traceability. Supply the request and scope, active task path, basis, full `GHERKIN.md`, relevant acceptance criteria and approved plan sections, plan-wide constraints, and only the evidence needed to verify consequential claims. Apply only supported blocking findings. Never invoke it a third time.

When an audit returns `READY`, replace `Audit: Pending` with `Audit: Passed YYYY-MM-DD`. If the final allowed audit returns `REWORK`, apply only unambiguous mechanical corrections, leave `Audit: Pending`, and report remaining blockers. The auditor is read-only and creates no artifact.

Present the audited plain-language descriptions and scopes, identify the full `GHERKIN.md` path, summarize what the audit checked, and request explicit user approval. Never approve in the drafting invocation. On a later invocation, only explicit approval of the current complete entries may change `Status: Draft` to `Status: Approved` and add `Approved: YYYY-MM-DD`. Any substantive change to explanation, scope, Gherkin, level, basis, ownership, or traceability returns the section to draft and requires a fresh audit and approval.

Finish only with audited drafts awaiting review or explicitly approved sections. Do not implement or publish code.
