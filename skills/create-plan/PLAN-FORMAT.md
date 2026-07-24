# PLAN.md Format

## How To Build The Plan

Design the PR sequence before filling in the format. Divide work at coherent responsibility boundaries, not by file count, architectural layer, or arbitrary line ranges.

1. Map every approved behavior, acceptance criterion, structural change, migration, and operational concern to required implementation work and PR ownership.
2. Identify complete building blocks, then combine adjacent blocks unless keeping them separate materially reduces risk or cognitive load, preserves useful standalone value, or is required by the hard size limit. Aim for the fewest coherent PRs, not the greatest possible decomposition.
3. Arrange the blocks as a dependency graph. No PR may depend on a later PR or leave deliberate breakage for a later PR to repair.
4. Put each production behavior in the PR that owns it, record applicable existing validation commands, and keep every PR independently verifiable. Do not include new test behavior, coverage, levels, scenarios, or test implementation in `PLAN.md`.
5. Group tightly coupled work when splitting would duplicate context or produce an incomplete contract. Split independent workflows, migrations, reusable foundations, or behavior-preserving structural preparation when each remains useful alone.
6. Estimate additions plus deletions for the planned production, migration, and configuration logic. Repartition when the size rules require it.
7. Audit the result against the brief: every acceptance criterion has one implementation owner, intermediate states remain safe and independently verifiable, and no blocking decision or assumption remains.

## PR Size Rules

- Target at most 500 changed logic lines per PR; never exceed 750.
- Count additions plus deletions. Rewrites and moved logic still count.
- Logic includes handwritten source, scripts, migrations, runtime or test configuration, and tests. Blank lines, comments, documentation, generated files, vendored code, lockfiles, and snapshots do not count, but substantial excluded diffs must be disclosed.
- A 501-750 line PR is valid only when a named split would increase cognitive load or break a coherent responsibility. State the estimate, rejected split, and reason.
- If the implemented PR exceeds 750 lines, split the behavior into smaller complete outcomes.
- Estimates are evidence-based, not promises. The implementation agent must measure the actual diff and repartition before opening a PR when it exceeds the hard maximum.

Use this structure. Omit only sections marked optional and replace every placeholder with project-specific content.

`Human Review` is the reader's fast path through the plan. Give every PR one matching subsection in stack order. Start with one sentence that explains the PR's role, follow with a short numbered list of concrete changes (normally two to five; do not split one change artificially), then explain any dependency, mechanism, or design choice whose importance would otherwise be unclear. Use plain language and enough detail that the PR can be understood without its execution contract. Avoid source paths, symbol inventories, commands, estimates, and worker instructions unless one is essential to understanding the behavior. The detailed `Pull Requests` sections remain authoritative and the review must not add scope, decisions, or promises.

