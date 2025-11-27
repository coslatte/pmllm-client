interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
}

const ChatHeader = ({
  title = "Chat",
  subtitle = "PMLLM",
}: ChatHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {subtitle}
          </p>
          <h1 className="text-2xl font-semibold text-zinc-950">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
