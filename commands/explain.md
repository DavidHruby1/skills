---
description: Explain a file as part of its complete data flow with detailed context, interactive function nodes, and highlighted source
agent: build
---

# Explain

Create a detailed Czech HTML walkthrough for the files and question in `$ARGUMENTS`.

Expected input:

```text
/explain @path/to/file <what the user wants explained>
```

File references and readable paths are target files. The remaining text is the user's focus. Do not parse focus text as a path. A configured repository `@reference` is a context root, not a target file. If no valid target file exists, print `Usage: /explain @file [what you want explained]` and stop.

This command is not complete when it only explains the target file. It is not complete when it creates one summary diagram. It is not complete when the function graph is a static SVG. Follow every stage below.

## Stage 1: Build The Relevant Whole

Read repository instructions and relevant onboarding documentation. Read each target file completely. Then inspect source until you can trace the behavior from its real trigger to its observable result.

The explanation scope must include:

- each target file;
- direct upstream files that import, call, instantiate, render, register, or schedule the target;
- every local file directly imported by the target;
- downstream files on the normal path to a return value, UI change, store update, HTTP call, database operation, event, job, or file operation;
- downstream files on an important alternative or failure path;
- focused tests or documentation that prove behavior or constraints.

"Upstream" means code that supplies the trigger or input. "Downstream" means code that receives a call, value, state change, or side effect. Directory nesting does not prove either relationship.

Read definitions. Do not infer imported signatures or behavior from call sites. Use history only when current source, tests, and documentation do not explain an important reason. Mark inferred rationale and unknown rationale. Never invent intent.

Before writing HTML, make a private inventory of:

- the external trigger and original input;
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
whole-context.html
data-flows.html
file-roles.html
function-canvas.html
code-walkthrough.html
check-your-understanding.html
```

Every page uses `<html lang="cs">`, links `site.css`, and has previous, index, and next navigation. Pages with source code also link `prism.css` and load `prism.js` before `site.js` with `defer`. `function-canvas.html` loads `cytoscape.min.js` before `site.js` with `defer`. The site must work from `file://` without a server.

## Stage 3: Explain The Whole Thoroughly

`whole-context.html` must thoroughly explain what all included files do together. Do not limit this to a short summary. Continue until a developer can predict the trigger, ordered processing, value changes, ownership, final result, state changes, side effects, and failure boundaries.

Start at the system boundary and narrow toward the target. Explain:

- what starts the behavior and under which conditions;
- where input originates and what a representative input contains;
- which files participate and why each one is required;
- what each file contributes in execution order;
- how values change between files;
- who owns each decision and state change;
- what the caller or user receives;
- what external effects occur and in which order;
- where and how the flow can fail;
- what would be missing, stale, duplicated, unsafe, or incorrect without the target code;
- how this whole answers the user's focus.

Do not add a generic domain primer. Define only concepts needed to understand the actual flow. Do not show source excerpts yet.

## Stage 4: Show Multiple Detailed Flows

`data-flows.html` must contain multiple distinct inline SVG diagrams. It must always include:

1. **End-to-end execution flow:** trigger, upstream callers, target files, downstream dependencies, effects, and result.
2. **Value transformation flow:** one concrete value before and after every important boundary.

Add separate state, alternative, failure, lifecycle, transaction, or asynchronous-order diagrams when those paths exist. One diagram cannot satisfy this stage. Do not repeat the same diagram with different labels.

After every diagram, explain every node and every edge in flow order. For each node, explain its file or boundary, current value, owner, operation, and purpose. For each edge, explain its trigger, transferred value, transformation, receiver, and reason. Include a full text equivalent. A diagram never replaces prose.

Every state change must use this causal sequence:

```text
trigger -> old value -> operation -> new value -> consumer -> reason
```

Use full-width scrollable diagram viewports. Keep labels readable. Do not overlap nodes, labels, or edges.

## Stage 5: Explain Every File Role

`file-roles.html` covers every file in the explanation scope. For each file, explain:

- who triggers or imports it;
- what it receives;
- what exact decisions and transformations it owns;
- what it calls, returns, renders, emits, or mutates;
- what side effects it owns;
- how it connects to the previous and next files in the flow;
- why this responsibility is at this boundary;
- what would break or move elsewhere without it.

Do not use labels such as "service", "helper", "component", or "utility" as explanations. State the concrete work.

When state exists, add **Stav a jeho změny**. For every relevant local state, ref, signal, store field, cache, mutable object, and persisted value, give its declaration, type, initial value, owner, readers, writers, trigger, representative old and new values, lifetime, and dependent behavior. Explain the framework state model before using framework-specific state terms.

## Stage 6: Create The Interactive Function Canvas

`function-canvas.html` starts with two complete text references:

1. **Funkce uvnitř požadovaných souborů:** every function and method defined in target files.
2. **Přímo volané externí funkce:** every directly called function imported from a local file.

