"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

import { askAssistant, fetchChatMessages, sendChatMessage } from "@/lib/api/client";
import { getOrCreateChatId, getOrCreateUserId } from "@/lib/api/session";
import { ApiChatMessage, QueryResponse } from "@/lib/api/types";
import { ChatMessage } from "@/lib/types/chat";
import { createChatId } from "@/lib/utils/id";

const formatTimestamp = (value?: string) => {
  if (!value) {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const fromApiMessage = (message: ApiChatMessage): ChatMessage => ({
  id: message.id,
  role: message.role,
  content: message.content,
  timestamp: formatTimestamp(message.created_at),
});

const fromAssistantResponse = (response: QueryResponse): ChatMessage => ({
  id: createChatId(),
  role: "assistant",
  content: response.answer,
  timestamp: formatTimestamp(),
  citations: response.context,
});

export type UseChatSessionResult = {
  messages: ChatMessage[];
  inputValue: string;
  isResponding: boolean;
  isBootstrapping: boolean;
  isReady: boolean;
  error: string | null;
  endOfMessagesRef: React.RefObject<HTMLDivElement | null>;
  handleInputChange: (value: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  retrySession: () => void;
};

export const useChatSession = (initialMessages: ChatMessage[] = []): UseChatSessionResult => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [bootstrapNonce, setBootstrapNonce] = useState(0);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      setError(null);

      try {
        const ensuredUserId = await getOrCreateUserId();
        const ensuredChatId = await getOrCreateChatId(ensuredUserId);
        if (!isActive) return;

        setUserId(ensuredUserId);
        setChatId(ensuredChatId);

        const history = await fetchChatMessages(ensuredChatId);
        if (!isActive) return;

        setMessages(history.length ? history.map(fromApiMessage) : []);
      } catch (err) {
        if (!isActive) return;
        const message = err instanceof Error ? err.message : "Unable to connect to pmLLM";
        setError(message);
        setMessages(initialMessages);
      } finally {
        if (isActive) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isActive = false;
    };
  }, [bootstrapNonce, initialMessages]);

  const handleInputChange = (value: string) => setInputValue(value);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || !chatId || isBootstrapping) return;

    const userMessage: ChatMessage = {
      id: createChatId(),
      role: "user",
      content: trimmed,
      timestamp: formatTimestamp(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsResponding(true);
    setError(null);

    try {
      await sendChatMessage({ chat_id: chatId, role: "user", content: trimmed });
      const assistantResponse = await askAssistant({ question: trimmed, chat_id: chatId });
      setMessages((prev) => [...prev, fromAssistantResponse(assistantResponse)]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to reach pmLLM";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          id: createChatId(),
          role: "assistant",
          content: "I could not reach the pmLLM backend. Please try again.",
          timestamp: formatTimestamp(),
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const retrySession = () => {
    setBootstrapNonce((nonce) => nonce + 1);
  };

  const isReady = Boolean(!isBootstrapping && chatId && userId && !error);

  return {
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
  };
};
