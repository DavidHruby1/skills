# Planning

Use when deciding what to build, comparing approaches, designing a change, decomposing work, or planning a refactor before implementation.

Planning fails when it either patches tactically while ignoring real pressure or invents architecture for imagined futures. A good plan improves optionality without delaying feedback.

## Answer

- What is the requested behavior or design problem?
- What current pressure makes structure relevant now?
- Which knowledge needs one owner?
- Which boundary hides that knowledge from callers?
- Which avoidable error can be made impossible by the design?
- Which approach makes the next likely change easier?
- Which assumption must be proven before the design is safe?

## Sequence

1. State the real problem and current pressure.
2. Identify knowledge that should have one owner.
3. Read the likely affected files in full and inventory existing symbols, callers, and tests that already own all or part of that knowledge.
4. Prove why each existing owner should be reused, modified, moved, or removed before proposing a new one.
5. Design it twice for non-trivial choices: compare two credible shapes before committing.
6. Judge them by reuse, coupling, cohesion, depth, change amplification, cognitive load, reversibility, error prevention, and validation cost.
7. Choose the smallest coherent approach that keeps useful options open.
8. Sequence the work as small behavior and structure steps with exact symbol ownership.
9. Name validation and unresolved assumptions.

## Prefer

- tracer bullets when uncertainty is high
- one owner for each rule, data-shape conversion, lifecycle order, or policy
- reusing or deepening an existing behavioral owner before introducing another symbol or path
- deep modules with simple interfaces over shallow forwarding layers
- designs that make invalid states, wrong ordering, or missing validation impossible where practical
- reversible decisions until current requirements justify commitment
- separating structure changes from behavior changes when practical

## Avoid

- provider, format, storage, tenant, policy, registry, or plugin abstractions for imaginary futures
- rewrites before feedback
- generic abstractions before the real domain concept is clear
- moving knowledge into callers through flags, ordering rules, or leaked data shapes
- temporal decomposition that splits one workflow into phases callers must remember
- treating tidy-first as permission for a cleanup marathon

Stop when the chosen path is safe enough to implement or validate. More detail must reduce a real risk, not make the plan look more architectural.

## Examples

### CSV Export

Bad: create `Exporter`, `CsvExporter`, `JsonExporter`, `ExporterFactory`, and a registry when product only asked for CSV.

Better: add `exportReportCsv(report)` near report formatting code. This names the real behavior and keeps a future interface possible if a second format creates real pressure.

Do not apply when multiple formats must be selected at runtime now.

### Billing Provider Uncertainty

Bad: build the full provider interface, retry service, webhook router, reconciliation job, and test matrix before touching the provider.

Better: build one tracer bullet: create a test customer, receive one webhook, map it to an internal event, and persist enough state to inspect behavior.

Do not apply when the provider contract is already proven locally and the work is routine implementation.

### Tidy First Without Rewrite

Bad: rewrite invoices into `InvoiceCalculator`, `TaxPolicy`, `DiscountPolicy`, and visitors before adding tax.

Better: extract the existing subtotal calculation only if that makes the tax change safer, then add tax in the local total path.

Do not apply when the function is impossible to validate and a larger refactor has explicit scope and tests.
