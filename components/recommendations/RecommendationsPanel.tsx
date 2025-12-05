"use client";

import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

import RecommendationCard from "@/components/recommendations/RecommendationCard";
import { fetchRecommendations, fetchAlbumRecommendations } from "@/lib/api/client";
import { getOrCreateUserId } from "@/lib/api/session";
import { fallbackRecommendations } from "@/lib/constants/recommendations";
import { RecommendationItem } from "@/lib/types/recommendations";
import { UserPreferences, AlbumRecommendationsRequest } from "@/lib/api/types";

// Function to apply preference-based filtering and scoring
const applyPreferenceFiltering = (recommendations: RecommendationItem[], preferences: UserPreferences): RecommendationItem[] => {
  if (!preferences) return recommendations;

  return recommendations
    .map(rec => {
      let adjustedScore = rec.score || 0;
      let preferenceMultiplier = 1.0;

      // For album recommendations, extract info from meta field (format: "Genre1 · Genre2 · #tag1 #tag2")
      // For general recommendations, extract from title and description
      let genres: string[] = [];
      let tags: string[] = [];
      let artist = '';

      if (rec.meta) {
        // This is likely an album recommendation with structured meta
        const metaParts = rec.meta.split(' · ');
        genres = metaParts.filter(part => !part.startsWith('#'));
        tags = metaParts
          .filter(part => part.startsWith('#'))
          .map(tag => tag.substring(1));
      }

      // Extract artist from title (format: "Title — Artist1, Artist2")
      const titleParts = rec.title.split(' — ');
      if (titleParts[1]) {
        artist = titleParts[1].split(',')[0].trim().toLowerCase(); // Take first artist
      }

      // Boost score for favorite genres and tags
      const hasFavoriteGenre = genres.some(genre =>
        preferences.favorite_genres.some(fav =>
          fav.toLowerCase().includes(genre.toLowerCase()) ||
          genre.toLowerCase().includes(fav.toLowerCase())
        )
      );
      if (hasFavoriteGenre) {
        preferenceMultiplier *= 1.2;
      }

      const hasFavoriteTag = tags.some(tag =>
        preferences.favorite_tags.some(fav => fav.toLowerCase() === tag.toLowerCase())
      );
      if (hasFavoriteTag) {
        preferenceMultiplier *= 1.15;
      }

      if (artist && preferences.favorite_artists.some(fav =>
        fav.toLowerCase().includes(artist) || artist.includes(fav.toLowerCase())
      )) {
        preferenceMultiplier *= 1.25;
      }

      // Reduce score for disliked genres, tags, and artists
      const hasDislikedGenre = genres.some(genre =>
        preferences.disliked_genres.some(dis =>
          dis.toLowerCase().includes(genre.toLowerCase()) ||
          genre.toLowerCase().includes(dis.toLowerCase())
        )
      );
      if (hasDislikedGenre) {
        preferenceMultiplier *= 0.7;
      }

      const hasDislikedTag = tags.some(tag =>
        preferences.disliked_tags.some(dis => dis.toLowerCase() === tag.toLowerCase())
      );
      if (hasDislikedTag) {
        preferenceMultiplier *= 0.75;
      }

      if (artist && preferences.disliked_artists.some(dis =>
        dis.toLowerCase().includes(artist) || artist.includes(dis.toLowerCase())
      )) {
        preferenceMultiplier *= 0.6;
      }

      adjustedScore = Math.min(adjustedScore * preferenceMultiplier, 0.99); // Cap at 0.99

      return {
        ...rec,
        score: adjustedScore,
        // Add preference indicator to description
        description: preferenceMultiplier > 1.1
          ? `⭐ ${rec.description}`
          : preferenceMultiplier < 0.9
          ? `⚠️ ${rec.description}`
          : rec.description
      };
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0)); // Sort by adjusted score descending
};

type RecommendationsPanelProps = {
  className?: string;
  withAnchor?: boolean;
};

