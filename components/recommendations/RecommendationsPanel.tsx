"use client";

import { useState } from "react";

import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { recommendedAlbums } from "@/lib/constants/recommendations";

const RecommendationsPanel = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const albums = recommendedAlbums.slice(0, visibleCount);
  const canShowMore = visibleCount < recommendedAlbums.length;

  const handleShowMore = () => {
    setVisibleCount((count) => Math.min(count + 3, recommendedAlbums.length));
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
          <h2 className="text-2xl font-semibold text-zinc-950">Álbumes para tu próximo bloque</h2>
          <p className="text-sm text-zinc-500">
            Curado desde tus sesiones nocturnas, patrones de energía y tags favoritos (#electronic, #pop, #jazztronica).
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

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <RecommendationCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
