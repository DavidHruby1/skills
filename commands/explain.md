---
description: Build a concise, source-backed HTML walkthrough for provided code files
agent: build
---

Explain the code files named in `$ARGUMENTS` as a compact local static site. Work directly and keep the investigation proportional to what a developer needs to understand the files.

Write all explanatory content, headings, captions, navigation, quiz questions, answers, and diagram labels in clear, natural Czech, and set each page's `<html lang="cs">`. Keep source excerpts, code identifiers, file paths, API names, and established technical terms unchanged when translating them would reduce precision.

Treat `$ARGUMENTS` as 1-8 literal file paths relative to the project root. Accept readable text files inside the project only. If a path is invalid, report it, print `Usage: /explain <file> [file ...]`, and stop without writing output.

Read repository instructions and onboarding documentation when present. Read every requested file completely, then inspect only the callers, dependencies, types, tests, and documentation needed to explain it accurately. Use history only when an important design choice remains unexplained.

Create a new `.opencode/explain/<concise-kebab-name>/` directory, adding `-2`, `-3`, and so on if needed. Keep the site flat:

```text
<concise-kebab-name>/
|-- index.html
|-- big-picture.html
|-- core-idea.html
|-- how-it-works.html
|-- functions-and-relations.html
|-- connections-and-choices.html
|-- check-your-understanding.html
|-- site.css
`-- site.js                   # optional, only when useful
```

`index.html` is a short landing page that states the walkthrough's purpose, estimated reading time, requested files, and numbered links to the six chapter pages. Each chapter page links to the previous chapter, the index, and the next chapter. Use `site.css` for shared styles, inline SVG for diagrams, and an optional shared `site.js` only when interaction materially improves understanding or navigation.

Do not create anything else: no nested folders, atlas, manifest, JSON, metadata, source sidecars, build tooling, backend, server, localhost service, browser emulation, headless browser, container, or virtual display. JavaScript is allowed in the single optional `site.js`, but use it only for clear progressive enhancements; never require it to read content, follow navigation, or reveal answers.

Use these chapter files and titles:

1. **Big picture**: a skippable beginner primer, the relevant domains and lifecycle, one domain-level map, and where the requested files fit.
2. **Core idea**: the central mechanism in normal prose, demonstrated by one concrete toy value moving through the system and what would happen without this code. Prefer a compact standalone SVG flow diagram here; do not turn the chapter into a source-code block.
3. **How it works**: source-backed code excerpts in execution order, with normal and failure traces placed beside the code they explain.
4. **Funkce a jejich vazby** (`functions-and-relations.html`): a compact function reference followed by a selective relationship graph. Use exactly two reference sections. **Funkce uvnitř souboru** covers every function or method defined in the requested files. **Externí funkce** covers every directly called function imported from another file. The headings already communicate where each function belongs, so do not add a separate defining-file field to entries. For each entry, show the exact signature and briefly explain what it does, what purpose it serves here, and why it works or belongs at that boundary. Keep minor helpers concise, but do not omit them from the reference sections.
5. **Connections and choices**: callers, dependencies, state, side effects, focused tests, design trade-offs, and genuinely unknown rationale.
6. **Check your understanding**: 7-8 medium-difficulty multiple-choice questions with exactly three plausible options labeled `a`, `b`, and `c`. Focus primarily on code structure, control flow, dependencies, responsibility boundaries, state and transaction ownership, and architectural choices. Use observable behavior only when it tests understanding of those concepts; avoid product or UI trivia. Put the correct answer and a concise explanation in a native `<details>` element after each question so it stays hidden until opened.

In **Funkce a jejich vazby**, read the definitions of directly called external functions and copy signatures from their source instead of inferring them from call sites. Render signatures as compact code, not large source excerpts. After the two complete reference sections, add one curated inline SVG graph containing only the main functions and the direct relationships needed to understand the architecture. Determine importance from orchestration responsibility, branching, state changes, boundary crossings, and number of meaningful collaborators; prefer substantial entry points and coordination functions over trivial helpers. Mention omitted helper relationships in the relevant function descriptions instead of crowding the graph.

Draw graph nodes as circles or rounded circular nodes, visually distinguish functions defined in the requested files from external functions, use directed edges with short relationship labels, and include a legend. Put the graph in a full-bleed viewport that escapes the normal 70-80 character text column and uses nearly the full browser width. Give the graph a comfortably large canvas and native two-axis overflow without shrinking labels to fit. When useful, add pointer drag-to-pan and restrained zoom controls through `site.js`, while preserving keyboard access, visible scrollbars, and full usability without JavaScript. Keep the surrounding reference text in the normal reading column. Do not attempt a complete call graph, use force-directed layout, or allow nodes, labels, or edges to overlap.

Keep each fact in its most relevant chapter and avoid repeated summaries. Support integration claims with links to the relevant file, test, configuration, or documentation.

Use exact, syntax-highlighted `<pre><code>` excerpts with visible line numbers and `path:start-end` labels. A `<pre><code>` block may contain only escaped source text: never place prose, lists, diagrams, callouts, navigation, or other page markup inside it, and close both tags immediately after the excerpt. Prefer 8-30 lines that capture one contract, transformation, branch, or side effect. Explain each excerpt's inputs, operation, output or effect, and importance; add line annotations only when useful. Cover every important behavior, but summarize mechanical declarations. HTML-escape source text and redact credentials or personal data.

Include simple inline SVG diagrams where they clarify architecture or execution. Place each `<svg>` in its own diagram container outside every `<pre>` and `<code>` element. Give edges arrowheads, action labels, and clear endpoints; show representative values at important boundaries and distinguish normal from failure paths. Put a short text equivalent below each diagram. For UI code, include a schematic wireframe only when it clarifies the triggering interaction and visible state change.

Use a restrained documentation layout with system sans-serif prose, system monospace code, high contrast, visible keyboard focus, and a 70-80 character reading width. Keep navigation shallow and consistent across pages. Make it readable at desktop and 390px mobile widths, with JavaScript used only as progressive enhancement.

Before finishing, inspect every generated HTML file and confirm that structural tags are balanced, every `<pre>` contains exactly one `<code>`, each source block closes before subsequent prose or diagrams, inline SVG is outside code blocks, excerpts still match the source, and every local link points to an existing file or page ID. Confirm separately that the function reference includes every function defined in the requested files, every directly called external function, and exact source-backed signatures; then check that the graph remains selective, legible, full-bleed, and scrollable without overlapping nodes or labels. Then run `wslview <absolute-path-to-index.html>` to open the site directly. If `wslview` is unavailable, report the absolute path; do not substitute another tool or server. Finish with only the output path and any genuinely unknown behavior or rationale.
