import type { NodeInstance, Edge } from "./types";

// pull out {{ varName }} from text for dynamic handles
export const extractVariables = (text: string): string[] => {
  const matches = Array.from(
    text.matchAll(/\{\{\s*([A-Za-z_$][\w$]*)\s*\}\}/g)
  );
  return Array.from(new Set(matches.map((m) => m[1])));
};

// topsort to see if we have a DAG
export const isDag = (nodes: NodeInstance[], edges: Edge[]): boolean => {
  const indegree = new Map<string, number>();
  const graph = new Map<string, string[]>();

  nodes.forEach((n) => {
    indegree.set(n.id, 0);
    graph.set(n.id, []);
  });

  edges.forEach(({ source, target }) => {
    if (!graph.has(source)) return;
    graph.get(source)!.push(target);
    indegree.set(target, (indegree.get(target) ?? 0) + 1);
  });

  const queue = Array.from(indegree.entries())
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);

  let visited = 0;
  while (queue.length) {
    const curr = queue.shift()!;
    visited += 1;
    for (const nxt of graph.get(curr) ?? []) {
      indegree.set(nxt, (indegree.get(nxt) ?? 0) - 1);
      if ((indegree.get(nxt) ?? 0) === 0) queue.push(nxt);
    }
  }
  return visited === nodes.length;
};

// could use uuid but this is fine for demo
export const makeId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 7)}`;
