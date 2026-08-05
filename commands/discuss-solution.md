---
description: Prověří návrh kontrariánským a steelman posouzením.
argument-hint: <insert idea or plan>
agent: build
---

# discuss-solution 

User proposal or plan:

$ARGUMENTS

In a single parallel step, launch exactly two `general` subagents via `task`.
Do not launch any additional subagents.

## 1. Falsification Reviewer

Review the relevant files and determine whether the proposal contains actual
bugs, concrete regression risks, invalid assumptions, or missing pieces.

Your objective is **not** to produce criticism. Your objective is to determine
whether there is sufficient evidence that the proposal should be changed.

Report **only** findings for which you can provide all of the following:

- a concrete claim,
- classification: `confirmed bug`, `concrete risk`, or `unverified assumption`,
- supporting evidence with `path:line`,
- the mechanism explaining why the issue would occur,
- the conditions under which it would occur,
- severity,
- confidence.

Do **not** report issues based solely on stylistic preference, hypothetical
future requirements, or generic best practices.

There is **no minimum number of findings**. If you cannot find any
well-supported issue, explicitly state that.

Do not modify any files.

## 2. Validation Reviewer

Review the relevant files and determine which parts of the proposal are
actually supported by the existing implementation, requirements, and project
architecture.

Your objective is **not** to praise the proposal. Your objective is to verify
which parts are correct and under which conditions they remain valid.

Report **only** conclusions for which you can provide all of the following:

- a concrete claim,
- supporting evidence with `path:line`,
- the requirement, contract, or implementation detail supporting it,
- the conditions under which it remains true,
- confidence.

Do **not** invent strengths merely to balance the review. If no part of the
proposal can be sufficiently validated, explicitly state that.

Do not modify any files.

## Final Evaluation

After receiving both reports, independently reload every file necessary to
verify their claims. Treat the subagent reports as candidate findings, **not**
as ground truth.

For every significant claim:

1. Verify the cited code and surrounding context.
2. Check relevant callers, tests, contracts, and configuration.
3. Confirm the described mechanism.
4. Reject any claim that is not sufficiently supported.
5. Clearly distinguish confirmed facts, concrete risks, and remaining
   uncertainty.

Do not assume both reports carry equal weight, and do not attempt to produce
an artificial compromise. Base your conclusions solely on the strength of the
evidence.

Structure the final output as follows:

1. **Verdict:** accept, revise, or reject the proposal.
2. **Verified issues:** only well-supported findings, including `path:line`,
   mechanism, severity, and confidence.
3. **Verified strengths:** conclusions supported by evidence and the conditions
   under which they remain valid.
4. **Uncertainties:** claims that cannot be resolved from the available files.
5. **Recommended changes:** only the smallest changes necessary to satisfy the
   current requirements.

If no significant issue has been verified, recommend keeping the original
proposal.

Do not recommend refactoring, additional abstractions, or future-proofing
unless they are required to satisfy the current requirements.
