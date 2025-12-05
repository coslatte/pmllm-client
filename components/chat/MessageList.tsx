import { RefObject } from "react";

import { ChatMessage } from "@/lib/types/chat";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  isResponding: boolean;
  isBootstrapping: boolean;
  error: string | null;
  onRetry: () => void;
  endOfMessagesRef: RefObject<HTMLDivElement | null>;
};

const MessageList = ({
  messages,
  isResponding,
  isBootstrapping,
  error,
  onRetry,
  endOfMessagesRef,
}: MessageListProps) => {
  const showEmptyState = !isBootstrapping && !messages.length && !error;

  return (
    <div className="grow space-y-6 overflow-y-auto pb-32">
      {isBootstrapping && (
        <div className="rounded-3xl border border-indigo-100 bg-white/80 px-5 py-4 text-sm text-indigo-700 backdrop-blur dark:border-indigo-700/60 dark:bg-indigo-950/60 dark:text-indigo-200">
          Conectando con el backend de pmLLM…
        </div>
      )}

      {showEmptyState && (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/60 px-5 py-4 text-sm text-zinc-500 backdrop-blur dark:border-indigo-700/60 dark:bg-indigo-950/40 dark:text-zinc-300">
          Envía tu primer mensaje para iniciar la sesión.
        </div>
      )}

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isResponding && (
        <div className="flex justify-start">
          <div className="rounded-3xl border border-border bg-surface px-5 py-3 text-sm text-muted">
            Synthesizing answer…
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 px-5 py-4 text-sm text-rose-700 backdrop-blur dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-100">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 inline-flex items-center justify-center rounded-2xl border border-rose-200/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-rose-700 transition hover:bg-rose-100/60 dark:border-rose-700/80 dark:text-rose-200 dark:hover:bg-rose-900/40"
          >
            Reintentar conexión
          </button>
        </div>
      )}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
