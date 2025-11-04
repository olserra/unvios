## Quick orientation for AI coding assistants

This project is a Next.js 16 (canary) App Router SaaS-style app that stores user "memories" and optionally uses an LLM + embedding service to recall and persist personal facts.

Keep guidance short and actionable. When making edits, reference concrete files below and follow existing patterns rather than introducing large architectural changes.

### High-level architecture

- Frontend: `app/` (Next.js 16 canary App Router / app directory). Many pages and components are server components; UI primitives live in `components/ui/`.
- API surface: Next.js server routes under `app/api/*` (e.g. `app/api/llm/chat/route.ts`, `app/api/memories/route.ts`). These routes contain the main LLM and memory CRUD logic.
- Database: Postgres accessed via Drizzle in `lib/db/*`. Primary schema is in `lib/db/schema.ts`. Low-level SQL/vector ops use `lib/db/drizzle.ts` (postgres client) and `client.unsafe` for vector operations.
- Auth: Cookie-based JWT sessions in `lib/auth/session.ts` (signed via `AUTH_SECRET` or dev auto-generated secret). Use `getSession()` / `getUser()` from `lib/auth/session.ts` and `lib/db/queries.ts` for user context.

### Key developer workflows / commands

- Run dev site: `pnpm dev` (uses `next dev --turbopack`).
- DB setup: `pnpm db:setup` (runs `lib/db/setup.ts`).
- Migrations: `pnpm db:migrate` (uses `drizzle-kit migrate`).
- Seed: `pnpm db:seed` or `pnpm dev:seed` / `pnpm db:reset-seed` for reset workflows.

Always check `.env` for required variables before using API routes that call external services (see below).

### Important environment variables

- `POSTGRES_URL` — required in both dev/prod for DB connection (`lib/db/drizzle.ts`).
- `AUTH_SECRET` (or `NEXTAUTH_SECRET`) — required in production; dev auto-generates a temporary secret in `lib/auth/session.ts`.
- `EMBEDDING_API_URL`, `EMBEDDING_API_KEY` — optional; used to compute and save vector embeddings in `app/api/memories/route.ts` and `app/api/llm/chat/route.ts`.
- `LLM_API_URL`, `LLM_API_KEY` — used by `app/api/llm/chat/route.ts` for LLM calls. OpenAI-style endpoints are supported and detected.
- `USE_LOCAL_MEMORIES=1` — opt-in dev fallback that routes memory reads/writes to `lib/devMemories.ts` instead of the DB.

### Project-specific patterns & conventions (do these exactly)

- Memory format: the assistant is expected to return explicit memory annotations in the form: `[MEMORY: <content> | tag1, tag2]`. The chat handler parses these via regex and saves them into the `memories` table (see `app/api/llm/chat/route.ts`).
- Vector storage: embeddings are stored in a `vector`-typed column on `memories`. Writes use `client.unsafe` with `UPDATE ... SET embedding = $1::vector` (see `app/api/memories/route.ts` and `lib/db/queries.ts`). Assume pgvector or compatible extension is present when embeddings are enabled.
- Duplicate detection: before saving a new memory the code performs a nearest-neighbor check via `getNearestMemoriesForUser` (low-level SQL using `<=>`) and skips saving if distance is below a small threshold. Preserve this flow when editing memory/embedding logic.
- Error handling: many API routes fall back to the local dev store (`lib/devMemories.ts`) when DB or embedding calls fail. Maintain non-fatal behavior for external-service failures.
- Session handling: `getSession()` and `getUser()` are canonical ways to get auth context; prefer them over ad-hoc cookie reads.

### LLM integration specifics

- `app/api/llm/chat/route.ts` builds prompts using nearby memories (vector search first, then fallback to full memory set). Keep this two-step retrieval pattern.
- The system prompt includes strict response saving rules and language/conciseness constraints. If you change memory parsing or saving rules, update examples in the route to match.
- Support both OpenAI-chat style payloads and generic `inputs` payloads; the code detects OpenAI-style endpoints by URL.

### Files worth reading for examples

- Memory & LLM: `app/api/llm/chat/route.ts`, `app/api/memories/route.ts`
- DB schema & queries: `lib/db/schema.ts`, `lib/db/queries.ts`, `lib/db/drizzle.ts`
- Auth/session: `lib/auth/session.ts`, `lib/auth/middleware.ts`
- Dev helpers & scripts: `lib/devMemories.ts`, `scripts/` (e.g. `backfill-embeddings.ts`, `dev-seed.ts`)

### When making changes, prefer small, localized edits

- Don't replace the memory format or vector storage approach without updating both the chat route and the memories CRUD route.
- If adding a new env var, document it near the top of `README.md` and add fallbacks where appropriate.
- Tests are not present; prefer adding small unit-like checks in `scripts/` when modifying DB or embedding behavior.

If anything above is unclear or you want me to expand examples (e.g., show exact regex or SQL snippets to modify), tell me which area to expand and I will iterate.
