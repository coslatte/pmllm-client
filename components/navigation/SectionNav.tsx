import { navItems } from "@/lib/constants/chat";
import { FiHash, FiMessageSquare, FiMusic, FiPlus } from "react-icons/fi";

type SectionNavProps = {
  activeId: string;
  onSelect: (id: string) => void;
  chats: { id: string; title: string }[];
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onCreateChat: () => void;
};

const iconMap = {
  chat: FiMessageSquare,
  recommendations: FiMusic,
};

const SectionNav = ({
  activeId,
  onSelect,
  chats,
  activeChatId,
  onSelectChat,
  onCreateChat,
}: SectionNavProps) => {
  return (
    <section className="rounded-3xl border border-border bg-surface p-4 text-sm shadow-[0_28px_80px_-60px_rgba(15,23,42,0.4)]">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={onCreateChat}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface-strong px-3 py-2 font-semibold text-foreground transition hover:border-primary hover:text-primary"
        >
          <FiPlus className="h-4 w-4" />
          Create chat
        </button>

        <div className="h-px bg-border opacity-60" aria-hidden="true" />

        <div className="space-y-2">
          {chats.map((chat) => {
            const isActiveChat = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                type="button"
                onClick={() => onSelectChat(chat.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2 text-left font-medium transition ${
                  isActiveChat
                    ? "border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-[length:220%_220%] animate-gradient-slow text-white shadow-[0_15px_45px_-30px_rgba(67,56,202,0.8)]"
                    : "border-border text-muted hover:border-primary/60 hover:text-foreground"
                }`}
              >
                <FiHash className="h-4 w-4" />
                <span className="truncate">{chat.title}</span>
              </button>
            );
          })}
        </div>

        <div className="h-px bg-border opacity-60" aria-hidden="true" />

        <div className="flex flex-col gap-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Sections
          </p>

          {/* CHAT CONTENT */}

          {navItems.map((item) => {
            const Icon = iconMap[item.id as keyof typeof iconMap];
            const isActive = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-2 text-left font-medium transition ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-[length:220%_220%] animate-gradient-slow text-white"
                    : "border-border text-muted hover:border-primary/60 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className={`text-xs ${isActive ? "text-white/80" : "text-muted"}`}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectionNav;
