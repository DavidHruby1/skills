# Writing Tests

Use when implementing unit, integration, or end-to-end tests assigned from approved `GHERKIN.md`. Tests prove observable behavior and should fail for one clear behavioral reason, not because they mirror implementation structure.

## Contract And Evidence

- Require exact assigned scenario IDs from a `GHERKIN.md` section with `Status: Approved`, an approval date, and a passed audit. Without them, stop without editing tests.
- Implement only the assigned IDs and preserve each ID in its test name or parametrization ID.
- Treat each approved scenario's plain-language description, scope, Gherkin, level, basis, and traceability as one contract. Report contradictions instead of choosing one representation.
- For `Basis: Planned behavior`, tests may be written before production behavior at any level. A valid initial failure must come from absent or incorrect behavior, never collection, syntax, import, fixture, infrastructure, or environment failure.
- For `Basis: Existing behavior`, tests should pass against the established behavior. A behavioral failure is evidence of a contract or production contradiction, not permission to weaken the test.

## Shared Rules

- Inspect existing tests, configuration, fixtures, helpers, production interfaces, and focused commands before editing. Follow repository conventions and reuse existing infrastructure.
- Exercise the public interface used by real callers. Assert returns, errors, rendered output, emitted events, response contracts, persistence, or intentional external commands.
- Keep each test independently runnable and deterministic. Control time, randomness, global state, network, filesystem, database data, and third-party systems only at boundaries outside the behavior under test; restore changed state.
- Give each test one behavioral reason to fail. Use arrange-act-assert when it clarifies those roles and parametrization when examples express one rule with meaningfully different boundaries.
- Cover the approved representative normal, boundary, invalid, and failure cases without repeating the same rule at every level.
- Prefer explicit assertions over broad snapshots, incidental record counts, or implementation calls. Expected values must be independently obvious or fixed examples, not the production algorithm repeated in the test.
- Keep production logic out of fixtures, factories, setup helpers, and expected-value calculations. Add dependencies or infrastructure only with explicit approval.

## Unit

A unit test proves the smallest public behavior that provides a tight deterministic loop, such as a function, composable, component contract, class, or module.

- Isolate only slow or nondeterministic outer boundaries. Do not mock the subject's own behavior.
- Prefer small fakes or stubs for returned behavior. Verify calls only when sending the command is itself the public outcome.
- Restore mocks, globals, environment, dates, and timers. Prefer framework facilities that clean up state automatically.
- For Vue, mount the component, interact through rendered controls, await updates, and assert DOM output or documented emitted events. Use an exposed instance only when it is explicitly public.
- Use snapshots only for deliberately reviewed stable representations, never instead of assertions that name behavior.

Good unit test:

```ts
it('UT-001 rejects quantity above stock without changing the cart', () => {
  const cart = Cart.withLine({ sku: 'book', quantity: 1, available: 3 })

  expect(() => cart.setQuantity('book', 4)).toThrow('exceeds available stock')
  expect(cart.quantityFor('book')).toBe(1)
})
```

This reaches public behavior and proves both rejection and unchanged state. A bad unit test reaches through internals and only verifies implementation wiring:

```ts
it('UT-001 validates stock', () => {
  const cart = Cart.withLine({ sku: 'book', quantity: 1, available: 3 })
  const validate = vi.spyOn(cart as any, '_validateStock')

  ;(cart as any)._setQuantity('book', 4)
  expect(validate).toHaveBeenCalled()
})
```

## Integration

An integration test proves one named seam between real collaborators. Typical seams include parent-child-plugin behavior, HTTP client and API, API-service-repository flow, database mappings and constraints, migrations, queues, caches, or service adapters.

- Exercise the smallest real assembly that proves the seam and keep both sides real. Replace only boundaries outside the declared scope, especially uncontrolled third parties.
- When database behavior matters, use the production engine and relevant schema or migrations. Give each test controlled business data and restore isolation through rollback, truncation, or a disposable resource.
- For Vue, mount the meaningful tree with real children and plugins, interact through rendered controls, and assert visible DOM or documented emitted behavior.
- For APIs, use the framework's public test client and assert status, response contract, persistence, and material side effects. Do not bypass routing, serialization, validation, or middleware when they belong to the seam.
- Cover seam-specific failures such as serialization, constraints, transactions, authorization, timeout, retry, or contract errors only when they are in approved scope.

Good integration test:

```python
def test_IT_001_creates_and_persists_an_order(api_client, order_repository):
    response = api_client.post(
        "/orders",
        json={"customer_id": "customer-1", "lines": [{"sku": "book", "quantity": 2}]},
    )

    assert response.status_code == 201
    order = order_repository.get(response.json()["id"])
    assert [(line.sku, line.quantity) for line in order.lines] == [("book", 2)]
```

This keeps the API-to-persistence seam real. A bad integration test removes that seam and proves only mocked controller behavior:

```python
def test_IT_001_creates_an_order(api_client, mocker):
    repository = mocker.patch("app.orders.OrderRepository")
    repository.save.return_value = Order(id="order-1")

    response = api_client.post(
        "/orders",
        json={"customer_id": "customer-1", "lines": [{"sku": "book", "quantity": 2}]},
    )
    assert response.status_code == 201
```

## End-To-End

An end-to-end test proves a consequential completed journey through the production-built application, real first-party network and backend, and controlled data. Use the repository's installed runner; when none exists, obtain approval before adding one.

- Start from a user goal and assert meaningful checkpoints and the final observable outcome. Never import application internals into a browser test.
- Use a production build or production-equivalent server and schema with explicit test configuration. Keep first-party calls real when they belong to the journey; replace uncontrolled third parties at their owned boundary.
- Create unique business data through an intentional API or fixture boundary and clean it up, or use an isolated disposable environment. Never depend on another test's state or execution order.
- Prefer role, label, placeholder, or stable test-ID locators. Avoid DOM ancestry, generated classes, XPath, and positional selectors.
- Use auto-waiting actions and assertions. Wait for observable conditions or specific responses, never arbitrary delays.
- Keep authentication efficient without sharing mutable business state. Capture diagnostic traces on retry; retries expose flakiness rather than making it acceptable.
- Run only browser coverage tied to concrete compatibility risk. Exhaustive rule matrices belong at lower levels.

Good end-to-end test:

```ts
test('E2E-001 a buyer completes checkout', async ({ page }) => {
  await page.goto('/products/book')
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'Cart' }).click()
  await page.getByRole('button', { name: 'Place order' }).click()

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
  await expect(page.getByText('Book')).toBeVisible()
})
```

This follows a user journey through accessible controls and auto-waiting assertions. A bad end-to-end test relies on DOM structure, arbitrary time, and a non-retrying assertion:

```ts
test('E2E-001 checkout', async ({ page }) => {
  await page.goto('/')
  await page.locator('div:nth-child(3) > button.btn-primary').click()
  await page.waitForTimeout(3000)

  expect(await page.locator('.success').isVisible()).toBe(true)
})
```

## Completion Check

Every assigned scenario has a traceable test through the intended public boundary; real collaborators required by its level remain real; substitutions sit outside that boundary; data and process state are isolated; assertions identify the promised behavior; and the focused validation command is known. Report any contract contradiction, invalid harness failure, or unavailable environment rather than masking it.
