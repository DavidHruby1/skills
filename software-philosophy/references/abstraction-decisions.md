# Abstraction Decisions
Use when creating, removing, splitting, merging, or moving functions, modules, classes, hooks, components, or boundaries.

Bad abstractions make code look clean while spreading knowledge, increasing jumps, hiding behavior, or supporting imaginary future needs.

Create an abstraction when it:
- hides real knowledge or names a real domain/implementation concept
- reduces duplicated business, data-shape, formatting, validation, or lifecycle knowledge
- makes the common case easier and harder to misuse
- separates things that change for different reasons
- pulls complexity into the module that owns it
- prevents callers from knowing external quirks, ordering rules, or internal data shapes

Do not create an abstraction when:
- there is only one use and no hidden concept
- it only forwards arguments or returns the same result
- the name is vague, such as `manager`, `handler`, `processor`, `helper`, `utils`, or `data`
- callers still need to understand the internals
- it exists only to make code look clean
- it creates more files without reducing cognitive load
- it encodes speculative future variants
- one clear function is easier to read than several tiny ones

Complexity red flags:
- change amplification: small requirements force edits in many places
- cognitive load: readers must hold too many facts, modes, flags, ordering rules, or cross-file assumptions
- unknown unknowns: a reasonable change can miss a hidden dependency
- temporal coupling, scattered special cases, duplicated defaults, repeated conditionals, leaked API shapes, and comments that describe rules code does not enforce

Diagnose before changing structure:
- name the symptom first: change amplification, cognitive load, unknown unknowns, duplicated knowledge, leaked data shape, temporal coupling, or behavior drift
- change structure only when the move reduces that symptom for the current task or next likely change
- if the symptom is only ugliness, style preference, or discomfort with local mess, stop unless a small safe improvement is obvious

Useful boundary questions:
1. Which decision lives here?
2. Which callers no longer need to know that decision?
3. Which future change becomes localized?
4. Which misuse becomes harder?
5. Does the boundary reduce change amplification or just move it?

Good fix directions:
- Centralize duplicated business knowledge.
- Move external data quirks to boundary code.
- Replace mode flags with explicit functions when behavior truly differs.
- Encapsulate ordering rules inside one operation.
- Rename vague concepts before extracting more code.
- Inline shallow pass-through layers.
- Add comments only for hidden constraints that code cannot express clearly.

Stop when the boundary hides the relevant knowledge, the common path is clear, the diagnosed red flag is removed locally, or further splitting would only fragment one idea.

Examples: [examples/abstraction-decisions.md](../examples/abstraction-decisions.md), [examples/ai-failure-modes.md](../examples/ai-failure-modes.md).
