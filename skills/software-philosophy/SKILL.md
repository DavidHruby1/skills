---
name: software-philosophy
description: Apply software-design principles when planning, implementing, or reviewing a concrete software change involving interfaces, information hiding, responsibility placement, or implementation clarity. Not for general programming explanations, routine mechanical edits, or unrelated planning; read-only use provides assessment criteria, not permission to implement.
---

# Software Philosophy

Implement the required behavior with the least necessary complexity, not the fewest lines. Apply the governing AGENTS.md rules for scope, abstraction, test selection, and verification; this skill guides implementation, not a separate workflow. An agent's assigned permissions and execution constraints still apply.

This skill guides design judgment, not repository coding conventions. Follow applicable repository documentation for local style, syntax, layout, and tooling; use these principles for choices those conventions do not settle.

Examples illustrate decisions under stated contracts, not universal rewrites. Python is illustrative, not a preferred implementation language. Transfer the reason to idiomatic TypeScript, Python, or the project's language while preserving its evaluation, error, and resource semantics. Do not mechanically translate the syntax.

## Definitions

These terms follow John Ousterhout's software-design vocabulary:

- **Module**: a unit of implementation with an interface, such as a function, class, or subsystem; not necessarily a file.
- **Interface**: everything a caller must know to use a module correctly: its signature, meaning, constraints, errors, side effects, and required call order.
- **Implementation**: the internal mechanism that fulfills the interface's contract and that callers should not need to understand.
- **Deep module**: provides substantial functionality through a relatively simple interface, hiding more complexity than its use introduces.
- **Shallow module**: exposes an interface whose learning and usage costs are large relative to the functionality it hides. A short function is not automatically a good module.
- **Information hiding**: keeping a decision or piece of knowledge inside a module so other modules need not know it or change with it.
- **Information leakage**: multiple modules must know the same internal decision, forcing coordinated changes when it changes.
- **Change amplification**: one requirement change requires edits in many places.
- **Cognitive load**: how much a developer must hold in mind to perform a particular change.
- **Unknown unknowns**: it is not apparent what must be understood or which code a change affects.
- **Define errors out of existence**: choose a contract that eliminates an otherwise necessary error case. This does not mean swallowing failures or returning false success.

Depth is not size: do not invent internal complexity to hide it. A general operation can remove special cases without adding hypothetical providers, configuration, or extension points.

## Use What Already Works

- Understand the affected contract and actual flow before choosing a smaller implementation. A small patch in the wrong place is still wrong.
- Before writing a replacement, look for an existing implementation that satisfies the same rule and contract. Reuse it only when its purpose fits; similar names or text are not sufficient evidence.
- Consider the standard library, native platform capabilities, and already-installed dependencies before adding custom mechanisms. Prefer less code to own, not fewer lines to display.
- These are options, not a rigid ladder. Choose what meets the real requirements and established project constraints; do not replace a suitable project dependency merely because a native alternative exists.
- A native date input may replace a custom picker if it meets the interaction requirements. A database constraint can guarantee integrity, but does not automatically replace authorization or useful input feedback.
- Use the existing dependency when it already solves the problem. Add a new dependency only when it removes enough necessary implementation or risk to justify its cost; a few lines are not a safe substitute for specialized security or parsing logic.

**Avoid: shorter code that implements only part of the format.** For CSV export where values can contain commas, quotes, or newlines:

```python
for row in rows:
    output.write(",".join(str(value) for value in row) + "\n")
```

**Prefer: the existing format implementation.** Here `output` is a text stream opened with `newline=""`:

```python
import csv

csv.writer(output).writerows(rows)
```

The library owns quoting and record formatting. It does not decide application policy, such as which fields the user may export or how spreadsheet formulas must be treated. Keep required policy rather than assuming the library solves the entire task.

## Keep Knowledge Local

