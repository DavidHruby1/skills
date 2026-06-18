# Refactoring And Comment Examples
## Extract one calculation before feature change
Bad:
```ts
function invoiceTotal(invoice: Invoice) {
  let total = 0;
  for (const item of invoice.items) total += item.price * item.quantity;
  total -= invoice.couponAmount ?? 0;
  return total;
}
```
Why bad: adding tax now mixes loop, coupon, and tax behavior in one edit.
Better:
```ts
function lineSubtotal(item: InvoiceItem) { return item.price * item.quantity; }
function invoiceTotal(invoice: Invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + lineSubtotal(item), 0);
  return subtotal - (invoice.couponAmount ?? 0);
}
```
Do not apply when the feature can be added more clearly inline.

## Local duplication removal
Bad:
```ts
if (user.role === 'admin' || user.role === 'owner') showBilling();
if (user.role === 'admin' || user.role === 'owner') showTeamSettings();
```
Why bad: the same permission rule appears twice, so a future role change can miss one location.
Better:
```ts
const canManageAccount = user.role === 'admin' || user.role === 'owner';
if (canManageAccount) showBilling();
if (canManageAccount) showTeamSettings();
```
Do not apply when the rule appears across files; then consider moving it to the module that owns authorization policy.

## Stop before unrelated cleanup
Bad: a rounding fix also renames 12 variables, reformats the file, changes imports, and moves helpers.
Why bad: the correctness fix becomes hard to review and behavior changes can hide inside cleanup.
Better:
```ts
function invoiceTotalCents(invoice: Invoice) {
  const subtotalCents = invoice.items.reduce((sum, item) => sum + Math.round(item.unitPriceCents * item.quantity), 0);
  return subtotalCents - (invoice.discountCents ?? 0);
}
```
Do not apply when a tiny local rename or extraction is necessary to make the fix safe.

## Comment preserves an invariant
Bad:
```ts
// Subtract pending withdrawals from the balance.
const availableBalance = account.balance - account.pendingWithdrawals;
```
Why bad: the comment repeats the expression.
Better:
```ts
// Pending withdrawals reduce available balance before settlement so users cannot reserve the same funds twice.
const availableBalance = account.balance - account.pendingWithdrawals;
```
Do not apply when the rule can be encoded more safely in a domain method like `account.availableBalance()`.

## Comment explains why simpler-looking code is wrong
Bad:
```ts
const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
```
Why bad: future readers cannot tell whether exact 24-hour blocks are intentional.
Better:
```ts
// Subscription periods are exact 24-hour blocks, not calendar days; date addition would change behavior across daylight-saving transitions.
const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
```
Do not apply when the product means calendar days; then the code is wrong, not under-commented.
