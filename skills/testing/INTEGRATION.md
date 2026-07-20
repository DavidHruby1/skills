# Integration Tests

Use this branch when the behavior depends on two or more real collaborators. Name the seam under test before writing scenarios. Typical seams are Vue parent-child-plugin behavior, frontend HTTP client and API contract, Python API-service-repository flow, database mappings and constraints, migrations, queues, caches, or adapters to separately developed services.

## Rules

- Exercise the smallest real assembly that can prove the seam. An integration test is not made stronger by including unrelated layers.
- Keep collaborators on both sides of the named seam real. Replace only boundaries outside the test's declared scope, especially uncontrolled third-party services.
- Use the same database engine and relevant schema or migrations as production when database behavior matters. Give each test controlled data and restore isolation with rollback, truncation, or a fresh disposable resource.
- For Python, prefer pytest fixtures that expose capabilities such as `db_session`, `api_client`, or `postgres`; keep lifecycle and cleanup in the fixture. Use Testcontainers when the repository already supports containers or the user approves adding it.
- For Vue component integration, mount the meaningful component tree with real children and real application plugins. Interact through rendered controls and assert user-visible DOM or documented emitted behavior. Stub the HTTP edge only when the backend is outside this test's seam.
- For API integration, issue requests through the framework's public test client and assert status, response contract, persistence, and material side effects. Avoid direct controller calls when routing, serialization, validation, or middleware belongs to the seam.
- Verify both success and seam-specific failures: serialization, constraints, transactions, authorization boundaries, timeouts, retries, or contract errors when they are in approved scope.
- Keep tests deterministic and independently runnable. Shared expensive infrastructure may use broader fixture scope, but business data is reset per test.
- Prefer explicit assertions over broad snapshots or record counts alone. Assert the business record or response that identifies correctness.

## Good Vitest/Vue Example

This mounts a real parent and child while replacing only the HTTP boundary outside the component seam:

```ts
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, expect, it, vi } from 'vitest'
import CartPanel from './CartPanel.vue'

afterEach(() => vi.unstubAllGlobals())

it('IT-001 updates the total when a real line-item control changes quantity', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ items: [{ id: 'book', name: 'Book', quantity: 1, unitPrice: 20 }] }),
  }))
  const wrapper = mount(CartPanel)
  await flushPromises()

  await wrapper.get('button[aria-label="Increase Book quantity"]').trigger('click')

  expect(wrapper.get('[aria-label="Cart total"]').text()).toContain('$40')
})
```

The test does not stub the line-item child or invoke its methods. It proves the parent-child integration through the rendered contract.

## Bad Vitest/Vue Example

```ts
it('integrates cart items', async () => {
  const wrapper = shallowMount(CartPanel, {
    global: { stubs: { CartLine: true } },
  })
  wrapper.vm.items[0].quantity = 2
  expect(wrapper.vm.total).toBe(40)
})
```

The claimed seam is removed by stubbing the child, and direct state mutation bypasses the integration wiring.

## Good Pytest Example

The project fixture supplies a migrated disposable database and real application repository:

```python
def test_IT_002_commits_an_order_and_returns_its_public_representation(api_client, db_session):
    response = api_client.post(
        "/orders",
        json={"customer_id": "customer-1", "lines": [{"sku": "book", "quantity": 2}]},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "pending"
    persisted = db_session.execute(
        select(Order).where(Order.id == body["id"])
    ).scalar_one()
    assert [(line.sku, line.quantity) for line in persisted.lines] == [("book", 2)]
```

For a database adapter itself, a narrower real-database test is also valid:

```python
def test_IT_003_duplicate_email_is_rejected(customer_repository):
    customer_repository.add(email="buyer@example.com")

    with pytest.raises(DuplicateEmail):
        customer_repository.add(email="buyer@example.com")
```

## Bad Pytest Examples

```python
def test_create_order(client, mocker):
    repository = mocker.patch("app.orders.OrderRepository")
    repository.save.return_value = Order(id="order-1")
    response = client.post("/orders", json={"lines": []})
    assert response.status_code == 201
```

If persistence is the named seam, mocking the repository removes the behavior the test claims to prove.

```python
def test_customer_count(db_session):
    create_customer(db_session)
    assert db_session.query(Customer).count() > 0
```

The assertion can pass because of leaked data and does not identify the created customer's contract.

## Completion Check

Every approved integration scenario names and exercises one real seam; external substitutions sit outside that seam; test data is isolated; Vue tests use public rendered behavior; Python tests use public adapters or clients and production-faithful dependencies; and the selected integration suite passes or reports a specific production defect.

## Sources

- Kent C. Dodds, [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)
- pytest, [How to use fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
- pytest, [Good Integration Practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- Docker, [Testcontainers for Python](https://docs.docker.com/guides/testcontainers-python-getting-started/)
