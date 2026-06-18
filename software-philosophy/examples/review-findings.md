# Review Finding Examples

## Behavior drift hidden in a refactor

### Bad review comment

This refactor looks cleaner. Nice extraction.

### Better finding

High: This is labeled as a refactor, but the extracted path now applies discounts before rounding instead of after rounding. That changes invoice totals for fractional quantities. Either preserve the original operation order in the extraction or mark this as a behavior change and add coverage for the new rounding rule.

### Why this is better

It catches observable behavior drift instead of rewarding clean-looking structure.

### Do not apply when

Do not call this behavior drift if the task explicitly changed the rounding rule and the diff includes validation for the new behavior.

## Shallow abstraction

### Bad review comment

Consider using a service layer here.

### Better finding

Medium: `UserManager.getUser` only forwards to `UserRepository.getUser`, so callers gain another dependency without hiding authorization, caching, mapping, or error policy. Use the repository directly until there is real user policy for this boundary to own.

### Why this is better

It judges the abstraction by whether it hides knowledge, not by whether the shape looks enterprise-ready.

### Do not apply when

Do not reject the layer if it owns meaningful policy such as authorization, caching, mapping, retry behavior, or external error normalization.

## Missing validation tied to risk

### Bad review comment

Add more tests.

### Better finding

Medium: This changes the fallback order for user display labels, but there is no coverage for invited users without `display_name`. That is the path most likely to regress because the rule comes from the external API shape. Add a focused test for invited users or document the manual verification performed.

### Why this is better

It asks for validation because of a specific hidden rule, not as a generic review habit.

### Do not apply when

Do not request a new test if existing coverage already exercises this exact fallback rule or the change includes a credible manual verification path.

## No findings

### Good no-finding response

No findings. The change keeps behavior local, does not introduce new boundaries, and the existing tests cover the modified branch. Residual risk: I did not verify provider behavior beyond the checked tests.

### Why this is good

It states the absence of findings directly and names what remains unverified.

### Do not apply when

Do not say no findings if unreviewed files, missing context, or unavailable validation could hide a material risk; state the limitation instead.
