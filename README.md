# Unvios

[![CI](https://github.com/olserra/unvios/actions/workflows/test.yml/badge.svg)](https://github.com/olserra/unvios/actions/workflows/test.yml)

Unvios is an AI-powered personal memory assistant built with Next.js 16. It stores, retrieves, and intelligently recalls user memories using LLM integration and vector embeddings, creating a personalized knowledge base that grows with you.

## Features

### Core Functionality

- **AI Memory System**: Store personal facts, preferences, and experiences with automatic semantic search
- **Vector Embeddings**: Optional pgvector integration for intelligent memory retrieval based on context
- **LLM Chat Interface**: Conversational AI that references your stored memories in responses
- **Memory Management**: Full CRUD operations with tagging, editing, and duplicate detection
- **Activity Logging**: Track user interactions and system events

### Authentication & Payments

- Cookie-based JWT authentication with email/password sign-up
- Stripe integration for subscription management
- Protected dashboard routes with role-based access

### User Experience

- Interactive onboarding tour for new users
- Real-time chat interface with memory annotations
- Dashboard with memory browser and analytics
- Marketing pages (features, pricing, about, blog, research)

## Tech Stack

- **Framework**: [Next.js 16 (canary)](https://nextjs.org/) with App Router
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [pgvector](https://github.com/pgvector/pgvector)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **LLM Integration**: OpenAI-compatible API endpoints
- **Embeddings**: Configurable embedding service for vector search
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database with pgvector extension (or use `USE_LOCAL_MEMORIES=1` for development)
- Optional: OpenAI API key or compatible LLM endpoint

### Installation

```bash
git clone https://github.com/olserra/unvios
cd unvios
pnpm install
```

## Running Locally

### 1. Set up environment variables

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Or manually create a `.env` file with the following variables:

#### Required Variables

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/unvios

# Auth (auto-generated in dev if not provided)
AUTH_SECRET=your-secret-key-here

# Base URL
BASE_URL=http://localhost:3000
```

#### Optional Variables (for full LLM functionality)

```env
# LLM API (OpenAI or compatible endpoint)
LLM_API_URL=https://api.openai.com/v1
LLM_API_KEY=your-llm-api-key

# Embedding API (for vector search)
EMBEDDING_API_URL=https://api.openai.com/v1
EMBEDDING_API_KEY=your-embedding-api-key

# Stripe (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# Dev mode (skip DB, use local JSON file)
USE_LOCAL_MEMORIES=1
```

### 2. Database setup

Run migrations to create the database schema:

```bash
pnpm db:migrate
```

Seed the database with a default user:

```bash
pnpm db:seed
```

This creates a test user:

- Email: `test@test.com`
- Password: `admin123`

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Development Workflows

### Key Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:setup` - Initialize database and create `.env`
- `pnpm db:migrate` - Run Drizzle migrations
- `pnpm db:seed` - Seed database with test data
- `pnpm db:reset-seed` - Reset and re-seed database
- `pnpm test` - Run Vitest unit tests
- `pnpm test:e2e` - Run Playwright e2e tests

### Memory System Architecture

The memory system uses a special annotation format in LLM responses:

```
[MEMORY: User prefers dark mode | preferences, ui]
[MEMORY: Lives in San Francisco | location, personal]
```

The chat API (`app/api/llm/chat/route.ts`) automatically:

1. Parses memory annotations from LLM responses
2. Checks for duplicates using vector similarity
3. Saves new memories with optional embeddings
4. Retrieves relevant memories for context in future conversations

### Vector Search Flow

When embeddings are enabled:

1. User message is embedded
2. Nearest memories are retrieved using cosine distance (`<=>`)
3. Memories are included in LLM prompt for context
4. New memories are embedded and stored with vector column

### Development Mode

Set `USE_LOCAL_MEMORIES=1` to use `lib/devMemories.ts` instead of the database. Useful for:

- Quick prototyping without DB setup
- Testing memory logic in isolation
- Offline development

## Project Structure

```
app/
  ├── (dashboard)/        # Protected dashboard pages
  │   ├── chat/          # AI chat interface
  │   └── dashboard/     # Memory browser, settings
  ├── (login)/           # Auth pages (sign-in, sign-up)
  ├── api/               # Next.js API routes
  │   ├── llm/chat/      # LLM chat endpoint with memory integration
  │   ├── memories/      # Memory CRUD + embeddings
  │   ├── auth/          # Authentication endpoints
  │   └── stripe/        # Payment webhooks
  └── [marketing pages]  # Public pages (about, pricing, etc.)

lib/
  ├── auth/              # Session management, JWT handling
  ├── db/                # Drizzle schema, queries, migrations
  ├── memoryParser.ts    # Memory annotation parsing logic
  └── devMemories.ts     # Local development fallback store

components/
  ├── dashboard/         # Chat, memory panels, onboarding
  └── ui/                # shadcn/ui primitives

scripts/
  ├── backfill-embeddings.ts  # Generate embeddings for existing memories
  ├── dev-seed.ts             # Seed development data
  └── reset-and-seed.ts       # Full reset workflow
```

## Testing

### Unit Tests

```bash
pnpm test
```

Tests are in `tests/` and use Vitest. Current coverage includes:

- Memory parser logic (`tests/memoryParser.test.ts`)
- Utility functions (`tests/utils.test.ts`)

### E2E Tests

```bash
pnpm test:e2e
```

Playwright tests verify critical user flows end-to-end.

## Going to Production

### 1. Environment Variables

Set all required variables in your production environment:

```env
POSTGRES_URL=your-production-db-url
AUTH_SECRET=$(openssl rand -base64 32)
BASE_URL=https://yourdomain.com
LLM_API_URL=your-llm-endpoint
LLM_API_KEY=your-llm-key
EMBEDDING_API_URL=your-embedding-endpoint
EMBEDDING_API_KEY=your-embedding-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

### 2. Database

Ensure your production database has the pgvector extension:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Run migrations:

```bash
pnpm db:migrate
```

### 3. Stripe Webhooks

1. Create a production webhook in Stripe Dashboard
2. Point it to `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, etc.
4. Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Deploy

Deploy to Vercel or your preferred platform:

```bash
vercel --prod
```

## Architecture Decisions

See `docs/adr/` for detailed Architecture Decision Records covering:

- CI/CD workflows and caching strategies
- Security audit and fixes
- Cookie consent implementation
- Onboarding tour implementation
- Test infrastructure

## Contributing

When making significant architectural changes, please create an ADR in `docs/adr/` using the template at `docs/adr/adr-template.md`.

## Security

See `SECURITY_FIXES_APPLIED.md` for recent security improvements.

Report security issues to: [security contact info]

## License

See `LICENSE` file for details.
