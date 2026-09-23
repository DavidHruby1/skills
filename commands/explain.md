---
description: Explain code in plain Czech through concrete scenarios, connected function canvases, and source-backed walkthroughs
agent: build
---

# Explain

Create a detailed Czech HTML walkthrough for the files and question in `$ARGUMENTS`.

Expected input:

```text
/explain @path/to/file <what the user wants explained>
```

File references and readable paths are target files. The remaining text is the user's focus. Do not parse focus text as a path. A configured repository `@reference` is a context root, not a target file. If no valid target file exists, print `Usage: /explain @file [what you want explained]` and stop.

The reading order is visual overview, concrete scenarios, focused function collaboration, then detailed source. A file summary, one all-purpose diagram, or a few token source excerpts are not sufficient. Follow the stages below; use the explicit no-relationship exception when no function canvas is justified.

## Teaching Contract

Write for a developer who can read code but does not know this feature, its domain, or its local names. The goal is that the reader can explain what happens and why, not recognize a list of identifiers. Thoroughness means removing gaps in understanding, not displaying everything inspected.

- Start with the real situation: who is doing what, what problem they face, and what successful behavior looks like. Explain the domain objects and quantities needed for this situation before introducing implementation names.
- Lead with meaning, then attach the exact name: "Rozpracované změny v prohlížeči (`draft`) ještě nejsou uložené na serveru." Never use a function, type, endpoint, or framework term as its own explanation.
- At first meaningful use of a non-obvious name, say what kind of thing it is, where it lives, what it receives or represents, and what concrete work it does here. A source link, tooltip, later glossary, or code excerpt does not replace this inline explanation.
- Explain each important function as a small input/action/result story. If understanding it depends on a callee, open that black box far enough to explain the relevant decision, transformation, or effect. Do not merely replace one unexplained name with three more.
- Carry a small, consistent worked example through the important steps. Show actual before/after values, whose values they are, and their units. Mark invented example data as illustrative; derive behavior and constraints from inspected source. Never invent domain rules to make the story simpler.
- Explain causality in ordinary sentences: why this step is needed, what it changes, and how the next step uses that change. Say what the user sees. Name a concrete failure consequence rather than saying "ensures consistency".
- Make each page and scenario locally understandable with a short orientation. Briefly reintroduce necessary terms and link to deeper context. Do not make the reader visit another page merely to decode the opening paragraph.
- Keep the main reading path focused. Put necessary reference signatures and secondary implementation details in labeled `<details>` sections after the explanation. Omit irrelevant helpers rather than building an exhaustive catalog. Do not hide prerequisites, the central calculation, or important failure behavior there.

## Stage 1: Build The Relevant Whole

Read repository instructions and relevant onboarding documentation. Read each target file completely. Then inspect source until you can trace the behavior from its real trigger to its observable result.

The explanation scope must include:

- each target file;
- direct upstream callers that trigger the behavior being explained;
- local dependencies needed to explain that behavior, including important calculations hidden behind helpers;
- downstream files on the normal path to a return value, UI change, store update, HTTP call, database operation, event, job, or file operation;
- downstream files on an important alternative or failure path;
- focused tests or documentation that prove behavior or constraints.

"Upstream" means code that supplies the trigger or input. "Downstream" means code that receives a call, value, state change, or side effect. Directory nesting does not prove either relationship.

Read definitions. Do not infer imported signatures or behavior from call sites. Use history only when current source, tests, and documentation do not explain an important reason. Mark inferred rationale and unknown rationale. Never invent intent.

Inspect widely enough to avoid missing behavior, but publish only what teaches the requested flow. An inspected file or import does not automatically deserve a section, code block, or graph node. Keep the research inventory private.

Before writing HTML, make a private inventory of:

- the external trigger and original input;
- the reader's missing domain context, unfamiliar terms, and a representative worked example;
- every included file and its concrete responsibility;
- the normal execution order across files;
- important branches and failures;
- value transformations at each boundary;
- state reads, writes, owners, and consumers;
- final outputs and side effects;
- the direct answer to the user's focus.

