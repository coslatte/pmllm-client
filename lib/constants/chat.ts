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
  {
    id: "msg-3",
    role: "assistant",
    content:
      "Starting with Chromatics-inspired pads, then easing into rhythmic neo-soul instrumentals. I will keep the tempo between 92 and 108 BPM so it feels grounded without dragging.",
    timestamp: "Today · 08:22",
    confidence: "0.91",
    citations: ["Gemma 3 · RAG", "Knowledge Graph"],
  },
];

export const navItems = [
  { id: "chat", label: "Chat" },
  { id: "recommendations", label: "Recommendations" },
  { id: "connections", label: "Connections" },
];

export const genreTags = ["#electronic", "#pop", "#ambient", "#jazztronica"];
