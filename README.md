# LinkWell - AI-Powered Document Writing Platform

LinkWell is a modern document writing platform that combines a rich text editor with AI assistance and a personal knowledge base.

## Features

- **Rich Text Editor** - Full-featured Tiptap editor with formatting tools
- **AI Writing Assistant** - GPT-4o-mini powered chat and content generation
- **Knowledge Base** - Add reference materials for AI-aware writing
- **Auto-save** - Your work is automatically saved as you write
- **Beautiful UI** - Clean, modern interface with serif typography

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Convex (real-time, serverless)
- **Authentication**: Convex Auth (email/password)
- **AI**: OpenAI GPT-4o-mini
- **Editor**: Tiptap (ProseMirror-based)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account
- OpenAI API key

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up Convex:

```bash
npx convex dev
```

This will:
- Create a new Convex project (or link to an existing one)
- Generate the Convex functions
- Start the development server

3. Copy the environment file and configure it:

```bash
copy .env.local.example .env.local
```

Update `.env.local` with your Convex deployment URL (shown when running `npx convex dev`).

4. Set your OpenAI API key in the Convex Dashboard:
   - Go to your project at [dashboard.convex.dev](https://dashboard.convex.dev)
   - Navigate to Settings > Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
linkwell/
├── convex/
│   ├── schema.ts         # Database schema
│   ├── auth.ts           # Convex Auth configuration
│   ├── documents.ts      # Document CRUD operations
│   ├── knowledge.ts      # Knowledge management
│   ├── ai.ts             # OpenAI integration
│   └── http.ts           # HTTP routes for auth
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── auth/         # Auth forms & protected routes
│   │   ├── editor/       # Tiptap editor components
│   │   ├── knowledge/    # Knowledge panel
│   │   └── ai/           # AI chat components
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── EditorPage.tsx
│   └── lib/
│       ├── tiptap.ts     # Tiptap configuration
│       └── utils.ts      # Utility functions
├── tailwind.config.js
└── package.json
```

## Usage

1. **Create an account** - Sign up with email and password
2. **Create a document** - Click "New Document" on the dashboard
3. **Add knowledge** - Use the left panel to add reference materials
4. **Write with AI** - Use the right panel to chat with AI or use quick actions
5. **Format your text** - Use the toolbar for headings, bold, lists, etc.

## AI Features

- **Continue Writing** - AI continues from where you left off
- **Expand** - Elaborate on selected text or the last paragraph
- **Summarize** - Get a concise summary of content
- **Rewrite** - Improve clarity and flow of selected text
- **Chat** - Ask questions about your document or knowledge base

## License

MIT
