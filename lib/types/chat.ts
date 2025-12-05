export type ChatRole = "user" | "assistant";

export type VectorHit = {
  id: number | string;
  label: string;
  score: number;
};

export type DebugInfo = {
  prompt?: string;
  context_sections?: string[];
  graph_context?: string[];
  vector_hits?: VectorHit[];
  tag_term?: string;
  latency_ms?: number;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  confidence?: string;
  citations?: string[];
  debug?: DebugInfo;
};