## Stage 2: Scaffold The Site

Create a new `.opencode/explain/<concise-kebab-name>/` directory. Add `-2`, `-3`, and so on when needed. Determine the Prism language names required by the source excerpts. Then run this command with the absolute output path and a comma-separated language list:

```bash
node ~/.config/opencode/scripts/scaffold-explain.mjs "$OUTPUT" "typescript,javascript,markup,css"
```

Change the language list to match the actual source. This command creates the tested local canvas renderer, Cytoscape, Prism, and shared CSS. It creates:

```text
site.js
site.css
cytoscape.min.js
prism.js
prism.css
```

Do not rewrite, replace, abbreviate, or inline these five files. Do not use Mermaid, a CDN, remote assets, or another graph implementation.

Add exactly these HTML files:

```text
index.html
data-flows.html
function-canvas.html
code-walkthrough.html
```

Use the navigation labels **Přehled**, **Scénáře**, **Spolupráce funkcí**, and **Kód krok za krokem**, in that order. Do not generate separate Role, file inventory, glossary, context, or quiz pages. Explain responsibilities and terms at their point of use. The overview is the entry page, not a table of contents that makes the reader click again before learning anything.

Every page uses `<html lang="cs">`, links `site.css`, and has previous, overview, and next navigation where applicable. Pages with source code also link `prism.css` and load `prism.js` before `site.js` with `defer`. `function-canvas.html` loads `cytoscape.min.js` before `site.js` with `defer`. The site must work from `file://` without a server.

## Stage 3: Start With A Visual Overview

`index.html` gives the reader a mental model before showing functions or code. Open with **Co se tu snaží uživatel udělat**, a short direct answer to the user's focus, and a concrete starting situation. For non-UI code, identify the real caller and its goal instead. Explain the few domain concepts needed for the first diagram in ordinary sentences. For example, distinguish a total for all orders from the share belonging to the selected order before discussing an edit to either value.

Immediately follow with a high-level inline SVG diagram, typically 3-7 steps, from the initiating action to the visible result. Use human actions and responsibilities as primary labels, not file or function names. Distinguish browser/local state, network, and server/persistence boundaries where relevant. Mark the target's part of the flow. Number the steps and reuse those numbers in the explanation below it.

Explain this overview with a connected narrative: what starts it, what the main participants do to the input, what changes, and what the user receives. Show the main success route first; introduce important alternative routes separately rather than crowding them into the first picture. End with links phrased as questions the next scenarios answer, such as "Jak se číslo z tabulky převede na uložené množství?"

Do not turn this page into an exhaustive architecture description. The reader should understand the overall purpose and path without opening the source. Detailed branches, function names, and calculations belong in the linked scenarios. Do not show source excerpts yet.

## Stage 4: Show Multiple Detailed Flows

`data-flows.html` teaches the behavior through named scenarios, not a gallery of diagrams. Use headings such as "Co se stane po kliknutí na Uložit" rather than "Draft → PUT → reconcile". It must contain multiple distinct inline SVG diagrams and always include:

1. **End-to-end execution flow:** trigger, upstream callers, target files, downstream dependencies, effects, and result.
2. **Value transformation flow:** one concrete value before and after every important boundary.

Add focused visuals for the important state, alternative, failure, lifecycle, transaction, or asynchronous-order behavior actually needed to answer the user's question. Choose the view that explains the uncertainty: before/after values for a calculation, lanes for client/server handoffs, a sequence for waiting and responses, or a branch for success versus failure. Do not force every concept into another box-and-arrow chain. One diagram cannot satisfy this stage; do not repeat the same diagram with different labels.

For each scenario:

