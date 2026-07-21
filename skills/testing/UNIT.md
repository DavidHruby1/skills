# Unit Tests

Use this branch for approved unit scenarios written either test-first or with their planned production implementation, according to the execution mode explicitly selected in `GHERKIN.md`. A unit is the smallest public behavior that provides a tight, deterministic feedback loop: usually a TypeScript function, composable, Vue component contract, Python function, class, or module. Isolation is a means to control slow or nondeterministic boundaries, not a goal that justifies mocking the subject's own behavior.

## Rules

- Exercise the unit through the interface its real caller uses. Assert return values, raised exceptions, emitted Vue events, rendered output, or intentional calls across an external boundary.
- Give each test one behavioral reason to fail. Use Arrange-Act-Assert when it clarifies those roles; omit ceremony when the roles are already obvious.
- Include representative normal, boundary, invalid, and failure cases derived from the approved scenarios. Use `it.each` or `pytest.mark.parametrize` for one rule over multiple meaningful examples.
- Keep tests independent of execution order, wall-clock time, randomness, global state, network, filesystem, and databases. Inject or control only the boundary responsible for nondeterminism.
- Mock at the unit's outer boundary. Prefer small fakes or stubs for returned behavior; verify calls only when sending that command is itself the public outcome.
- Restore Vitest mocks, globals, environment, dates, and timers after each test. Prefer pytest's `monkeypatch`, `tmp_path`, and function-scoped fixtures because they clean up test state.
- For Vue, mount the component, interact through rendered controls, await Vue updates, and assert DOM output, props/slots effects, or emitted events. Reach through `wrapper.vm` only when the composable or exposed instance API is explicitly the public contract.
- Use snapshots only for a deliberately reviewed stable representation. A snapshot is not a substitute for an assertion that names the behavior.
- Keep production logic out of fixtures, factories, and expected-value calculations. Expected values must be independently obvious or fixed examples, not results computed by duplicating the algorithm under test.

## Good Vitest Examples

Pure TypeScript rule with meaningful boundaries:

```ts
import { describe, expect, it } from 'vitest'
import { acceptedQuantity } from './acceptedQuantity'

describe('acceptedQuantity', () => {
  it.each([
    { requested: 1, available: 3, expected: 1 },
    { requested: 3, available: 3, expected: 3 },
  ])('UT-001 accepts $requested when $available are available', ({ requested, available, expected }) => {
    expect(acceptedQuantity(requested, available)).toBe(expected)
  })

  it('UT-002 rejects a quantity above available stock', () => {
    expect(() => acceptedQuantity(4, 3)).toThrow('exceeds available stock')
  })
})
```

Vue component through its public UI and emitted event:

```ts
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import QuantityPicker from './QuantityPicker.vue'

it('UT-003 emits the next allowed quantity', async () => {
  const wrapper = mount(QuantityPicker, { props: { modelValue: 1, max: 2 } })

  await wrapper.get('button[aria-label="Increase quantity"]').trigger('click')

  expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
})
```

## Bad Vitest Examples

```ts
it('updates internals', async () => {
  const wrapper = mount(QuantityPicker, { props: { modelValue: 1, max: 2 } })
  await wrapper.vm.increment()
  expect(wrapper.vm.internalCount).toBe(2)
})
```

This couples the test to private names and bypasses the button wiring, so a broken user interaction can still pass.

```ts
it('calculates the discount', () => {
  const subtotal = 120
  expect(discountedTotal(subtotal)).toBe(subtotal - subtotal * 0.1)
})
```

This duplicates the implementation in the oracle. The test can preserve the same defect as the production algorithm.

## Good Pytest Examples

Public outcomes, named examples, and a precise failure case:

```python
import pytest

from shop.quantity import accepted_quantity


@pytest.mark.parametrize(
    ("requested", "available", "expected"),
    [
        pytest.param(1, 3, 1, id="UT-001-below-stock"),
        pytest.param(3, 3, 3, id="UT-001-at-stock"),
    ],
)
def test_accepts_available_quantity(requested, available, expected):
    assert accepted_quantity(requested, available) == expected


def test_UT_002_rejects_quantity_above_stock():
    with pytest.raises(ValueError, match="exceeds available stock"):
        accepted_quantity(4, 3)
```

Controlled external boundary, with the command itself treated as the outcome:

```python
def test_UT_003_sends_receipt_after_successful_payment(mocker):
    payments = mocker.Mock()
    receipts = mocker.Mock()
    payments.charge.return_value = "payment-123"

    checkout = Checkout(payments=payments, receipts=receipts)
    checkout.complete(order_id="order-7")

    receipts.send.assert_called_once_with(order_id="order-7", payment_id="payment-123")
```

## Bad Pytest Examples

```python
def test_checkout(mocker):
    checkout = Checkout(mocker.Mock(), mocker.Mock())
    mocker.patch.object(checkout, "_calculate_total", return_value=100)
    checkout._complete_internal()
    assert checkout._status == "done"
```

The subject's own internals are mocked and asserted, so the test neither proves the real calculation nor the public checkout result.

```python
def test_everything(shared_order):
    assert shared_order.add("book")
    assert shared_order.discount() == 10
    assert shared_order.pay()
    assert shared_order.status == "paid"
```

Several behaviors and mutable shared state produce ambiguous failures and order dependence.

## Completion Check

Every approved unit scenario has a traceable test; each test reaches real production code through a public contract; controlled dependencies are restored; and the focused command is reported for orchestrator validation. The orchestrator must verify that test-first cases fail because new behavior is absent or wrong rather than because the harness is broken, and that cases written with implementation pass.

## Sources

- Vue Test Utils, [Event Handling](https://test-utils.vuejs.org/guide/essentials/event-handling)
- Vitest, [Mocking](https://vitest.dev/guide/mocking)
- pytest, [How to use fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
- pytest, [How to parametrize](https://docs.pytest.org/en/stable/how-to/parametrize.html)
