---
description: Compact the current conversation into a handoff document for another agent to pick up.
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it under `/tmp` - not the current workspace.

Do not duplicate content already captured in other artifacts (briefs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
