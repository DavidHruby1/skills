document.addEventListener("DOMContentLoaded", () => {
  if (window.Prism) window.Prism.highlightAll();

  const container = document.querySelector("#function-graph");
  const source = document.querySelector("#function-graph-data");
  if (!container || !source || !window.cytoscape) return;

  let graph;
  try {
    graph = JSON.parse(source.textContent);
  } catch (error) {
    container.textContent = `Graf nelze načíst: ${error.message}`;
    return;
  }

  const elements = [
    ...graph.nodes.map((node) => ({ data: node })),
    ...graph.edges.map((edge) => ({ data: edge })),
  ];

  const cy = window.cytoscape({
    container,
    elements,
    minZoom: 0.25,
    maxZoom: 2.5,
    wheelSensitivity: 0.18,
    boxSelectionEnabled: false,
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#173f5f",
          "border-color": "#67e8f9",
          "border-width": 2,
          color: "#f8fafc",
          label: "data(label)",
          "font-family": "ui-monospace, SFMono-Regular, Menlo, monospace",
          "font-size": 13,
          "text-wrap": "wrap",
          "text-max-width": 150,
          "text-valign": "center",
          "text-halign": "center",
          width: 178,
          height: 64,
          shape: "round-rectangle",
        },
      },
      {
        selector: "node[kind = 'external']",
        style: { "background-color": "#4c1d95", "border-color": "#c4b5fd" },
      },
      {
        selector: "node[kind = 'effect']",
        style: { "background-color": "#713f12", "border-color": "#fde68a" },
      },
      {
        selector: "edge",
        style: {
          width: 2,
          "line-color": "#64748b",
          "target-arrow-color": "#64748b",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          label: "data(label)",
          color: "#cbd5e1",
          "font-size": 11,
          "text-background-color": "#111827",
          "text-background-opacity": 0.9,
          "text-background-padding": 3,
          "text-rotation": "autorotate",
        },
      },
      {
        selector: ".dimmed",
        style: { opacity: 0.14 },
      },
      {
        selector: ".selected-path",
        style: {
          opacity: 1,
          "line-color": "#22d3ee",
          "target-arrow-color": "#22d3ee",
          "border-color": "#22d3ee",
          "border-width": 4,
          width: 4,
        },
      },
    ],
    layout: {
      name: "breadthfirst",
      directed: true,
      spacingFactor: 1.35,
      padding: 48,
      animate: false,
    },
  });

  const details = document.querySelector("#function-details");
  cy.on("tap", "node", (event) => {
    const data = event.target.data();
    if (!details) return;

    details.replaceChildren();
    const heading = document.createElement("h3");
    heading.textContent = data.label;
    details.append(heading);

    for (const [label, value] of [
      ["Signatura", data.signature],
      ["Účel", data.purpose],
      ["Soubor", data.path],
    ]) {
      if (!value) continue;
      const row = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      row.append(strong, document.createTextNode(value));
      details.append(row);
    }

    if (data.snippet) {
      const link = document.createElement("a");
      link.href = data.snippet;
      link.textContent = "Přejít na vysvětlený kód";
      details.append(link);
    }
  });

  document.querySelector("[data-graph-action='zoom-in']")?.addEventListener("click", () => {
    cy.zoom({ level: Math.min(cy.zoom() * 1.2, cy.maxZoom()), renderedPosition: center(container) });
  });
  document.querySelector("[data-graph-action='zoom-out']")?.addEventListener("click", () => {
    cy.zoom({ level: Math.max(cy.zoom() / 1.2, cy.minZoom()), renderedPosition: center(container) });
  });
  document.querySelector("[data-graph-action='fit']")?.addEventListener("click", () => cy.fit(undefined, 48));
  document.querySelector("[data-graph-action='reset']")?.addEventListener("click", () => {
    cy.layout({ name: "breadthfirst", directed: true, spacingFactor: 1.35, padding: 48, animate: false }).run();
    cy.fit(undefined, 48);
  });

  document.querySelectorAll("[data-highlight-path]").forEach((button) => {
    button.addEventListener("click", () => {
      const path = button.dataset.highlightPath;
      cy.elements().removeClass("dimmed selected-path");
      if (path === "all") return;
      cy.elements().addClass("dimmed");
      cy.elements(`[flow = '${path}']`).removeClass("dimmed").addClass("selected-path");
    });
  });

  cy.fit(undefined, 48);
});

/**
 * Returns the rendered center of a graph container.
 * Cytoscape uses this point to keep button zoom stable and predictable.
 */
function center(element) {
  return { x: element.clientWidth / 2, y: element.clientHeight / 2 };
}