1. **Situace a cíl:** establish the actor, starting state, relevant terms, and expected result before the diagram.
2. **Konkrétní příklad:** introduce the values to follow. For a calculation, show the arithmetic and explain what each number measures and belongs to.
3. **Obrázek:** summarize the scenario with plain-language actions. Exact identifiers may appear as secondary labels. Show only relationships explained in this scenario; do not imply a call or chronology merely to connect boxes.
4. **Krok za krokem:** write a numbered narrative in execution order. Each step names the actor, explains its operation on the example, and connects the result to the next step. Introduce the relevant implementation name only after explaining its job. Cover every pictured node and edge naturally within these steps.
5. **Výsledek a selhání:** state the visible outcome, what is now stored versus only local, and what remains true if an important step fails. Distinguish a failed write from a failed reload after a successful write when applicable.

The numbered narrative is the full accessible text alternative to the diagram. It must teach the flow even if the picture and code identifiers are removed. Do not add a second compressed "Textová alternativa" with arrows, or paragraphs labeled "Uzly" and "Hrany" that just enumerate facts.

Explain state changes in prose using the example's old value, the operation, the new value, and the behavior that now changes. Do not publish `trigger -> old value -> operation -> new value -> consumer -> reason` as a fill-in template. For asynchronous work, make clear what waits for what and why that ordering matters.

Reuse scenario names, step numbers, and example values across diagrams, canvases, and code. Link each detailed scenario to the matching function canvas and exact code section, not just the top of another page. The reader must be able to move from "what happens" to "which functions do it" to "how the code does it" without searching.

Use full-width scrollable diagram viewports. Keep labels readable. Do not overlap nodes, labels, or edges. Keep each visual next to the explanation it supports. Use consistent visual distinctions for temporary versus persisted values and normal versus failure paths, with text labels as well as color. On mobile, preserve readable labels and a clear scroll affordance rather than shrinking an entire graph into illegibility.

Explain file responsibility at the step where that file participates: who calls it, what it receives, which decision or change it owns, and what the next participant receives. Labels such as "service", "helper", or "component" are not explanations. Do not reproduce this as a separate file-role catalog.

When state matters, explain its owner, starting value, lifetime, readers and writers through the scenario. Show what is only a temporary browser edit versus shared application state or saved database data. Explain the relevant framework mechanism before relying on framework state terms; do not publish an exhaustive state inventory.

## Stage 5: Create Focused Function Canvases

`function-canvas.html` starts with a short explanation of which behavior the reader will follow, its trigger and result, and what an arrow means. Then show one focused interactive canvas per scenario or coherent subflow. The canvas is a map of collaboration, not a function inventory.

- Include only functions that participate in a source-verified relationship with another displayed node and are necessary to understand the scenario. Each canvas must be connected when edge directions are ignored. No isolated nodes, unrelated helper clusters, or decorative effects.
- Being called is necessary but not sufficient for inclusion. Omit incidental formatting, parsing, getters, predicates, and framework plumbing unless their specific behavior is central to the user's question. Explain their relevant work in the caller's prose and source walkthrough instead.
- Keep the entry point, important decisions, meaningful transformations, and persistence/external boundaries needed to understand the scenario. Do not remove a central calculation just because its function is named "helper".
- Aim for 4-8 meaningful nodes per canvas; do not pad smaller real flows. Split before exceeding 10 nodes, or earlier if labels and crossings make the path hard to follow. Separate scenarios such as loading, saving an existing entity, creating a new entity, and recovery rather than presenting a single system-wide graph.
- When splitting a continuous flow, repeat the shared boundary function on both canvases and link their explanations. Say where the first view stops and the next continues. Do not introduce invented functions to join the views.
- Every edge must say what relationship it represents: a direct call, callback/event handoff, or a clearly labeled condensed path. Do not present two functions as direct caller/callee if omitted functions are between them. For a condensed path, name the omitted intermediate calls in the adjacent narrative without adding them as nodes.
- Use a short Czech action plus the exact function name for node labels. The details must explain its concrete input, work, and result, not just its architectural category.
- If there is no real inter-function relationship in scope, explain that limitation in text; do not fabricate a second node to satisfy the graph requirement.

After each canvas, provide an ordered, self-contained explanation of the displayed collaboration and links to its source walkthrough. Add a collapsed reference only if useful for the functions involved in this scenario. Copy exact signatures from definitions and explain concrete inputs, outputs, and effects. Do not list every function or imported helper in the target file just to be exhaustive.