- Put a rule where the relevant knowledge already lives, provided the module's purpose and name remain accurate. Keep distinct contracts separate even when their implementations look similar.
- Hide internal formats, external-system quirks, and required sequencing behind an interface when doing so removes knowledge from callers. Convert external representations at the appropriate boundary rather than spreading their details throughout the application.
- Prefer a simple interface that completes a useful operation over several calls whose ordering and shared state every caller must understand.
- Keep related decisions together. Do not split a clear function solely to make functions shorter or introduce a wrapper that only renames a call without hiding a meaningful decision or constraint.
- Judge an abstraction by what callers no longer need to know, not its pattern name, file count, or number of implementations. Do not centralize unrelated rules just to avoid similar lines.
- Prevent avoidable invalid states with appropriate types, construction, or operations. Validate untrusted data at boundaries; do not add defensive checks for states already excluded by an enforced contract.

### An Interface Should Remove Knowledge

**Avoid: every settings consumer knows the file format and preparation sequence.** These are illustrative call sites:

```python
raw = json.loads(path.read_text())
settings = apply_defaults(raw)
validate_settings(settings)
start_server(settings)
```

**Prefer: the settings module delivers a usable result.**

```python
settings = load_settings(path)
start_server(settings)
```

This is deeper only if `load_settings` actually owns decoding, defaults, and validation, and callers no longer need those details. Merely hiding the same sequence behind a new name while callers still validate or repair its result does not solve the leakage. Its contract must explain meaningful failures; it must not return defaults after an unreadable or corrupt file unless that behavior is explicitly required.

Do not build a generic loader framework for this. If the sequence occurs once and is already clear inside the responsible function, extraction may add nothing. Separate decoding from policy when current callers genuinely need those operations independently.

### Eliminate An Error Case, Not Error Reporting

For cleanup whose contract is "ensure this temporary file is absent," absence is success:

**Avoid: suppressing every filesystem failure.**

```python
try:
    path.unlink()
except OSError:
    pass
```

**Prefer: expressing the permitted case precisely.**

```python
path.unlink(missing_ok=True)
```

Missing files require no caller branch; permission and other deletion failures still propagate. Do not use this contract when a missing file indicates lost data or an incorrect operation.

## Expose Important Decisions

- Use precise names that explain domain meaning, units, and distinctions. Prefer explicit data flow to hidden mutation or required temporal knowledge.
- Keep the common path direct and make meaningful alternatives, cleanup, transactions, and resource lifetime visible. Flattening control flow is useful only when it makes those obligations easier to understand.
- Choose an expression when it communicates one coherent operation. Use explicit steps and meaningful intermediate values when they reveal distinct decisions, side effects, or failure handling that an expression would obscure.
- Do not compress code into one-liners, expand clear expressions mechanically, or add helpers merely to satisfy a line-count preference.

### Concision Versus Cognitive Load

- Use a list comprehension only when it is immediately readable on one line within the project's line-length limit. If it needs multiple lines or makes the reader mentally unpack its logic, use a regular `for` loop instead. Do not cram the expression onto one long line to evade this rule.

**Prefer a comprehension for a direct transformation and readable filter:**

```python
active_names = [user.name for user in users if user.is_active]
```

Expanding this simple one-line expression into initialization, a loop, a condition, and `append` adds ceremony without revealing a hidden decision. Fitting on one line is necessary for a list comprehension here, but not sufficient: its meaning must still be immediately clear.

**Avoid forcing traversal and several selection decisions into one expression:**

```python
results = [
    normalize(item.value)
    for group in groups
    if group.is_enabled
    for item in group.items
    if item.is_active and item.value is not None and can_process(item, user)
]
```

**Prefer explicit stages when the reader needs to distinguish those decisions:**

```python
results = []
for group in groups:
    if not group.is_enabled:
        continue
    for item in group.items:
        if not item.is_active or item.value is None:
            continue
        if can_process(item, user):
            results.append(normalize(item.value))
```

This preserves traversal order and short-circuiting while separating group eligibility, usable input, and processing permission. It is useful because those decisions become visible, not because loops are inherently better. A simple lookup or flattening expression may already communicate its intent directly. Apply the same judgment to comprehensions, collection chains, and callbacks; preserve evaluation order, early termination, side effects, and failures when changing their shape.

## Explain Missing Context

Actively check new and materially changed code for reader uncertainty. Can a maintainer understand a value's purpose, an operation's meaning, and its important constraints from its name and local context, without chasing hidden assumptions? If not, improve the name or structure; add a comment when essential context still cannot be expressed clearly in code. Do not default to either commenting everything or commenting nothing.

