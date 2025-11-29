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
      className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted shadow-[0_18px_40px_-30px_rgba(67,56,202,0.65)] transition hover:border-primary hover:text-foreground"
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      {isDark ? "Light" : "Dark"} mode
    </button>
  );
};

export default ThemeToggle;