Repeat this canvas structure for each scenario. Replace the `save` suffix with a unique scenario slug in all IDs and their references. Keep the classes and data attributes unchanged. Keep each canvas's toolbar, details, and JSON inside its own shell. Do not replace the canvas with an SVG diagram:

```html
<h2 id="function-canvas-save-title">Jak se uloží změny</h2>
<p><!-- scenario context, trigger, result, and arrow meaning --></p>
<section class="function-canvas-shell" aria-labelledby="function-canvas-save-title">
  <div class="graph-toolbar" aria-label="Ovládání grafu">
    <button type="button" data-graph-action="zoom-in">+</button>
    <button type="button" data-graph-action="zoom-out">−</button>
    <button type="button" data-graph-action="fit">Přizpůsobit</button>
    <button type="button" data-graph-action="reset">Obnovit rozložení</button>
    <button type="button" data-highlight-path="all">Vše</button>
    <button type="button" data-highlight-path="main">Hlavní cesta</button>
    <button type="button" data-highlight-path="failure">Chybová cesta</button>
  </div>
  <div class="function-graph" role="img" aria-labelledby="function-canvas-save-title" aria-describedby="function-graph-save-alternative"></div>
  <aside class="function-details" aria-live="polite">Vyberte funkci.</aside>
  <script class="function-graph-data" type="application/json"><!-- graph JSON --></script>
</section>
<div id="function-graph-save-alternative"><!-- ordered explanation of the collaboration --></div>
```

The JSON has this shape:

```json
{
  "nodes": [
    {
      "id": "caller-id",
      "label": "Uloží změny\nfunctionName()",
      "kind": "local",
      "signature": "functionName(input: Type): Output",
      "purpose": "Explain the concrete input, operation, result, and why the next step needs it, in Czech.",
      "path": "src/file.ts:10",
      "snippet": "code-walkthrough.html#function-name",
      "flow": "main"
    },
    {
      "id": "callee-id",
      "label": "Zapíše data\npersistChanges()",
      "kind": "external",
      "signature": "persistChanges(input: Type): Output",
      "purpose": "Explain what is written, where, and what the caller receives, in Czech.",
      "path": "src/persistence.ts:20",
      "snippet": "code-walkthrough.html#persist-changes",
      "flow": "main"
    }
  ],
  "edges": [
    {
      "id": "unique-edge-id",
      "source": "caller-id",
      "target": "callee-id",
      "label": "předá validovaný vstup",
      "flow": "main"
    }
  ]
}
```

Use `kind: local` for target-file functions, `external` for functions from other local files, and `effect` only for a concrete external effect needed to understand the displayed path. Use `flow: main`, `failure`, or `alternative`. Node and edge IDs must be unique within a canvas; every edge endpoint must exist in that canvas. Include only path-highlight buttons for paths present there.

Replace the example names with real source-backed functions. In inline JSON, encode `<` as `\u003c` so embedded source text cannot close the script element; do not HTML-entity-escape JSON.

The supplied renderer initializes every canvas independently with draggable nodes, automatically attached edges, background pan, pointer zoom, controls, reset, path highlighting, and node details. Controls and node selection affect only their own canvas. Your task is to provide selective, correct graph data and explanatory text, not to visualize every inspected function.

## Stage 6: Walk Through Substantial Source

`code-walkthrough.html` is a detailed guided reading, not a teaser or a list of signatures. Start with a small visual route map linking the scenario steps to their code sections. Present source in actual execution order across files, not file-name order. The amount of code must follow the behavior being explained, not an arbitrary short-snippet budget.

### Source Coverage

