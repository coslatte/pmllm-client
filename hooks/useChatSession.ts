"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { initialMessages as defaultMessages } from "@/lib/constants/chat";
import { ChatMessage } from "@/lib/types/chat";
import { createChatId } from "@/lib/utils/id";

export type UseChatSessionResult = {
  messages: ChatMessage[];
  inputValue: string;
  isResponding: boolean;
  endOfMessagesRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const useChatSession = (
  initialMessages: ChatMessage[] = defaultMessages,
): UseChatSessionResult => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (value: string) => setInputValue(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: createChatId(),
      role: "user",
      content: trimmed,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsResponding(true);

    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: createChatId(),
        role: "assistant",
        content:
          "Got it. I will blend upbeat percussive layers with atmospheric harmonies so you stay in flow without lyric fatigue.",
        timestamp: "Just now",
        confidence: "0.87",
        citations: ["Realtime context"],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsResponding(false);
    }, 900);
  };

  return {
    messages,
    inputValue,
    isResponding,
    endOfMessagesRef,
    handleInputChange,
    handleSubmit,
  };
};
