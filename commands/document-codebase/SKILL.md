---
name: document-codebase
description: Build whole-codebase docs by creating the docs structure, delegating source-backed files, then writing onboarding and index files from accepted reports.
disable-model-invocation: true
argument-hint: "[codebase path or scope]"
---

# Document Codebase

Build source-grounded codebase documentation by mapping first, creating the docs structure, delegating source-backed files, then writing onboarding and index files from accepted reports.

## Process

1. Resolve the codebase scope. If the user gives no path, use the current project root. Completion: one root or explicit scope is named.
2. Create a documentation branch before mapping or writing. Require the scope to be in a Git repository. From the current `HEAD`, create and switch to `docs/codebase-documentation`, or the first free `docs/codebase-documentation-N` starting at `2` when that name exists in local or known remote refs. Completion: one new documentation branch is checked out.
3. Map before reading. Query an existing `graphify-out/` first to narrow the whole-codebase architecture, dependencies, communities, entrypoints, and relationships. Verify the map in source, using `ast-grep` only for syntax-aware structural checks where it improves precision. Completion: the major code areas and their source evidence are listed.
4. Plan and create the docs structure. Start coarse and split only when source-backed concerns have different reader questions or source ownership. Use `docs/architecture/` and `docs/modules/` for a single component; in a monorepo, use component roots such as `docs/backend/` and `docs/frontend/` with their own architecture and module subdirectories. Create the needed directories before delegation. Do not create `docs/README.md`. Completion: every proposed source-backed doc has a target path, writer, audience, source scope, and reason to exist, and the required directories exist.
5. Delegate source-backed files. Spawn one writing subagent per source-backed documentation file. Use `docu-writer` for each module and architecture document. Give each subagent exactly one assigned scope, audience, target documentation path, and any section requirements. Completion: every delegated file has a concise subagent report.
6. Check subagent reports. Compare each report against its assignment: target path written, assigned scope inspected, sources named, uncertainty reported, and no global docs-tree decision made by the subagent. Inspect target files or source only when the report is insufficient or inconsistent. Completion: every accepted source-backed file has a report that matches its assignment, and every rejected or uncertain file has a reason.
7. Write navigation files from accepted reports. After source-backed files are accepted, create or update onboarding and folder `index.md` files only from the planned tree, accepted reports, and verified target files. Use `docs/onboarding.md` for repository-wide navigation and `docs/<component>/onboarding.md` for component navigation. Completion: onboarding and indexes point to existing accepted docs, state gaps explicitly, and do not introduce new code claims.
8. Report coverage. Return the documentation branch, files created or updated, subagents used, accepted reports, rejected or uncertain reports, skipped docs, source areas inspected, and unresolved uncertainty. Completion: the user can see where the work lives, what exists, what was checked, and what is not proven.

## Exploration Rule

When `graphify-out/graph.json` already exists, use `graphify query`, `graphify explain`, `graphify path`, or `graphify affected` to narrow broad documentation boundaries and relationships before ordinary file reads. Do not build a graph solely to satisfy this workflow; when no graph exists, map with glob, grep, read, and LSP.

Use `ast-grep` after scope mapping only when syntax-aware structure improves the precision of facts such as framework entrypoints, route declarations, API clients, state stores, controllers, services, jobs, or schema definitions. Use direct read, glob, or grep for known files, names, strings, configuration, documentation, and localized questions.

If no usable graph exists or Graphify is blocked by permissions, continue with glob, grep, read, and LSP, adding `ast-grep` only for syntax-aware checks where structure improves precision. Do not skip the mapping step.

## Target Files

Use this shape as a starting point, not a quota. Plan source-backed files for writing subagents, then plan `onboarding.md` and folder `index.md` files for the orchestrator after reports are accepted.

```
docs/
    onboarding.md
    architecture/
        index.md
        frontend.md
        backend.md
        data.md
    modules/
        index.md
        <module>.md
```

Create only source-backed files supported by the repository and an available writer. Create `onboarding.md` and folder `index.md` files only after subagent reports are accepted. Prefer fewer, clearer files over a scattered tree.

For a monorepo with independently owned components, apply the same shape beneath `docs/<component>/`, for example `docs/backend/architecture/` and `docs/frontend/modules/`. Keep cross-cutting documentation directly under `docs/`.

## Ownership

- `docs/architecture/`: cross-cutting technical structure, not individual product modules.
- `docs/modules/`: one coherent business, product, or domain area per file.
- `docs/onboarding.md`: maintainer starting path through accepted documentation, written after source-backed docs exist.
- `index.md`: folder navigation for accepted files in that folder, written after source-backed docs exist.

