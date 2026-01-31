"use client";

import { useMemo, useState } from "react";
import type { Handle, NodeTemplate, NodeInstance, Edge } from "../src/nodes";
import {
  NODE_LIBRARY,
  TEMPLATE_MAP,
  paletteAccents,
  extractVariables,
  isDag,
  makeId,
} from "../src/nodes";
import { submitPipeline } from "../src/submit";

const NodeCard = ({
  node,
  template,
  onTextChange,
  onRemove,
}: {
  node: NodeInstance;
  template: NodeTemplate;
  onTextChange: (id: string, val: string) => void;
  onRemove: (id: string) => void;
}) => {
  const isText = template.type === "text";
  const textValue = node.text ?? "";
  const variables = isText ? extractVariables(textValue) : [];

  // resize text node based on content
  const textMetrics = useMemo(() => {
    if (!isText)
      return { width: undefined, minHeight: undefined, areaHeight: undefined };
    const lines = Math.max(textValue.split(/\r?\n/).length, 1);
    const longest = Math.max(...textValue.split(/\r?\n/).map((l) => l.length), 1);
    const width = Math.min(520, Math.max(260, 120 + longest * 7));
    const minHeight = Math.min(420, Math.max(200, 120 + lines * 24));
    const areaHeight = Math.min(320, Math.max(120, lines * 26 + 40));
    return { width, minHeight, areaHeight };
  }, [isText, textValue]);

  const leftHandles: Handle[] = [
    ...template.inputs,
    ...variables.map<Handle>((v) => ({
      id: `var-${v}`,
      label: v,
      side: "left",
      tone: "info",
    })),
  ];
  const rightHandles = template.outputs;

  return (
    <div
      className="node"
      style={{
        width: textMetrics.width,
        minHeight: textMetrics.minHeight,
        boxShadow: `0 15px 60px -25px ${template.accent}44`,
      }}
    >
      <div className="node__glow">
        <div
          className="node__glow-inner"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${template.accent}33, transparent 40%)`,
          }}
        />
      </div>

      <div className="node__header">
        <div className="node__info">
          <div
            className="node__icon"
            style={{ backgroundColor: `${template.accent}dd` }}
          >
            {template.icon}
          </div>
          <div className="node__content">
            <div className="node__title-row">
              <p className="node__title">
                {template.title}
              </p>
              <span className="node__badge">
                {template.type}
              </span>
            </div>
            <p className="node__description">{template.description}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(node.id)}
          className="btn--close"
        >
          ✕
        </button>
      </div>

      {template.bodyHint && (
        <p className="node__hint">
          {template.bodyHint}
        </p>
      )}

      {isText && (
        <div className="node__text-area">
          <textarea
            value={textValue}
            onChange={(e) => onTextChange(node.id, e.target.value)}
            placeholder="Type and use {{variables}} to add inputs..."
            style={{ height: textMetrics.areaHeight }}
            className="node__textarea"
          />
          {variables.length > 0 && (
            <p className="node__variables">
              vars: {variables.join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="node__handles">
        <div className="node__handles-left">
          {leftHandles.map((h) => (
            <HandlePill key={h.id} handle={h} accent={template.accent} />
          ))}
        </div>
        <div className="node__handles-right">
          {rightHandles.map((h) => (
            <HandlePill
              key={h.id}
              handle={h}
              accent={template.accent}
              align="right"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HandlePill = ({ handle, accent, align = "left" }: { handle: Handle; accent: string; align?: "left" | "right" }) => {
  const dot = <span className="handle__dot" style={{ backgroundColor: `${accent}dd` }} />;
  return (
    <div className="handle">
      {align === "left" ? dot : null}
      <span className="handle__label">{handle.label}</span>
      {align === "right" ? dot : null}
    </div>
  );
};

export default function Home() {
  const [nodes, setNodes] = useState<NodeInstance[]>([
    { id: "input-1", type: "input" },
    { id: "text-1", type: "text", text: "Hello {{name}}!" },
    { id: "llm-1", type: "llm" },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    { id: "e-1", source: "input-1", target: "text-1" },
    { id: "e-2", source: "text-1", target: "llm-1" },
  ]);
  // console.log("nodes", nodes.length, "edges", edges.length); // debug

  const [edgeDraft, setEdgeDraft] = useState({ source: "", target: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertData, setAlertData] = useState<{
    show: boolean;
    num_nodes?: number;
    num_edges?: number;
    is_dag?: boolean;
    error?: string;
  }>({ show: false });
  const stats = useMemo(() => {
    const isDagResult = isDag(nodes, edges);
    return { numNodes: nodes.length, numEdges: edges.length, isDag: isDagResult };
  }, [nodes, edges]);

  const addNode = (type: string) => {
    const template = TEMPLATE_MAP[type];
    if (!template) return;
    const newId = makeId(type);
    setNodes((prev) => [...prev, { id: newId, type }]);
    console.log("added node", type, newId);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    console.log("removed node", id);
  };

  const handleTextChange = (id: string, text: string) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  };

  const addEdge = () => {
    const { source, target } = edgeDraft;
    if (!source || !target || source === target) return;
    const id = makeId("edge");
    setEdges((prev) => [...prev, { id, source, target }]);
    setEdgeDraft({ source: "", target: "" });
    console.log("edge added", source, "->", target);
  };

  const removeEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = await submitPipeline(nodes, edges);
      setAlertData({
        show: true,
        num_nodes: data.num_nodes,
        num_edges: data.num_edges,
        is_dag: data.is_dag,
      });
    } catch (error) {
      console.error("submit failed", error);
      setAlertData({
        show: true,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error. Is the backend running on :8000?",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <div className="app__container">
        <header className="header">
          <div className="header__content">
            <div className="header__title-section">
              <p className="header__subtitle">
                Pipeline Builder
              </p>
              <h1 className="header__title">
                FlowForge Studio
              </h1>
              <p className="header__description">
                Add nodes, wire edges, and watch Text nodes grow + auto-handle
                variables.
              </p>
            </div>
            <div className="header__actions">
              <StatPill label="Nodes" value={stats.numNodes} color="emerald" />
              <StatPill label="Edges" value={stats.numEdges} color="amber" />
              <StatPill
                label="DAG"
                value={stats.isDag ? "Yes" : "No"}
                color={stats.isDag ? "cyan" : "rose"}
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn--submit"
              >
                {isSubmitting ? "Submitting..." : "Submit Pipeline"}
              </button>
            </div>
          </div>
        </header>

        <div className="app__layout">
          <aside className="sidebar">
            <p className="sidebar__title">Node library</p>
            <div className="node-library">
              {NODE_LIBRARY.map((tpl, idx) => (
                <button
                  key={tpl.type}
                  onClick={() => addNode(tpl.type)}
                  className={`node-card bg-gradient-to-br ${
                    paletteAccents[idx % paletteAccents.length]
                  }`}
                >
                  <div className="node-card__header">
                    <span className="node-card__icon">{tpl.icon}</span>
                    <span className="node-card__title">
                      {tpl.title}
                    </span>
                  </div>
                  <p className="node-card__description">
                    {tpl.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="sidebar__section">
              <p className="sidebar__section-title">Add edge</p>
              <div className="form-group">
                <Select
                  label="From"
                  value={edgeDraft.source}
                  onChange={(v) => setEdgeDraft((s) => ({ ...s, source: v }))}
                  options={nodes}
                />
                <Select
                  label="To"
                  value={edgeDraft.target}
                  onChange={(v) => setEdgeDraft((s) => ({ ...s, target: v }))}
                  options={nodes}
                />
              </div>
              <button
                onClick={addEdge}
                className="btn btn--success w-full"
              >
                Connect
              </button>
            </div>

            <div className="edge-list">
              <div className="edge-list__header">
                <p className="edge-list__title">Edges</p>
                <span className="edge-list__count">
                  {edges.length}
                </span>
              </div>
              <div className="edge-list__items">
                {edges.map((e) => (
                  <div
                    key={e.id}
                    className="edge-item"
                  >
                    <span className="edge-item__text">
                      {e.source} → {e.target}
                    </span>
                    <button
                      onClick={() => removeEdge(e.id)}
                      className="btn--remove"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {edges.length === 0 && (
                  <p className="text-xs text-slate-300">No edges yet.</p>
                )}
              </div>
            </div>
          </aside>

          <section className="canvas">
            <div className="canvas__container">
              <p className="canvas__title">
                Canvas
              </p>
              <div className="canvas__grid">
                {nodes.map((node) => {
                  const template = TEMPLATE_MAP[node.type];
                  if (!template) return null; // skip unknown type
                  return (
                    <NodeCard
                      key={node.id}
                      node={node}
                      template={template}
                      onTextChange={handleTextChange}
                      onRemove={removeNode}
                    />
                  );
                })}
                {nodes.length === 0 && (
                  <div className="canvas__empty">
                    Add nodes from the library to begin.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Alert Modal */}
      {alertData.show && (
        <div className="modal">
          <div className="modal__overlay">
            <button
              onClick={() => { setAlertData({ show: false }); console.log("modal closed"); }}
              className="modal__close"
            >
              ✕
            </button>
            {alertData.error ? (
              <div>
                <h3 className="modal__title modal__title--error">
                  Error
                </h3>
                <p className="modal__error-text">{alertData.error}</p>
              </div>
            ) : (
              <div>
                <h3 className="modal__title modal__title--success">
                  Pipeline Analysis Results
                </h3>
                <div className="modal__content">
                  <div className="modal__row">
                    <span className="modal__label">Number of Nodes</span>
                    <span className="modal__value">
                      {alertData.num_nodes}
                    </span>
                  </div>
                  <div className="modal__row">
                    <span className="modal__label">Number of Edges</span>
                    <span className="modal__value">
                      {alertData.num_edges}
                    </span>
                  </div>
                  <div className="modal__row">
                    <span className="modal__label">Is DAG</span>
                    <span
                      className={`modal__badge ${
                        alertData.is_dag
                          ? "modal__badge--success"
                          : "modal__badge--error"
                      }`}
                    >
                      {alertData.is_dag ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setAlertData({ show: false })}
              className="btn btn--primary mt-6 w-full"
            >
              Close
            </button>
            {/* todo: could add "submit again" here */}
          </div>
        </div>
      )}
    </div>
  );
}

const Select = ({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: NodeInstance[] }) => (
  <label className="form-label">
    {label}
    <select value={value} onChange={(e) => onChange(e.target.value)} className="form-select">
      <option value="">Select</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>{o.id} ({o.type})</option>
      ))}
    </select>
  </label>
);

const StatPill = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: "emerald" | "amber" | "cyan" | "rose";
}) => {
  return (
    <div className={`stat-pill stat-pill--${color}`}>
      <p className="stat-pill__label">{label}</p>
      <p className="stat-pill__value">{value}</p>
    </div>
  );
};