- Show the real entry/caller, relevant state initialization, main transformation, important callee bodies, persistence/network boundary, and completion/error handling for the explained path. Include callback or template wiring when it is needed to see what actually triggers the code. Several central calculations need several substantial excerpts, not one representative snippet for the whole feature.
- Prefer a complete function, computed block, handler, or coherent branch with enough surrounding code to understand its inputs and result. A decorator, signature, opening line, isolated call, or unexplained middle fragment never counts as coverage of an operation.
- For a long function, use consecutive, clearly labeled source ranges that cover the relevant behavior through its result. Explain each part before continuing. Do not stop halfway through `try`, omit the successful return, show `Promise.all` without its results, or promise an operation whose body is absent.
- Where a needed value was initialized elsewhere, show that declaration or initialization in a separate linked excerpt. Where a central call hides the algorithm, show the callee's implementation too. Incidental formatting helpers can remain explained in prose.
- Omit unrelated regions only between excerpts, state precisely what was skipped and why it is irrelevant, and preserve actual line ranges. Never insert invented ellipses or explanatory comments into supposedly exact source. Do not concatenate noncontiguous lines into one block.
- More code must mean better coverage, not a whole-file dump. Group the implementation into understandable steps with substantive explanation between blocks. Keep the central source expanded; optional surrounding source may be in labeled `<details>` sections.

### Explain Each Excerpt

Before each excerpt, locate it in the visual scenario with the same step number and a link back. Say what question this code answers. Under **Co musíte znát**, introduce the non-obvious values and mechanisms needed to read it: what each represents, where it came from, its relevant type/shape, and the worked example's current value. Explain concepts such as `computed`, a transaction, or a callback in terms of their concrete behavior here, not just a translation. Avoid repeating a glossary of terms already established.

After each excerpt, walk through its meaningful line groups with line-range references:

1. Explain what the code actually evaluates or changes, using explicit subjects and the same example values. For a condition, say which branch the example takes and why.
2. Explain why the operation is needed for this feature. Tie skipped rows, validation, rounding, accumulation, locks, or cleanup to a concrete consequence where present. Distinguish observed behavior from inferred motivation.
3. Show the resulting value or state, its owner, and the exact next consumer. At a boundary, show a small labeled example of the payload or result, distinct from the verbatim source.
4. Cover the important alternative/failure result and what the user sees. If the function continues in the next block, say explicitly what remains to happen and link to it.

For a central algorithm or calculation, add an adjacent compact visual: before/after values, a per-iteration table, or a decision sketch. A dense code block followed by a one-sentence paraphrase is not an explanation. The reader must be able to trace the sample input through the displayed lines to the result.

Use exact escaped source in this form:

```html
<pre class="line-numbers" data-start="42"><code class="language-typescript">escaped source only</code></pre>
```

Use the correct Prism `language-*` class. Keep the source unchanged and HTML-escape it. Add `path:start-end` beside the block. Read the generated HTML back and compare decoded excerpts with the cited source ranges; verify the body, closing lines, and indentation survived generation. Code containing `<`, `>`, or `&` must display literally rather than becoming HTML. Source citations and canvas links must resolve to real section IDs.

End with **Přímá odpověď na zadaný problém**. Answer the user's focus with exact flows, functions, state changes, and source links.

## Writing Rules

Write in Czech with transferable `ASD-STE100` principles. ASD-STE100 formally controls English, so do not claim Czech compliance. Use short direct sentences, one main fact per sentence, active voice, explicit subjects, stable terms, and short paragraphs. Define terms before use. Avoid vague verbs such as "zpracuje", "řeší", "spravuje", or "obsluhuje" unless you immediately state the exact operation and result. Short sentences must not produce a shallow explanation.

Do not write telegraphic fragments, slash-separated operations, identifier chains, or English technical shorthand in place of explanation. Terms such as "baseline", "bulk", "flush", "reconcile", and "best-effort cleanup" need their concrete meaning here, not merely a Czech synonym. Use formulas only after explaining the quantities; follow them with worked numbers and the consequence. Prefer connected paragraphs over a table of unexplained attributes.

### Calibration Example

Bad: "Save → baseline → globalDelta = currentGlobal - originalGlobal → nextOrder → bulk PUT → reconcile."

Better, **only if the inspected code proves these rules**:

