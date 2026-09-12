---
name: software-philosophy
description: Use when making or reviewing concrete decisions about module responsibilities, interfaces, dependency boundaries, data guarantees, or architectural trade-offs in discussions, specs, plans, or code review, including unresolved design questions discovered during implementation. Not for executing an accepted design, general programming explanations, or local syntax, naming, formatting, and helper choices that leave those decisions unchanged.
---

# Software Philosophy

Choose the least complex design that fully satisfies the current requirement.
Complexity is what people must understand and coordinate, not the number of lines.
Use this skill as a decision lens, not a coding standard or a mandatory workflow.
Apply only the concerns relevant to the change, including meaningful decisions inside a single module.
Governing AGENTS.md rules, assigned scope, and permissions still apply.
A planning or review assignment does not itself authorize implementation.

## Vocabulary

### Software Design

- **Module**: a unit of implementation with an interface, such as a function, class, or subsystem;
  not necessarily a file or a service.
- **Interface**: everything a caller must know to use a module correctly: meaning, constraints,
  errors, side effects, and required call order, not just its signature.
- **Implementation**: the internal mechanism that fulfills the interface's contract and that
  callers should not need to understand.
- **Deep module**: substantial functionality behind a relatively simple interface, hiding more
  complexity than its use introduces.
- **Shallow module**: an interface whose learning and usage costs are large relative to the
  functionality it hides. A short function is not automatically a good module.
- **Information hiding**: keeping a decision or piece of knowledge inside a module so others
  need not know it or change with it.
- **Information leakage**: multiple modules depend on the same internal decision, forcing
  coordinated changes when that decision changes.
- **Change amplification**: one requirement change requires edits in many places.
- **Cognitive load**: how much a developer must hold in mind to perform a particular change.
- **Unknown unknowns**: it is not apparent what must be understood or which code a change affects.
- **Define errors out of existence**: choose a valid contract that eliminates an otherwise
  necessary error case; never conceal failure or return false success.

### Architecture

- **Architecture characteristic**: a quality important to the system's success that shapes its
  design, such as availability, security, performance, or deployability.
- **Cohesion**: how strongly a module's responsibilities belong together around a coherent purpose.
- **Coupling**: dependencies that constrain how parts can be understood, changed, or operated.
- **Connascence**: parts must agree on something to remain correct, such as a meaning, format,
  call order, or timing. Stronger dependencies are more tolerable locally than across boundaries.
- **Fitness function**: an objective check that a relevant architecture characteristic still holds;
  it can be an existing test, dependency rule, measurement, or operational check, not a new framework.

### Data Systems

- **Reliability**: continuing to provide the required behavior under the faults being considered.
- **Scalability**: the ability to handle a specified kind of load growth with appropriate resources.
- **Maintainability**: making the system practical to operate, understand, and change over time.
- **Invariant**: a condition that must remain true across the operations and states in its scope.
- **System of record**: the authoritative source for a particular fact.
- **Derived data**: a representation computed from other data, such as a cache, index, or read model.
- **Partial failure**: some components fail or become unreachable while others continue running;
  the caller may not know whether a remote operation took effect.
- **Idempotence**: repeating the same logical operation has the same intended effect as applying
  it once; this does not automatically cover every downstream side effect.
- **Timeliness versus integrity**: how up-to-date an observation is versus whether data is correct,
  uncorrupted, and preserved. Delayed visibility and lost or duplicated effects are different problems.

## Keep Knowledge Local

Place a rule with the knowledge needed to own it. Judge boundaries by what callers no longer need
to know and what can change independently, not by pattern names, file counts, or code size.

- Group responsibilities that share a decision or invariant; separate responsibilities with
  different meanings or reasons to change. Similar code alone does not establish a shared rule.
- Hide internal formats, external-system quirks, and preparation sequences at the responsible
  boundary. Avoid decomposing modules solely by the order in which operations happen.
- Prefer an interface that completes a useful operation over one that makes each caller coordinate
  internal steps and shared state. Move necessary complexity into the module equipped to own it.
- Keep the common use simple. Expose genuine caller choices, not configuration the module could
  determine itself. Do not hide costs, constraints, or failure semantics callers actually need.
- Let a general operation remove existing special cases. Do not confuse this with building a
  framework, provider hierarchy, or extension point for hypothetical requirements.
- Give each layer a distinct responsibility. A pass-through layer needs a concrete boundary or
  policy benefit; another name for the same operation is not enough.
