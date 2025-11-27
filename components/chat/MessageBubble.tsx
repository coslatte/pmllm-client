import { ChatMessage } from "@/lib/types/chat";
import { FiUser, FiMessageSquare } from "react-icons/fi";

const bubbleStyles = {
  user: "bg-blue-600 text-white",
  assistant: "bg-zinc-50 text-zinc-800 border border-zinc-100",
};

type MessageBubbleProps = {
  message: ChatMessage;
};

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-xl space-y-2">
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          {isUser ? <FiUser className="h-3 w-3" /> : <FiMessageSquare className="h-3 w-3" />}
          {isUser ? "You" : "pmLLM"}
        </span>
        <div
          className={`rounded-3xl px-5 py-4 text-sm leading-relaxed shadow-sm ${
            bubbleStyles[message.role]
          }`}
        >
          <p>{message.content}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span>{message.timestamp}</span>
          {!isUser && message.confidence && (
            <span className="font-medium text-blue-500">
              Confidence · {message.confidence}
            </span>
          )}
        </div>
        {!isUser && message.citations && (
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
            {message.citations.map((source) => (
              <span
                key={source}
                className="rounded-full border border-zinc-200 px-3 py-1 text-[11px] uppercase tracking-wide"
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
