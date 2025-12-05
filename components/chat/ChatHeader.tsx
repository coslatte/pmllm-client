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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface backdrop-blur shadow-[0_1px_0_rgba(15,23,42,0.08)] dark:shadow-[0_1px_0_rgba(148,163,184,0.3)]">
      <div className="flex w-full items-center justify-between gap-4 px-8 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            {subtitle}
          </p>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        </div>
        <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};

export default ChatHeader;
