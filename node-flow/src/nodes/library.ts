// all node defs live here - add new ones by pushing to this array
import type { NodeTemplate } from "./types";

export const NODE_LIBRARY: NodeTemplate[] = [
  {
    type: "input",
    title: "User Input",
    icon: "🟢",
    accent: "#22c55e",
    description: "Pipeline entry. Produces user-provided data.",
    inputs: [],
    outputs: [{ id: "out", label: "value", side: "right" }],
  },
  {
    type: "output",
    title: "Output",
    icon: "🏁",
    accent: "#f97316",
    description: "Pipeline sink. Collects final results.",
    inputs: [{ id: "in", label: "result", side: "left" }],
    outputs: [],
  },
  {
    type: "llm",
    title: "LLM",
    icon: "🤖",
    accent: "#6366f1",
    description: "Large language model call with prompt + params.",
    inputs: [
      { id: "prompt", label: "prompt", side: "left" },
      { id: "context", label: "context", side: "left", tone: "muted" },
    ],
    outputs: [{ id: "response", label: "text", side: "right" }],
    bodyHint: "Model: gpt-4o-mini • Temperature: 0.7",
  },
  {
    type: "text",
    title: "Text",
    icon: "📝",
    accent: "#f59e0b",
    description: "Freeform text. Use {{variable}} to add inputs.",
    inputs: [{ id: "in", label: "text in", side: "left" }],
    outputs: [{ id: "out", label: "text out", side: "right" }],
  },
  // extra nodes for the assignment
  {
    type: "http",
    title: "HTTP Request",
    icon: "🌐",
    accent: "#06b6d4",
    description: "Fetch data from an external API.",
    inputs: [
      { id: "url", label: "url", side: "left" },
      { id: "body", label: "body", side: "left", tone: "muted" },
    ],
    outputs: [
      { id: "json", label: "json", side: "right" },
      { id: "status", label: "status", side: "right", tone: "muted" },
    ],
    bodyHint: "GET / POST with headers & query params",
  },
  {
    type: "math",
    title: "Math",
    icon: "➗",
    accent: "#8b5cf6",
    description: "Lightweight arithmetic & expressions.",
    inputs: [
      { id: "a", label: "a", side: "left" },
      { id: "b", label: "b", side: "left" },
    ],
    outputs: [{ id: "result", label: "result", side: "right" }],
    bodyHint: "Supports +, -, *, /, ^",
  },
  {
    type: "branch",
    title: "Branch",
    icon: "🪢",
    accent: "#14b8a6",
    description: "Route based on a condition.",
    inputs: [{ id: "condition", label: "if", side: "left" }],
    outputs: [
      { id: "true", label: "true", side: "right" },
      { id: "false", label: "false", side: "right" },
    ],
    bodyHint: "Truthy check or custom predicate",
  },
  {
    type: "vector",
    title: "Vector Store",
    icon: "🧠",
    accent: "#e11d48",
    description: "Embed & search semantic vectors.",
    inputs: [
      { id: "docs", label: "docs", side: "left" },
      { id: "query", label: "query", side: "left", tone: "muted" },
    ],
    outputs: [{ id: "matches", label: "matches", side: "right" }],
    bodyHint: "Top-k similarity with filters",
  },
  {
    type: "tool",
    title: "Tool Executor",
    icon: "🛠️",
    accent: "#0ea5e9",
    description: "Invoke custom tools/scripts.",
    inputs: [{ id: "args", label: "args", side: "left" }],
    outputs: [
      { id: "result", label: "result", side: "right" },
      { id: "logs", label: "logs", side: "right", tone: "muted" },
    ],
    bodyHint: "Shell-safe, sandboxed execution",
  },
];

export const TEMPLATE_MAP = NODE_LIBRARY.reduce<Record<string, NodeTemplate>>(
  (acc, tpl) => {
    acc[tpl.type] = tpl;
    return acc;
  },
  {}
);

export const paletteAccents = [
  "from-emerald-500/30 to-emerald-400/20",
  "from-indigo-500/30 to-indigo-400/20",
  "from-amber-500/30 to-amber-400/20",
  "from-cyan-500/30 to-cyan-400/20",
  "from-rose-500/30 to-rose-400/20",
];
