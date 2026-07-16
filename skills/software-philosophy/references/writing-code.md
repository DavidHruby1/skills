# Writing Code

Use when adding implementation code, modifying existing structure, refactoring locally, deciding where logic belongs, or deciding whether a comment should exist.

New code often works locally while spreading knowledge, adding hidden modes, inventing layers, or hiding simple behavior behind impressive structure. The right change satisfies the requested behavior with the least accidental complexity.

## Do

- Build context from existing code before editing.
- Put logic where the relevant knowledge already lives.
- Use precise, consistent names for real domain concepts and decisions.
- Keep the common path obvious, direct, and readable.
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

Comment generously when purpose or design knowledge is not obvious locally: explain why a function or abstraction exists, why it has this shape, and its invariants, boundary contracts, external constraints, lifecycle assumptions, trade-offs, ownership, or why a simpler-looking solution is wrong.

Improve confusing code, names, and boundaries, but do not assume clean code replaces design documentation. Avoid comments that repeat code, narrate mechanics, preserve stale history, or state contracts the code does not enforce; keep useful comments close to the decision and current with behavior.

## Checks

1. What fact, rule, or decision does this code own?
2. Who should not need to know that decision?
3. Would changing this rule require edits in one place or many?
4. Did this add a concept the task did not need?
5. Is one clear function easier than several tiny jumps?
6. Are the names specific enough to make the common path obvious?
7. What validation proves the behavior or structure is safe?

Avoid boolean flags with hidden modes, pass-through services, shallow managers/helpers, config objects that only avoid explicit parameters, premature factories/interfaces/strategies, broad cleanup, and pushing domain decisions into UI, routes, controllers, or tests because it was convenient.

Stop when the implementation is clear, local, validated as far as feasible, and easy enough to change. More extraction, generality, commenting, or cleanup must reduce a current risk.

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

### Comment Preserves An Invariant

Bad:

```ts
// Subtract pending withdrawals from the balance.
const availableBalance = account.balance - account.pendingWithdrawals;
```

Better:

```ts
// Pending withdrawals reduce available balance before settlement so users cannot reserve the same funds twice.
const availableBalance = account.balance - account.pendingWithdrawals;
```

Prefer encoding the rule in a domain method when that is clearer and safe.
