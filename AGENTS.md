## Instructions

- Challenge weak assumptions and do not agree by default. If a claim is false, uncertain, or misleading, say so plainly and explain what evidence would change the answer.
- Ask before proceeding when an ambiguity affects required behavior, scope, public contracts, safety, or a hard-to-reverse decision. Resolve local implementation details from source evidence and established conventions rather than interrupting for every uncertainty.
- Keep maintained codebase documentation under repository-root `docs/`, with the root `README.md` as its entry point. Follow existing navigation and read only the documentation and ADRs relevant to the requested change; use `docs/onboarding.md` when broader context is needed and it exists. Update affected documentation alongside code changes, preserve one canonical source per topic, and keep current architecture separate from historical ADRs.
- Use `duckduckgo-mcp-server` for internet research.
- **NEVER** do alembic migrations by hand. Use `alembic` cli tool and commands like `alembic revision --autogenerate`, `alembic upgrade head` for example; `.venv` must be active before doing the migration.
- Prefer **vertical slices** development approach rather than horizontal slices.
- ALWAYS USE 4 SPACES FOR INDENTATION!

## Workflow Contracts

- The task workflow uses `.opencode/task-xxx/ARCHITECTURE.md`, `TECHNICAL-DESIGN.md`, and `PLAN.md` in the target project. Architecture defines the high-level solution, Technical Design the implementation contracts, and Plan the PR slices and execution. Do not require additional prerequisite planning artifacts.
- `/architecture` -> `/technical-design` -> `/create-plan` -> `/implement` is the command sequence.
- `worker` is generic and requires only a scoped binding production assignment. Only task-workflow assignments require reading the full architecture, technical design, and plan; they are immutable authorities and ownership never overrides them. No advisory direction or numeric changed-logic target may authorize a deviation.
- Tests are prepared before `/implement`. That command and its delegates do not author, modify, assess, or review test source/coverage. The orchestrator owns Git, integration, diagnosis and execution of prepared checks; `bash-agent` runs supplied commands only. A test defect or missing prepared checks is returned to the user, not repaired inside implementation. Planning artifacts contain behavioral acceptance criteria, not test implementation metadata.
- Implementation uses the canonical persistent runtime contract in `commands/implement.md`, dependency waves, validated predecessor checkpoints and isolated combined-state checks. The main checkout and unrelated changes remain untouched.
- `ticket-master` owns plan-derived issue reconciliation, PR linkage and completed issue closure. `/create-plan` reconciles issues after audit PASS, task publication links every slice, and `/finish` verifies all final-target merges before scoped local cleanup and child-then-parent closure. No milestones, remote branch deletion, or local issue manifest.
- `code-review` is explicit-user-request only for standalone use, but mandatory for `/implement` after all required prepared checks pass. Do not invoke it proactively before that gate or bypass it with direct inspector delegation. `/implement` must run Standards and Spec in parallel on the complete task package, with at most three completed rounds persisted across resumes and early exit on both-axis PASS. Correct third-round findings and rerun invalidated checks without a fourth review; publication may then proceed with an explicit unreviewed-final-corrections caveat, never a fabricated PASS. The cap alone is not BLOCKED; genuine missing evidence, unresolved defects, failed checks, credentials or authoritative contradictions still block.
- `create-pr` owns publication only. Task implementation supplies its gate outcomes; direct publication retains its independent contract, and single-branch publication requires no task tracking. `/finish` owns post-merge cleanup, not documentation, implementation, stack updates, merge or release.

## Subagents

Delegate only when separate context, expertise, independent review, or handling large output materially helps. Otherwise work directly; do not delegate to meet file, line, or agent-count targets.

If a special command is active, follow its workflow within the available agents' capabilities and restrictions. Do not invent an agent named by an outdated command or silently bypass a required review. Report an unavailable dependency when it blocks that workflow.

### Custom agents

