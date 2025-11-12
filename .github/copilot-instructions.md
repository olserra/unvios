# Unvios - Quick Orientation for AI Assistants

This is a Next.js 16 (canary) App Router SaaS app for personal memory management with LLM + vector embeddings.

## Critical Rules

**ALL code, comments, and user-facing text MUST be in English.**
- No Portuguese or other languages in code, comments, UI strings, or error messages

**Follow existing patterns** - make minimal, surgical changes rather than large refactors.

**Document major changes** - create ADRs in `docs/adr/` for architecture/infra changes.

## Quick Reference

### Architecture Overview
- **Frontend**: Next.js App Router in `app/`, server components, UI in `components/ui/`
- **API**: Server routes in `app/api/*` (memories CRUD, LLM chat)
- **Database**: Postgres via Drizzle (`lib/db/`), pgvector for embeddings
- **Auth**: JWT sessions in cookies (`lib/auth/session.ts`)

### Key Commands
```bash
pnpm dev              # Start dev server
pnpm db:setup         # Initialize database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed test data
```

### Essential Files
- Memory & LLM: `app/api/llm/chat/route.ts`, `app/api/memories/route.ts`
- DB: `lib/db/schema.ts`, `lib/db/queries.ts`
- Auth: `lib/auth/session.ts`, `lib/auth/middleware.ts`

## Domain-Specific Guides

For detailed information, see:
- **Architecture & patterns** → `.github/instructions/architecture.md`
- **Backend (API, DB, auth)** → `.github/instructions/backend-guide.md`
- **Frontend (UI, components)** → `.github/instructions/frontend-guide.md`
- **Environment setup** → `.github/instructions/environment.md`
- **Development workflows** → `.github/instructions/workflows.md`
- **Testing & quality** → `.github/instructions/testing.md`
- **Business context** → `.github/instructions/business-context.md`

## Quick Patterns

**Memory format**: `[MEMORY: content | tag1, tag2]` - LLM outputs these, server parses and saves

**Auth**: Always use `getSession()` / `getUser()` from `lib/auth/session.ts`

**Vector search**: Use `getNearestMemoriesForUser()` for similarity queries

**Fallback strategy**: Routes gracefully fall back to `lib/devMemories.ts` on DB errors
