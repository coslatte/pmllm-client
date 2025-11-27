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
        className="flex w-full items-center justify-between rounded-3xl border border-zinc-200 bg-white/90 px-4 py-3 font-semibold text-zinc-700 shadow-lg shadow-indigo-100/70 backdrop-blur transition hover:border-indigo-200 hover:text-indigo-600 dark:border-indigo-800/50 dark:bg-indigo-950/60 dark:text-indigo-100 dark:shadow-indigo-950/40"
      >
        <span className="flex items-center gap-2">
          <FiUser className="h-4 w-4" />
          User
        </span>
        <span className="text-xs text-zinc-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-64 rounded-3xl border border-zinc-200 bg-white/90 p-5 text-sm text-zinc-600 shadow-xl backdrop-blur dark:border-indigo-800/50 dark:bg-indigo-950/80 dark:text-indigo-100 dark:shadow-black/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-zinc-900">
                Arianna Duarte
              </p>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                ID · 9F32-PLM
              </p>
            </div>
            <span className="rounded-full bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-200">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-1 text-xs">
            <p className="font-semibold text-zinc-500 dark:text-indigo-200/80">Metadata</p>
            <p className="text-zinc-400 dark:text-indigo-300/70">
              Focus · graph insights · nightly sessions
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {genreTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-indigo-100 bg-indigo-50/90 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200"
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
