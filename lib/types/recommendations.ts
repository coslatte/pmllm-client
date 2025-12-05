export type RecommendationItem = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  score?: number;
  source?: 'database' | 'rag' | 'fallback';
};
