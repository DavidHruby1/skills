# End-To-End Tests

Use this branch for a completed critical user journey through the production-built Vue application, real first-party network, Python backend, and controlled database. E2E tests provide high confidence at high execution and maintenance cost, so cover consequential journeys and cross-layer risks rather than reproducing every lower-level case.

Inspect the repository's installed E2E runner and conventions first. Reuse Playwright or Cypress when present. If no E2E runner exists, recommend Playwright because Vue's official guide recommends it, but obtain user approval before adding the dependency or infrastructure. Examples below use Playwright with TypeScript.

## Rules

- Start from a user goal and assert the outcome a user or external consumer observes. Do not import Vue components, stores, or Python application internals into the browser test.
- Run against the production build or the repository's production-equivalent test server, real backend, and production-equivalent schema. Control test configuration explicitly.
- Keep every test independent. Create unique business data through an approved API or fixture boundary and clean it up, or run against an isolated disposable environment. A test must not depend on another test's account, order, storage, or execution order.
- Keep first-party calls real when they are part of the journey. Route or fake uncontrolled third-party systems such as payment providers or email delivery at their owned boundary, then assert the application's observable handling.
- Prefer Playwright locators by role, label, placeholder, or stable test ID. Use CSS only when it represents a deliberate stable contract. Avoid DOM ancestry, generated classes, XPath, and positional selectors.
- Use Playwright's locator actions and web-first assertions, which auto-wait for actionable or expected states. Wait for an observable condition or specific response when needed, never an arbitrary timeout.
- Assert meaningful journey checkpoints and the final outcome. Avoid asserting every intermediate DOM detail, which makes one journey brittle and obscures the actual failure.
- Keep authentication setup efficient without coupling tests: use a setup project or API-created storage state per role, with data isolation preserved.
- Capture traces on retry in CI and use them to diagnose failures. Retries expose flakiness; they do not convert an unstable test into a trustworthy one.
- Run critical browser coverage required by the product. Do not multiply every test across every browser without a concrete compatibility risk.

## Good Playwright Example

```ts
import { expect, test } from '@playwright/test'

test('E2E-001 a buyer places an order from the cart', async ({ page, request }) => {
  const email = `buyer-${crypto.randomUUID()}@example.test`
  const user = await request.post('/test-support/users', { data: { email } })
  expect(user.ok()).toBeTruthy()

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('valid-test-password')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await page.goto('/products/book')
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'Cart' }).click()
  await page.getByRole('button', { name: 'Place order' }).click()

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
  await expect(page.getByText('Book')).toBeVisible()
})
```

Adapt test-support setup to the repository. It must be unavailable in production or strongly access-controlled, and it must create data through an intentional test boundary rather than direct hidden state mutation.

## Bad Playwright Examples

```ts
test('checkout', async ({ page }) => {
  await page.goto('/')
  await page.locator('div:nth-child(3) > button.btn-primary').click()
  await page.waitForTimeout(3000)
  expect(await page.locator('.success').isVisible()).toBe(true)
})
```

DOM structure and CSS classes are brittle, the fixed sleep is timing-dependent, and the manual visibility assertion does not retry.

```ts
test('step 1 creates cart', async ({ page }) => {
  // creates shared cart
})

test('step 2 checks out shared cart', async ({ page }) => {
  // assumes the previous test ran and retained state
})
```

The second test cannot run independently and creates cascading failures under parallel execution or retries.

```ts
test('E2E pricing matrix', async ({ page }) => {
  for (const quantity of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    // repeats a lower-level calculation rule through the full browser stack
  }
})
```

Exhaustive rule examples belong in unit or integration tests. E2E should keep one representative price and protect the cross-system journey.

## Completion Check

Every approved E2E scenario protects a consequential cross-system journey; tests interact only through user-visible or intentional external contracts; first-party layers in scope are real; third-party boundaries and data are controlled; tests are isolated and use resilient auto-waiting locators and assertions; and the selected E2E suite passes or reports a specific production or environment blocker.

## Sources

- Playwright, [Best Practices](https://playwright.dev/docs/best-practices)
- Playwright, [Locators](https://playwright.dev/docs/locators)
- Kent C. Dodds, [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
