"use client";

import { useEffect, useState } from "react";

import ChatComposer from "@/components/chat/ChatComposer";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import SectionNav from "@/components/navigation/SectionNav";
import UserMenu from "@/components/navigation/UserMenu";
import RecommendationsPanel from "@/components/recommendations/RecommendationsPanel";
import UserPreferencesPanel from "@/components/recommendations/UserPreferencesPanel";
import { getOrCreateUserId } from "@/lib/api/session";
import { createChatSession } from "@/lib/api/client";
import { useChatSession } from "@/hooks/useChatSession";

const ChatWorkspace = () => {
  const seedChats = [
    { id: "chat-1", title: "Chat 1", chatId: "dummy1" },
    { id: "chat-2", title: "Chat 2", chatId: "dummy2" },
  ];

  const [chats, setChats] = useState(seedChats);
  const [activeChatId, setActiveChatId] = useState(
    seedChats[0]?.id ?? "chat-1"
  );
  const [activeSection, setActiveSection] = useState<"chat" | "recommendations" | "preferences">("chat");
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem("pmllm-theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [userId, setUserId] = useState<string | null>(null);

  const activeChat = chats.find(c => c.id === activeChatId);

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
  } = useChatSession(activeChat?.chatId || null);

  useEffect(() => {
    const bootstrap = async () => {
      const ensuredUserId = await getOrCreateUserId();
      setUserId(ensuredUserId);
    };
    bootstrap();
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

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId as "chat" | "recommendations" | "preferences");
  };

  const handleCreateChat = async () => {
    if (!userId) return;
    const chat = await createChatSession(userId);
    setChats((prev) => {
      const nextIndex = prev.length + 1;
      const newChat = {
        id: `chat-${Date.now()}`,
        title: `New chat ${nextIndex}`,
        chatId: chat.id,
      };
      setActiveChatId(newChat.id);
      return [newChat, ...prev];
    });
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) {
      const remaining = chats.filter(c => c.id !== chatId);
      setActiveChatId(remaining[0]?.id || "");
    }
  };

  const getHeaderTitle = () => {
    switch (activeSection) {
      case "recommendations":
        return "Recommendations";
      case "preferences":
        return "Music Preferences";
      default:
        return "Chat";
    }
  };

  const renderPrimaryArea = () => {
    switch (activeSection) {
      case "recommendations":
        return <RecommendationsPanel />;
      case "preferences":
        return (
          <div className="space-y-6">
            <UserPreferencesPanel isOpen={true} onClose={() => setActiveSection("chat")} />
          </div>
        );
      default:
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
    }
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
              onSelect={handleSectionSelect}
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              onCreateChat={handleCreateChat}
              onDeleteChat={handleDeleteChat}
            />
            <UserMenu onOpenPreferences={() => setActiveSection("preferences")} />
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
