import { ChatMessage } from "@/lib/types/chat";
import { FiUser, FiMessageSquare } from "react-icons/fi";

const bubbleStyles = {
  user:
    "border border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-[length:220%_220%] animate-gradient-slow text-white shadow-[0_25px_60px_-35px_rgba(67,56,202,0.85)]",
  assistant:
    "border border-border bg-surface-strong text-foreground shadow-[0_35px_90px_-70px_rgba(15,23,42,0.9)]",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl space-y-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {isUser ? <FiUser className="h-3 w-3" /> : <FiMessageSquare className="h-3 w-3" />}
          {isUser ? "You" : "pmLLM"}
        </span>
        <div
          className={`rounded-3xl px-5 py-4 text-sm leading-relaxed transition ${
            bubbleStyles[message.role]
          }`}
        >
          <p>{message.content}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>{message.timestamp}</span>
          {!isUser && message.confidence && (
            <span className="font-medium text-primary">
              Confidence · {message.confidence}
            </span>
          )}
        </div>
        {!isUser && message.citations && (
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            {message.citations.map((source) => (
              <span
                key={source}
                className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] uppercase tracking-wide"
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
