---
name: testing
description: Use when the user explicitly requests an optional test contract for approved PLAN.md work, or when an implementation worker is assigned approved GHERKIN.md scenarios and must write their unit, integration, or end-to-end tests; never invoke proactively otherwise.
---

# Testing

Turn approved behavior into a human-reviewed test contract, then route an implementation worker to the exact test-writing rules for that approved contract. The active task's `BRIEF.md` is the behavioral authority, `PLAN.md` owns implementation and PR boundaries, and `GHERKIN.md` owns only the test behavior the user explicitly selected. The implementation workflow writes the resulting production and test code in the owning planned PR.

## Invocation Router

Choose the route from the caller and artifact state; never mix contract authoring with test implementation.

- **Contract route**: use when the user directly invokes `/testing`. Continue with Step 1 to select one test level, draft and audit its Gherkin section, and obtain explicit approval. Do not edit test or production files on this route.
- **Worker route**: use only when an implementation worker receives one or more scenarios from an existing `GHERKIN.md` section that contains both `Status: Approved` and `Approved: YYYY-MM-DD`. Skip Steps 1-3 and continue directly to **Worker Test Routing**. If the assigned section is draft, lacks its approval date, has an invalid execution mode, or contains no scenarios assigned to the worker's current `PLAN.md` PR, stop as blocked without editing tests.

## 1. Establish The Branch

Proceed only after the user explicitly invokes this workflow and selects exactly one test level. Never infer, recommend, or add a test level merely because the implementation could benefit from it. If the user invokes the workflow without a level, ask which one they want and do not choose for them.

Resolve the active task using the task-artifact convention in `AGENTS.md`. Read its `BRIEF.md`, published `PLAN.md`, existing `GHERKIN.md` when present, repository instructions, relevant documentation, source, tests, test configuration, and dependency manifests. Inspect the actual test commands and established test layout instead of assuming defaults. Require every `Published Issues` item in `PLAN.md` to be checked; this workflow never changes the published plan or its issues.

Select exactly one branch from the requested outcome:

- **Unit**: test a small unit. Read [`UNIT.md`](UNIT.md) in full. Require the user to choose `Execution: Test-first` or `Execution: With implementation`; never choose the mode yourself.
- **Integration**: test a real boundary between connected components, such as Vue components, an HTTP API and application service, or Python code and its database. Read [`INTEGRATION.md`](INTEGRATION.md) in full and use `Execution: With implementation`.
- **End-to-end**: test a completed user journey through the production-built Vue application, real backend, and controlled test data. Read [`E2E.md`](E2E.md) in full and use `Execution: With implementation`.

Classify by the boundary actually exercised, not the test runner or directory name. If the selected label conflicts with the requested boundary, explain the conflict and ask the user to select again rather than silently reclassifying it. Require `BRIEF.md` and a published `PLAN.md` for every branch; stop and request the producing workflow when either is absent or when implementation requires an unresolved decision.

If the selected section is not approved, create or correct its draft and stop for explicit approval. Preserve an approved section verbatim unless the user explicitly requests a substantive change; then return it to `Status: Draft`. Stop on artifact contradictions instead of guessing.

This step is complete when explicit user authorization, one branch, its execution mode, exact behavior, exercised boundary, owning plan stages, existing conventions, and runnable validation commands are established from repository evidence.

## 2. Draft The Contract

Create or update `<active-task>/GHERKIN.md`. Preserve every other approved section verbatim. Give the selected branch its own `## Unit`, `## Integration`, or `## End-to-End` section followed, in order, by `Status: Draft` and its `Execution:` value.

Write English Gherkin unless the repository establishes another specification language. Apply these rules:

- Give every scenario one tag such as `@UT-001`, `@IT-001`, or `@E2E-001` that is unique across the entire file and never reused, recycled, or renumbered, plus its level tag: `@unit`, `@integration`, or `@e2e`.
- Put each scenario in its own fenced `gherkin` block containing its `Feature`, optional `Rule`, tags, scenario, and steps. Put exactly one Markdown `Traceability:` line immediately after that block. Do not place traceability inside the Gherkin fence or combine multiple scenarios in one fence.
- Use `Given` for relevant preconditions, `When` for the triggering event, and `Then` for outputs visible through the unit's public contract, a collaborating system's contract, or the user interface.
- A scenario should use declarative domain language and survive an internal refactor that preserves behavior.
- Keep a scenario to roughly 3-5 steps. Use `And` or `But` only to extend the preceding role.
- Use `Scenario Outline` only when examples express the same rule and each row adds meaningful coverage.
- Cover every applicable acceptance criterion and material invariant, including representative success, rejection, boundary, and failure behavior. Add scenarios because they protect a concrete risk, not to maximize their count.
- The traceability line must name at least one relevant `BRIEF.md` criterion and exactly one owning `PLAN.md` PR.

After completing the first draft of the file, invoke `test-auditor` exactly once, supplying the active task path, full `BRIEF.md`, full `PLAN.md`, full first-draft `GHERKIN.md`, and the full applicable branch reference. Require it to check whether the selected scope is complete and non-duplicative, including every applicable acceptance criterion and material invariant, representative success, rejection, boundary, and failure behavior, the selected test boundary, execution mode, observable outcomes, unique IDs, and exactly one correct owning PR per scenario. Correct valid findings yourself without invoking `test-auditor` again. The audit writes no status or marker into `GHERKIN.md`.

