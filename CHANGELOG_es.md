# Registro de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [Sin Liberar]

## [0.1.0] - 2025-11-27

### Agregado

- Configuración inicial del proyecto con Next.js 16, TypeScript y Tailwind CSS v4
- Creado `.github/copilot-instructions.md` con guía para agentes de IA del cliente de recomendaciones musicales
- Agregado requisito de idioma especificando que todas las respuestas de generación de código deben ser en inglés
- Incorporado contexto arquitectónico de `docs/overview.md` sobre el sistema RAG + Knowledge Graph
- Creados CHANGELOG.md y CHANGELOG_es.md para seguimiento de cambios
- Agregada carpeta docs con overview.md describiendo la arquitectura del sistema de recomendaciones musicales
- Agregada documentación en español en `docs/es_ES/overview.md` para soporte bilingüe
- Agregada dependencia `react-icons` para componentes de UI

### Cambiado

- Actualizadas instrucciones de IA para reflejar el propósito del proyecto como cliente para recomendaciones musicales impulsadas por Gemma 3
- Agregados patrones de integración backend y referencias de endpoints API
- **Decisión de Diseño**: Establecido uso exclusivo de Tailwind CSS v4 para todos los estilos, evitando CSS personalizado
- Actualizada documentación para enfatizar patrones de uso de Tailwind CSS v4 y referencias
- Agregados requisitos de mantenimiento de documentación bilingüe a las instrucciones de IA
- **README**: Reescritura completa con información comprehensiva del proyecto, guía de instalación y flujo de desarrollo

### Corregido

- Corregido error de tipo TypeScript en `useChatSession.ts` cambiando `RefObject<HTMLDivElement>` por `React.RefObject<HTMLDivElement>` para compatibilidad de tipos adecuada

### Detalles Técnicos

- Framework: Next.js 16 con App Router
- Estilos: Tailwind CSS v4 con configuración de tema inline
- Gestor de Paquetes: pnpm
- TypeScript: Modo estricto habilitado
- ESLint: Formato de configuración flat con presets de Next.js
- Iconos UI: react-icons (^5.5.0) para iconos de componentes
