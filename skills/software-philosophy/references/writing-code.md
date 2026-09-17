# Writing Code

Use when adding implementation code, modifying existing structure, refactoring locally, deciding where logic belongs, or deciding whether a comment should exist.

New code often works locally while spreading knowledge, adding hidden modes, inventing layers, or hiding simple behavior behind impressive structure. The right change satisfies the requested behavior with the least accidental complexity.

## Do

- Build context from existing code before editing.
- Put logic where the relevant knowledge already lives.
- Use precise, consistent names for real domain concepts and decisions.
- Keep the common path obvious, direct, and readable.
- Use guard clauses and early `return`, `continue`, or `throw` for invalid states, failed preconditions, exceptional cases, and branches that can finish immediately. Do not nest `if` blocks when handling a condition up front can leave the main path flat and linear. Preserve nesting only when the alternatives genuinely belong together or an early exit would obscure lifecycle, cleanup, transaction, or control-flow semantics.
- Convert external data shapes at boundaries.
- Prefer simple data flow over hidden mutation or temporal ordering.
- Keep related decisions together when splitting would leak assumptions.
- Make avoidable errors impossible with types, explicit operations, defaults, validation, or localized construction where practical.
- Follow nearby style unless it is actively causing complexity.
- Apply the Abstraction Gate in [SKILL.md](../SKILL.md) whenever deciding where a rule belongs or whether to extract, extend, or create an abstraction.

## Refactoring

- Refactor only where it supports the current change.
- Make the smallest behavior-preserving structural move that relieves current pressure.
- Preserve public interfaces unless changing them is part of the task.
- Separate feature and refactor changes in the explanation, patch, or commits when practical.
- Do not call it behavior-preserving if ordering, defaults, errors, data shapes, side effects, or tests changed.

## Syntax Simplicity Gate

Optimize for reader comprehension, not line count.

A comprehension is simple only when it performs one direct transformation, has at most one simple condition, has no side effects or nesting, and needs no mental unfolding.

Use a `for` loop when code has multiple transformations or conditions, a nested comprehension, a complex boolean, several calls, fallback or exception behavior, side effects, decision steps, named intermediates, or a `next`/`map`/`filter`/generator/chaining expression that must be mentally expanded. A simple `next` lookup is allowed.

Good simple comprehension:

```python
active_names = [user.name for user in users if user.is_active]
```

Bad complex comprehension:

```python
results = [
    normalize(item.value)
    for group in groups
    for item in group.items
    if item.is_active and item.value is not None and can_process(item, user)
]
```

Better:

```python
results = []

for group in groups:
    for item in group.items:
        if not item.is_active:
            continue
        if item.value is None:
            continue
        if not can_process(item, user):
            continue

        results.append(normalize(item.value))
```

Bad complex `next`:

```python
selected = next(
    (
        normalize(item)
        for item in items
        if item.is_active
        and item.owner_id == user.id
        and can_process(item)
        and not is_expired(item)
    ),
    None,
)
```

Better:

```python
selected = None

for item in items:
    if not item.is_active:
        continue
    if item.owner_id != user.id:
        continue
    if not can_process(item):
        continue
    if is_expired(item):
        continue

    selected = normalize(item)
    break
```

Good simple `next`:

```python
selected = next((item for item in items if item.id == requested_id), None)
```

Check: Can a reader understand the expression directly, or must they mentally expand it into a loop and decision steps?

## Comments

An interface comment is mandatory for every new or materially changed non-trivial function, method, or class. Put it directly above the declaration in the repository language's normal comment form.

Write the comment in this order:

1. What the declaration provides.
2. How its main process, order, inputs, outputs, and side effects work, in simple words.
3. Why this approach, constraint, or tradeoff exists.

Use plain language that is understandable without reading the body. Keep it short and direct, normally two to five sentences. Explain any necessary technical term, be precise, and use the repository's language.

Avoid vague jargon such as `orchestrates`, `coordinates`, `manages`, `handles`, `canonical representation`, `abstraction boundary`, `lifecycle semantics`, `data shape`, `execution context`, and `invariant enforcement` unless it is a project term and is immediately explained. Do not repeat the declaration name, translate code line by line, promise general maintainability, state behavior the code does not enforce, or use a comment instead of clear code.

Bad vague comment:

```ts
// Handles payment webhooks.
function acceptPaymentWebhook(...) {
```

Bad technical comment:

```ts
/**
 * Normalizes the external provider payload into the canonical domain
 * representation while preserving lifecycle invariants.
 */
function acceptPaymentWebhook(...) {
```

Bad line narration:

```ts
// First verifies the signature, then maps the status, saves the payment, and publishes an event.
function acceptPaymentWebhook(...) {
```

Good comment:

```ts
/**
 * Turns a payment provider's message into a payment update the rest of the app understands.
 * It checks that the message is genuine, converts its status, and saves the result before
 * notifying the rest of the system. Saving first ensures that anything receiving the
 * notification can immediately read the updated payment.
 */
function acceptPaymentWebhook(...) {
```

Good delivery address comment:

```python
def select_delivery_address(order):
    """
    Chooses the address where this order should be delivered.
    A temporary checkout address is used first, otherwise the customer's saved address is used.
    This keeps gift and one-time deliveries from overwriting the customer's normal address.
    """
```

Check: Can a reader understand what this provides, how it works, and why it works this way without reading the body?

## Checks

1. Did this add a concept the task did not need?
2. Is one clear function easier than several tiny jumps?
3. Are the names specific enough to make the common path obvious?
4. What validation proves the behavior or structure is safe?
5. Does every new or materially changed non-trivial declaration comply with the Comments contract?

Avoid boolean flags with hidden modes, config objects that only avoid explicit parameters, broad cleanup, and pushing domain decisions into UI, routes, controllers, or tests because it was convenient.

Stop when the implementation is clear, local, validated as far as feasible, and easy enough to change. More extraction, generality, or cleanup must reduce a current risk; more comments must add a useful review signpost.
