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

Treat comments as part of the design, not polish added after coding. Before writing the body of every new non-trivial class, function, or method, write its interface comment. Update the comment first when materially changing an existing abstraction. This comments-first step forces the responsibility and contract to become clear before implementation grows around a weak boundary.

Comment every new or materially changed class, function, and method unless it is genuinely trivial. A trivial operation is completely explained by its precise name and one obvious expression and has no meaningful branch, transformation, ordering, side effect, boundary interaction, invariant, fallback, or failure behavior. Constructors, lifecycle hooks, callbacks, parsers, validators, mappers, orchestration functions, and functions with side effects are rarely trivial. When uncertain, comment it.

Place interface comments directly above the declaration using the language's documentation-comment form. Explain the abstraction, not the syntax:

- its responsibility and observable result,
- why it exists, belongs here, or uses this approach,
- the contract callers must respect, including important inputs, outputs, invariants, side effects, ownership, ordering, failure behavior, and external constraints,
- the important internal strategy when a maintainer cannot safely infer it from the body.

Use several concise sentences when needed. A reviewer should understand the role and design before reading the body. Also document non-obvious fields, state transitions, algorithms, decision blocks, ordering constraints, and cross-module dependencies close to the relevant code. Prefer an extra useful design comment over leaving reasoning implicit.

Do not use comments as a substitute for fixing confusing code, names, or boundaries. Avoid comments that only translate syntax or narrate obvious statements line by line, but do not use that rule as a reason to omit a function-level explanation of purpose, rationale, and operation. Never preserve stale history or promise a contract the code does not enforce.

Before declaring the change complete, inventory every added or materially changed declaration and verify that each has an accurate interface comment or clearly meets the strict triviality exception. Missing coverage is an implementation defect.

## Checks

1. What fact, rule, or decision does this code own?
2. Who should not need to know that decision?
3. Would changing this rule require edits in one place or many?
4. Did this add a concept the task did not need?
5. Is one clear function easier than several tiny jumps?
6. Are the names specific enough to make the common path obvious?
7. What validation proves the behavior or structure is safe?
8. Does every added or materially changed non-trivial declaration have an accurate interface comment?

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
