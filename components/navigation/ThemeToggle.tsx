"use client";

import { FiMoon, FiSun } from "react-icons/fi";

type ThemeToggleProps = {
  mode: "light" | "dark";
  onToggle: () => void;
};

const ThemeToggle = ({ mode, onToggle }: ThemeToggleProps) => {
  const isDark = mode === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 shadow-sm shadow-indigo-100/70 transition hover:bg-white/90 hover:text-indigo-700 backdrop-blur dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-900/60 dark:shadow-black/40"
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      {isDark ? "Light" : "Dark"} mode
    </button>
  );
};

export default ThemeToggle;
