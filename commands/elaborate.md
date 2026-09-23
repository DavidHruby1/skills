---
description: LLM explains clearly and simply code in a selected range.
argument-hint: <range of lines (recommended to use after /radar)>
---

Clearly and simply explain this part:

**$ARGUMENTS**

Read only enough surrounding code to understand the selected part correctly. Check relevant definitions, types, or the immediate caller when needed, but do not expand into the whole repository.

First explain in plain words:

1. What the code does and where it fits in the flow.
2. How it executes, preferably using one concrete example.
3. Why it works this way.

Then show focused exact snippets and explain their individual parts.

For non-obvious variables, explain where they come from and what they contain at that point.

Distinguish reasons proven by the code, tests, or documentation from your own inference. If the reason is unknown, say so instead of inventing intent.

If the code is not an algorithm, do not pretend that it is.

Use the `i-have-adhd` skill and write in Czech.
