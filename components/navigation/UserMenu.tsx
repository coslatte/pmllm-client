"use client";

import { useEffect, useRef, useState } from "react";

import { genreTags } from "@/lib/constants/chat";
import { FiUser } from "react-icons/fi";

const UserMenu = () => {
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
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface-strong px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
      >
        <span className="flex items-center gap-2">
          <FiUser className="h-4 w-4" />
          User
        </span>
        <span className="text-xs text-muted">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 rounded-3xl border border-border bg-surface p-5 text-sm text-muted shadow-[0_35px_120px_-45px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">
                Arianna Duarte
              </p>
              <p className="text-xs uppercase tracking-wide text-muted opacity-70">
                ID · 9F32-PLM
              </p>
            </div>
            <span className="rounded-full bg-gradient-to-r from-primary via-secondary to-accent bg-[length:220%_220%] animate-gradient-slow px-3 py-1 text-xs font-semibold text-white">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-1 text-xs">
            <p className="font-semibold text-foreground opacity-80">Metadata</p>
            <p className="text-muted">
              Focus · graph insights · nightly sessions
            </p>
          </div>

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
        </div>
      )}
    </div>
  );
};

export default UserMenu;