> Uživatel upravuje počet kusů v tabulce pro konkrétní den a výrobní linku. Buňka ale ukazuje součet za všechny zakázky, zatímco uložit chceme změnu pouze do právě vybrané zakázky. Proto nemůžeme číslo z buňky rovnou zapsat jako její nový počet.
>
> Použijme ilustrační čísla: buňka původně ukazuje 100 kusů. Vybrané zakázce z nich patří 30 a ostatním zakázkám 70. Uživatel přepíše buňku na 110. Přidal tedy 10 kusů. Vybrané zakázce má nově patřit 40 kusů, nikoli 110; ostatním zůstane 70.
>
> Pro tento výpočet si prohlížeč při zahájení editace uchová původní hodnoty. To je zde `baseline`: zapamatovaných 100 kusů celkem a 30 kusů vybrané zakázky. Rozpracované změny, označené jako `draft`, drží nově zadaných 110. Ještě nejde o uložená data na serveru.
>
> Při uložení kód odečte původní součet od nového: 110 − 100 = 10. Tento rozdíl přičte k původnímu počtu vybrané zakázky: 30 + 10 = 40. Na server pak pošle požadovaný výsledný počet 40 pro tuto zakázku, linku a den. Neposílá ani součet 110, ani samotný přírůstek 10.

This illustrates the required depth, not reusable domain content. Continue with the actual source-backed function responsible, request, server behavior, and visible result. Never transplant this feature's rules into an unrelated explanation.

Support claims with source links. Separate proven behavior, inferred rationale, and unknown rationale. Keep prose in a 70-80 character reading column. Let diagrams, canvas, and code use nearly the full viewport. Support desktop and 390px mobile widths.

## Completion Gate

Before opening the result, verify all requirements. Fix failures instead of reporting a partial site.

- Exactly the four requested pages exist, in overview-to-code reading order; no Role, inventory, separate context, or quiz page is generated.
- `index.html` opens with the goal and a readable high-level visual, not source code or a catalog. It directly answers the user's focus.
- Every page opens with enough context to understand its scenario without guessing what local terms mean.
- Important functions and terms are explained at first meaningful use, not only before source excerpts or in a reference.
- The worked example traces concrete values and ownership through the central transformation and its observable result; illustrative values are labeled.
- Read the main narrative without diagrams and identifiers: it still explains who does what, why, and with what result. Rewrite any step that merely delegates the explanation to another unexplained name.
- At least two distinct flow diagrams exist, and every node and edge is explained in a readable step-by-step narrative, not compressed node/edge lists or arrow chains.
- Matching scenario names, step numbers, and local anchors connect the visual overview, detailed scenarios, function canvases, and code.
- Each canvas has the required scoped structure, valid JSON, and unique HTML ID references.
- Each canvas shows one coherent connected collaboration, no isolated nodes or incidental helper clutter, and at most 10 nodes. A scope with no real inter-function relationship explains that limitation instead of inventing a graph.
- Every edge references existing nodes and matches a verified relationship; condensed paths are explicitly labeled and explained.
- Split canvases explain their shared boundaries and continuation; any secondary references are collapsed below the canvases and limited to relevant functions.
- On a multi-canvas page, selecting a node, zooming, resetting, or highlighting a path affects only its own canvas.
- Every important identifier is explained before its first excerpt.
- Each important step has substantive source coverage, including relevant initialization, callee bodies, and completion/failure handling. No signature-only or truncated-body placeholders remain.
- Excerpts match their cited source ranges after HTML decoding, including closing lines. Every omission is explicit and does not hide the behavior being explained.
- Every substantial excerpt has a line-group walkthrough with concrete example values and the resulting state or next consumer. Central calculations also have a supporting visual.
- Every source block has `line-numbers` and the correct `language-*` class.
- Prism grammars used by HTML exist in `prism.js`.
- HTML tags and local links are valid.
- `node --check "$OUTPUT/site.js"` succeeds.
- `node --check "$OUTPUT/prism.js"` succeeds.
- No generated HTML references a remote asset.

Run `wslview "$OUTPUT/index.html"`. If `wslview` is unavailable, report the absolute path. Finish with only the output path and genuinely unknown behavior or rationale.
