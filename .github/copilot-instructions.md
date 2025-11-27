# AI Agent Instructions for pmllm-client

## Project Overview

This is a Next.js 16 client application for a music recommendation system using Retrieval-Augmented Generation (RAG) and Knowledge Graph technology. The client provides an interactive web interface for users to chat with a Gemma 3-powered LLM backend, explore music recommendations, and discover relationships in a music knowledge graph derived from MusicBrainz data.

## Architecture & Structure

- **Framework**: Next.js 16 with App Router (`app/` directory)
- **Styling**: Tailwind CSS v4 with inline theme configuration
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font`
- **Path Aliases**: `@/*` maps to project root (configured in `tsconfig.json`)
- **Backend Integration**: REST API endpoints (`/recommend`, `/connect`, `/ask`) connecting to RAG + KG backend

## Key Patterns & Conventions

### Language Requirements

- **All code generation and technical responses must be in English** - this is critical for consistency and maintainability
- Documentation and comments can be in Spanish following project conventions
- UI text and user-facing content should follow the bilingual approach (English for code, Spanish for documentation)

### Styling & Theming

- **Exclusive use of Tailwind CSS v4** - avoid custom CSS at all costs
- Use CSS custom properties for theme colors (`--background`, `--foreground`)
- Dark mode implemented via `prefers-color-scheme` media queries
- Tailwind classes applied directly in JSX (no CSS modules or styled-components)
- Example: `className="bg-zinc-50 dark:bg-black text-black dark:text-zinc-50"`

### Tailwind CSS v4 References

- Configuration: `@import "tailwindcss"` in globals.css (no plugins array needed)
- Theme customization: Use `@theme inline` directive for custom properties
- Dark mode: Use `dark:` prefixes with CSS variables
- Responsive design: Mobile-first with `sm:`, `md:`, `lg:`, `xl:` breakpoints

### Component Structure

- Pages in `app/` directory with default exports
- Layout components use `children: React.ReactNode` prop pattern
- Metadata exported as const objects (see `app/layout.tsx`)
- Chat interface components for LLM interactions
- Recommendation panels for music discovery features

### API Integration Patterns

- REST API calls to backend endpoints for chat, recommendations, and knowledge graph exploration
- Handle responses with confidence scores, citations, and contextual explanations
- Implement loading states and error handling for API interactions

### Documentation & Bilingual Support

- **Bilingual Documentation Maintenance**: Every time documentation is created, modified, or deleted, the corresponding Spanish version must be updated in `docs/es_ES/` to keep both languages synchronized
- English documentation in `docs/` serves as the source of truth for technical content
- Spanish documentation in `docs/es_ES/` provides localized versions for Spanish-speaking team members

### Configuration

- ESLint uses flat config format (`eslint.config.mjs`) with Next.js presets
- PostCSS configured for Tailwind v4 (`@tailwindcss/postcss` plugin)
- TypeScript strict mode enabled with incremental compilation

## Development Workflow

- **Package Manager**: pnpm (scripts in `package.json` use pnpm commands)
- **Dev Server**: `pnpm run dev` (not `npm run dev` as shown in README)
- **Linting**: `pnpm run lint` uses ESLint with Next.js rules
- **Build**: `pnpm run build` for production builds
- **Documentation**: Follow `docs/overview.md` for architectural context and feature requirements
- **Bilingual Documentation**: When creating, modifying, or deleting documentation references, always update the corresponding Spanish version in `docs/es_ES/` to maintain synchronization

## File Organization

- `app/`: Next.js App Router pages and layouts
- `docs/`: Project documentation and architectural overview (English)
- `docs/es_ES/`: Spanish documentation and architectural overview
- `public/`: Static assets (SVGs, favicon)
- Config files at root: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`
- `.github/`: AI agent instructions and project guidelines

## Dependencies

- Next.js 16.0.5 with React 19.2.0
- Tailwind CSS v4 (beta) with PostCSS plugin
- TypeScript 5.x with strict settings
- ESLint 9.x with Next.js configuration

## Common Patterns

- Import fonts: `import { Geist, Geist_Mono } from "next/font/google"`
- Image optimization: Use `next/image` with priority for above-the-fold images
- Responsive design: Mobile-first with `sm:` breakpoints
- Dark mode: Use `dark:` prefixes and CSS variables
- API calls: Fetch-based requests to backend endpoints with proper error handling

## Gotchas

- README shows npm commands but project uses pnpm
- Tailwind v4 uses `@import "tailwindcss"` instead of v3's plugin system
- ESLint config uses new flat config format (not `.eslintrc`)
- All code generation responses must be in English regardless of user query language
- **Never use custom CSS** - all styling must be done with Tailwind CSS v4 classes