Copy exact signatures from definitions. For each function, explain its inputs, output, state reads, state writes, side effects, callers, callees, role in the flows, reason for existence, and concrete behavior lost without it.

After the references, add this exact canvas structure. Do not replace it with an SVG diagram:

```html
<section class="function-canvas-shell" aria-labelledby="function-canvas-title">
  <div class="graph-toolbar" aria-label="Ovládání grafu">
    <button type="button" data-graph-action="zoom-in">+</button>
    <button type="button" data-graph-action="zoom-out">−</button>
    <button type="button" data-graph-action="fit">Přizpůsobit</button>
    <button type="button" data-graph-action="reset">Obnovit rozložení</button>
    <button type="button" data-highlight-path="all">Vše</button>
    <button type="button" data-highlight-path="main">Hlavní cesta</button>
    <button type="button" data-highlight-path="failure">Chybová cesta</button>
  </div>
  <div id="function-graph" role="img" aria-describedby="function-graph-alternative"></div>
  <aside id="function-details" aria-live="polite">Vyberte funkci.</aside>
</section>
<div id="function-graph-alternative"><!-- complete text alternative --></div>
<script id="function-graph-data" type="application/json"><!-- graph JSON --></script>
```

The JSON has this shape:

```json
{
  "nodes": [
    {
      "id": "unique-function-id",
      "label": "functionName()",
      "kind": "local",
      "signature": "functionName(input: Type): Output",
      "purpose": "Concrete purpose in Czech.",
      "path": "src/file.ts:10",
      "snippet": "code-walkthrough.html#function-name",
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

Use `kind: local` for target-file functions, `external` for functions from other local files, and `effect` for important external effects. Use `flow: main`, `failure`, or `alternative`. Every edge endpoint must exist. Include important entry, branch, state-change, boundary, and side-effect functions. Trivial helpers can stay only in the text reference.

The supplied renderer provides draggable nodes, automatically attached edges, background pan, pointer zoom, controls, reset, path highlighting, and node details. Your task is to provide complete and correct graph data and text alternatives.

## Stage 7: Walk Through Highlighted Source

`code-walkthrough.html` presents excerpts in actual execution order across files. Do not order them by file name. Before every excerpt, add **Co musíte znát** and define each non-obvious parameter, variable, property, import, callback, state container, constant, and framework helper used in that excerpt. Give its type, origin, representative value, next consumer, and reason for use.

Use exact escaped source in this form:

```html
<pre class="line-numbers" data-start="42"><code class="language-typescript">escaped source only</code></pre>
```

Use the correct Prism `language-*` class. Keep the source unchanged. Add `path:start-end` beside the block. After each excerpt, explain small line groups in source and execution order. State input, evaluated operation, branch condition, output or side effect, next consumer, why the operation exists, and what concrete behavior fails without it. Connect state reads and writes to the state inventory.

End with **Přímá odpověď na zadaný problém**. Answer the user's focus with exact flows, functions, state changes, and source links.

## Stage 8: Check Understanding

`check-your-understanding.html` contains 7-8 medium questions with exactly three options `a`, `b`, and `c`. Test flow, file roles, transformations, function boundaries, state ownership, failures, and the user's focus. Put each answer and explanation in `<details>`.

## Writing Rules

Write in Czech with transferable `ASD-STE100` principles. ASD-STE100 formally controls English, so do not claim Czech compliance. Use short direct sentences, one main fact per sentence, active voice, explicit subjects, stable terms, and short paragraphs. Define terms before use. Avoid vague verbs such as "zpracuje", "řeší", "spravuje", or "obsluhuje" unless you immediately state the exact operation and result. Short sentences must not produce a shallow explanation.

Support claims with source links. Separate proven behavior, inferred rationale, and unknown rationale. Keep prose in a 70-80 character reading column. Let diagrams, canvas, and code use nearly the full viewport. Support desktop and 390px mobile widths.

## Completion Gate

Before opening the result, verify all requirements. Fix failures instead of reporting a partial site.

- All target, direct upstream, and direct imported local files appear in file roles.
- `whole-context.html` is thorough and answers the user's focus.
- At least two distinct flow diagrams exist, and every node and edge is explained.
- Every target-file function and directly called imported function has an exact text reference.
- `function-canvas.html` contains the required structure and valid JSON.
- The canvas contains multiple connected nodes; it is not a static SVG.
- Every edge references existing nodes.
- Every important identifier is explained before its first excerpt.
- Every source block has `line-numbers` and the correct `language-*` class.
- Prism grammars used by HTML exist in `prism.js`.
- HTML tags and local links are valid.
- `node --check "$OUTPUT/site.js"` succeeds.
- `node --check "$OUTPUT/prism.js"` succeeds.
- No generated HTML references a remote asset.

Run `wslview "$OUTPUT/index.html"`. If `wslview` is unavailable, report the absolute path. Finish with only the output path and genuinely unknown behavior or rationale.
