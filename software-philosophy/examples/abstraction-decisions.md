# Abstraction Decision Examples
## Fake pass-through service
Bad:
```ts
class UserManager { constructor(private users: UserRepository) {} getUser(id: string) { return this.users.getUser(id); } }
```
Why bad: the class hides no knowledge; it adds a name, dependency, and hop without reducing complexity.
Better:
```ts
const user = await userRepository.getUser(id);
```
Do not apply when the service owns meaningful policy such as authorization, caching, mapping, or external error normalization.

## Useful boundary hides external shape
Bad:
```ts
const name = apiUser.profile?.display_name ?? apiUser.email_address;
const avatar = apiUser.profile?.images?.small_url ?? DEFAULT_AVATAR;
```
Why bad: every caller knows the vendor shape and fallback rules.
Better:
```ts
function toUserSummary(apiUser: ApiUser): UserSummary {
  return { name: apiUser.profile?.display_name ?? apiUser.email_address, avatarUrl: apiUser.profile?.images?.small_url ?? DEFAULT_AVATAR };
}
```
Do not apply when this is a one-off script or one tiny local call with no reuse or risk.

## Boolean mode flag
Bad:
```ts
function sendReceipt(order: Order, preview: boolean) {
  if (preview) return renderReceipt(order);
  email(order.customerEmail, renderReceipt(order));
}
```
Why bad: one function has two hidden behaviors and callers must remember what `true` means.
Better:
```ts
function renderReceiptPreview(order: Order) { return renderReceipt(order); }
function sendReceiptEmail(order: Order) { email(order.customerEmail, renderReceipt(order)); }
```
Do not apply when the flag is a simple formatting option with no different side effects or lifecycle.

## Repeated knowledge
Bad:
```ts
button.style.background = '#1263eb';
header.style.background = '#1263eb';
sidebar.style.background = '#1263eb';
```
Why bad: changing the brand color requires finding every copy.
Better:
```ts
const BRAND_BLUE = '#1263eb';
button.style.background = BRAND_BLUE;
header.style.background = BRAND_BLUE;
sidebar.style.background = BRAND_BLUE;
```
Do not apply when the values only happen to match but represent different concepts.

## Temporal coupling
Bad:
```ts
cart.recalculate();
cart.applyDiscount(code);
cart.recalculate();
cart.checkout();
```
Why bad: callers must know when recalculation is required; forgetting one call causes subtle bugs.
Better:
```ts
cart.applyDiscount(code);
cart.checkout(); // checkout recalculates internally before charging
```
Do not apply when recalculation is expensive and callers need explicit batch control; expose a clear transaction API instead.

## Premature interface
Bad:
```ts
interface PaymentProvider { charge(input: ChargeInput): Promise<ChargeResult>; }
class StripePaymentProvider implements PaymentProvider { charge(input: ChargeInput) { return stripe.charge(input); } }
```
Why bad: there is one implementation and no current substitution pressure.
Better:
```ts
async function chargeWithStripe(input: ChargeInput): Promise<ChargeResult> { return stripe.charge(input); }
```
Do not apply when tests, deployment, or product requirements already need interchangeable providers.
