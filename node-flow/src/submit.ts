// hits backend /pipelines/parse - returns node count, edge count, is_dag
import type { NodeInstance, Edge } from "./nodes/types";

const API_BASE = "http://localhost:8000";

export type ParseResponse = {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
};

export async function submitPipeline(
  nodes: NodeInstance[],
  edges: Edge[]
): Promise<ParseResponse> {
  console.log("[submit] sending pipeline", { nodeCount: nodes.length, edgeCount: edges.length });
  const payload = { nodes, edges };
  const response = await fetch(`${API_BASE}/pipelines/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    console.warn("[submit] backend returned", response.status);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log("[submit] got result", data);
  return {
    num_nodes: data.num_nodes,
    num_edges: data.num_edges,
    is_dag: data.is_dag,
  };
}
