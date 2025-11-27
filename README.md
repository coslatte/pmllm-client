# PM LLM Client

A modern web client for a music recommendation system powered by Retrieval-Augmented Generation (RAG) and Knowledge Graph technology. Built with Next.js 16, this interface provides an intuitive way to interact with a backend AI system for music discovery, recommendations, and knowledge exploration.

## Features

- **Interactive Chat Interface**: Natural language conversations with the AI for music-related queries
- **Personalized Recommendations**: Get tailored music suggestions based on your preferences
- **Knowledge Graph Exploration**: Discover relationships between artists, genres, and musical concepts
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Responses**: Live confidence scores and citations for AI responses
- **Session Management**: Persistent chat history and recommendation tracking

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (exclusive - no custom CSS)
- **Icons**: React Icons
- **Backend**: REST API integration with RAG + KG system
- **AI Model**: Integration with a language model (to be decided)
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ (recommended: 22.14.0)
- pnpm package manager
- Git

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/coslatte/pmllm-client.git
   cd pmllm-client
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

### Project Structure

```
pmllm-client/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Tailwind CSS v4 configuration
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── chat/             # Chat interface components
│   └── navigation/       # Navigation components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and constants
│   ├── constants/        # App constants
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Helper functions
├── docs/                 # Documentation (English)
├── docs/es_ES/          # Documentation (Spanish)
├── public/              # Static assets
└── .github/             # AI agent instructions
```

## Architecture

### Frontend Architecture

The client follows a component-based architecture with:

- **Pages**: Route-based components in `app/` directory
- **Components**: Reusable UI components organized by feature
- **Hooks**: Custom logic for chat sessions, API calls, and state management
- **Utils**: Helper functions for ID generation, data processing, and formatting

### Backend Integration

Connects to a RAG + Knowledge Graph system featuring:

- **Knowledge Graph**: MusicBrainz data with artist, recording, and genre relationships
- **Vector Store**: Milvus for embedding-based retrieval
- **AI Model**: A language model (to be decided) for natural language generation
- **API Endpoints**:
  - `/recommend` - Personalized music recommendations
  - `/connect` - Knowledge graph relationship exploration
  - `/ask` - General chatbot queries

## Documentation

### English Documentation

- [Project Overview](docs/overview.md) - Complete architectural overview
- [CHANGELOG](CHANGELOG.md) - Version history and changes

### Documentación en Español

- [Resumen del Proyecto](docs/es_ES/overview.md) - Resumen arquitectónico completo
- [Registro de Cambios](CHANGELOG_es.md) - Historial de versiones y cambios

### AI Agent Instructions

- [.github/copilot-instructions.md](.github/copilot-instructions.md) - Guidelines for AI coding assistants

### Development Guidelines

- **Code Style**: Follow the existing TypeScript and ESLint configuration
- **Styling**: Use Tailwind CSS v4 classes exclusively (no custom CSS)
- **Language**: All code generation responses must be in English
- **Documentation**: Maintain bilingual documentation (English + Spanish)
- **Commits**: Use conventional commit messages
- **No emojis in documentation or developer-facing text**: Do not include emoji characters in `docs/`, `README.md`, changelogs, commit messages, code comments, or generated UI text unless explicitly requested. Keep documentation plain, professional, and searchable.
