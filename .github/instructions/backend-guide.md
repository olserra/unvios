# Backend Development Guide

## API Routes

### Memory Management

#### GET /api/memories
**Purpose**: Fetch all memories for authenticated user

**Response**:
```json
{
  "grouped": {
    "personal": [/* Memory[] */],
    "work": [/* Memory[] */]
  },
  "items": [/* flat Memory[] */]
}
```

**Memory shape**:
```typescript
{
  id: number;
  userId: number;
  content: string;
  tags: string[];        // Parsed from JSON
  category: string;
  createdAt: string;
}
```

**Implementation**: `app/api/memories/route.ts::GET`

#### POST /api/memories
**Purpose**: Create new memory

**Request**:
```json
{
  "content": "User likes hiking",
  "category": "personal",     // Optional, defaults to "general"
  "tags": ["hobby", "outdoor"]  // Optional, max 3
}
```

**Response**:
```json
{
  "memory": { /* Memory object */ }
}
```

**Side effects**:
- Computes embedding if `EMBEDDING_API_URL` configured
- Stores vector in `embedding` column
- Non-fatal if embedding fails

**Implementation**: `app/api/memories/route.ts::POST`

#### PUT /api/memories/:id
**Purpose**: Update existing memory

**Request**: Same as POST

**Implementation**: `app/api/memories/[id]/route.ts::PUT`

#### DELETE /api/memories/:id
**Purpose**: Delete memory

**Response**: `{ ok: true }`

**Implementation**: `app/api/memories/[id]/route.ts::DELETE`

### LLM Chat

#### POST /api/llm/chat
**Purpose**: Chat with LLM, auto-save memories

**Request**:
```json
{
  "message": "I like pasta",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response**:
```json
{
  "output": "Got it! [MEMORY: User likes pasta | food, preference]"
}
```

**Flow**:
1. Embed user message
2. Vector search for relevant memories
3. Build prompt with memory context
4. Call LLM
5. Parse memory markers from output
6. Check for duplicates (vector distance < 0.15)
7. Save new memories to DB
8. Strip markers from output
9. Return clean response

**Memory marker format**: `[MEMORY: content | tag1, tag2, tag3]`

**Implementation**: `app/api/llm/chat/route.ts`

## Database Layer

### Schema
**Location**: `lib/db/schema.ts`

**Key tables**:
```typescript
memories {
  id: serial
  userId: integer → users.id
  content: text
  tags: text              // JSON-encoded string[]
  category: varchar(100)
  createdAt: timestamp
  embedding: vector       // pgvector type (added via migration)
}

users {
  id: serial
  name: varchar(100)
  email: varchar(255) unique
  passwordHash: text
  createdAt: timestamp
  deletedAt: timestamp    // Soft delete
}
```

### Query Functions
**Location**: `lib/db/queries.ts`

#### `getUser()`
Returns authenticated user from session cookie.

**Returns**: `User | null`

**Usage**:
```typescript
const user = await getUser();
if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

#### `getMemoriesGrouped()`
Fetch memories for authenticated user, grouped by category.

**Returns**: `Record<string, Memory[]>`

**Implementation**:
- Fetches from `memories` table where `userId` matches
- Parses `tags` from JSON string to array
- Groups by `category` field

#### `getNearestMemoriesForUser(userId, vector, limit)`
Vector similarity search using pgvector.

**Parameters**:
- `userId`: number
- `vector`: number[] (embedding)
- `limit`: number (default 10)

**Returns**: `Memory[]` with `distance` field

**SQL**:
```sql
SELECT *, 1 - (embedding <=> $1::vector) AS distance
FROM memories
WHERE user_id = $2 AND embedding IS NOT NULL
ORDER BY embedding <=> $1::vector
LIMIT $3
```

**Filters**: Only returns memories with distance > 0.65 (relevance threshold)

### Vector Operations

**CRITICAL**: Vector operations use raw SQL via `client.unsafe()`:

```typescript
// Storing embeddings
const vecStr = "[" + vec.join(",") + "]";
await client.unsafe(
  `UPDATE memories SET embedding = $1::vector WHERE id = $2`,
  [vecStr, memoryId]
);

// Searching
await client.unsafe(
  `SELECT *, embedding <=> $1::vector AS distance FROM memories WHERE user_id = $2`,
  [vecStr, userId]
);
```

**Security**: Always validate vector contains only finite numbers:
```typescript
if (!vec.every(n => typeof n === "number" && Number.isFinite(n))) {
  throw new Error("Invalid vector data");
}
```

## Authentication

### Session Management
**Location**: `lib/auth/session.ts`

#### `getSession()`
Cached function to get current session from cookies.

**Returns**: `SessionData | null`

**Type**:
```typescript
{
  user: { id: number };
  expires: string;
}
```