On later corrections, approvals, implementation, and later `/testing` runs for that existing contract, never invoke `test-auditor` again. Make final contract acceptance yourself and stop on a substantive artifact conflict or unresolved decision instead of guessing. Then end this run after presenting the draft and requesting explicit user approval. Test files remain unchanged. Approval applies only to the exact scenario text reviewed by the user; only the user can authorize changing the section from `Status: Draft` to `Status: Approved`. Any substantive scenario change returns the section to `Status: Draft` and requires user approval again without another audit.

This step is complete only when `GHERKIN.md` contains a complete, non-duplicative draft for the selected scope, every scenario has exactly one planned PR owner, the one-time first-draft audit has been handled without changing Gherkin status, and no plan, test, or production file has changed.

## 3. Confirm Approval

On a later continuation, incorporate requested Gherkin corrections and stop again. Proceed only when the user explicitly approves the current selected section's exact scenario text and execution mode. Change that section to `Status: Approved`, add `Approved: YYYY-MM-DD` immediately below it, and preserve its execution mode, scenarios, and traceability verbatim.

This step is complete when the selected section and execution mode are explicitly approved, every scenario has one unambiguous PR owner, and no unresolved contradiction remains.

## 4. Hand Off To Implementation

Treat approved `GHERKIN.md` as a supplemental test contract, not as a reason to edit or republish `PLAN.md`. The implementation orchestrator groups every approved scenario by its traceability PR and instructs the worker to invoke this skill before writing those tests. When no approved Gherkin section exists, this workflow creates no test requirement; it applies only to levels the user explicitly selected and approved.

### Worker Test Routing

For every approved Gherkin section supplied in the worker assignment, route by the section heading and read exactly the corresponding test-writing reference in full before editing tests:

- `## Unit` routes to [`UNIT.md`](UNIT.md).
- `## Integration` routes to [`INTEGRATION.md`](INTEGRATION.md).
- `## End-to-End` routes to [`E2E.md`](E2E.md).

The worker does not choose, infer, or reclassify the level. The approved section heading is the routing decision. When one PR is assigned approved scenarios from more than one section, apply each corresponding route only to that section's scenarios. Stop as blocked if a heading is unknown, the requested boundary contradicts its heading, or the applicable reference cannot be read.

After routing, inspect the repository's existing tests, test configuration, fixtures, helpers, and production interfaces. Write the smallest tests that faithfully prove every assigned approved scenario, keep each scenario ID in its test name or adjacent parametrization ID, and follow all rules and completion checks in the routed reference. Preserve the approved Gherkin text and its traceability. Do not create tests for unassigned scenarios or expand the selected level. The worker reports required test commands but leaves test execution to the implementation orchestrator.

The implementation orchestrator applies the recorded execution mode:

- **Test-first**: valid only for Unit. The worker writes the mapped tests before production implementation, the orchestrator proves a valid behavioral red state, and only then does the worker implement production behavior in the same planned PR.
- **With implementation**: the worker writes production behavior and mapped tests together in the same planned PR. Integration and End-to-End always use this mode.

After the mapped tests are written, the implementation orchestrator first inspects the worker's complete test diff against every assigned scenario and the routed reference. It returns incomplete or incorrect work to the worker before executing tests. Once the code inspection is satisfactory, the orchestrator runs the narrowest relevant command and then the selected suite. A red unit result is valid only during the test-first precursor, when new behavior reaches the intended production boundary and fails for the expected missing or incorrect behavior; collection, import, syntax, fixture, and environment failures are invalid. After production implementation, Unit, Integration, and E2E tests must all pass against their intended boundaries. The orchestrator never invokes `test-auditor` during implementation.

The contract route is complete when the approved supplemental contract is stable, uniquely assigned to planned PRs, and ready for `/implement`; no plan, production, test, fixture, configuration, branch, or issue has changed on that route. The worker route is complete when every assigned approved scenario has a traceable test written according to its routed reference and the worker has reported the orchestrator-owned validation.

## Gherkin Example

Good:

```markdown
## Unit
Status: Draft
Execution: Test-first
```

```gherkin
Feature: Cart quantity limits
  Rule: A cart line cannot exceed available stock

    @unit @UT-001
    Scenario: Requested quantity exceeds stock
      Given a product has 3 units available
      When 4 units are requested
      Then the request is rejected as exceeding available stock
      And the cart remains unchanged
```

Traceability: `BRIEF.md` AC-2; `PLAN.md` PR 1.

Bad:

```gherkin
Scenario: Call updateQuantity
  Given CartService is mocked
  When updateQuantity(4) is called
  Then line 42 throws StockError
```

The good scenario fixes the public behavior while leaving implementation choices open. The bad scenario specifies names, mocking, and source structure that the consumer does not observe.

## Research Basis

- Cucumber, [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/): scenario roles, observable outcomes, and concise examples.
- Cucumber, [Writing better Gherkin](https://cucumber.io/docs/bdd/better-gherkin/): declarative behavior over implementation procedures.
- Vue, [Testing](https://vuejs.org/guide/scaling-up/testing.html): Vue test levels, recommended tools, and public-interface testing.
- Ham Vocke / Martin Fowler, [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html): tests at different granularities and avoidance of duplicated coverage.
- Kent C. Dodds, [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details): tests should fail on broken behavior, not behavior-preserving refactors.
