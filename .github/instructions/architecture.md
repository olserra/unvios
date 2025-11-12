# Architecture & Design Patterns

## Folder Structure

```
app/
├── (dashboard)/          # Dashboard layout group
├── (login)/              # Login/auth layout group
├── api/                  # API routes
│   ├── llm/chat/        # LLM chat endpoint
│   ├── memories/        # Memory CRUD
│   ├── auth/            # Authentication
│   └── user/            # User management
├── about/               # Public pages
├── features/
├── pricing/
└── layout.tsx           # Root layout

lib/
├── auth/                # Authentication logic
│   ├── session.ts       # JWT session management
│   └── middleware.ts    # Auth middleware/validators
├── db/                  # Database layer
│   ├── schema.ts        # Drizzle schema
│   ├── queries.ts       # Query functions
│   ├── drizzle.ts       # DB client
│   └── migrations/      # SQL migrations
├── devMemories.ts       # Local fallback store
└── utils.ts             # Shared utilities

components/
├── dashboard/           # Dashboard-specific components
├── ui/                  # Reusable UI primitives
└── analytics/           # Analytics components
```

## Design Patterns in Use

### 1. Repository Pattern
**Location**: `lib/db/queries.ts`

Abstracts data access behind functions:
- `getUser()` - Fetch authenticated user
- `getMemoriesGrouped()` - Fetch memories by category
- `getNearestMemoriesForUser()` - Vector similarity search

**Why**: Decouples business logic from SQL implementation.

### 2. Middleware/Guard Pattern
**Location**: `lib/auth/middleware.ts`

Wraps server actions with validation:
```typescript
validatedAction(schema, action)           // Input validation
validatedActionWithUser(schema, action)   // Auth + validation
```

**Why**: Centralizes auth checks and input validation.

### 3. Factory Pattern
**Location**: `lib/auth/session.ts`

`getOrCreateSecret()` generates or retrieves JWT secret:
- Production: requires `AUTH_SECRET` env var
- Development: auto-generates temporary secret

**Why**: Ensures secret availability across environments.

### 4. Adapter Pattern
**Location**: `app/api/llm/chat/route.ts`

`normalizeOutput()` handles different LLM response formats:
- OpenAI style: `choices[].message.content`
- Generic style: `output`, `text`, `results[].output`

**Why**: Support multiple LLM providers with one interface.

### 5. Strategy Pattern
**Location**: Memory storage switching

Two storage strategies:
- **Database**: `lib/db/queries.ts` (production)
- **Local files**: `lib/devMemories.ts` (development)

Switch via `USE_LOCAL_MEMORIES` env var.

**Why**: Enables local development without database.

### 6. Template Method Pattern
**Location**: API route structure

All routes follow consistent flow:
1. Validate session (`getSession()`)
2. Validate input (Zod schema)
3. Execute business logic
4. Handle errors with fallback

**Why**: Predictable error handling and auth checks.

### 7. Singleton Pattern
**Location**: Database client

- `lib/db/drizzle.ts` exports shared `client` and `db`
- `getSession()` uses React's `cache()` for request-scoped singleton

**Why**: Prevent connection pool exhaustion.

### 8. Fallback/Circuit Breaker Pattern
**Location**: All API routes

Try-catch blocks with graceful degradation:
```typescript
try {
  // Use database
} catch (error) {
  // Fall back to local store
  return dev.listMemories();
}
```

**Why**: Development continues despite service failures.

### 9. Validator/Decorator Pattern
**Location**: Input validation

Zod schemas wrap all user inputs:
```typescript
const schema = z.object({
  content: z.string().min(1).max(10000),
  tags: z.array(z.string()).max(10)
});
```

**Why**: Type-safe runtime validation.

### 10. ORM/Active Record Pattern
**Location**: Database operations

Drizzle ORM provides type-safe queries:
```typescript
await db.select().from(memories).where(eq(memories.userId, user.id))
```

**Why**: Type safety and SQL abstraction.

## Architectural Decisions

### Server-First Approach
- React Server Components by default
- Client components only when needed (`'use client'`)
- Data fetching in server components

### API Layer Design
- RESTful routes for CRUD operations
- Server actions for form mutations
- Streaming responses for LLM chat

### Database Strategy
- Postgres with pgvector extension
- Drizzle ORM for type safety
- Raw SQL (`client.unsafe`) for vector operations only

### Authentication Flow
- Cookie-based JWT sessions
- No external auth provider (self-managed)
- Session validation on every request via middleware

### Memory System Architecture
- LLM outputs memory markers: `[MEMORY: content | tags]`
- Server parses markers using regex
- Duplicate detection via vector similarity (distance < 0.15)
- Embeddings stored as pgvector type

## Key Conventions

### Error Handling
- Non-fatal failures for external services (embeddings, LLM)
- Fallback to local storage in development
- Always return user-friendly error messages

### Session Management
- Always use `getSession()` / `getUser()` - never read cookies directly
- Session cached per request (React `cache()`)
- Auto-generated secrets in dev, required in production

### Vector Operations
- Use `client.unsafe()` for vector queries
- Validate vector data (finite numbers only)
- Distance threshold: 0.65 for relevance, 0.15 for duplicates

### Code Organization
- API routes: thin controllers, delegate to `lib/`
- Business logic: `lib/db/queries.ts`
- Validation: Zod schemas inline or in middleware
- UI components: separate by feature in `components/`

## Performance Patterns

### Request Caching
- `getSession()` cached per request
- SWR for client-side data fetching
- Server component caching by default

### Database Optimization
- Vector indexes on `memories.embedding`
- Limit queries (`.limit(10)`)
- Batch operations where possible

### LLM Optimization
- Two-step memory retrieval: vector search → fallback
- Context window management (max 50 history items)
- Streaming responses for real-time feedback
