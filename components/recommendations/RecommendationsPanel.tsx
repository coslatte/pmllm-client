"use client";

import { useEffect, useState } from "react";

import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { fetchRecommendations } from "@/lib/api/client";
import { getOrCreateUserId } from "@/lib/api/session";
import { fallbackRecommendations } from "@/lib/constants/recommendations";
import { RecommendationItem } from "@/lib/types/recommendations";

const RecommendationsPanel = () => {
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
      id="recommendations"
      className="rounded-4xl border border-zinc-100 bg-white/90 px-6 py-8 shadow-xl shadow-indigo-100/60 backdrop-blur dark:border-indigo-800/50 dark:bg-indigo-950/70 dark:shadow-black/40"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Basado en tus reproducciones recientes
          </p>
          <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">Álbumes para tu próximo bloque</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Curado con tu perfil vectorial, sesiones nocturnas y tags favoritos (#electronic, #pop, #jazztronica).
          </p>
        </div>
        {canShowMore && (
          <button
            type="button"
            onClick={handleShowMore}
            className="inline-flex items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50/90 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100/90 backdrop-blur dark:border-indigo-700/60 dark:bg-indigo-900/60 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleRecommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
