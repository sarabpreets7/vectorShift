// node types - used across all node templates

export type HandleSide = "left" | "right";

export type Handle = {
  id: string;
  label: string;
  side: HandleSide;
  tone?: string;
};

export type NodeTemplate = {
  type: string;
  title: string;
  icon: string;
  accent: string;
  description: string;
  inputs: Handle[];
  outputs: Handle[];
  bodyHint?: string;
};

export type NodeInstance = {
  id: string;
  type: string;
  text?: string;
};

export type Edge = {
  id: string;
  source: string;
  target: string;
};
