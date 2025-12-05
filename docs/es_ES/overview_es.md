# Overview del Cliente Web: Interfaz para Sistema de Recomendaciones Musicales con RAG

Este repositorio contiene el cliente web (pmllm-client) desarrollado con Next.js 16, TypeScript y Tailwind CSS. Es una interfaz gráfica que actúa como mediador entre el usuario y el backend de procesamiento, proporcionando una experiencia intuitiva para interactuar con un sistema de Knowledge-Graph + Retrieval-Augmented Generation (RAG) basado en un modelo de lenguaje (a decidir).

## Propósito desde la Perspectiva del Usuario

- **Chatbot Interactivo**: Una interfaz de chat clásica donde los usuarios envían prompts (mensajes) y reciben respuestas generadas por el LLM (modelo de lenguaje a decidir) del backend. Las respuestas incluyen explicaciones contextuales, citas de fuentes y puntuaciones de confianza.
- **Sistema de Recomendaciones Musicales**: Una sección dedicada en la UI para obtener recomendaciones personalizadas de cursos, piezas musicales, playlists y recursos relacionados con música, basadas en el conocimiento gráfico y la recuperación de información del backend.
- **Descubrimiento de Relaciones**: Visualización de conexiones entre temas musicales (géneros, artistas, conceptos teóricos) a través de la interfaz, aprovechando el grafo de conocimiento del backend.

## Arquitectura desde la Vista del Cliente

El cliente web se conecta vía API REST al backend, que maneja:

1. **Backend de Procesamiento**:
   - Knowledge Graph (KG) con datos de MusicBrainz (artistas, grabaciones, géneros, etc.)
   - Vector Store (Milvus) para recuperación de embeddings
   - Generación con un LLM (a decidir) para respuestas de alta calidad
   - Orquestación de consultas y recomendaciones

2. **Interfaz del Cliente**:
   - **Chat Interface**: Envío de prompts al backend y display de respuestas con formato enriquecido (citas, confianza)
   - **Recommendations UI**: Paneles para explorar recomendaciones musicales, con filtros y navegación por relaciones
   - **User Experience**: Diseño responsivo con **Tailwind CSS v4 exclusivamente** (sin CSS personalizado), optimizado para estudiantes, educadores y profesionales de la música

3. **Endpoints API Utilizados**:
   - `/recommend`: Para obtener recomendaciones musicales personalizadas
   - `/connect`: Para explorar relaciones en el grafo de conocimiento
   - `/ask`: Para consultas generales vía chatbot

## Contexto del Sistema Completo

El backend implementa un sistema RAG + KG que utiliza un modelo de lenguaje (a decidir) para generación, sin fine-tuning. Emplea embeddings y vector stores para recuperación, con Neo4j para el grafo de conocimiento derivado de MusicBrainz. El cliente web es la capa de presentación que hace accesible esta funcionalidad avanzada a través de una interfaz amigable.

## Funcionalidades Clave del Cliente

- **Chat con el LLM**: Interfaz de conversación para preguntas sobre música, teoría, recomendaciones, etc.
- **Recomendaciones Interactivas**: Exploración de cursos, artistas similares, playlists basadas en preferencias
- **Visualización de Relaciones**: Gráficos o listas que muestran conexiones (ej. "armonía → contrapunto → orquestación")
- **Gestión de Sesiones**: Historial de chats y recomendaciones personalizadas

Este cliente transforma el poder del backend en una herramienta accesible para educación musical, práctica profesional y descubrimiento de música.

## Superficie Actual del Frontend (Noviembre 2025)

- **Shell del Workspace**: `app/page.tsx` renderiza `ChatWorkspace`, un componente cliente que controla el header fijo y el layout de dos columnas (dock + área principal) manteniendo la experiencia responsiva.
- **Secciones Dual**: `SectionNav` permite alternar entre el flujo de chat y el panel de recomendaciones, además de mostrar chats seed con la opción de crear sesiones nuevas in situ.
- **Persistencia de Tema**: `ChatHeader` conecta el control `ThemeToggle`, guardando el modo elegido en `window.localStorage` (`pmllm-theme`) y sincronizándolo con la paleta de variables definida en `app/globals.css`.
- **Cajón de Persona**: `UserMenu` expone una tarjeta colapsable con metadata de enfoque y tags provenientes de `lib/constants/chat.ts`, reforzando la historia de personalización.

