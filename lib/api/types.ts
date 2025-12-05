import { ChatRole } from "@/lib/types/chat";

export type ApiUser = {
  id: string;
  username: string;
  created_at: string;
};

export type ApiChatSession = {
  id: string;
  user_id: string;
  created_at: string;
};

export type ApiChatMessage = {
  id: string;
  chat_id: string;
  role: ChatRole;
  content: string;
  created_at: string;
};

export type SendMessagePayload = {
  chat_id: string;
  role: ChatRole;
  content: string;
};

export type QueryRequest = {
  question: string;
  chat_id?: string;
  top_k?: number;
  debug?: boolean;
};

export type ArtistTagSearchItem = {
  node_id: string;
  artist_name: string;
  matched_terms: string[];
  tags: string[];
  genres: string[];
};

export type ArtistTagSearchBlock = {
  term: string;
  match_count: number;
  items: ArtistTagSearchItem[];
};

export type QueryDebugBlock = {
  prompt: string;
  context_sections?: string[];
  graph_context?: string[];
  vector_hits?: Array<{ id: number | string; label: string; score: number }>;
  tag_term?: string;
};

export type QueryResponse = {
  answer: string;
  context?: string[];
  latency_ms?: number;
  artist_tag_search?: ArtistTagSearchBlock;
  debug?: QueryDebugBlock;
};

export type RecommendationItemPayload = {
  item: string;
  score: number;
  reason: string;
};

export type RecommendationResponse = {
  recommendations: RecommendationItemPayload[];
};
