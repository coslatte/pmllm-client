import { RecommendationItem } from "@/lib/types/recommendations";

type RecommendationCardProps = {
  recommendation: RecommendationItem;
};

const getScoreLabel = (score?: number) => {
  if (typeof score !== "number") {
    return "Suggested for your profile";
  }

  return `Match ${(score * 100).toFixed(1)}%`;
};

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const scoreLabel = getScoreLabel(recommendation.score);

  return (
    <article className="flex flex-col justify-between rounded-3xl border border-border bg-surface-strong p-5 shadow-[0_32px_90px_-60px_rgba(15,23,42,0.55)]">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          {scoreLabel}
        </p>
        <h3 className="text-lg font-semibold text-foreground">{recommendation.title}</h3>
        {recommendation.meta && (
          <p className="text-sm text-muted">{recommendation.meta}</p>
        )}
      </div>
      <p className="mt-4 text-sm text-muted">{recommendation.description}</p>
    </article>
  );
};

export default RecommendationCard;
