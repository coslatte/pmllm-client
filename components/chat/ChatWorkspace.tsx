"use client";

import { startTransition, useEffect, useState } from "react";

import ChatComposer from "@/components/chat/ChatComposer";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import SectionNav from "@/components/navigation/SectionNav";
import UserMenu from "@/components/navigation/UserMenu";
import RecommendationsPanel from "@/components/recommendations/RecommendationsPanel";
import { useChatSession } from "@/hooks/useChatSession";

const ChatWorkspace = () => {
  const {
    messages,
    inputValue,
    isResponding,
    isBootstrapping,
    isReady,
    error,
    endOfMessagesRef,
    handleInputChange,
    handleSubmit,
    retrySession,
  } = useChatSession();

  const seedChats = [
    { id: "chat-1", title: "Chat 1" },
    { id: "chat-2", title: "Chat 2" },
  ];

  const [chats, setChats] = useState(seedChats);
  const [activeChatId, setActiveChatId] = useState(
    seedChats[0]?.id ?? "chat-1"
  );
  const [activeSection, setActiveSection] = useState("chat");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pmllm-theme");
    const resolved: "light" | "dark" =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    startTransition(() => {
      setThemeMode(resolved);
    });
  }, []);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined")
      return;
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.classList.toggle("dark", themeMode === "dark");
    window.localStorage.setItem("pmllm-theme", themeMode);
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleCreateChat = () => {
    setChats((prev) => {
      const nextIndex = prev.length + 1;
      const newChat = {
        id: `chat-${Date.now()}`,
        title: `New chat ${nextIndex}`,
      };
      setActiveChatId(newChat.id);
      return [newChat, ...prev];
    });
  };

  const getHeaderTitle = () => {
    if (activeSection === "recommendations") {
      return "Recommendations";
    }
    return "Chat";
  };

  const renderPrimaryArea = () => {
    if (activeSection === "recommendations") {
      return <RecommendationsPanel />;
    }

    return (
      <>
        <section className="flex min-h-[420px] flex-col rounded-4xl border border-border bg-surface px-5 py-6 shadow-[0_45px_120px_-70px_rgba(15,23,42,0.65)]">
          <MessageList
            messages={messages}
            isResponding={isResponding}
            isBootstrapping={isBootstrapping}
            error={error}
            onRetry={retrySession}
            endOfMessagesRef={endOfMessagesRef}
          />
        </section>
        <ChatComposer
          inputValue={inputValue}
          isResponding={isResponding}
          isReady={isReady}
          isBootstrapping={isBootstrapping}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ChatHeader
        title={getHeaderTitle()}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      <div className="flex w-full gap-6 px-8 pb-16 pt-28">
        <aside className="sticky top-28 h-fit w-64 shrink-0 self-start">
          <div className="flex flex-col gap-4">
            <SectionNav
              activeId={activeSection}
              onSelect={setActiveSection}
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              onCreateChat={handleCreateChat}
            />
            <UserMenu />
          </div>
        </aside>

        <main className="flex min-h-[520px] flex-1 flex-col gap-6">
          {renderPrimaryArea()}
        </main>
      </div>
    </div>
  );
};

export default ChatWorkspace;
