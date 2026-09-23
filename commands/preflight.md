---
description: Check whether a task's design is ready for final planning and implementation.
argument-hint: <task-xxx or task directory>
agent: plan
---

Review the task identified by `$ARGUMENTS`. Read its `ARCHITECTURE.md` and `TECHNICAL-DESIGN.md` in full, plus `PROPOSAL.md` if it exists.

Assess whether you understand the complete intended outcome, scope, behavior, contracts, and implementation direction well enough to proceed to the final plan and implementation without inventing decisions.

Respond concisely with:

- **Confidence:** a float from `0.0` to `10.0`
- **Reasoning:** why you gave that score, including any remaining ambiguities or questions
- **Verdict:** ready for final planning and implementation, or not ready