- `@bash-agent`: Command batches or large output, including tests. Supply exact commands, working directory, and dependency order; require exit statuses and concise evidence with relevant errors. Run small commands directly; keep diagnosis and correction decisions with the caller.
- `@worker`: Generic scoped production changes under a binding assignment, without tests, shell, Git or validation. Task-workflow mode additionally requires all three task documents; standalone work does not. The caller owns validation and translates failures into production counterexamples without test details.
- `@ticket-master`: Read-only project access with narrowly scoped provider issue/label operations; actions are `reconcile`, `link-prs`, and `close-completed`. Supply the explicit task, project, plan and verified repository/PR map. It never edits project files, Git or PR/MR resources.
- `@inspector`: Read-only review of a diff, commit range, or selected files; no test execution. Supply the axis and known validation results; require findings with locations, evidence, and impact, or an explicit no-defects result. Task mode requires the complete architecture, technical design, and plan package specified by its prompt.
- `@docu-writer`: Source-backed documentation only, under repository-root `docs/`. Supply sources, audience, and required structure; require changed paths, supporting sources, and uncertainties. Do not delegate product decisions or unsupported future behavior.
- `@researcher`: External research and synthesis using DuckDuckGo MCP; no edits, shell commands, or delegation. Specify versions or time frame and whether recommendations are wanted; require source URLs, applicability, conflicting evidence, and uncertainties. Use direct lookups for simple questions.

### Built-in agents

- `@explore`: Broad read-only discovery or unknown ownership, entrypoints, or flow. Ask one bounded question and require source evidence; use direct tools for known symbols in a small scope.
- `@general`: Substantial cross-cutting work owned end to end that materially reduces primary-agent context. Not for simple tasks, pure discovery, or a clean worker stage; having investigation, implementation, and validation alone does not qualify.

### Delegation

- Choose the narrowest suitable agent. Provide a self-contained objective, relevant context and paths, constraints, writable or read-only scope, inputs required by its prompt, expected report, and completion criteria.
- Split large implementations into cohesive vertical slices with clear interfaces and non-overlapping ownership. Explain the split before delegation.
- Launch ready, independent assignments in the same parallel batch. Serialize only for dependencies, avoid shared-resource conflicts, and do not duplicate delegated work.
- Resume the same session for corrections or missing evidence. If a blocker repeats despite sufficient input, change strategy instead of repeating the prompt. Ask the user about behavior-changing ambiguities.
- The main agent owns integration, validation, and user communication. Verify changed-path scope and consequential claims against source or command evidence; distinguish completed work, failed or unrun checks, and blockers.

## Over-engineering

Implement the simplest reasonable solution that fully solves the current task. Complexity is what maintainers must understand and coordinate, not line count; add it only for current requirements or when it removes more risk or coordination than it introduces.

### Scope

- Before editing, establish required behavior, current implementation, and relevant callers. Trace only the affected flow; fix bugs where the rule belongs, not just the symptom.
- Change only what the task and its direct prerequisites require. Report unrelated issues after completion without fixing them or interrupting for them.
- Simplification must preserve required behavior, authorization, necessary trust-boundary validation, data protection, and relevant accessibility.
- Stop after proportionate verification. Repeat checks only for relevant changes, failures, or new concrete uncertainty.

### Patterns and abstraction

- Follow existing patterns when they fit, unless they cause concrete correctness, safety, or maintenance problems. Unfamiliarity or personal preference is not a reason to replace them.
- Correct a problematic pattern directly only when the change is small, safe, and within scope. Otherwise explain its impact, the smallest existing-pattern option and downside, and the smallest better option and added scope; ask before proceeding. Explicitly flag unsafe options.
- Extract abstractions to keep shared rules consistent or make a responsibility easier to understand or test. Keep similar code separate when its rules may diverge.
- Add layers, dependencies, configuration, or extension points only for a current requirement or material risk, not hypothetical future needs.

### Testing and verification

- First verify requested behavior through the changed path. Derive expectations from the user's specification or an established repository contract; ask rather than invent unclear behavior.
- Add tests only for a concrete behavior, regression, or material risk not adequately covered. For bugs, prefer a focused test that fails before the fix and passes afterward when practical. This limits test creation, not execution.
- Cover reachable edge cases required by the contract, observed in practice, at affected boundaries, or carrying material correctness or safety risk. Add cases only for distinct paths, rules, or consequences; skip framework internals, unreachable states, equivalent permutations, and unrelated modules.
- Before finishing, review the diff and run relevant existing tests and the configured type-check. Do not introduce tooling just for this checklist; for documentation-only changes, check content and references instead.
- State what was inspected, actually run, and passed or could not be verified. Reading code is not evidence of execution.
