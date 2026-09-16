import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { resolve } from "node:path";

const configRoot = resolve(homedir(), ".config/opencode");
const output = process.argv[2] ? resolve(process.argv[2]) : null;
const requestedLanguages = (process.argv[3] || "javascript,typescript,markup,css,json")
  .split(",")
  .map((language) => language.trim().toLowerCase())
  .filter(Boolean);

if (!output) {
  console.error("Usage: node scaffold-explain.mjs <output-directory> [language,language]");
  process.exit(1);
}

const prismRoot = resolve(configRoot, "node_modules/prismjs");
const components = JSON.parse(await readFile(resolve(prismRoot, "components.json"), "utf8"));
const languageMetadata = components.languages;
const builtIn = new Set(["markup", "html", "xml", "svg", "mathml", "ssml", "atom", "rss", "css", "clike", "javascript", "js"]);

/**
 * Maps a Prism alias to the component file that provides its grammar.
 * This keeps HTML language classes and copied browser grammars consistent.
 */
function canonicalLanguage(requested) {
  if (languageMetadata[requested]) return requested;
  for (const [name, metadata] of Object.entries(languageMetadata)) {
    const aliases = Array.isArray(metadata.alias) ? metadata.alias : [metadata.alias].filter(Boolean);
    if (aliases.includes(requested)) return name;
  }
  throw new Error(`Prism does not provide the requested language: ${requested}`);
}

const orderedLanguages = [];
const visited = new Set();

/**
 * Adds one grammar after all grammars that it requires.
 * Prism must receive dependencies in this order when scripts share one file.
 */
function addLanguage(requested) {
  const language = canonicalLanguage(requested);
  if (visited.has(language) || builtIn.has(language)) return;
  visited.add(language);

  const required = languageMetadata[language]?.require;
  const dependencies = Array.isArray(required) ? required : [required].filter(Boolean);
  dependencies.forEach(addLanguage);
  orderedLanguages.push(language);
}

requestedLanguages.forEach(addLanguage);
await mkdir(output, { recursive: true });

const prismParts = [await readFile(resolve(prismRoot, "prism.js"), "utf8")];
for (const language of orderedLanguages) {
  prismParts.push(await readFile(resolve(prismRoot, `components/prism-${language}.min.js`), "utf8"));
}
prismParts.push(await readFile(resolve(prismRoot, "plugins/line-numbers/prism-line-numbers.min.js"), "utf8"));

const prismCss = [
  await readFile(resolve(prismRoot, "themes/prism-tomorrow.min.css"), "utf8"),
  await readFile(resolve(prismRoot, "plugins/line-numbers/prism-line-numbers.css"), "utf8"),
].join("\n");

await Promise.all([
  copyFile(resolve(configRoot, "templates/explain/site.js"), resolve(output, "site.js")),
  copyFile(resolve(configRoot, "templates/explain/site.css"), resolve(output, "site.css")),
  copyFile(resolve(configRoot, "node_modules/cytoscape/dist/cytoscape.min.js"), resolve(output, "cytoscape.min.js")),
  writeFile(resolve(output, "prism.js"), prismParts.join("\n"), "utf8"),
  writeFile(resolve(output, "prism.css"), prismCss, "utf8"),
]);

console.log(`Explain assets ready: ${output}`);
console.log(`Prism grammars: ${[...requestedLanguages].join(", ")}`);
