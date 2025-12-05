import { ChatMessage } from "@/lib/types/chat";

export const initialMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Welcome back. I analyzed your latest listening streak and spotted a bridge between synth-pop textures and new jazz. Want to explore that blend tonight?",
    timestamp: "Today · 08:20",
    confidence: "0.82",
    citations: ["MusicBrainz · Sessions", "Milvus · Embeddings"],
  },
  {
    id: "msg-2",
    role: "user",
    content:
      "Line up a study playlist that keeps the energy steady but not distracting. I need 45 minutes of focus with subtle vocal layers.",
    timestamp: "Today · 08:22",
  },
];

export const navItems = [
  { id: "chat", label: "Chat" },
  { id: "recommendations", label: "Recommendations" },
];

export const genreTags = ["#electronic", "#pop", "#ambient", "#jazztronica"];
