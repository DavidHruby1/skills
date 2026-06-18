# Planning Tradeoff Examples

## Design it twice before choosing

### Task

Add CSV export for reports. Product only asks for CSV today.

### Bad

Create an `Exporter` interface, `CsvExporter`, `JsonExporter`, `ExporterFactory`, and a format registry so future formats can plug in later.

### Why it is bad

The plan optimizes for imaginary formats. It adds a shallow framework before there is substitution pressure.

### Better

Option A: Add `exportReportCsv(report)` near report formatting code.

Option B: Add a generic export registry with provider classes.

Choose Option A now. It names the real behavior, keeps the change local, and does not prevent extracting a real interface if a second format appears.

### Why this is better

It compares two credible designs, chooses the smaller current-pressure fit, and keeps the future interface option open without paying for it today.

### Do not apply when

Reject this choice if current requirements include multiple formats selected at runtime or non-developers configure exports.

## Tracer bullet for uncertainty

### Task

Integrate a new billing provider, but its webhook behavior is unclear.

### Bad

Build the full billing abstraction, provider interface, retry service, webhook router, reconciliation job, and test matrix before touching the provider.

### Why it is bad

The riskiest knowledge is unknown. A large framework may encode wrong assumptions.

### Better

Build one thin end-to-end path: create a test customer, receive one webhook, map it to the internal billing event, and persist the minimal state needed to inspect behavior.

### Why this is better

The tracer bullet creates feedback before committing to broad structure.

### Do not apply when

Reject this plan if the provider contract is already proven locally and the risk is only routine implementation.

## Tidy first without rewriting

### Task

Add tax calculation to a messy invoice total function.

### Bad

Rewrite invoices into `InvoiceCalculator`, `TaxPolicy`, `DiscountPolicy`, and `LineItemVisitor` before adding tax.

### Why it is bad

The plan turns one behavior change into a broad redesign.

### Better

First extract the existing subtotal calculation if that makes the tax change safer. Then add tax in the local total path. Leave broader invoice cleanup for a separate change unless repeated tax changes create pressure.

### Why this is better

It separates one small structure improvement from the behavior change and stops when the current change is safe.

### Do not apply when

Reject this plan if the current function is impossible to validate and a larger refactor has explicit scope and tests.
