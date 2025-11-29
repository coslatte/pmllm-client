# Arquitectura del Cliente (Implementación Actual)

El cliente pmLLM entrega un workspace de una sola página construido con componentes cliente, Tailwind CSS v4 y datos locales. El objetivo es mantener la superficie utilizable hoy y dejar puntos de extensión claros para el backend RAG + KG.

## Estructura de Alto Nivel

```text
app/
  layout.tsx        # Shell HTML global, fuentes, metadata, temas
  page.tsx          # Renderiza ChatWorkspace (solo cliente)
components/
  chat/             # Bloques de UI del chat (header, composer, lista)
  navigation/       # Widgets SectionNav, ThemeToggle, UserMenu
  recommendations/  # Grid y controles de RecommendationCard
hooks/
  useChatSession.ts # Hook del ciclo de vida con respuesta simulada
lib/
  constants/        # Mensajes seed, secciones de nav, datos de recomendaciones
  types/            # Contratos TypeScript de chat + recomendaciones
  utils/            # Utilidades transversales (fábrica de IDs, etc.)
```

## Shell del Workspace

- `ChatWorkspace` compone el layout (header fijo + sidebar + área principal desplazable) y orquesta cambios de sección, creación de chats y persistencia de tema.
- El componente alterna entre modo chat y modo recomendaciones, así que futuras superficies (ej. `/connect`) pueden reutilizar el mismo andamiaje.

## Navegación y Control de Secciones

- `SectionNav` lee `navItems` desde `lib/constants/chat.ts`, mostrando sesiones y selector de sección en una sola columna.
- La creación de chats genera un ID/tiempo en el cliente y enfoca esa sesión de inmediato. Aquí se conectará la futura API de `/sessions`.
- Los íconos provienen de `react-icons/fi`, manteniendo el bundle liviano pero familiar.

## Capa de Tema y Persona

- `ChatHeader` integra `ThemeToggle`, que guarda la preferencia en `window.localStorage` (`pmllm-theme`). El elemento raíz recibe `data-theme` para que los tokens definidos en `app/globals.css` cambien al instante.
- `UserMenu` muestra metadata de la persona y tags de escucha. Un manejador de clic externo cierra el panel para replicar patrones modernos de dashboard.

## Pila de Chat

1. `useChatSession`
   - Mantiene `messages`, `inputValue`, `isResponding` y `endOfMessagesRef`.
   - Inicia la conversación con `initialMessages` y simula una respuesta del backend con `setTimeout`, permitiendo renderizado offline.
2. `MessageList` + `MessageBubble`
   - Consumen el contrato `ChatMessage` y renderizan timestamp, confianza y chips de citas.
   - El auto-scroll ocurre cuando el hook actualiza la ref, dejando listo el modo streaming.
3. `ChatComposer`
   - Expone `handleSubmit` y `handleInputChange`, manteniendo la lógica de formulario declarativa.
   - Deshabilita el botón de envío cuando el input está vacío o la respuesta sigue pendiente.

## Pila de Recomendaciones

- `RecommendationsPanel` corta datos mock, muestra la progresión "Más recomendaciones" y contiene copy bilingüe para validar el grid con textos mixtos.
- `recommendedAlbums` está tipeado mediante `RecommendedAlbum` y puede reemplazarse por la respuesta de `/recommend` sin tocar el panel.
- `RecommendationCard` centraliza cómo se presentan highlights, tags de recurrencia y chips de género, facilitando futuras pruebas (imágenes, CTAs).

## Datos y Utilidades

- `lib/types/chat.ts` y `lib/types/recommendations.ts` definen las formas esperadas por UI y hooks.
- `createChatId` usa `crypto.randomUUID` cuando está disponible y cae en IDs basados en timestamp cuando no. Cuando el backend entregue IDs, este helper se reemplaza en un único lugar.

## Ruta de Integración

1. Sustituir `setTimeout` en `useChatSession` por peticiones a `/ask` (streaming o batch). Emitir respuestas parciales agregando mensajes del asistente.
2. Crear un hook `useRecommendations` que consulte `/recommend` usando el contexto del chat activo o la metadata de `UserMenu`.
3. Promover el estado del chat a un provider cuando se necesite persistencia de sesión o sincronización entre ventanas.
4. Añadir hooks de analítica (ej. `onSendPrompt`, `onOpenRecommendation`) vía props para que la instrumentación sea opcional y testeable.

Esta arquitectura separa las responsabilidades, permite iterar rápido en UI y deja puntos claros para cablear backend, localización y mejoras de accesibilidad.
