---
description: Reconcile one explicitly selected task plan with its provider issue tracking.
agent: build
---

# Sync Issues

Invocation arguments: `$ARGUMENTS`.

Required argument: an explicit `task-xxx` identifier or a path to one existing plan file. If it is missing, invalid, or ambiguous, report the required usage and stop. Never infer the task from conversation history, the current branch, a discovered task directory, a provider issue, or the newest plan. Examples: `/sync-issues task-001`, `/sync-issues .opencode/task-001/PLAN.md`.

Resolve a task identifier only to that project's `.opencode/task-xxx/PLAN.md`. A supplied plan path selects that exact existing file and must identify its task explicitly in the plan or through one unambiguous `task-xxx` task directory. Do not create a plan, select a sibling plan, or reconstruct one from provider resources.

Read the project instructions and selected plan, then invoke `ticket-master` once with:

- `Action: reconcile`
- the project root
- the exact selected plan path
- the task ID resolved from that plan
- the verified tracking provider repository and complete repository-qualified PR map

`ticket-master` owns all provider issue discovery and reconciliation rules. Do not implement code, modify task artifacts, invoke implementation, create or update a PR/MR, or use a local issue manifest. Return the ticket-master outcome and stop. A reconciliation failure is tracking-only; report it as partial or blocked without changing the plan or starting implementation or publication.
