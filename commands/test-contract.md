---
description: Create and approve a plain-language GHERKIN.md test contract
agent: build
---

Create or revise the active task's `GHERKIN.md` as a human-reviewed contract for what tests must prove. `$ARGUMENTS` may name the task, requested behavior, evidence basis, or constraints. This command writes no production or test code and changes no plan, issue, branch, or dependency.

Resolve the active task using `AGENTS.md`. Determine the evidence basis from explicit arguments first, then repository evidence:

- **Planned behavior**: the requested behavior is not implemented. Require and read the task's full `BRIEF.md` and published `PLAN.md`, plus `RESEARCH.md` when present, then relevant documentation, source, existing tests, configuration, and manifests. `BRIEF.md` governs behavior; `PLAN.md` governs implementation and PR ownership. Report a missing or contradictory required artifact and stop.
- **Existing behavior**: the requested behavior already exists. `BRIEF.md` and `PLAN.md` are optional. Read the relevant source in full, existing tests when present, governing documentation, and bounded path-scoped Git history needed to recover intent. Treat current implementation as evidence, not unquestionable intent; stop when code, tests, documentation, history, or the user's request materially disagree.

When the basis remains ambiguous after inspection, ask one focused question. Record `Basis: Planned behavior` or `Basis: Existing behavior` in the drafted section. Do not ask the user to choose test levels. Select the smallest non-duplicative combination of unit, integration, and end-to-end scenarios that proves every material behavior and risk. Integration and end-to-end scenarios may be specified before implementation; test-first work is not limited to unit tests.

Create or update one or more `## Unit`, `## Integration`, or `## End-to-End` sections in `<active-task>/GHERKIN.md`. Preserve approved sections outside the requested scope verbatim. Each changed section starts, in order, with `Status: Draft`, its `Basis:`, and `Audit: Pending`.

For every scenario:

- Add a Markdown heading with one unique stable ID and descriptive title, such as `### UT-001: Rejecting quantity above stock`. Use `UT`, `IT`, or `E2E` according to the exercised boundary; preserve existing IDs and assign the next unused ID.
- Add `**What this test does:**` followed by two or three short sentences that plainly describe the starting situation, action, and expected observable result. It must be understandable without reading Gherkin and avoid code identifiers, mocks, fixtures, selectors, and testing jargon.
- Add `**Test scope:**` followed by one short ordinary-language explanation of what real boundary participates and any evidence-backed material limitation.
- Put one fenced `gherkin` block after those explanations. Include `Feature`, optional `Rule`, level and ID tags, one scenario, and roughly 3-5 declarative `Given`, `When`, `Then`, `And`, or `But` steps. Describe observable behavior rather than implementation structure.
- Put exactly one `Traceability:` line immediately after the fence. For planned behavior, name at least one relevant `BRIEF.md` criterion and exactly one owning `PLAN.md` PR. For existing behavior, name the concrete source, test, documentation, or commit evidence that establishes intent.

Cover every applicable acceptance criterion and material invariant, including representative success, rejection, boundary, and consequential failure behavior. Add scenarios for distinct risks, not to repeat the same rule at every level or maximize scenario count. A scenario's explanation, scope, Gherkin, level, and traceability form one contract entry and must agree.

After each substantive draft, invoke `test-contract-auditor`. Supply the exact user request and scope, active task path, selected basis, full current `GHERKIN.md`, all governing artifacts, and repository and history locations needed for independent verification. Correct every valid finding and re-audit substantive corrections. When the auditor returns `READY`, replace `Audit: Pending` with `Audit: Passed YYYY-MM-DD`. The auditor never edits files, and its report is for correction rather than a separate artifact.

Present the audited plain-language scenario descriptions and scopes as the review fast path, identify the full `GHERKIN.md` path, briefly state that the audit checked unsupported claims, contradictions, scenario effectiveness, and missing coverage, then request explicit approval. Do not mark a section approved in the drafting run.

On a later invocation, incorporate requested corrections, return changed sections to draft, and audit them again. Only explicit approval of the current complete entries may change `Status: Draft` to `Status: Approved` and add `Approved: YYYY-MM-DD` immediately below it. Any substantive change to an explanation, scope, Gherkin, level, basis, or traceability invalidates approval and requires a fresh audit and approval.

Finish when the requested contract sections are either audited drafts awaiting review or explicitly approved, and no production or test file has changed.
