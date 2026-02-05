# LinkWell

An AI-powered document writing platform that helps you create high-quality content by referencing your own knowledge and collaborating with AI in real-time.

## Features

- **AI-Assisted Writing** - Get intelligent suggestions, expand your ideas, and refine your writing with AI that understands your context
- **Reference Your Knowledge** - Add notes, research, and source materials directly to your document. AI uses them to ground every response
- **Clean, Focused Editor** - A distraction-free writing environment with beautiful typography designed for long-form content

## Tech Stack

- **Frontend**: React with TypeScript (Vite)
- **Backend/Database**: Convex (real-time, serverless)
- **Authentication**: Convex Auth (email + password)
- **AI**: OpenAI API (GPT-4o-mini)
- **Rich Text Editor**: Tiptap
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- A Convex account (free at [convex.dev](https://convex.dev))
- An OpenAI API key

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Convex**

   ```bash
   npx convex dev
   ```

   This will:
   - Prompt you to log in with GitHub
   - Create a new Convex project
   - Generate the `VITE_CONVEX_URL` automatically

3. **Configure OpenAI API Key**

   Go to your [Convex Dashboard](https://dashboard.convex.dev), select your project, then:
   - Navigate to **Settings** > **Environment Variables**
   - Add `OPENAI_API_KEY` with your OpenAI API key

4. **Run the development server**

   In a separate terminal (keep `npx convex dev` running):

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
linkwell/
├── convex/                 # Convex backend
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication config
│   ├── documents.ts       # Document CRUD operations
│   ├── knowledge.ts       # Knowledge management
│   └── ai.ts              # OpenAI integration
├── src/
│   ├── main.tsx           # App entry point
│   ├── App.tsx            # Router setup
│   ├── components/
│   │   ├── editor/        # Tiptap editor components
│   │   ├── knowledge/     # Knowledge panel
│   │   └── ai/            # AI chat panel
│   ├── pages/             # Page components
│   └── lib/               # Utilities
└── ...config files
```

## Usage

1. **Create an account** - Sign up with email and password
2. **Create a document** - Click "New Document" on the dashboard
3. **Add knowledge** - Use the left panel to add reference materials
4. **Write with AI** - Use the right panel to chat with AI or use quick actions
5. **Auto-save** - Your document saves automatically as you write

## Environment Variables

### Client-side (.env.local)

```
VITE_CONVEX_URL=<your-convex-deployment-url>
```

### Server-side (Convex Dashboard)

```
OPENAI_API_KEY=<your-openai-api-key>
```

## License

MIT
