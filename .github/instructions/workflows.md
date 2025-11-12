# Development Workflows

## Daily Development

### Starting Development Server

```bash
pnpm dev
```

**What it does**: 
- Starts Next.js dev server on `http://localhost:3000`
- Enables Turbopack for fast refresh
- Watches for file changes

**Access**:
- App: http://localhost:3000
- API routes: http://localhost:3000/api/*

---

## Database Workflows

### Initial Setup

```bash
pnpm db:setup
```

**What it does**:
- Creates database and tables
- Runs initial migrations
- Sets up pgvector extension
- Creates indexes

**Script**: `lib/db/setup.ts`

**Requirements**:
- `POSTGRES_URL` set in `.env.local`
- PostgreSQL running
- Database exists (or user has CREATE DATABASE permission)

---

### Running Migrations

```bash
pnpm db:migrate
```

**What it does**:
- Applies new schema changes from `lib/db/migrations/`
- Uses Drizzle Kit migration system

**When to run**:
- After pulling new schema changes
- After creating new migrations

---

### Generating Migrations

```bash
pnpm db:generate
```

**What it does**:
- Compares `lib/db/schema.ts` with database
- Generates SQL migration files in `lib/db/migrations/`

**When to run**:
- After modifying `lib/db/schema.ts`

**Workflow**:
1. Edit `lib/db/schema.ts`
2. Run `pnpm db:generate`
3. Review generated migration in `lib/db/migrations/`
4. Run `pnpm db:migrate` to apply
5. Commit migration files

---

### Seeding Database

```bash
pnpm db:seed
```

**What it does**:
- Inserts test users and memories
- Uses data from `lib/devMemoriesSeed.json`

**Script**: `lib/db/seed.ts`

**Use cases**:
- Fresh database setup
- Testing with realistic data
- Demo environments

---

### Development Seed (with reset)

```bash
pnpm dev:seed
```

**What it does**:
- Truncates existing data
- Seeds fresh test data
- Faster than full reset

**Warning**: Deletes all existing data

---

### Reset and Seed

```bash
pnpm db:reset-seed
```

**What it does**:
- Drops all tables
- Recreates schema
- Seeds test data

**Warning**: Complete data loss. Use only in development.

---

### Database Studio

```bash
pnpm db:studio
```

**What it does**:
- Opens Drizzle Studio UI
- Browse/edit database via web interface
- Usually runs on http://localhost:4983

**Use cases**:
- Inspect data
- Debug queries
- Manual data edits

---

## Testing Workflows

### Running Tests

```bash
pnpm test
```

**What it does**:
- Runs Vitest unit tests
- Watches for changes

**Config**: `vitest.config.ts`

**Test locations**:
- `*.test.ts` files in any directory
- `tests/` directory

---

### E2E Tests (Playwright)

```bash
pnpm test:e2e
```

**What it does**:
- Runs Playwright browser tests
- Tests user flows end-to-end

**Config**: `playwright.config.ts`

**Test location**: `tests/` directory

---

### Type Checking

```bash
pnpm type-check
```

**What it does**:
- Runs TypeScript compiler (`tsc`)
- Checks for type errors without building

**Config**: `tsconfig.json`

**CI usage**: `tsconfig.ci.json` for stricter checks

---

## Code Quality

### Linting

```bash
pnpm lint
```

**What it does**:
- Runs ESLint on all files
- Checks for code style issues

**Auto-fix**:
```bash
pnpm lint:fix
```

---

### Formatting

```bash
pnpm format
```

**What it does**:
- Runs Prettier on all files
- Formats code consistently

**Check only** (no writes):
```bash
pnpm format:check
```

---

## Building & Production

### Build for Production

```bash
pnpm build
```

**What it does**:
- Type-checks code
- Bundles Next.js app
- Optimizes assets
- Generates `.next/` output

**Output**: `.next/` directory

---

### Start Production Server

```bash
pnpm start
```

**What it does**:
- Serves production build
- Requires `pnpm build` first

**Port**: http://localhost:3000 (configurable via PORT env var)

---

## Utility Scripts

### Backfill Embeddings

```bash
pnpm backfill-embeddings
```

