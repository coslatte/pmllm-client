import { createChatSession, createUser } from "@/lib/api/client";

const USER_STORAGE_KEY = "pmllm-user-id";
const CHAT_STORAGE_KEY = "pmllm-chat-id";

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const readStorage = (key: string) => {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(key);
};

const writeStorage = (key: string, value: string) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, value);
};

const removeStorage = (key: string) => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
};

const generateUsername = () => `listener-${Math.random().toString(36).slice(2, 8)}`;

export const getStoredUserId = () => readStorage(USER_STORAGE_KEY);
export const getStoredChatId = () => readStorage(CHAT_STORAGE_KEY);

export const setStoredChatId = (chatId: string) => writeStorage(CHAT_STORAGE_KEY, chatId);
export const resetStoredChatId = () => removeStorage(CHAT_STORAGE_KEY);

export const getOrCreateUserId = async () => {
  const existing = getStoredUserId();
  if (existing) return existing;

  const user = await createUser(generateUsername());
  writeStorage(USER_STORAGE_KEY, user.id);
  return user.id;
};

export const getOrCreateChatId = async (userId: string) => {
  const existing = getStoredChatId();
  if (existing) return existing;

  const chat = await createChatSession(userId);
  setStoredChatId(chat.id);
  return chat.id;
};
