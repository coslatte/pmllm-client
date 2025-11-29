"use client";

import { useState } from "react";

import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { recommendedAlbums } from "@/lib/constants/recommendations";

type RecommendationsPanelProps = {
  className?: string;
  withAnchor?: boolean;
};

const RecommendationsPanel = ({ className = "", withAnchor = true }: RecommendationsPanelProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const albums = recommendedAlbums.slice(0, visibleCount);
  const canShowMore = visibleCount < recommendedAlbums.length;

  const handleShowMore = () => {
    setVisibleCount((count) => Math.min(count + 3, recommendedAlbums.length));
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

      <div className="mt-6 grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {albums.map((album) => (
          <RecommendationCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
