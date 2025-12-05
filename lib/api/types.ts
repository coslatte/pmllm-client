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

export type AlbumRecommendationItem = {
  release_id: string;
  release_name: string;
  release_group_name: string;
  artists: string[];
  matched_genres: string[];
  tags: string[];
  connections: string[];
  matched_count: number;
  score: number;
};

export type AlbumRecommendationsResponse = {
  generated_from: string[];
  exclude_filters: string[];
  recommendations: AlbumRecommendationItem[];
};

export type AlbumRecommendationsRequest = {
  user_id?: string;
  include_genres?: string[];
  exclude_genres?: string[];
  limit?: number;
  min_genre_overlap?: number;
};

export type RecommendationResponse = {
  recommendations: RecommendationItemPayload[];
};

export type UserPreferences = {
  id: string;
  user_id: string;
  favorite_genres: string[];
  favorite_artists: string[];
  favorite_tags: string[];
  preferred_moods: string[];
  disliked_genres: string[];
  disliked_artists: string[];
  disliked_tags: string[];
  created_at: string;
  updated_at: string;
};

export type GenreInfo = {
  name: string;
  count: number;
  description?: string;
};

export type TagInfo = {
  name: string;
  count: number;
  description?: string;
};

export type ArtistInfo = {
  name: string;
  genres: string[];
  tags: string[];
  popularity_score?: number;
};

export type MusicMetadataResponse = {
  genres: GenreInfo[];
  tags: TagInfo[];
  artists: ArtistInfo[];
  total_genres: number;
  total_tags: number;
  total_artists: number;
};
