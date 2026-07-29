---
description: Helps me find the most relevant code snippets and related locations for a feature request
argument-hint: <feature request>
---

Explore the codebase and help me understand it before implementing the following feature:

**$ARGUMENTS**

Do not implement it or propose a patch.

Instead:
1. Find the smallest number of code sections that directly control the feature.
2. Show full code snippets only for the most important entry points, typically:

   * the relevant template or UI section
   * the event handler or main function that controls the behavior
3. Do not show snippets for helpers, utilities, types, or secondary functions unless they are essential to understanding the main behavior.
4. After the main snippets, list the remaining relevant functions, hooks, utilities, types, and tests only with their file, line range, name, and a concise explanation.
5. Describe the event and data flow between the relevant parts.

Prefer a small number of highly relevant files and snippets. If a feature touches many sections in one file, show only the sections that directly trigger or control it.

For every snippet or referenced function, always include 1-3 bullet points explaining how it works and why it matters. Three bullet points is a hard maximum.

Only use @explore subagents to search the codebase, but only if necessary meaning the feature span is broad and complex **across more than 4 files.**

Output format:

````md
## `{file path}` **{line range}** - {section or element name}

```{language}
{code snippet}
```

- {how this section works}
- {why it matters}

## `{file path}` **{line range}** - `{handler or main function signature}`

```{language}
{code snippet}
```

- {how this function controls the behavior}
- {how it connects to the previous snippet}

## Related code

`{file path}` **{line range}** - `{function, hook, type, utility, or test name}`
- {what it does}
- {how it relates to the feature}

`{file path}` **{line range}** - `{function, hook, type, utility, or test name}`
- {what it does}
- {how it relates to the feature}

## Event and data flow

1. {where the interaction starts}
2. {which handler receives it}
3. {which state or related functions it uses}
4. {how the UI or data changes}
````
