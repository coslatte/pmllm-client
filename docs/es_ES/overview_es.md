# Overview del Cliente Web: Interfaz para Sistema de Recomendaciones Musicales con RAG

Este repositorio contiene el cliente web (pmllm-client) desarrollado con Next.js 16, TypeScript y Tailwind CSS. Es una interfaz gráfica que actúa como mediador entre el usuario y el backend de procesamiento, proporcionando una experiencia intuitiva para interactuar con un sistema de Knowledge-Graph + Retrieval-Augmented Generation (RAG) basado en Gemma 3.

## Propósito desde la Perspectiva del Usuario

- **Chatbot Interactivo**: Una interfaz de chat clásica donde los usuarios envían prompts (mensajes) y reciben respuestas generadas por el LLM (Gemma 3) del backend. Las respuestas incluyen explicaciones contextuales, citas de fuentes y puntuaciones de confianza.
- **Sistema de Recomendaciones Musicales**: Una sección dedicada en la UI para obtener recomendaciones personalizadas de cursos, piezas musicales, playlists y recursos relacionados con música, basadas en el conocimiento gráfico y la recuperación de información del backend.
- **Descubrimiento de Relaciones**: Visualización de conexiones entre temas musicales (géneros, artistas, conceptos teóricos) a través de la interfaz, aprovechando el grafo de conocimiento del backend.

## Arquitectura desde la Vista del Cliente

El cliente web se conecta vía API REST al backend, que maneja:

1. **Backend de Procesamiento**:
   - Knowledge Graph (KG) con datos de MusicBrainz (artistas, grabaciones, géneros, etc.)
   - Vector Store (Milvus) para recuperación de embeddings
   - Generación con Gemma 3 para respuestas de alta calidad
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

El backend implementa un sistema RAG + KG que utiliza Gemma 3 (ej. `google/gemma-3-1b`) para generación, sin fine-tuning. Emplea embeddings y vector stores para recuperación, con Neo4j para el grafo de conocimiento derivado de MusicBrainz. El cliente web es la capa de presentación que hace accesible esta funcionalidad avanzada a través de una interfaz amigable.

## Funcionalidades Clave del Cliente

- **Chat con el LLM**: Interfaz de conversación para preguntas sobre música, teoría, recomendaciones, etc.
- **Recomendaciones Interactivas**: Exploración de cursos, artistas similares, playlists basadas en preferencias
- **Visualización de Relaciones**: Gráficos o listas que muestran conexiones (ej. "armonía → contrapunto → orquestación")
- **Gestión de Sesiones**: Historial de chats y recomendaciones personalizadas

Este cliente transforma el poder del backend en una herramienta accesible para educación musical, práctica profesional y descubrimiento de música.

## Estilo de Documentación

- **No usar emojis en la documentación ni en texto técnico**: La documentación, `README.md`, changelogs, mensajes de commit, comentarios de código y cadenas generadas en la UI no deben contener caracteres emoji salvo que se solicite explícitamente. Mantener la documentación clara, profesional y fácil de buscar.
- La documentación en inglés en `docs/` es la fuente técnica de referencia; las traducciones al español deben vivir en `docs/es_ES/` y actualizarse sincronizadas cuando se realicen cambios.
