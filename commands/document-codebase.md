---
description: Create or improve concise, source-backed fullstack documentation, onboarding, and evidenced architecture decision records.
---

# Document Codebase

Document the current codebase so a maintainer can run it, understand its boundaries, find the right place for a change, and preserve important rules. Build a useful map, not an encyclopedia of files.

Requested path or scope: $ARGUMENTS

## Scope and Evidence

- Use the requested project or scope; default to the current project root. Read its `AGENTS.md`, existing documentation conventions, and `docs/onboarding.md` when present before choosing a structure.
- Focus on the actual fullstack application: frontend, backend, their contracts, development workflow, and relevant operations. Do not invent absent components or infrastructure.
- Read source, tests, scripts, manifests, configuration, and CI where they establish behavior or supported workflows. Dependency contents, vendored code, build output, and generated files are not documentation subjects; generated contracts can be referenced, not manually edited.
- Source proves current implementation, not original intent. Use approved decisions, ADRs, issues, PRs, or explicit user confirmation for rationale. Planning artifacts are evidence of intent, not proof of implementation.
- Preserve existing human-written intent and unrelated edits. If code and an accepted contract disagree, report the conflict and ask before changing the contract. Do not silently endorse implementation drift.

## Process

1. Resolve the root and scope. Inspect Git status when available. In a Git repository, preserve the existing branch workflow: create and switch from current `HEAD` to `docs/codebase-documentation`, or the first free `docs/codebase-documentation-N` starting at `2`, checking local and known remote refs. Do not force a switch or discard changes; ask if a safe switch is blocked. Without Git, work in place and report that limitation. Do not commit, push, or publish without explicit authorization.
2. Map the relevant entrypoints, major responsibilities, API boundary, data ownership, and supported development commands. Trace important flows across frontend and backend rather than cataloguing every file. Use direct searches for known scopes; delegate broad read-only discovery to `explore` only when useful.
3. Inspect existing docs and identify reader questions that are unanswered or stale. Choose the smallest set of pages to create or update. Record each target's audience, primary question, source scope, and canonical ownership. Do not create empty directories, placeholder pages, or one document per module by default.
4. Write source-backed documentation. Work directly for small scopes. Delegate independently useful code explanations to `docu-writer` with precise sources, audience, target path under `docs/`, required sections, and non-overlapping ownership. The caller owns the overall structure, onboarding, workflow guides, ADR handling, and validation; no agent-count or file-count quota applies.
5. Verify the written pages against their sources, then update navigation. Check local links, command definitions, important behavior claims, and the final change scope. Run existing relevant documentation checks if available; do not add tools just for this task. Report changed paths, inspected coverage, checks actually run, and unresolved gaps concisely.

## Structure

Keep documentation under repository-root `docs/`. Preserve an established useful layout instead of migrating it to match a template. The root `README.md` is the entry point: project purpose, a verified quick start or link to it, and documentation links. Do not duplicate setup instructions there and in several guides.

For a project without documentation, start with only the pages needed from this shape:

```text
README.md
docs/
    onboarding.md
    architecture.md
    development.md
    frontend.md
    backend.md
    adr/
        0001-<decision>.md
```

`onboarding.md` gives a short starting path: prerequisites, links to setup and architecture, and where to begin a change. It is not another copy of those pages. Use an existing `docs/README.md` or index as navigation when present; avoid multiple competing indexes. Create folder indexes only when they improve discovery.

Split into `docs/architecture/`, `docs/frontend/`, `docs/backend/`, domain pages, or operations/runbooks only when distinct reader questions or ownership justify it. Keep cross-stack flows in one canonical page and link from frontend/backend docs. Existing component READMEs may link to the canonical docs; do not create competing documentation trees beside each application.

## Large Codebases

For a large or modular system, first create a documentation inventory of domains and meaningful modules: their responsibility, public boundary, data ownership, invariants, and key integrations. For each, explicitly decide whether it needs a dedicated page, is adequately covered by a canonical contract or parent domain page, or has no non-obvious behavior to document. Keep this inventory as a short index in the relevant documentation navigation when it materially improves discovery.

Document every meaningful boundary, not every directory, file, endpoint, or function. Organize independent domain or module pages in focused subdirectories and delegate their source-backed explanations in non-overlapping batches when useful. A concise top-level architecture map must link to this deeper documentation; it is not a substitute for it.

## What to Explain

Select applicable topics, not a mandatory section checklist:

