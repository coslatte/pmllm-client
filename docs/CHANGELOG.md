# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2025-11-27

### Added

- Initial project setup with Next.js 16, TypeScript, and Tailwind CSS v4
- Created `.github/copilot-instructions.md` with AI agent guidance for the music recommendation client
- Added language requirement specifying all code generation responses must be in English
- Incorporated architectural context from `docs/overview.md` about RAG + Knowledge Graph system
- Created CHANGELOG.md and CHANGELOG_es.md for change tracking
- Added docs folder with overview.md describing the music recommendation system architecture
- Added Spanish documentation in `docs/es_ES/overview.md` for bilingual support
- Added `react-icons` dependency for UI components
- **UI Enhancement**: Fixed header positioning with dynamic titles based on active section (Chat/Recommendations/Connections)

### Changed

- Updated AI instructions to reflect the project's purpose as a client for Gemma 3-powered music recommendations
- Added backend integration patterns and API endpoint references
- **Design Decision**: Established exclusive use of Tailwind CSS v4 for all styling, avoiding custom CSS
- Updated documentation to emphasize Tailwind CSS v4 usage patterns and references
- Added bilingual documentation maintenance requirements to AI instructions
- **README**: Complete rewrite with comprehensive project information, installation guide, and development workflow
- **AI Model**: Changed references from specific "Gemma 3" to generic "language model (to be decided)" across all documentation

### Fixed

- Fixed TypeScript type error in `useChatSession.ts` by changing `RefObject<HTMLDivElement>` to `React.RefObject<HTMLDivElement>` for proper type compatibility

### Technical Details

- Framework: Next.js 16 with App Router
- Styling: Tailwind CSS v4 with inline theme configuration
- Package Manager: pnpm
- TypeScript: Strict mode enabled
- ESLint: Flat config format with Next.js presets
- UI Icons: react-icons (^5.5.0) for component icons
