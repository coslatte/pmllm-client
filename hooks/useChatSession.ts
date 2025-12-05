"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { askAssistant, fetchChatMessages, sendChatMessage } from "@/lib/api/client";
import { getOrCreateUserId } from "@/lib/api/session";
import { ApiChatMessage, QueryResponse, QueryDebugBlock } from "@/lib/api/types";
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

const fromAssistantResponse = (response: QueryResponse): ChatMessage => {
  // Extract debug information from the answer content if present
  const { cleanAnswer, extractedDebug } = extractDebugFromAnswer(response.answer);

  // Merge debug information from response and extracted debug
  let debugInfo: QueryDebugBlock | undefined;

  if (response.debug || extractedDebug) {
    debugInfo = {
      prompt: response.debug?.prompt || '',
      context_sections: response.debug?.context_sections,
      graph_context: extractedDebug?.graph_context || response.debug?.graph_context,
      vector_hits: response.debug?.vector_hits,
      tag_term: extractedDebug?.tag_term || response.debug?.tag_term,
    };
  }

  return {
    id: createChatId(),
    role: "assistant",
    content: cleanAnswer,
    timestamp: formatTimestamp(),
    citations: response.context,
    debug: debugInfo,
  };
};

// Function to extract debug information from answer content
const extractDebugFromAnswer = (answer: string): { cleanAnswer: string; extractedDebug?: Partial<QueryDebugBlock> } => {
  const lines = answer.split('\n');
  const cleanLines: string[] = [];
  const graphContext: string[] = [];
  let tagTerm: string | undefined;

  let inGraphSection = false;

  for (const line of lines) {
    // Check for timestamp pattern (e.g., "03:01 PM")
    if (/^\d{1,2}:\d{2}\s+(AM|PM)$/.test(line.trim())) {
      continue; // Skip timestamp lines
    }

    // Check for tag/artist patterns
    if (line.includes('Tag:') || line.includes('Artist:')) {
      // Extract tag term if present
      const tagMatch = line.match(/Tag: name: ([^&\s]+)/);
      if (tagMatch && tagMatch[1]) {
        tagTerm = tagMatch[1];
      }
      continue; // Skip debug lines
    }

    // Check for graph connections section
    if (line.includes('--- GRAPH CONNECTIONS ---')) {
      inGraphSection = true;
      continue;
    }

    if (inGraphSection) {
      if (line.trim() && !line.includes('---')) {
        graphContext.push(line.trim());
      }
      continue;
    }

    // If we reach here, it's part of the main answer
    cleanLines.push(line);
  }

  const cleanAnswer = cleanLines.join('\n').trim();

  const extractedDebug: Partial<QueryDebugBlock> | undefined =
    graphContext.length > 0 || tagTerm ? { graph_context: graphContext, tag_term: tagTerm } : undefined;

  return { cleanAnswer, extractedDebug };
};

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

export const useChatSession = (chatId: string | null, initialMessages: ChatMessage[] = []): UseChatSessionResult => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [bootstrapNonce, setBootstrapNonce] = useState(0);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Bootstrap user ID
  useEffect(() => {
    let isActive = true;

    const bootstrap = async () => {
      setIsBootstrapping(true);
      setError(null);

      try {
        const ensuredUserId = await getOrCreateUserId();
        if (!isActive) return;

        setUserId(ensuredUserId);
      } catch (err) {
        if (!isActive) return;
        const message = err instanceof Error ? err.message : "Unable to connect to pmLLM";
        setError(message);
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
  }, [bootstrapNonce]);

  // Use SWR for messages fetching with caching
  const { data: apiMessages, error: fetchError, mutate } = useSWR(
    chatId ? `chat-messages-${chatId}` : null,
    async () => {
      if (!chatId) return [];
      const history = await fetchChatMessages(chatId);
      return history.map(fromApiMessage);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // 5 seconds
    }
  );

  // Update messages when API data changes
  useEffect(() => {
    if (apiMessages) {
      setMessages(apiMessages);
    }
  }, [apiMessages]);

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      setError(fetchError.message || "Failed to load messages");
    }
  }, [fetchError]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const assistantResponse = await askAssistant({ question: trimmed, chat_id: chatId, debug: true });
      const newAssistantMessage = fromAssistantResponse(assistantResponse);
      setMessages((prev) => [...prev, newAssistantMessage]);
      // Invalidate cache to refetch messages
      mutate();
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
    mutate(); // Refetch messages
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
