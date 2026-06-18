# AI Failure Mode Examples

## Over-abstracted generated code

### Bad
```ts
interface NotificationStrategy { send(message: string): Promise<void>; }
class EmailNotificationStrategy implements NotificationStrategy { /* one use */ }
class NotificationStrategyFactory { /* returns email */ }
```

### Why it is bad
The task needed one email notification. The strategy and factory add imaginary flexibility.

### Better
```ts
async function sendSignupEmail(email: string, message: string) {
  await emailClient.send({ to: email, body: message });
}
```

### Why this is better
The code names the real use case and hides only the email-client call.

### Do not apply when
Reject this fix if the current requirements include multiple notification channels selected at runtime.

## Fake manager class

### Bad
```ts
class OrderManager {
  constructor(private orders: OrderRepository) {}
  save(order: Order) { return this.orders.save(order); }
  find(id: string) { return this.orders.find(id); }
}
```

### Why it is bad
`Manager` hides uncertainty. The class forwards calls and owns no policy.

### Better
```ts
await orderRepository.save(order);
```

### Why this is better
The direct dependency is clearer until there is real order policy to own.

### Do not apply when
Reject this fix if the class enforces order transitions, authorization, or invariants.

## Comment spam

### Bad
```ts
// Loop through users.
for (const user of users) {
  // Check if user is active.
  if (user.active) {
    // Add user to active users.
    activeUsers.push(user);
  }
}
```

### Why it is bad
The comments make the code longer without preserving knowledge.

### Better
```ts
const activeUsers = users.filter(user => user.active);
```

### Why this is better
The code directly expresses the operation.

### Do not apply when
Reject this fix if "active" has a hidden domain meaning that needs a why-comment or named predicate.

## Invented flexibility

### Bad
```ts
type ExportFormat = 'csv' | 'json' | 'xml' | 'yaml';

function exportReport(report: Report, format: ExportFormat) {
  // Only csv is implemented because only csv was requested.
}
```

### Why it is bad
The type advertises unsupported behavior and creates future confusion.

### Better
```ts
function exportReportCsv(report: Report) {
  return toCsv(report.rows);
}
```

### Why this is better
The code supports exactly the current behavior.

### Do not apply when
Reject this fix if the product plan explicitly requires multiple export formats now.

## Clean-looking but harder to change

### Bad
```ts
const rules = [
  { field: 'age', op: 'gte', value: 18 },
  { field: 'country', op: 'eq', value: 'US' },
];

function isEligible(user: User) {
  return evaluateRules(user, rules);
}
```

### Why it is bad
A tiny eligibility rule became a mini rule engine. Debugging and changing it now requires understanding generic machinery.

### Better
```ts
function isEligible(user: User) {
  return user.age >= 18 && user.country === 'US';
}
```

### Why this is better
The rule is obvious and cheap to change while it remains simple.

### Do not apply when
Reject this fix if non-developers edit rules or many dynamic rules already exist.
