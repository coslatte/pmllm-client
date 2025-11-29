import { RefObject } from "react";

import { ChatMessage } from "@/lib/types/chat";
import MessageBubble from "./MessageBubble";

type MessageListProps = {
  messages: ChatMessage[];
  isResponding: boolean;
  endOfMessagesRef: RefObject<HTMLDivElement | null>;
};

const MessageList = ({ messages, isResponding, endOfMessagesRef }: MessageListProps) => {
  return (
    <div className="grow space-y-6 overflow-y-auto pb-32">
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
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;