## Profundidad en la Experiencia de Chat

1. **Estado + Simulación de Streaming**: `useChatSession` administra el arreglo de mensajes, el input del usuario, el flag de respuesta y el ancla de scroll. Hoy inicializa mensajes desde `lib/constants/chat.ts`, agrega prompts del usuario e inyecta una respuesta placeholder tras un timeout corto para poder probar la UI sin backend.
2. **Render de Mensajes**: `MessageList` transforma entidades `ChatMessage` (definidas en `lib/types/chat.ts`) en `MessageBubble`. Los mensajes del asistente muestran badges de confianza y chips de citas cuando están presentes, exponiendo metadata clave.
3. **UX del Composer**: `ChatComposer` ofrece un textarea etiquetado, deshabilita el envío mientras `isResponding` es verdadero y mantiene el estilo del CTA alineado con los tokens de Tailwind v4. El componente emite `handleSubmit` para que el cableado con la API ocurra dentro del hook.
4. **Auto-Scroll**: La referencia `endOfMessagesRef` mantiene el chat anclado al intercambio más reciente, preparando la superficie para respuestas en streaming.

## Experiencia de Recomendaciones

- **Punto de Entrada**: Al elegir "Recommendations" en `SectionNav`, el área principal cambia a `RecommendationsPanel`, que actualmente muestra copy bilingüe para destacar el mensaje de procedencia.
- **Fuente de Datos**: `lib/constants/recommendations.ts` aloja `recommendedAlbums`, una lista mock de ocho álbumes tipada con `RecommendedAlbum`. Cada registro combina tags, highlights y textos que luego se reemplazarán con `/recommend`.
- **Divulgación Progresiva**: El panel enseña seis tarjetas por defecto y muestra el botón "Más recomendaciones" cuando quedan elementos pendientes. Cada clic revela tres tarjetas adicionales, replicando la carga incremental.
- **Layout de Tarjetas**: `RecommendationCard` estandariza cómo se presentan los tags de recurrencia, metadata del álbum y frases de highlight, sirviendo como plantilla para playlists generadas por backend.

## Notas de Temas, Estilos y Localización

- **Solo Tailwind**: Todos los componentes usan utilidades de Tailwind v4 y las variables definidas en `app/globals.css`. No se agrega CSS personalizado adicional.
- **Tokens de Modo Oscuro**: `:root[data-theme="dark"]` sobrescribe los colores base y habilita `color-scheme: dark`, así la UI responde tanto a la preferencia almacenada como a `prefers-color-scheme` cuando no hay override.
- **Cadenas Localizadas**: Los encabezados de recomendaciones incluyen copy en español mientras el resto de la UI permanece en inglés, validando que el layout soporta payloads multilingües.

## Lista de Integración con la API

1. **/ask**: Reemplazar el stub con timeout dentro de `useChatSession` por una llamada `fetch` que haga streaming de las respuestas del asistente, poblando `confidence` y `citations` desde el backend.
2. **/recommend**: Sustituir `recommendedAlbums` por un hook que obtenga playlists personalizadas usando el contexto del chat activo (o metadata del usuario) como payload.
3. **/connect**: Añadir otra entrada en `SectionNav` cuando la superficie de exploración del grafo esté lista; el layout ya anticipa múltiples secciones.
4. **Errores + Loading**: Mostrar toasts optimistas o alertas inline en `ChatComposer` y `RecommendationsPanel` para reflejar la latencia del backend.

## Estilo de Documentación

- **No usar emojis en la documentación ni en texto técnico**: La documentación, `README.md`, changelogs, mensajes de commit, comentarios de código y cadenas generadas en la UI no deben contener caracteres emoji salvo que se solicite explícitamente. Mantener la documentación clara, profesional y fácil de buscar.
- La documentación en inglés en `docs/` es la fuente técnica de referencia; las traducciones al español deben vivir en `docs/es_ES/` y actualizarse sincronizadas cuando se realicen cambios.