- Use precise domain names and document obligations or rationale that names cannot express.
  Describe what callers need to know, not internal machinery. A contract that is hard to explain
  is a reason to reconsider the boundary, not to add a longer implementation narrative.

Depth is not size. Do not invent internal complexity to hide, merge unrelated responsibilities,
or move domain policy into infrastructure merely to make callers shorter.

For example, a settings boundary can own decoding, defaults, and validation and return usable
settings. A facade that still requires every caller to repair its result has not removed that knowledge.

## Prefer Adequate Solutions Over Speculative Architecture

- Start from the affected behavior and existing design. Reuse a module, platform capability, or
  dependency when its contract fits; resemblance or familiarity is not sufficient evidence.
- Prefer less custom functionality to own, while accounting for integration and operational costs.
  Add dependencies when the necessary work or risk they remove justifies their cost; do not replace
  specialized correctness with incomplete custom logic.
- Distinguish necessary complexity from accidental complexity. A real integrity, security, or
  recovery requirement can justify more machinery; hypothetical growth or flexibility cannot.
- Make small strategic improvements in the changed path when they reduce a present design cost.
  The smallest diff is not always the simplest system.
- Keep structural changes distinct from intentional behavior changes. A refactor must preserve
  relevant contracts, errors, side effects, persistence, and ordering, not just the happy-path result.

## Make Architectural Trade-offs Explicit

Architecture choices are contextual. Compare them against the actual problem, not a preferred style.

- Translate business outcomes into the few characteristics that drive this decision. Distinguish
  hard constraints from preferences; do not try to maximize every desirable quality.
- Make consequential quality requirements concrete: relevant workload, latency distribution,
  availability expectations, recovery needs, or resource limits. Label unknowns and proposed targets;
  do not invent numbers or treat "fast," "scalable," and "production-ready" as acceptance criteria.
- For a consequential decision with credible alternatives, design it twice: compare the simplest
  viable approaches by caller knowledge, coordinated changes, guarantees, and operating cost.
  Do not manufacture alternatives or decision matrices for routine choices.
- Examine coupling through shared data, shared models, synchronous calls, timing, and coordinated
  releases, not only imports. A network boundary does not establish operational independence.
- Keep cohesive modules together unless separate deployment, scaling, ownership, or fault isolation
  serves a current requirement. Modularity does not require distribution.
- Weigh reuse against independent evolution. Share actual common knowledge; avoid forcing unrelated
  domains into a common model merely because both use a name such as "customer."
- Consider the team's ability to deploy, observe, diagnose, and recover the proposed system.
  Operational work and failure modes count as complexity even when application code becomes shorter.
- Prefer decisions that remain easy to change when current needs are uncertain. Record a concrete
  condition for revisiting a choice when useful; do not build the future replacement in advance.

For important decisions, preserve the context, choice, rationale, and accepted consequences.
Use the existing spec or an architecture decision record (ADR) where appropriate, not a mandatory
new document for every change. Record why an alternative lost when that knowledge prevents rework.

## State Guarantees Before Choosing Data Mechanisms

Use this section when the change affects persistent state, concurrency, asynchronous work, or
remote dependencies. Address the guarantees actually affected, not every distributed-systems concern.

- Identify the authoritative owner of each fact and the direction of derived data flow. A cache
  or index is not a second authority. Clarify how changed derived state stays correct or is rebuilt.
- Choose data models and access paths from required queries, updates, relationships, and workload.
  A storage technology's popularity is not a requirement; another datastore adds coordination cost.
- State important invariants and where they are enforced. Include authorization and trust boundaries
  where relevant; format validation and storage constraints do not replace application policy.
- Define what success promises: accepted, committed, durably recorded, externally completed, or
  visible to subsequent reads. Do not let an interface imply a stronger guarantee than it provides.
- Separate transaction atomicity (all-or-nothing changes) from isolation (concurrent interactions).
  Identify the protection an invariant requires; "we use transactions" does not prove race safety.
- Specify which stale reads or reordered observations are acceptable. Stronger consistency has
  costs, but eventual convergence is not a remedy for lost data or violated business invariants.
- Treat a timeout as an uncertain outcome, not proof that nothing happened. When retries or
  redelivery are possible, define the protected effect and the scope of idempotence or deduplication.
