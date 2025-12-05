"use client";

import { useEffect, useRef, useState } from "react";

import { genreTags } from "@/lib/constants/chat";
import { FiUser } from "react-icons/fi";

type UserMenuProps = {
  onOpenPreferences?: () => void;
};

const UserMenu = ({ onOpenPreferences }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-auto relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-surface-strong px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
      >
        <span className="flex items-center gap-2">
          <FiUser className="h-4 w-4" />
          User
        </span>
        <span className="text-xs text-muted">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 rounded-md border border-border bg-surface p-5 text-sm text-muted shadow-[0_35px_120px_-45px_rgba(15,23,42,0.45)]">
          {/* USER INFO */}
          <div className="flex items-center justify-between">
            <div className="flex-col space-y-1">
              <p className="text-base font-semibold text-foreground">
                Gabriel Paz
              </p>
              <p className="text-xs uppercase tracking-wide text-muted opacity-70">
                ID - LMAO-SOME-ID-1234
              </p>
            </div>
          </div>

          {/* TAGS / GENRES */}
          <div className="mt-4 flex flex-wrap gap-2">
            {genreTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-surface-strong px-3 py-1 text-xs font-semibold text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                onOpenPreferences?.();
                setIsOpen(false); // Close the menu after clicking
              }}
              className="mt-6 w-full rounded-md border border-border bg-surface-strong px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
            >
              Set Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
