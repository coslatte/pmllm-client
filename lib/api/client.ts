import {
  ApiChatMessage,
  ApiChatSession,
  ApiUser,
  QueryRequest,
  QueryResponse,
  RecommendationResponse,
  SendMessagePayload,
} from "@/lib/api/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_PMLLM_API_BASE_URL ?? "/api/pmllm";

const withBaseUrl = (path: string) => {
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const buildHeaders = (headers?: HeadersInit): HeadersInit => ({
  "Content-Type": "application/json",
  ...(headers ?? {}),
});

const parseResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === "string"
        ? payload
        : payload?.message || payload?.detail || "Unexpected API error";
    throw new Error(detail);
  }

  return (payload ?? null) as T;
};

const apiFetch = async <T>(path: string, init?: RequestInit) => {
  const response = await fetch(withBaseUrl(path), {
    ...init,
    headers: buildHeaders(init?.headers),
  });

  return parseResponse<T>(response);
};

export const createUser = (username: string) =>
  apiFetch<ApiUser>("/users", {
    method: "POST",
    body: JSON.stringify({ username }),
  });

export const createChatSession = (userId: string) =>
  apiFetch<ApiChatSession>("/chat", {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });

export const fetchChatMessages = (chatId: string) =>
  apiFetch<ApiChatMessage[]>(`/chat/${chatId}/messages`);

export const sendChatMessage = (payload: SendMessagePayload) =>
  apiFetch<ApiChatMessage>("/message", {
    method: "POST",
    body: JSON.stringify({
      chat_id: payload.chat_id,
      role: payload.role,
      content: payload.content,
    }),
  });

export const askAssistant = (payload: QueryRequest) =>
  apiFetch<QueryResponse>("/query", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchRecommendations = (userId: string) =>
  apiFetch<RecommendationResponse>(`/recommendations?user_id=${encodeURIComponent(userId)}`, {
    method: "POST",
    body: JSON.stringify({ user_id: userId }),
  });
