---
description: Create an evidence-backed GHERKIN.md test contract
agent: build
---

Create or revise the active task's `GHERKIN.md` as the contract for what tests must prove. `$ARGUMENTS` may name the task, behavior, evidence basis, or constraints. This command implements and publishes no production code, test code, plan, issue, branch, commit, or dependency.

Resolve the active task using `AGENTS.md`. Determine the evidence basis from explicit arguments first, then repository evidence:

- **Planned behavior:** Require the task's full `BRIEF.md` and published `PLAN.md`, plus `RESEARCH.md` when present. `PLAN.md` must contain `Status: Approved`; otherwise stop. Read relevant documentation, source, existing tests, configuration, and manifests. `BRIEF.md` governs behavior and the approved `PLAN.md` governs implementation ownership.
- **Existing behavior:** `BRIEF.md` and `PLAN.md` are optional. Read the relevant source in full, existing tests when present, governing documentation, and only bounded path-scoped Git history needed to recover intent. Treat implementation as evidence, not unquestionable intent; stop on a material disagreement among evidence or with the request.

Ask one focused question if the basis remains ambiguous. Record `Basis: Planned behavior` or `Basis: Existing behavior` in each changed section. Select the smallest non-duplicative set of unit, integration, and end-to-end scenarios that proves all material behavior and risk; do not ask the user to choose levels.

Create or update `## Unit`, `## Integration`, and/or `## End-to-End` sections in `<active-task>/GHERKIN.md`. Preserve sections outside scope verbatim. Each changed section starts with its `Basis:`.

For every scenario:

- Add a heading with one unique stable ID and descriptive title, such as `### UT-001: Rejecting quantity above stock`. Use `UT`, `IT`, or `E2E` for the exercised boundary; preserve existing IDs and assign the next unused ID.
- Add `**What this test does:**` with two or three plain sentences describing the starting situation, action, and observable result without test jargon or implementation details.
- Add `**Test scope:**` with one short explanation of the real participating boundary and any evidence-backed material limitation.
- Add one fenced `gherkin` block containing `Feature`, optional `Rule`, level and ID tags, one scenario, and declarative `Given`, `When`, `Then`, `And`, or `But` steps. Describe observable behavior.
- Add one `Traceability:` line immediately after the fence. Name an `Owning PR: N` when a plan assigns the behavior to a PR. For planned behavior, cite at least one relevant `BRIEF.md` criterion and verify that the named PR exists in the approved `PLAN.md` and owns the behavior. Existing behavior cites concrete source, test, documentation, or commit evidence.

Cover each applicable criterion and material invariant, including representative success, rejection, boundary, and consequential failure behavior. Add scenarios for distinct risks, not duplicate confidence. The explanation, scope, Gherkin, level, basis, ownership, and traceability must agree.

Invoke `test-contract-auditor` after the complete substantive draft. Supply the governing evidence and apply supported findings. Rerun the audit when substantive corrections need verification.

The auditor is read-only and creates no metadata. Resolve evidence-backed defects when possible; ask one focused question only when conflicting evidence leaves intended behavior materially ambiguous.

Present the plain-language descriptions and scopes, identify the full `GHERKIN.md` path, and summarize what the audit checked and any unresolved evidence conflict.

Finish with a coherent current contract. Do not implement or publish code.
