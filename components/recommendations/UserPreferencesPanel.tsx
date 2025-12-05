"use client";

import { useEffect, useState } from "react";
import { FiSettings, FiHeart, FiX } from "react-icons/fi";
import { updateUserPreferences, createUserPreferences } from "@/lib/api/client";
import { getOrCreateUserId } from "@/lib/api/session";
import { UserPreferences, MusicMetadataResponse } from "@/lib/api/types";

type UserPreferencesPanelProps = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const UserPreferencesPanel = ({
  className = "",
  isOpen: externalIsOpen,
  onClose,
}: UserPreferencesPanelProps) => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [metadata, setMetadata] = useState<MusicMetadataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Use external isOpen if provided, otherwise use internal state
  const panelIsOpen = externalIsOpen !== undefined ? externalIsOpen : isOpen;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const userId = await getOrCreateUserId();

        // Load user preferences from localStorage (API doesn't have GET endpoint)
        const storedPreferences = localStorage.getItem(
          `userPreferences_${userId}`
        );
        if (storedPreferences) {
          try {
            const parsedPreferences = JSON.parse(storedPreferences);
            setPreferences(parsedPreferences);
            console.log("Loaded preferences from localStorage");
          } catch (parseErr) {
            console.log("Error parsing stored preferences:", parseErr);
            setPreferences(null);
          }
        } else {
          console.log("No stored preferences found, using defaults");
          setPreferences(null);
        }

        // Set mock metadata for development (API endpoint doesn't exist)
        console.log("Using mock metadata (API endpoint not available)");
        setMetadata({
          genres: [
            { name: "Electronic", count: 1250 },
            { name: "Pop", count: 980 },
            { name: "Jazz", count: 756 },
            { name: "Rock", count: 892 },
            { name: "Classical", count: 543 },
            { name: "Hip Hop", count: 678 },
            { name: "Ambient", count: 445 },
            { name: "Folk", count: 321 },
          ],
          tags: [
            { name: "electronic", count: 1250 },
            { name: "pop", count: 980 },
            { name: "jazz", count: 756 },
            { name: "rock", count: 892 },
            { name: "classical", count: 543 },
            { name: "hip-hop", count: 678 },
            { name: "ambient", count: 445 },
            { name: "folk", count: 321 },
          ],
          artists: [
            {
              name: "Tycho",
              genres: ["Electronic", "Ambient"],
              tags: ["electronic", "ambient"],
            },
            {
              name: "Bonobo",
              genres: ["Electronic", "Jazz"],
              tags: ["electronic", "jazz"],
            },
            {
              name: "Four Tet",
              genres: ["Electronic"],
              tags: ["electronic", "experimental"],
            },
            {
              name: "Max Richter",
              genres: ["Classical", "Ambient"],
              tags: ["classical", "ambient"],
            },
            {
              name: "Nils Frahm",
              genres: ["Classical", "Electronic"],
              tags: ["classical", "electronic"],
            },
          ],
          total_genres: 8,
          total_tags: 8,
          total_artists: 5,
        });
        setIsUsingMockData(true);

        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load preferences";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSavePreferences = async (
    newPreferences: Partial<UserPreferences>
  ) => {
    try {
      const userId = await getOrCreateUserId();

      let savedPreferences: UserPreferences;

      if (preferences) {
        // Update existing preferences
        savedPreferences = await updateUserPreferences(userId, newPreferences);
      } else {
        // Create new preferences
        const defaultPreferences: Omit<
          UserPreferences,
          "id" | "created_at" | "updated_at"
        > = {
          user_id: userId,
          favorite_genres: [],
          favorite_artists: [],
          favorite_tags: [],
          preferred_moods: [],
          disliked_genres: [],
          disliked_artists: [],
          disliked_tags: [],
          ...newPreferences,
        };
        savedPreferences = await createUserPreferences(
          userId,
          defaultPreferences
        );
      }

      // Save to localStorage regardless of API success
      localStorage.setItem(
        `userPreferences_${userId}`,
        JSON.stringify(savedPreferences)
      );

      setPreferences(savedPreferences);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save preferences";

      // Even if API fails, save locally and update state
      console.log("Preferences API not available, saving locally:", err);

      const userId = await getOrCreateUserId();
      const localPreferences: UserPreferences = {
        id: `local_${userId}`,
        user_id: userId,
        favorite_genres:
          newPreferences.favorite_genres || preferences?.favorite_genres || [],
        favorite_artists:
          newPreferences.favorite_artists ||
          preferences?.favorite_artists ||
          [],
        favorite_tags:
          newPreferences.favorite_tags || preferences?.favorite_tags || [],
        preferred_moods:
          newPreferences.preferred_moods || preferences?.preferred_moods || [],
        disliked_genres:
          newPreferences.disliked_genres || preferences?.disliked_genres || [],
        disliked_artists:
          newPreferences.disliked_artists ||
          preferences?.disliked_artists ||
          [],
        disliked_tags:
          newPreferences.disliked_tags || preferences?.disliked_tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(
        `userPreferences_${userId}`,
        JSON.stringify(localPreferences)
      );
      setPreferences(localPreferences);

      setError(`${message}. Los cambios se han guardado localmente.`);
    }
  };

  const toggleGenre = (genre: string, type: "favorite" | "disliked") => {
    if (!preferences) return;

    const currentList =
      type === "favorite"
        ? preferences.favorite_genres
        : preferences.disliked_genres;
    const otherList =
      type === "favorite"
        ? preferences.disliked_genres
        : preferences.favorite_genres;

    let newList: string[];
    if (currentList.includes(genre)) {
      // Remove from current list
      newList = currentList.filter((g) => g !== genre);
    } else {
      // Add to current list, remove from opposite list if present
      newList = [...currentList.filter((g) => g !== genre), genre];
    }

    const updatedPreferences = {
      ...preferences,
      [type === "favorite" ? "favorite_genres" : "disliked_genres"]: newList,
      [type === "favorite" ? "disliked_genres" : "favorite_genres"]:
        otherList.filter((g) => g !== genre),
    };

    setPreferences(updatedPreferences);
    handleSavePreferences(updatedPreferences);
  };

  const toggleArtist = (artist: string, type: "favorite" | "disliked") => {
    if (!preferences) return;

    const currentList =
      type === "favorite"
        ? preferences.favorite_artists
        : preferences.disliked_artists;
    const otherList =
      type === "favorite"
        ? preferences.disliked_artists
        : preferences.favorite_artists;

    let newList: string[];
    if (currentList.includes(artist)) {
      newList = currentList.filter((a) => a !== artist);
    } else {
      newList = [...currentList.filter((a) => a !== artist), artist];
    }

    const updatedPreferences = {
      ...preferences,
      [type === "favorite" ? "favorite_artists" : "disliked_artists"]: newList,
      [type === "favorite" ? "disliked_artists" : "favorite_artists"]:
        otherList.filter((a) => a !== artist),
    };

    setPreferences(updatedPreferences);
    handleSavePreferences(updatedPreferences);
  };

  const toggleTag = (tag: string, type: "favorite" | "disliked") => {
    if (!preferences) return;

    const currentList =
      type === "favorite"
        ? preferences.favorite_tags
        : preferences.disliked_tags;
    const otherList =
      type === "favorite"
        ? preferences.disliked_tags
        : preferences.favorite_tags;

    let newList: string[];
    if (currentList.includes(tag)) {
      newList = currentList.filter((t) => t !== tag);
    } else {
      newList = [...currentList.filter((t) => t !== tag), tag];
    }

    const updatedPreferences = {
      ...preferences,
      [type === "favorite" ? "favorite_tags" : "disliked_tags"]: newList,
      [type === "favorite" ? "disliked_tags" : "favorite_tags"]:
        otherList.filter((t) => t !== tag),
    };

    setPreferences(updatedPreferences);
    handleSavePreferences(updatedPreferences);
  };

  // Componente interno para simplificar las secciones de preferencias
  const PreferenceSection = ({
    title,
    items,
    favoriteList,
    dislikedList,
    onToggleFavorite,
    onToggleDisliked,
    favoriteLabel = "I like",
    dislikedLabel = "I don't like",
    showHash = false,
  }: {
    title: string;
    items: Array<{ name: string }>;
    favoriteList: string[];
    dislikedList: string[];
    onToggleFavorite: (item: string) => void;
    onToggleDisliked: (item: string) => void;
    favoriteLabel?: string;
    dislikedLabel?: string;
    showHash?: boolean;
  }) => (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-600">
            <FiHeart className="h-4 w-4" />
            {favoriteLabel}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const isFavorite = favoriteList.includes(item.name);
              
              return (
                <button
                  key={item.name}
                  onClick={() => onToggleFavorite(item.name)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    isFavorite
                      ? "border-green-500 bg-green-500/15 text-green-700 shadow-sm ring-1 ring-green-500/20 dark:text-green-400"
                      : "border-border bg-surface text-muted hover:border-green-300 hover:bg-green-50/30 dark:hover:bg-green-900/10"
                  }`}
                >
                  {showHash && "#"}
                  {item.name}
                  {isFavorite && (
                    <span className="ml-1 text-green-600 dark:text-green-400">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-600">
            <FiX className="h-4 w-4" />
            {dislikedLabel}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const isDisliked = dislikedList.includes(item.name);
              
              return (
                <button
                  key={item.name}
                  onClick={() => onToggleDisliked(item.name)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    isDisliked
                      ? "border-red-500 bg-red-500/15 text-red-700 shadow-sm ring-1 ring-red-500/20 dark:text-red-400"
                      : "border-border bg-surface text-muted hover:border-red-300 hover:bg-red-50/30 dark:hover:bg-red-900/10"
                  }`}
                >
                  {showHash && "#"}
                  {item.name}
                  {isDisliked && (
                    <span className="ml-1 text-red-600 dark:text-red-400">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div
        className={`rounded-md border border-border bg-surface p-6 ${className}`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
      >
        <FiSettings className="h-4 w-4" />
        Set Music preferences
      </button>

      {/* Modal */}
      {panelIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-md border border-border bg-surface p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Music Preferences
                </h2>
                <p className="text-sm text-muted">
                  Customize your music recommendations
                </p>
                {isUsingMockData && (
                  <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    🔧 Using mock data - Backend not available
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="rounded-md p-2 text-muted transition hover:bg-surface-strong hover:text-foreground"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-6 rounded-md border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700 backdrop-blur dark:border-rose-800/60 dark:bg-rose-900/40 dark:text-rose-200">
                {error}
              </div>
            )}

            {/* Preferences Sections */}
            <div className="space-y-8">
              <PreferenceSection
                title="Music Genres"
                items={metadata?.genres.slice(0, 20) || []}
                favoriteList={preferences?.favorite_genres || []}
                dislikedList={preferences?.disliked_genres || []}
                onToggleFavorite={(genre) => toggleGenre(genre, "favorite")}
                onToggleDisliked={(genre) => toggleGenre(genre, "disliked")}
              />

              <PreferenceSection
                title="Artists"
                items={metadata?.artists.slice(0, 15) || []}
                favoriteList={preferences?.favorite_artists || []}
                dislikedList={preferences?.disliked_artists || []}
                onToggleFavorite={(artist) => toggleArtist(artist, "favorite")}
                onToggleDisliked={(artist) => toggleArtist(artist, "disliked")}
                favoriteLabel="Favs"
                dislikedLabel="To avoid"
              />

              <PreferenceSection
                title="Tags and Styles"
                items={metadata?.tags.slice(0, 20) || []}
                favoriteList={preferences?.favorite_tags || []}
                dislikedList={preferences?.disliked_tags || []}
                onToggleFavorite={(tag) => toggleTag(tag, "favorite")}
                onToggleDisliked={(tag) => toggleTag(tag, "disliked")}
                showHash={true}
              />
            </div>

            {/* Info Section */}
            <div className="mt-6 rounded-md border border-blue-200 bg-blue-50/60 px-4 py-3 dark:border-blue-800/60 dark:bg-blue-900/40">
              <h4 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
                💡 Cómo funcionan tus preferencias
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>
                  • Los elementos marcados con ✓ reciben mayor prioridad en las
                  recomendaciones
                </li>
                <li>
                  • Los elementos marcados con ✗ serán evitados en las
                  sugerencias
                </li>
                <li>
                  • Las recomendaciones se actualizan automáticamente al guardar
                  cambios
                </li>
                <li>
                  • Tus preferencias se guardan localmente y se sincronizan
                  cuando el backend esté disponible
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="rounded-md border border-border bg-surface-strong px-6 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPreferencesPanel;
