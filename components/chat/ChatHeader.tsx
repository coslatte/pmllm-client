"use client";

import ThemeToggle from "@/components/navigation/ThemeToggle";

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

const ChatHeader = ({
  title = "Chat",
  subtitle = "PMLLM",
  themeMode,
  onToggleTheme,
}: ChatHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-indigo-100/60 bg-white/90 backdrop-blur dark:border-indigo-500/30 dark:bg-indigo-950/70">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
            {subtitle}
          </p>
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-indigo-50">{title}</h1>
        </div>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};

export default ChatHeader;
