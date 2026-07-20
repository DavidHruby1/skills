// graphify OpenCode plugin
// Injects a knowledge graph reminder before the first bash command when a graph exists.
import { existsSync } from "fs";
import { join } from "path";

export const GraphifyPlugin = async ({ directory }) => {
  let reminded = false;

  return {
    "tool.execute.before": async (input, output) => {
      if (reminded) return;
      if (!existsSync(join(directory, "graphify-out", "graph.json"))) return;

      if (input.tool === "bash") {
        output.args.command =
          'echo "[graphify] knowledge graph at graphify-out/. For focused questions, run graphify query with your question before grepping raw files. Read GRAPH_REPORT.md only for broad architecture context." ; ' +
          output.args.command;
        reminded = true;
      }
    },
  };
};