- Assess guarantees end to end. Broker delivery semantics or one database transaction do not by
  themselves guarantee exactly-once business effects across other systems.
- Make required failure behavior explicit: reject, remain pending, recover, reconcile, or compensate.
  Compensation is another fallible business operation, not an automatic rollback of the outside world.
- Prefer contracts that remove unnecessary error cases without weakening requirements. Ensuring a
  temporary resource is absent can succeed when it is already absent; permission failure is not success.

For example, committing a record and then enqueueing work leaves a crash gap between the operations.
If losing that work violates the contract, plan a durable handoff using suitable existing facilities
or a justified mechanism. Correct ordering and a comment alone do not provide reliable delivery.

## Plan for Evolution Where the Change Requires It

- Treat stored formats, APIs, and events as contracts with consumers. When old and new versions
  coexist, identify which readers must understand which writers, including during rollback.
- **Backward compatibility** lets newer code read older data; **forward compatibility** lets older
  code read newer data. Evaluate semantic meaning as well as whether parsing succeeds.
- For consequential data changes, cover migration, backfill, cutover, and recovery only as needed.
  Reverting code does not necessarily undo changed data or external effects.
- When adding derived state or retained data, consider rebuilding, deletion, and access restrictions
  that the requirement needs. Replaying data must not accidentally repeat external actions.
- Use a focused fitness function when an important architectural property would otherwise drift.
  For example, an existing dependency check can protect a boundary, or a workload measurement can
  verify a latency requirement. Do not introduce a general governance system to check one property.

## Apply to Feature Discussions, Specs, and Plans

Understand the intended outcome before choosing structure. Use relevant repository evidence to
establish affected contracts and flows; do not demand a full repository survey before every proposal.
Separate established facts, assumptions, and open decisions. Resolve uncertainty that can change
correctness, scope, or the chosen design through a focused lookup, check, or question.

A useful spec makes the intended behavior, non-goals, constraints, and observable acceptance criteria
clear. Add ownership, interfaces, invariants, failure behavior, and trade-offs where they affect the
change. Describe guarantees before mechanisms; avoid prescribing local syntax or helper structure.

A useful plan turns those decisions into bounded, verifiable changes. Identify affected boundaries,
meaningful dependencies between steps, and the evidence that establishes completion. Reference
verified files or existing facilities when helpful; do not invent repository details.

Plan verification around changed behavior and concrete risks. Prefer checks at real public boundaries;
include concurrency, compatibility, or failure scenarios only when the change makes them significant.
Expand verification when the affected scope warrants it, not to satisfy an exhaustive checklist.

Keep design effort proportional to the decision. A local change may need a short rationale, not a
full spec or ADR. Planning is complete when the implementer can proceed without inventing consequential
requirements or architectural decisions; local implementation choices may remain open.

## Apply to Architectural Code Review

Review the actual change against its intended behavior, accepted design, and affected callers or
consumers. Follow relevant dependencies far enough to assess impact, not through the whole repository.
An implementation can follow the plan and still reveal that the plan's assumptions were wrong.

- Look for concrete information leakage, misplaced responsibility, unnecessary interface burden,
  change amplification, and unsupported behavioral or data guarantees.
- Assess what maintainers and callers must understand, not whether the code uses a favored pattern.
  An unfamiliar design, short helper, or repeated expression is not by itself a defect.
- Connect each finding to a location or boundary, the triggering condition, its consequence, and
  the smallest adequate correction. For design debt, show the specific coordination or reasoning cost.
- Separate correctness or contract violations from justified design improvements and optional
  preferences. Do not reopen an accepted trade-off without new evidence or a changed requirement.
- Keep unrelated problems separate from the requested change. Do not make a broad redesign a
  prerequisite when a local correction fully addresses the issue.

Use the requested review format and prioritize consequential findings. Do not manufacture findings
or describe unverified concerns as proven bugs. State material uncertainty or missing evidence.

## Foundations

Adapted from John Ousterhout, *A Philosophy of Software Design*, 2nd ed.: complexity, deep modules,
information hiding, strategic design, contracts, and design alternatives.
Mark Richards and Neal Ford, *Fundamentals of Software Architecture*, 1st ed.: characteristics,
coupling, contextual trade-offs, fitness functions, and decision rationale.
Martin Kleppmann, *Designing Data-Intensive Applications*, 1st ed.: reliability, data ownership,
end-to-end correctness, partial failure, and evolution. These sources are not required reading per task.
