"use client";

import { useEffect, useState } from "react";

import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { fetchRecommendations } from "@/lib/api/client";
import { getOrCreateUserId } from "@/lib/api/session";
import { fallbackRecommendations } from "@/lib/constants/recommendations";
import { RecommendationItem } from "@/lib/types/recommendations";

type RecommendationsPanelProps = {
  className?: string;
  withAnchor?: boolean;
};

const RecommendationsPanel = ({ className = "", withAnchor = true }: RecommendationsPanelProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(fallbackRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = await getOrCreateUserId();
        const response = await fetchRecommendations(userId);
        if (!isActive) return;

        const hydrated: RecommendationItem[] = response.recommendations.map((item, index) => ({
          id: `${item.item}-${index}`,
          title: item.item,
          description: item.reason,
          score: item.score,
        }));

        setRecommendations(hydrated);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        const message = err instanceof Error ? err.message : "Unable to load recommendations";
        setError(message);
        setRecommendations(fallbackRecommendations);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isActive = false;
    };
  }, []);

  const visibleRecommendations = recommendations.slice(0, visibleCount);
  const canShowMore = visibleCount < recommendations.length;

  const handleShowMore = () => {
    setVisibleCount((count) => Math.min(count + 3, recommendations.length));
  };

  return (
    <section
      id={withAnchor ? "recommendations" : undefined}
      className={`rounded-4xl border border-border bg-surface px-6 py-8 shadow-[0_40px_120px_-65px_rgba(15,23,42,0.6)] ${className}`}
    >
      <div className="flex flex-wrap gap-3 items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Basado en tus reproducciones recientes
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Álbumes para tu próximo bloque</h2>
          <p className="text-sm text-muted">
            Curado desde tus sesiones nocturnas, patrones de energía y tags favoritos (#electronic, #pop, #jazztronica).

          </p>
        </div>
        {canShowMore && (
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center justify-center rounded-2xl border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
          >
            Más recomendaciones
          </button>
        )}
      </div>

      {isLoading && (
        <p className="mt-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-600 backdrop-blur dark:border-indigo-700/60 dark:bg-indigo-900/40 dark:text-indigo-200">
          Actualizando tus recomendaciones personalizadas…
        </p>
      )}

      {error && !isLoading && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur dark:border-rose-800/60 dark:bg-rose-900/40 dark:text-rose-200">
          {error}. Mostrando sugerencias locales mientras recuperamos la conexión.
        </p>
      )}

      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {visibleRecommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />

        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