#### `setSession(user)`
Creates session cookie for user.

**Parameters**: `NewUser` (with `id`)

**Cookie settings**:
- `httpOnly: true`
- `secure: true` (production only)
- `sameSite: 'lax'`
- Expires in 24 hours

#### `signToken(payload)` / `verifyToken(token)`
JWT operations using `HS256` algorithm.

**Secret**: From `AUTH_SECRET` env var (required in production)

### Middleware
**Location**: `lib/auth/middleware.ts`

#### `validatedAction(schema, action)`
Wraps server actions with Zod validation.

**Usage**:
```typescript
export const createMemory = validatedAction(
  z.object({ content: z.string() }),
  async (data, formData) => {
    // data is validated
  }
);
```

#### `validatedActionWithUser(schema, action)`
Adds auth check + validation.

**Usage**:
```typescript
export const updateProfile = validatedActionWithUser(
  schema,
  async (data, formData, user) => {
    // user is guaranteed to exist
  }
);
```

## External Services

### Embedding API
**Configuration**:
- `EMBEDDING_API_URL` - API endpoint
- `EMBEDDING_API_KEY` - Bearer token

**Default**: Hugging Face Inference API with `sentence-transformers/all-MiniLM-L6-v2`

**Request**:
```json
{
  "inputs": ["text to embed"]
}
```

**Response formats**:
```json
// Format 1: Direct array
[0.123, 0.456, ...]

// Format 2: Object with embedding
{ "embedding": [0.123, 0.456, ...] }

// Format 3: Nested array
[[0.123, 0.456, ...]]
```

**Implementation**: `embedText()` in `app/api/llm/chat/route.ts`

### LLM API
**Configuration**:
- `LLM_API_URL` - API endpoint
- `LLM_API_KEY` - Bearer token
- `LLM_MODEL` - Model name (for OpenAI-style APIs)

**Detection**: OpenAI-style if URL contains `api.openai.com` or `/v1/chat/completions`

**OpenAI payload**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ]
}
```

**Generic payload**:
```json
{
  "inputs": "prompt text"
}
```

**Implementation**: `callLLM()` in `app/api/llm/chat/route.ts`

## Conventions

### Error Handling
```typescript
try {
  // Try database operation
  const result = await db.select()...
} catch (error) {
  console.debug("DB failed, using fallback", error);
  // Fall back to dev store
  return await dev.listMemories();
}
```

**Non-fatal failures**:
- Embedding computation
- Vector search
- LLM calls

**Fatal failures**:
- User not authenticated (401)
- Invalid input (400)
- Database unavailable AND no fallback (500)

### Input Validation

Always use Zod schemas:
```typescript
const schema = z.object({
  content: z.string().min(1).max(10000),
  tags: z.array(z.string().max(50)).max(10).optional()
});

const validation = schema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    { error: validation.error.errors[0].message },
    { status: 400 }
  );
}
```

### Memory Parsing

**Regex**: `/\[MEMORY:\s*(.*?)\s*\|\s*(.*?)\]/g`

**Example**:
```
Input: "Great! [MEMORY: User likes pasta | food, preference, italian]"
Extracted: { content: "User likes pasta", tags: ["food", "preference", "italian"] }
```

**Validation before saving**:
- Content length >= 10 characters
- Tags limited to first 3
- Tags trimmed and filtered (no empty strings)
- Duplicate check via vector similarity

### Tags Storage

**In database**: JSON-encoded string
```typescript
JSON.stringify(["tag1", "tag2", "tag3"])
```

**In API responses**: Parsed array
```typescript
tags: JSON.parse(row.tags || "[]")
```

**Frontend contract**: Always send/receive arrays

## Development Fallbacks

### Local Memory Store
**Trigger**: `USE_LOCAL_MEMORIES=1` env var

**Location**: `lib/devMemories.ts`

**Storage**: `dev-memories.json` in project root

**API**: Matches database interface
- `listMemories()`
- `getMemory(id)`
- `createMemory(data)`
- `updateMemory(id, data)`
- `deleteMemory(id)`

**Auto-ID generation**: `Math.max(...ids) + 1`

### Secret Generation
**Trigger**: Missing `AUTH_SECRET` in development

**Behavior**: Auto-generates random 32-byte secret

**Warning**: Sessions invalid after restart

## Testing Patterns

No formal test suite exists. For testing:

1. **Scripts**: Use `scripts/` for DB operations
   - `scripts/backfill-embeddings.ts` - Example vector ops
   - `scripts/dev-seed.ts` - Seed test data

2. **Manual testing**: Use dev environment
   - `USE_LOCAL_MEMORIES=1` for isolated testing
   - Check `dev-memories.json` for results

3. **Type safety**: Rely on TypeScript + Drizzle types
