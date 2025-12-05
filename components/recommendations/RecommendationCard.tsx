import { RecommendationItem } from "@/lib/types/recommendations";

type RecommendationCardProps = {
  recommendation: RecommendationItem;
  source?: 'database' | 'rag' | 'fallback';
};

const getScoreLabel = (score?: number) => {
  if (typeof score !== "number") {
    return "Suggested for your profile";
  }

  return `Match ${(score * 100).toFixed(1)}%`;
};

const getSourceLabel = (source?: string) => {
  switch (source) {
    case 'database':
      return { text: 'Desde Base de Datos', color: 'text-emerald-600 dark:text-emerald-400' };
    case 'rag':
      return { text: 'Análisis RAG', color: 'text-blue-600 dark:text-blue-400' };
    case 'fallback':
      return { text: 'Datos de Ejemplo', color: 'text-amber-600 dark:text-amber-400' };
    default:
      return { text: 'Recomendación Personalizada', color: 'text-muted' };
  }
};

const RecommendationCard = ({ recommendation, source }: RecommendationCardProps) => {
  const scoreLabel = getScoreLabel(recommendation.score);
  const sourceInfo = getSourceLabel(source);

  return (
    <article className="flex flex-col justify-between rounded-md border border-border bg-surface-strong p-4 shadow-[0_32px_90px_-60px_rgba(15,23,42,0.55)]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            {scoreLabel}
          </p>
          <span className={`text-[10px] font-medium uppercase tracking-wide ${sourceInfo.color}`}>
            {sourceInfo.text}
          </span>
        </div>
        <h3 className="text-base font-semibold text-foreground leading-tight">{recommendation.title}</h3>
        {recommendation.meta && (
          <p className="text-sm text-muted">{recommendation.meta}</p>
        )}
      </div>
      <p className="mt-3 text-sm text-muted leading-relaxed">{recommendation.description}</p>
    </article>
  );
};

export default RecommendationCard;