| Area | Maintainer questions |
| --- | --- |
| System | What does it do? What are the boundaries and external dependencies? Where does a representative user action go? |
| Frontend | How do routing, rendering, server/client state, data fetching, cache invalidation, forms, and errors work? Where are shared UI and accessibility conventions? |
| Backend | Who owns domain rules and data? Where are authorization and validation enforced? What are transaction boundaries, job/retry semantics, and integration failure behavior? |
| Fullstack contract | Where is the canonical API/event schema? How do authentication, errors, pagination, compatibility, and client generation work where applicable? |
| Development and operations | How do I set up, run, test, migrate, deploy, observe, troubleshoot, or roll back this application using its existing workflows? |

Document a module separately only when its public boundary, data ownership, invariants, or non-obvious behavior warrants it. Link to a few useful entrypoints, not every function. Include critical failure paths and security boundaries; hiding a button is not backend authorization.

Reference the existing canonical contract, such as OpenAPI, GraphQL, or shared schemas. Do not manually duplicate endpoint/type inventories or introduce a different contract technology. Explain semantics and usage that the schema does not capture. If a contract is missing or inconsistent, report the gap rather than changing application code.

Use diagrams only to answer a concrete question: system context, major runtime units, or a significant cross-stack sequence. Do not diagram every class or assume a C4 container means Docker. Deployment descriptions must distinguish checked-in configuration from verified live infrastructure.

## Writing Rules

- Write for the repository's audience in its established language and terminology. Prefer short paragraphs, descriptive headings, active voice, and concrete examples. Put the answer before background; avoid filler, promotional language, and generic framework tutorials.
- Separate learning walkthroughs, task-oriented how-to guides, exact reference, and explanations. This distinction guides content, not a requirement to create four directories. Link to background instead of burying a procedure in it.
- For procedures, state prerequisites, working directory, exact supported steps, and how to recognize success. Explain destructive effects, permissions, and recovery where relevant. Never execute migrations, deployments, or destructive instructions merely to validate prose.
- Give each fact one canonical home. Link to contracts, scripts, source entrypoints, or existing pages rather than maintaining competing copies. Use stable relative links where possible and a short sources section for substantive explanations.
- Explain non-obvious rules and evidenced reasons, not syntax. Omit irrelevant sections and speculative risk lists. Never expose secrets; use placeholders and document variable purpose, not real credentials. Distinguish source-checked commands from commands actually executed.

## Architecture Decision Records

Keep current architecture separate from decision history. Follow the repository's ADR location and format; otherwise use `docs/adr/NNNN-short-title.md`, with unique increasing numbers that are not reused.

An ADR records one consequential decision about boundaries, data ownership, interfaces, security, operational qualities, or significant technology choices. Routine refactors and easily reversible local details do not need one. A documentation command records decisions; it does not make architectural choices or approve proposals.

Use this small structure when no template exists:

```markdown
# ADR-NNNN: <Decision>

Status: <proposed | accepted | rejected | deprecated | superseded by ADR-NNNN>
Date: <verified decision date, or explicitly labelled retrospective recording date>

## Context
<Problem, constraints, and decision drivers supported by evidence.>

## Decision
<One explicit choice and its scope.>

## Alternatives
<Actually considered options and evidenced reasons for rejecting them.>

## Consequences
<Benefits, costs, risks, and obligations.>

## Links
<Decision evidence and related architecture or implementation.>
```

Do not infer acceptance, decision dates, rejected alternatives, or rationale from installed packages or code alone. For retrospective ADRs, identify the evidence and recording date; if approval or material rationale is missing, ask the user or report a candidate gap instead of fabricating a record. Never manufacture ADRs just to fill the directory.

Preserve accepted and rejected decision history. A changed decision requires a new evidenced ADR; update the old status and replacement link only when supersession is confirmed. Keep reciprocal links and update current architecture separately. Do not rewrite historical reasoning to match today's code.

## Completion

Review actual written content, not only subagent reports. Verify consequential claims and references against named sources; report uncertain areas without claiming full coverage. Remove duplication introduced by this run and ensure navigation reaches new pages. Existing docs lint/build/link checks validate formatting and references, not factual correctness.

Finish with at most five concise bullets: branch/location, changed documentation, coverage, validation, and material gaps. Do not claim setup, tests, or production workflows were executed when they were only inspected. Remind the user that documentation should change in the same PR as future related code changes, not wait for another full-codebase pass.
