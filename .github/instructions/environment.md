# Environment Variables

## Required in Production

### `POSTGRES_URL`
**Purpose**: Database connection string

**Format**: `postgresql://user:password@host:port/database`

**Example**: `postgresql://postgres:secret@localhost:5432/unvios`

**Used in**: `lib/db/drizzle.ts`

**Failure mode**: App won't start without valid connection

---

### `AUTH_SECRET`
**Purpose**: JWT session signing secret

**Format**: Base64 string (minimum 32 characters recommended)

**Example**: `openssl rand -base64 32`

**Aliases**: Also checks `NEXTAUTH_SECRET`

**Used in**: `lib/auth/session.ts`

**Failure mode**: 
- Production: throws error if missing
- Development: auto-generates temporary secret (sessions reset on restart)

**Security**: Never commit to version control. Use `.env.local`

---

## Optional Services

### Embedding Service

#### `EMBEDDING_API_URL`
**Purpose**: Embedding API endpoint for vector generation

**Default**: `https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2`

**Example**: `https://api.openai.com/v1/embeddings`

**Used in**: 
- `app/api/memories/route.ts`
- `app/api/llm/chat/route.ts`

**Fallback**: Memories saved without embeddings (no vector search)

#### `EMBEDDING_API_KEY`
**Purpose**: Bearer token for embedding API

**Aliases**: Also checks `HUGGING_FACE_TOKEN`

**Example**: `hf_xxxxxxxxxxxxxxxxxxxxx`

**Used in**: Embedding API requests

**Fallback**: Falls back to no embeddings if missing

---

### LLM Service

#### `LLM_API_URL`
**Purpose**: LLM chat endpoint

**Examples**:
- OpenAI: `https://api.openai.com/v1/chat/completions`
- Local: `http://localhost:11434/api/generate`
- HuggingFace: `https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf`

**Used in**: `app/api/llm/chat/route.ts`

**Failure mode**: Chat endpoint returns 500 error

**Detection**: OpenAI-style if URL contains:
- `api.openai.com`
- `/v1/chat/completions`

#### `LLM_API_KEY`
**Purpose**: Bearer token for LLM API

**Aliases**: Also checks `HUGGING_FACE_TOKEN`

**Example**: `sk-xxxxxxxxxxxxxxxxxxxxx` (OpenAI format)

**Used in**: LLM API requests (Authorization header)

**Fallback**: Some APIs work without auth (local models)

#### `LLM_MODEL`
**Purpose**: Model identifier for OpenAI-style APIs

**Default**: `gpt-3.5-turbo`

**Examples**:
- `gpt-4`
- `gpt-4-turbo-preview`
- `claude-3-opus-20240229`

**Used in**: OpenAI-format request payloads only

---

## Development Flags

### `USE_LOCAL_MEMORIES`
**Purpose**: Use file-based memory storage instead of database

**Values**: `1` (enabled) or unset (disabled)

**Example**: `USE_LOCAL_MEMORIES=1`

**Storage**: `dev-memories.json` in project root

**Used in**:
- `app/api/memories/route.ts`
- All memory CRUD routes

**Use cases**:
- Local development without database
- Testing memory logic
- Quick prototyping

**Limitations**:
- No vector embeddings
- Data in plain JSON
- Not for production

---

### `NODE_ENV`
**Purpose**: Runtime environment

**Values**: `development`, `production`, `test`

**Auto-set by**: Next.js (`pnpm dev` → `development`)

**Effects**:
- Development: verbose logging, auto-generated secrets
- Production: requires all secrets, less logging

---

## Next.js Variables

### `NEXT_PUBLIC_SITE_URL`
**Purpose**: Public site URL for metadata/OG tags

**Default**: `http://localhost:3000`

**Example**: `https://unvios.com`

**Used in**: `app/layout.tsx` (metadata generation)

**Public**: Exposed to browser (prefix `NEXT_PUBLIC_`)

---

## Payment Integration (Future)

### `STRIPE_SECRET_KEY`
**Purpose**: Stripe API key for payment processing

**Example**: `sk_test_xxxxxxxxxxxxxxxxxxxxx`

**Used in**: `app/api/stripe/` (when implemented)

### `STRIPE_WEBHOOK_SECRET`
**Purpose**: Verify Stripe webhook signatures

**Example**: `whsec_xxxxxxxxxxxxxxxxxxxxx`

**Used in**: `app/api/stripe/webhook/route.ts`

---

## Example .env.local

```bash
# Database (required)
POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/unvios

# Auth (required in production)
AUTH_SECRET=your-secret-here-use-openssl-rand-base64-32

# Embedding service (optional)
EMBEDDING_API_URL=https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2
EMBEDDING_API_KEY=hf_your_token_here

# LLM service (optional)
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=sk-your-openai-key-here
LLM_MODEL=gpt-4-turbo-preview

# Development
USE_LOCAL_MEMORIES=1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Validation Checklist

Before deploying:

- [ ] `POSTGRES_URL` connects successfully
- [ ] `AUTH_SECRET` is set and >= 32 characters
- [ ] `LLM_API_URL` and `LLM_API_KEY` tested (if using chat)
- [ ] `EMBEDDING_API_URL` and `EMBEDDING_API_KEY` tested (if using embeddings)
- [ ] No secrets in `.env` (use `.env.local` or hosting platform secrets)
- [ ] `.env.local` in `.gitignore`

---

## Adding New Variables

When adding a new environment variable:

1. **Document it** in this file with:
   - Purpose
   - Format/example
   - Used in (file location)
   - Failure mode/fallback
   - Required vs optional

2. **Add fallback** in code:
   ```typescript
   const apiUrl = process.env.MY_API_URL || "http://default-url";
   ```

3. **Update README.md** if user-facing

4. **Add to example** `.env.example` file (without values)

5. **Consider prefix**: Use `NEXT_PUBLIC_` only if needed in browser
