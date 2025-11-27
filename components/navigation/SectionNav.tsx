import { navItems } from "@/lib/constants/chat";
import { FiLink, FiMessageSquare, FiMusic } from "react-icons/fi";

const iconMap = {
  chat: FiMessageSquare,
  recommendations: FiMusic,
  connections: FiLink,
};

type SectionNavProps = {
  activeId: string;
  onSelect: (id: string) => void;
};

const SectionNav = ({ activeId, onSelect }: SectionNavProps) => {
  return (
    <div className="pointer-events-auto rounded-3xl border border-zinc-200 bg-white/90 p-3 text-sm shadow-lg shadow-blue-100/60 backdrop-blur">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        Sections
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.id as keyof typeof iconMap];
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center justify-between rounded-2xl px-4 py-2 text-left font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-zinc-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {item.label}
              </span>
              <span className={`text-xs ${isActive ? "text-white/80" : "text-zinc-300"}`}>
                ›
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectionNav;
