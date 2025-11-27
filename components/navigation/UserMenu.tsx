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
        className="flex w-full items-center justify-between rounded-3xl border border-zinc-200 bg-white/90 px-4 py-3 font-semibold text-zinc-700 shadow-lg shadow-blue-100/60 backdrop-blur transition hover:border-blue-200 hover:text-blue-600"
      >
        <span className="flex items-center gap-2">
          <FiUser className="h-4 w-4" />
          User
        </span>
        <span className="text-xs text-zinc-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 left-0 w-64 rounded-3xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-zinc-900">
                Arianna Duarte
              </p>
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                ID · 9F32-PLM
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Live
            </span>
          </div>

          <div className="mt-4 space-y-1 text-xs">
            <p className="font-semibold text-zinc-500">Metadata</p>
            <p className="text-zinc-400">
              Focus · graph insights · nightly sessions
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {genreTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
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