const RecommendationsPanel = ({ className = "", withAnchor = true }: RecommendationsPanelProps) => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(fallbackRecommendations);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadRecommendations = async () => {
      setIsLoading(true);
      try {
        const userId = await getOrCreateUserId();

        // First, try to get user preferences from localStorage (API doesn't have GET endpoint)
        let userPrefs: UserPreferences | null = null;
        const storedPreferences = localStorage.getItem(`userPreferences_${userId}`);
        if (storedPreferences) {
          try {
            userPrefs = JSON.parse(storedPreferences);
            setUserPreferences(userPrefs);
            console.log('Loaded user preferences from localStorage');
          } catch (parseErr) {
            console.log('Error parsing stored preferences:', parseErr);
            setUserPreferences(null);
          }
        } else {
          console.log('No stored preferences found');
          setUserPreferences(null);
        }

        let finalRecommendations: RecommendationItem[] = fallbackRecommendations;
        let usingFallback = true;

        // Strategy 1: Try album recommendations based on user preferences
        if (userPrefs && (userPrefs.favorite_genres.length > 0 || userPrefs.favorite_artists.length > 0)) {
          try {
            const albumRequest: AlbumRecommendationsRequest = {
              user_id: userId,
              include_genres: userPrefs.favorite_genres,
              exclude_genres: userPrefs.disliked_genres,
              limit: 12,
            };

            const albumResponse = await fetchAlbumRecommendations(albumRequest);

            if (albumResponse.recommendations && albumResponse.recommendations.length > 0) {
              finalRecommendations = albumResponse.recommendations.map((album, index) => ({
                id: album.release_id,
                title: `${album.release_name} — ${album.artists.join(', ')}`,
                meta: `${album.matched_genres.join(' · ')} · #${album.tags.join(' #')}`,
                description: `Basado en tus géneros favoritos: ${album.matched_genres.join(', ')}. ${album.matched_count} conexiones encontradas.`,
                score: album.score,
                source: 'database' as const,
              }));
              usingFallback = false;
              console.log('Using album recommendations from database');
            }
          } catch (albumErr) {
            console.log('Album recommendations not available, trying general recommendations:', albumErr);
          }
        }

        // Strategy 2: If album recommendations failed or no preferences, try general RAG recommendations
        if (usingFallback) {
          try {
            const recommendationsResponse = await fetchRecommendations(userId);
            const hydrated: RecommendationItem[] = recommendationsResponse.recommendations.map((item, index) => ({
              id: `${item.item}-${index}`,
              title: item.item,
              description: item.reason,
              score: item.score,
              source: 'rag' as const,
            }));
            finalRecommendations = hydrated;
            usingFallback = false;
            console.log('Using general RAG recommendations');
          } catch (ragErr) {
            console.log('General recommendations not available, using fallback data:', ragErr);
            usingFallback = true;
          }
        }

        // Apply preference-based filtering if we have preferences and are using fallback or general recommendations
        if (userPrefs && !usingFallback) {
          finalRecommendations = applyPreferenceFiltering(finalRecommendations, userPrefs);
        }

        setRecommendations(finalRecommendations.map(rec => ({ ...rec, source: rec.source || (usingFallback ? 'fallback' : 'rag') })));
        setIsUsingFallback(usingFallback);
        setError(null);
      } catch (err) {
        if (!isActive) return;
        const message = err instanceof Error ? err.message : "Unable to load recommendations";
        console.log('Error loading recommendations:', err);
        setError(message);
        setRecommendations(fallbackRecommendations.map(rec => ({ ...rec, source: 'fallback' })));
        setIsUsingFallback(true);
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

  const handleRefresh = async () => {
    // Reset visible count and reload recommendations
    setVisibleCount(6);
    setIsLoading(true);
    setError(null);

    try {
      const userId = await getOrCreateUserId();

      // Load user preferences from localStorage
      let userPrefs: UserPreferences | null = null;
      const storedPreferences = localStorage.getItem(`userPreferences_${userId}`);
      if (storedPreferences) {
        try {
          userPrefs = JSON.parse(storedPreferences);
          setUserPreferences(userPrefs);
          console.log('Refreshed user preferences from localStorage');
        } catch (parseErr) {
          console.log('Error parsing stored preferences:', parseErr);
          setUserPreferences(null);
        }
      } else {
        console.log('No stored preferences found on refresh');
        setUserPreferences(null);
      }

      let finalRecommendations: RecommendationItem[] = fallbackRecommendations;
      let usingFallback = true;

      // Strategy 1: Try album recommendations based on user preferences
      if (userPrefs && (userPrefs.favorite_genres.length > 0 || userPrefs.favorite_artists.length > 0)) {
        try {
          const albumRequest: AlbumRecommendationsRequest = {
            user_id: userId,
            include_genres: userPrefs.favorite_genres,
            exclude_genres: userPrefs.disliked_genres,
            limit: 12,
          };

          const albumResponse = await fetchAlbumRecommendations(albumRequest);

          if (albumResponse.recommendations && albumResponse.recommendations.length > 0) {
            finalRecommendations = albumResponse.recommendations.map((album, index) => ({
              id: album.release_id,
              title: `${album.release_name} — ${album.artists.join(', ')}`,
              meta: `${album.matched_genres.join(' · ')} · #${album.tags.join(' #')}`,
              description: `Basado en tus géneros favoritos: ${album.matched_genres.join(', ')}. ${album.matched_count} conexiones encontradas.`,
              score: album.score,
              source: 'database' as const,
            }));
            usingFallback = false;
            console.log('Refreshed with album recommendations from database');
          }
        } catch (albumErr) {
          console.log('Album recommendations not available, trying general recommendations:', albumErr);
        }
      }

      // Strategy 2: If album recommendations failed, try general RAG recommendations
      if (usingFallback) {
        try {
          const recommendationsResponse = await fetchRecommendations(userId);
          const hydrated: RecommendationItem[] = recommendationsResponse.recommendations.map((item, index) => ({
            id: `${item.item}-${index}`,
            title: item.item,
            description: item.reason,
            score: item.score,
            source: 'rag' as const,
          }));
          finalRecommendations = hydrated;
          usingFallback = false;
          console.log('Refreshed with general RAG recommendations');
        } catch (ragErr) {
          console.log('General recommendations not available, using fallback data:', ragErr);
          usingFallback = true;
        }
      }

      // Apply preference-based filtering if we have preferences
      if (userPrefs && !usingFallback) {
        finalRecommendations = applyPreferenceFiltering(finalRecommendations, userPrefs);
      }

      setRecommendations(finalRecommendations.map(rec => ({ ...rec, source: rec.source || (usingFallback ? 'fallback' : 'rag') })));
      setIsUsingFallback(usingFallback);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to refresh recommendations";
      console.log('Error refreshing recommendations:', err);
      setError(message);
      setRecommendations(fallbackRecommendations.map(rec => ({ ...rec, source: 'fallback' })));
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPreferences = userPreferences && (
    userPreferences.favorite_genres.length > 0 ||
    userPreferences.favorite_artists.length > 0 ||
    userPreferences.favorite_tags.length > 0 ||
    userPreferences.disliked_genres.length > 0 ||
    userPreferences.disliked_artists.length > 0 ||
    userPreferences.disliked_tags.length > 0
  );

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
          <h2 className="text-2xl font-semibold text-foreground">
            Álbumes para tu próximo bloque
            {hasPreferences && (
              <span className="ml-2 text-sm font-normal text-emerald-600 dark:text-emerald-400">
                ✨ Personalizado
              </span>
            )}
          </h2>
          <p className="text-sm text-muted">
            Curado desde tus sesiones nocturnas, patrones de energía y tags favoritos (#electronic, #pop, #jazztronica).
            {hasPreferences && (
              <span className="block mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Incluyendo tus preferencias: {[
                  ...userPreferences!.favorite_genres.slice(0, 2),
                  ...userPreferences!.favorite_artists.slice(0, 1)
                ].join(', ')}
                {userPreferences!.favorite_genres.length > 2 && ' y más'}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface-strong px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            title="Actualizar recomendaciones"
          >
            <FiRefreshCw className="h-4 w-4" />
          </button>
          {canShowMore && (
            <button
              type="button"
              onClick={handleShowMore}
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Más recomendaciones
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 rounded-md border border-dashed border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm text-indigo-600 backdrop-blur dark:border-indigo-700/60 dark:bg-indigo-900/40 dark:text-indigo-200">
          {hasPreferences
            ? "Buscando recomendaciones personalizadas en la base de datos..."
            : "Cargando recomendaciones desde la base de datos..."
          }
        </p>
      )}

      {error && !isLoading && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur dark:border-rose-800/60 dark:bg-rose-900/40 dark:text-rose-200">
          {error}. Mostrando sugerencias locales mientras recuperamos la conexión.
          {isUsingFallback && (
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
              (Datos de ejemplo)
            </span>
          )}
          {!isUsingFallback && hasPreferences && (
            <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">
              (Desde base de datos)
            </span>
          )}
        </p>
      )}

      <div className="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        {visibleRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            source={recommendation.source}
          />

        ))}
      </div>
    </section>
  );
};

export default RecommendationsPanel;
