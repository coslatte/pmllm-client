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
    <article className="flex flex-col justify-between rounded-3xl border border-zinc-100 bg-white/80 p-5 shadow-lg shadow-indigo-100/50 backdrop-blur dark:border-indigo-800/40 dark:bg-indigo-950/60 dark:shadow-black/30">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-500">
          {scoreLabel}
        </p>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{recommendation.title}</h3>
        {recommendation.meta && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{recommendation.meta}</p>
        )}
      </div>
      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">{recommendation.description}</p>
    </article>
  );
};

export default RecommendationCard;
