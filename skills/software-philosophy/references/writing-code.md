# Writing Code

Use when adding implementation code, modifying existing structure, refactoring locally, deciding where logic belongs, or deciding whether a comment should exist.

New code often works locally while spreading knowledge, adding hidden modes, inventing layers, or hiding simple behavior behind impressive structure. The right change satisfies the requested behavior with the least accidental complexity.

## Do

- Build context from existing code before editing.
- Put logic where the relevant knowledge already lives.
- Use precise, consistent names for real domain concepts and decisions.
- Keep the common path obvious, direct, and readable.
- Use guard clauses and early `return`, `continue`, or `throw` for invalid states, failed preconditions, exceptional cases, and branches that can finish immediately. Do not nest `if` blocks when handling a condition up front can leave the main path flat and linear. Preserve nesting only when the alternatives genuinely belong together or an early exit would obscure lifecycle, cleanup, transaction, or control-flow semantics.
- Represent each business rule once; avoid duplicating knowledge under different text.
- Convert external data shapes at boundaries.
- Prefer simple data flow over hidden mutation or temporal ordering.
- Use existing abstractions before creating new ones.
- Pull complexity downward when the callee owns the rule, ordering, validation, or external quirk.
- Keep related decisions together when splitting would leak assumptions.
- Make avoidable errors impossible with types, explicit operations, defaults, validation, or localized construction where practical.
- Follow nearby style unless it is actively causing complexity.

## Refactoring

- Refactor only where it supports the current change.
- Make the smallest behavior-preserving structural move that relieves current pressure.
- Preserve public interfaces unless changing them is part of the task.
- Separate feature and refactor changes in the explanation, patch, or commits when practical.
- Do not call it behavior-preserving if ordering, defaults, errors, data shapes, side effects, or tests changed.

## Comments

Treat comments as a required navigation layer, not an optional finishing touch. Comment every new or materially changed class and every new or materially changed function unless it is genuinely trivial. A genuinely trivial function has an immediately obvious purpose and implementation, contains no meaningful branch, transformation, ordering, side effect, boundary interaction, invariant, or non-obvious failure behavior, and can be understood completely from its name and a single simple expression. When uncertain, add the comment.

Place the comment directly above the class or function using the language's normal documentation-comment form when available. For each non-trivial function, explain all three of these points that apply: what responsibility and observable result the function provides; why the function exists and why this approach, ownership, ordering, or boundary was chosen; and how the important control flow, data flow, state transition, algorithm, fallback, or side effect works. Include relevant invariants, contracts, external constraints, lifecycle assumptions, trade-offs, and failure behavior. Use enough detail that a reviewer can understand the function's role and design before reading its body; do not force this into one line when several concise sentences are needed.

Also comment classes, decision blocks, and individual lines whenever their purpose, reason, constraint, ordering, or behavior is not immediately obvious. Prefer too many useful explanatory comments over too few. Keep comments close to the code and update them whenever behavior changes.

Do not use comments as a substitute for fixing confusing code, names, or boundaries. Avoid comments that only translate syntax or narrate obvious statements line by line, but do not use that rule as a reason to omit a function-level explanation of purpose, rationale, and operation. Never preserve stale history or promise a contract the code does not enforce.

## Checks

1. What fact, rule, or decision does this code own?
2. Who should not need to know that decision?
3. Would changing this rule require edits in one place or many?
4. Did this add a concept the task did not need?
5. Is one clear function easier than several tiny jumps?
6. Are the names specific enough to make the common path obvious?
7. What validation proves the behavior or structure is safe?

Avoid boolean flags with hidden modes, pass-through services, shallow managers/helpers, config objects that only avoid explicit parameters, premature factories/interfaces/strategies, broad cleanup, and pushing domain decisions into UI, routes, controllers, or tests because it was convenient.

Stop when the implementation is clear, local, validated as far as feasible, and easy enough to change. More extraction, generality, or cleanup must reduce a current risk; more comments must add a useful review signpost.

## Examples

### Boundary Hides External Shape

Bad:

```ts
const name = apiUser.profile?.display_name ?? apiUser.email_address;
const avatar = apiUser.profile?.images?.small_url ?? DEFAULT_AVATAR;
```

Better:

```ts
function toUserSummary(apiUser: ApiUser): UserSummary {
    return {
        name: apiUser.profile?.display_name ?? apiUser.email_address,
        avatarUrl: apiUser.profile?.images?.small_url ?? DEFAULT_AVATAR,
    };
}
```

The boundary owns vendor fields and fallback rules. Do not apply for a one-off script with no reuse or risk.

### Local Duplication Removal

Bad:

```ts
if (user.role === "admin" || user.role === "owner") showBilling();
if (user.role === "admin" || user.role === "owner") showTeamSettings();
```

Better:

```ts
const canManageAccount = user.role === "admin" || user.role === "owner";
if (canManageAccount) showBilling();
if (canManageAccount) showTeamSettings();
```

The permission rule now has one local name. If it spreads across files, move it to the module that owns authorization policy.

### Class Comment Explains Why The Boundary Exists

Bad:

```ts
// Caches session data.
class SessionCache {
    // ...
}
```

Better:

```ts
// Keep transient sessions separate so cache eviction cannot destroy durable authentication state.
class SessionCache {
    // ...
}
```

The bad comment restates the class name. The better comment explains why transient and durable state have separate owners, so a reviewer can judge the boundary without reading every method.

### Function Comment Explains Why Precedence Matters

Bad:

```ts
// Selects the override address or falls back to the customer's default address.
function selectDeliveryAddress(order: Order): Address {
    return order.overrideAddress ?? order.customer.defaultAddress;
}
```

Better:

```ts
// Honor checkout overrides because gift and temporary deliveries must not replace the saved default.
function selectDeliveryAddress(order: Order): Address {
    return order.overrideAddress ?? order.customer.defaultAddress;
}
```

The bad comment translates the expression. The better comment preserves the product reason for the precedence and warns reviewers not to persist the temporary address.

### Inline Comment Explains Why Ordering Is Required

Bad:

```ts
// Save the account, then publish the update.
await repository.save(account);
await events.publish(accountUpdated(account));
```

Better:

```ts
// Publish only after persistence so consumers can immediately read the committed account.
await repository.save(account);
await events.publish(accountUpdated(account));
```

The bad comment narrates execution order already visible in the code. The better comment records why reordering is unsafe: event consumers expect the committed account to be readable. Do not add comments to surrounding ordinary statements merely for consistency.
