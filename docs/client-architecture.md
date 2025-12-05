# Client Architecture (Current Implementation)

The pmLLM client ships a single-page workspace powered by client components, Tailwind CSS v4, and localized mock data. The goal is to keep the surface shippable today while leaving clear seams for the RAG + KG backend.

## High-Level Structure

```text
app/
  layout.tsx        # Global HTML shell, fonts, metadata, theme tokens
  page.tsx          # Renders ChatWorkspace (client-only)
components/
  chat/             # Chat-specific building blocks (header, composer, list)
  navigation/       # SectionNav, ThemeToggle, UserMenu widgets
  recommendations/  # RecommendationCard grid & controls
hooks/
  useChatSession.ts # Chat lifecycle hook w/ placeholder assistant reply
lib/
  constants/        # Seed chat messages, nav entries, recommendation data
  types/            # Chat + Recommendation TypeScript contracts
  utils/            # Cross-cutting helpers (ID factory, etc.)
```

## Workspace Shell

- `ChatWorkspace` owns layout composition (fixed header + docked sidebar + scrollable main area) and orchestrates section changes, chat creation, and theme persistence.
- The component chooses between chat mode and recommendation mode, so new surfaces (e.g., `/connect`) can reuse the same scaffolding.

## Navigation & Section Control

- `SectionNav` reads `navItems` from `lib/constants/chat.ts`, rendering chat sessions and the section picker in one column.
- Chat creation currently seeds an ID/timestamp client-side and focuses the new session immediately. This is where upcoming `/sessions` API hooks will attach.
- Icons rely on `react-icons/fi`, keeping bundle size low while providing recognizable affordances.

## Theme + Persona Layer

- `ChatHeader` embeds `ThemeToggle`, which stores the preference in `window.localStorage` (`pmllm-theme`). The root element receives `data-theme` so the Tailwind tokens defined in `app/globals.css` update instantly.
- `UserMenu` exposes persona metadata and listening tags. A click-outside handler closes the drawer to match modern dashboard patterns.

## Chat Stack

1. `useChatSession`
   - Holds `messages`, `inputValue`, `isResponding`, and `endOfMessagesRef`.
   - Seeds conversations via `initialMessages` and simulates a backend reply with `setTimeout`, making it safe to render offline.
2. `MessageList` + `MessageBubble`
   - Consume `ChatMessage` contracts and render timestamp, confidence, and citation chips.
   - Auto-scroll happens when the hook updates the ref, preparing the ground for streaming mode.
3. `ChatComposer`
   - Emits `handleSubmit` and `handleInputChange`, keeping form logic declarative.
   - Disables the send button when the input is empty or a response is pending.

## Recommendations Stack

- `RecommendationsPanel` slices mock data, shows progressive "Más recomendaciones" disclosure, and carries bilingual hero copy to ensure the grid layout tolerates mixed languages.
- `recommendedAlbums` is strongly typed via `RecommendedAlbum` and can be swapped with `/recommend` payloads without touching the panel.
- `RecommendationCard` centralizes the interaction pattern for highlights, recurrence tags, and genre chips, so experiments (image previews, CTA buttons) can happen in one place.

## Data & Utilities

- `lib/types/chat.ts` and `lib/types/recommendations.ts` codify the shapes expected by UI and hooks.
- `createChatId` uses `crypto.randomUUID` when available and gracefully falls back to timestamp-based IDs. Once the backend issues IDs, this helper can be replaced in one spot.

## Integration Roadmap

1. Replace `setTimeout` inside `useChatSession` with `/ask` requests (streamed or batched). Emit partial responses by pushing interim assistant messages.
2. Introduce a `useRecommendations` hook that queries `/recommend` using the active chat context or persona metadata (from `UserMenu`).
3. Promote chat state into a context provider when session persistence or multi-window syncing becomes a requirement.
4. Add analytics hooks (e.g., `onSendPrompt`, `onOpenRecommendation`) via props so instrumentation stays optional and testable.

This architecture keeps concerns isolated, enables rapid UI iteration, and leaves clear seams for backend wiring, localization, and accessibility improvements.