**What it does**:
- Finds memories without embeddings
- Computes and stores embeddings
- Shows progress

**Script**: `scripts/backfill-embeddings.ts`

**Requirements**:
- `EMBEDDING_API_URL` configured
- `EMBEDDING_API_KEY` configured

**Use cases**:
- After enabling embeddings on existing data
- After migration

---

## Development Tips

### Working Without Database

Set in `.env.local`:
```bash
USE_LOCAL_MEMORIES=1
```

**Effects**:
- Memory data stored in `dev-memories.json`
- No database required
- No embeddings/vector search

---

### Testing LLM Integration

1. Set environment variables:
   ```bash
   LLM_API_URL=https://api.openai.com/v1/chat/completions
   LLM_API_KEY=sk-your-key
   LLM_MODEL=gpt-3.5-turbo
   ```

2. Start dev server:
   ```bash
   pnpm dev
   ```

3. Test chat endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/llm/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"I like hiking"}'
   ```

---

### Testing Embeddings

1. Set environment variables:
   ```bash
   EMBEDDING_API_URL=https://api-inference.huggingface.co/embeddings/...
   EMBEDDING_API_KEY=hf_your_token
   ```

2. Create a memory via API:
   ```bash
   curl -X POST http://localhost:3000/api/memories \
     -H "Content-Type: application/json" \
     -d '{"content":"Test memory","tags":["test"]}'
   ```

3. Check database for `embedding` column populated

---

### Debugging Sessions

Check session cookie:
```bash
# In browser console
document.cookie
```

Decode JWT (dev only):
```bash
# Copy token from cookie, then:
echo "your-jwt-token" | jwt decode -
```

---

### Resetting Auth Secret

1. Delete from `.env.local`:
   ```bash
   # AUTH_SECRET=...  # Comment out or delete
   ```

2. Restart dev server - new secret auto-generated

3. All existing sessions invalidated

---

## Common Workflows

### Adding a New Feature

1. **Create feature branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** in appropriate directories

3. **Run type check**:
   ```bash
   pnpm type-check
   ```

4. **Run linter**:
   ```bash
   pnpm lint:fix
   ```

5. **Test locally**:
   ```bash
   pnpm dev
   ```

6. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

---

### Changing Database Schema

1. **Edit schema**:
   ```typescript
   // lib/db/schema.ts
   export const myNewTable = pgTable("my_table", {
     id: serial("id").primaryKey(),
     // ...
   });
   ```

2. **Generate migration**:
   ```bash
   pnpm db:generate
   ```

3. **Review migration**:
   ```bash
   cat lib/db/migrations/0001_my_migration.sql
   ```

4. **Apply migration**:
   ```bash
   pnpm db:migrate
   ```

5. **Update queries** in `lib/db/queries.ts` if needed

6. **Test** with fresh seed:
   ```bash
   pnpm db:reset-seed
   ```

---

### Debugging Production Issues

1. **Check environment variables** in hosting platform

2. **Review logs** (Vercel/production logs)

3. **Reproduce locally**:
   ```bash
   pnpm build
   pnpm start
   ```

4. **Test API endpoints**:
   ```bash
   curl -v http://localhost:3000/api/memories
   ```

5. **Check database** via `pnpm db:studio`

---

## CI/CD Workflows

### GitHub Actions (if configured)

Typical workflow:
1. Push to branch
2. CI runs: `type-check`, `lint`, `test`
3. Build preview (Vercel)
4. Merge to main → deploy production

**Config**: `.github/workflows/` (when added)

---

## Performance Profiling

### Next.js Build Analysis

```bash
ANALYZE=true pnpm build
```

**Output**: Bundle size analysis

### React DevTools Profiler

1. Install React DevTools extension
2. Open Profiler tab
3. Record session
4. Identify slow components

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

### Database Connection Failed

```bash
# Check Postgres is running
pg_isready

# Test connection
psql $POSTGRES_URL
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
pnpm install

# Rebuild
pnpm build
```

### TypeScript Errors After Pull

```bash
# Rebuild TypeScript
pnpm type-check

# Clear tsbuildinfo
rm tsconfig.tsbuildinfo
```