- Explain non-obvious domain meaning, units, constants, ordering constraints, known limitations, or reasons for a choice at the point where the reader needs that information.
- Document interface obligations that the signature does not reveal: relevant preconditions, return meaning, side effects, errors, or usage constraints. Describe what callers need, not a tour of the body.
- Keep comments concise and concrete in the repository's normal comment or docstring form. A variable may need a comment; an obvious function may not. There is no sentence quota.
- Do not narrate assignments, restate names, invent rationale, or hide unclear code behind a paragraph. Keep comments accurate when changing the code they explain.

### Fix A Name Before Narrating It

**Avoid comments that compensate for vague names or repeat assignments:**

```python
# Delay in seconds before the next retry.
d = 5
# Set the batch size to 100.
batch_size = 100
```

**Prefer a meaningful name, plus a comment only for missing context.** In this example the provider contract establishes the limit:

```python
retry_delay_seconds = 5
# The provider accepts at most 100 IDs per request.
batch_size = 100
```

The unit belongs in the name; the external reason for the limit belongs in a comment. If the choice of retry delay also has an important, established reason, document it too. Do not fabricate a reason for an unexplained constant.

### Describe The Contract, Not The Machinery

Suppose the order always has a customer, both address fields use None for absence, and selecting an address must not modify either stored address.

**Avoid vague purpose and implementation narration:**

```python
def select_delivery_address(order):
    """Handles address resolution. Checks checkout_address, then returns saved_address."""
    if order.checkout_address is not None:
        return order.checkout_address
    return order.customer.saved_address
```

**Prefer the non-obvious business meaning and fallback contract:**

```python
def select_delivery_address(order):
    """Prefer the checkout-only address without changing the saved customer address.

    Fall back to the saved address; return None when neither is available.
    """
    if order.checkout_address is not None:
        return order.checkout_address
    return order.customer.saved_address
```

This comment is useful because scope, mutation expectations, and absence behavior matter to callers. Do not add all of these topics to every function by template; explain only obligations that are real and not already obvious.

### Explain Why Order Or A Limitation Matters

Assume `commit` makes the invoice visible to the worker and the existing workflow requires committing before enqueueing.

**Avoid merely restating the next call:**

```python
transaction.commit()
# Enqueue the invoice.
enqueue_invoice(invoice.id)
```

**Prefer the reason a maintainer must preserve the ordering:**

```python
transaction.commit()
# The worker reads the invoice immediately, so it must be committed before enqueueing.
enqueue_invoice(invoice.id)
```

This explains ordering, not guaranteed delivery. If crash-safe delivery is required, the implementation needs an appropriate delivery mechanism; a comment cannot make these two operations atomic. Apply the same honesty to performance ceilings and other known limitations.

## Refactor Only For The Change

- Make a local structural improvement when it directly helps implement the current requirement or removes a risk in the changed path. Do not clean up unrelated code.
- A refactor preserves observable results, errors, defaults, data shapes, persistence, external calls, and relevant ordering and side effects. A syntactic rewrite of a condition or an early return can preserve behavior; establish equivalence rather than assuming it.
- Keep intentional behavior changes distinguishable from structural changes. Do not alter assertions or expected values merely to make a claimed refactor pass.
- When a consequential interface or placement decision has two credible alternatives, compare what callers must know and what must change together before choosing. Do not generate alternatives for routine edits or turn that comparison into a mandatory report. Resolve a risky assumption with focused source evidence, a permitted check, or clarification rather than building speculative structure around it.

## When Implementing Tests

Apply the AGENTS.md test-selection rules first. This section is not an instruction to add tests to every change and does not override an assigned production-only boundary.

- Prove specified or established observable behavior through the public boundary real callers use. Do not mirror private implementation wiring.
- Reuse the repository's runner, fixtures, and helpers when appropriate. Keep setup limited to what the tested behavior needs.
- Keep tests deterministic and independently runnable. Control nondeterministic external boundaries and restore changed state; do not mock the behavior being tested.
- Use explicit assertions and independently obvious expected values, not the production algorithm repeated in the test. Verify calls only when sending that command is itself the relevant outcome.
- Keep real collaborators where their interaction is what the test must prove. Stop adding cases once the required behavior and concrete uncovered risks are covered.