## Split Rule

Start coarse. Split an architecture file only when the split reduces file-choice ambiguity or cognitive load.

One target file is valid when it has one ownership sentence, one primary reader question, and one source scope that can be explained without switching domains. A scope may include many files, but they must serve the same module or architecture concern.

Good splits have different reader questions or different source ownership:

- `frontend.md`: UI layers, routing, state, API access, and frontend boundaries for a modest frontend.
- `routing-and-navigation.md`: only when routing is large enough to own its own source scope.
- `state-and-api.md`: only when state management and API boundaries are substantial and recurring.
- `backend.md`: request flow, services, jobs, and backend boundaries for a modest backend.
- `data.md`: persistence, schema ownership, migrations, and data lifecycle.

Avoid tiny architecture files whose titles overlap. If two topics must be understood together, keep them together.

## Subagent Contract

Use one writing subagent per source-backed target documentation file. The orchestrator plans the docs tree, creates directories, checks subagent reports, then writes `onboarding.md` and folder `index.md` files from accepted outputs.

Do not assign one subagent several module docs, several architecture docs, or a mixed module-plus-architecture bundle.

Allowed subagent scopes:

- One module: one coherent business, product, or domain area, written to one `docs/modules/<module>.md` file.
- One architecture concern: one cross-cutting technical concern, written to one `docs/architecture/<concern>.md` file.

If a proposed module or architecture concern fails the one-file test, split the target documents first, then spawn one subagent for each resulting file. If two proposed scopes cannot be separated without duplicating the same source explanation, keep them in one document and use one subagent.

Before delegating, keep an assignment table with these columns: target path, writer, scope, audience, reason, and acceptance status. Use this table for report checking and final coverage reporting.

For each `docu-writer` task, provide:

```
Code scope: <paths, symbols, routes, packages, or graph communities>
Audience: <new maintainer | feature maintainer | architecture reader>
Target path: docs/<...>.md
Section requirements: <optional deviations from docu-writer default>
Do not decide the global docs tree. Write only this target file. Return only a concise report.
```

Delegate source-backed module and architecture documentation to `docu-writer`. Do not plan or create a root `docs/README.md`. Do not assign folder indexes or onboarding guides to `docu-writer`, because its contract is code documentation only. Write navigation files in this skill after source-backed docs are accepted.

Keep docs-tree planning, directory creation, subagent assignment, report checking, navigation-file writing, coverage decisions, and final user reporting in this orchestrator.

## Report Check

Accept a subagent report only when it confirms:

- The target path was created or updated.
- The inspected sources match the assigned scope.
- The report names unresolved uncertainty or says there is none.
- The subagent did not claim ownership of the global docs tree.
- The assigned file type matches the assigned scope.
- The file documents actual application, library, or domain source code and none of the excluded tooling, dependency, generated, or repository-metadata subjects.

If a report is missing any of these, ask the same subagent to correct the target file or report before accepting it.

## Navigation Files

Write repository-wide `docs/onboarding.md`, component `docs/<component>/onboarding.md`, and folder `index.md` files after report checking, not before delegation. Create only the navigation files required by the planned tree. These files are navigation, not new source documentation.

Navigation files must:

- Link only to accepted documentation files that exist.
- Explain when to read each linked file.
- State skipped or uncertain areas without inventing behavior.
- Avoid duplicating module or architecture explanations from source-backed docs.

Do not create `docs/README.md`.

## File-Choice Rule

Make file choice obvious inside each delegated assignment. When ambiguity is likely, require an ownership note near the top of the target file:
```
Use this file for <scope>. Use `<other-file>` for <different scope>.
```

## Grounding Rules

- Treat `docs/` as documentation of the actual application, library, and domain source code only. Build tooling, dependencies, generated output, vendored code, and repository metadata are outside documentation scope.
- Never document `node_modules/`, dependency contents, generated or distribution directories, package-manager files, or tool configuration such as Vite, Webpack, TypeScript, ESLint, Prettier, Babel, test-runner, CI, container, editor, and deployment configuration. These files may help locate the real source tree, but they must not become documentation subjects, sections, claims, target files, or navigation entries.
- Document only behavior, structure, and workflows implemented by application, library, or domain source code.
- State uncertainty when source evidence is incomplete.
- Do not invent product requirements, roadmap, production topology, commands, services, or environment variables.
- Prefer repository terminology over generic architecture language.
- Preserve existing docs unless they are clearly stale, duplicated, or contradicted by code; report uncertainty instead of overwriting ambiguous human-written intent.