```markdown
# Plan: <Concise Outcome>

## Approved Solution

<Describe the approved direction, why it was selected, and its accepted trade-offs. Do not repeat the brief or research.>

## Human Review

### Co PR 1 skutečně udělá

<Jednou větou vysvětlete, jak tento PR přispívá k celkovému plánu.>

**Plánované funkce a třídy:**

- `<Název funkce nebo třídy>`: <Vysvětlete, co bude dělat, jak bude fungovat a spolupracovat se zbytkem implementace a proč byly zvoleny právě tato odpovědnost a tento návrh.>
- `<Název funkce nebo třídy>`: <Vysvětlete, co bude dělat, jak bude fungovat a spolupracovat se zbytkem implementace a proč byly zvoleny právě tato odpovědnost a tento návrh.>

<!-- Zahrňte všechny funkce a třídy plánované pro daný PR. Podsekci zopakujte jednou pro každý PR v pořadí stacku. Zachovejte tento čitelný souhrn v souladu s autoritativní sekcí Pull Requests, ale formulujte jej méně mechanicky. Celou sekci Human Review pište česky; přesné identifikátory zdrojového kódu ponechte beze změny. -->

## Inputs

- Brief: `.opencode/artifacts/task-NNN/BRIEF.md`
- Research: `.opencode/artifacts/task-NNN/RESEARCH.md` <!-- Omit when absent. -->
- Relevant documentation: `<paths>`
- Relevant ADRs: `<paths>` <!-- Omit when absent. -->

## Plan-Wide Safety

- <Invariant, compatibility property, ownership rule, or cross-PR constraint that every PR must preserve>

## Pull Requests

### PR 1: <Reviewable Outcome>

**Outcome:** <Observable, independently mergeable result>

**Source evidence and reuse contract:**

- `<path:symbol or searched boundary>`: <Authoritative current responsibility, relevant callers, and evidence. Direct the worker to `call`, `extend`, `modify`, `move`, or `remove` this exact symbol; when no owner exists, record the searched boundary and concrete mismatch.>
- Parallel implementation guard: <Behavior that must remain owned by the existing symbol, or by the one justified new owner, and the duplicate helper, rule, transformation, or call path that must not be created.>
- New behavioral symbols: <`None`, or each proposed symbol and the concrete mismatch that prevents every credible existing owner from satisfying its responsibility.>

**Work:**

- `<path or boundary>`: <Concrete production changes, including how callers reach the exact existing symbols that remain authoritative>

**Steps:**

1. <First concrete assignment naming the exact existing symbols to call, extend, modify, move, or remove and why it precedes dependent work>
2. <Next safely ordered assignment; preserve the reuse contract and justify any new behavioral symbol against the source evidence>

**Traceability and existing validation:**

- [ ] <Brief acceptance criterion or supporting contract>: <implementation work that owns it>
- Existing validation: `<existing command or check>` exercises the affected boundary

**Dependencies:** <Earlier PRs or `None`>

**Out of scope:** <Work explicitly excluded from this PR or `None`>

**Size limit:** <Estimated additions plus deletions for planned production, migration, and configuration logic. State target compliance, justify 501-750 lines, and disclose substantial excluded changes; implementation measures the actual full diff under the rules above.>

<!-- Repeat the PR section as needed. -->

## Final Cross-PR Validation

<!-- Omit when no existing validation or operational check spans multiple PRs. -->

- [ ] `<existing command or operational check>` verifies the combined result

## Residual Risks

- <Known non-blocking risk, impact, mitigation, and owner>

## Unresolved

- <Non-blocking unknown, owner, and required resolution point>

<!-- Omit Unresolved when empty. Blocking unknowns are not allowed in PLAN.md. -->

## Published Issues

- Provider: <GitHub or GitLab, as required by repository instructions>
- Repository: `<owner/repository or group/project>`
- Task label: `task-NNN`

- [ ] PR 1: `<pending>`
- [ ] PR 2: `<pending>`; depends on PR 1

<!-- Before publication every item is pending. Publication may only check an item and replace its placeholder and PR dependency with verified issue references. -->
```

## Completion Checks

- The plan matches the solution explicitly approved during solution planning and does not silently change the brief.
- Human Review contains one clearly numbered subsection per PR in stack order, explains its concrete changes and important non-obvious connections in plain language, and is understandable without the execution contract.
- Human Review faithfully summarizes the authoritative Pull Requests sections without adding scope, decisions, promises, or conflicting instructions.
- Every brief acceptance criterion has one implementation owner, and applicable existing validation commands are recorded without prescribing new test coverage.
- Every PR is independently mergeable after its dependencies and completes its stated outcome.
- Every PR states its explicit out-of-scope work or `None`.
- The sequence uses the fewest coherent PRs; every split has a concrete benefit beyond technical separability.
- Every PR records applicable existing validation commands and leaves the system independently verifiable.
- Every PR targets at most 500 changed logic lines; no PR exceeds 750; every over-target PR justifies the rejected split.
- Work items name evidence-backed boundaries, and steps give a concrete safe implementation order rather than vague phases or repeated requirements.
- Every materially likely affected source file was read in full; each PR inventories existing behavioral owners, callers, and tests at symbol level.
- Every changed behavior names its exact authoritative existing symbol when one exists, directs how implementation will reuse it, and states which parallel implementation must not be created.
- Every new behavioral symbol is justified by concrete mismatches that prevent credible existing owners from satisfying the responsibility cleanly; similar existing behavior is explicitly reused or rejected.
- No PR creates a parallel implementation of an existing rule, transformation, side effect, or call path.
- Behavior and structural preparation are separated only when both remain coherent and safe alone.
- Risky premises are supported by repository or authoritative external evidence before irreversible dependent work.
- Existing tests and validation commands are inspected as current-system evidence without defining new test behavior, coverage, levels, scenarios, or implementation.
- Final cross-PR validation contains only checks that cannot be owned by one PR; it does not repeat every acceptance criterion.
- No blocking product, architecture, or external-contract unknown is delegated to implementation.
- Published Issues has exactly one item per PR in stack order, with matching dependencies and repository-instructed provider; items are pending before publication and checked only with verified issue references afterward.
- The plan contains no implementation code, speculative work, local coding prescription without a concrete risk, or restatement of research that does not guide execution.
