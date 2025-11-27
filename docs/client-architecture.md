# Client Architecture Proposal

The pmLLM client now follows a modular layout to keep chat, navigation, and shared utilities separated and easier to evolve.

## High-Level Structure

```text
app/
  layout.tsx       # Global HTML shell, fonts, metadata
  page.tsx         # Delegates to ChatWorkspace client experience
components/
  chat/            # Chat-specific UI building blocks
  navigation/      # Docked navigation and user menu widgets
hooks/
  useChatSession.ts# Encapsulated chat state, fake streaming logic
lib/
  constants/       # Seed data for mock session and dock metadata
  types/           # Shared TypeScript contracts
  utils/           # Cross-cutting helpers (ID factory, etc.)
```

## Separation of Concerns

- **Presentation**: Each UI section (header, composer, message list, nav, user menu) is an independent component with single-purpose props.
- **State**: `useChatSession` owns the conversation lifecycle (messages, input, responder simulation). Presentation components remain stateless and testable.
- **Data Contracts**: `lib/types/chat.ts` defines canonical chat message shapes used across hooks and UI, ensuring compile-time safety.
- **Configuration**: `lib/constants/chat.ts` houses mock data, nav sections, and genre tags, so copy or behavior swaps happen without touching components.
- **Utilities**: `lib/utils/id.ts` centralizes ID creation for easier replacement with backend-issued identifiers later on.

## Extension Points

1. **API Wiring**: Swap the timeout block inside `useChatSession` with real `/ask` calls while keeping UI untouched.
2. **Multi-Surface Layouts**: Introduce additional route groups under `app/(workspace)/` and reuse the same navigation widgets.
3. **State Machines**: Elevate `useChatSession` into a context provider when session persistence or history lists are required.
4. **Analytics & Telemetry**: Presentation components can emit lightweight events without breaking encapsulation by receiving callbacks through props.

This structure balances clarity, reusability, and readiness for future pmLLM features such as recommendation panels or graph explorers.
