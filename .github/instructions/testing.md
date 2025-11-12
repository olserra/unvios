# Testing & Quality Assurance

## Testing Philosophy

Unvios currently has minimal formal testing. Instead, we rely on:
- **TypeScript** for compile-time safety
- **Drizzle ORM types** for database query safety
- **Zod schemas** for runtime validation
- **Manual testing** in development
- **Scripts** for database operations validation

---

## Type Safety

### TypeScript Configuration

**Config**: `tsconfig.json`

**Strict mode enabled**:
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitAny": true
}
```

### Running Type Checks

```bash
pnpm type-check
```

**What it checks**:
- All `.ts` and `.tsx` files
- Import/export consistency
- Type mismatches
- Unused variables

**CI config**: `tsconfig.ci.json` (stricter)

---

## Runtime Validation

### Input Validation with Zod

All API routes use Zod schemas:

```typescript
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(10000),
  tags: z.array(z.string().max(50)).max(10).optional()
});

const result = schema.safeParse(body);
if (!result.success) {
  return NextResponse.json(
    { error: result.error.errors[0].message },
    { status: 400 }
  );
}
```

**Benefits**:
- Runtime type safety
- Automatic error messages
- API documentation via types

---

## Manual Testing Workflows

### Testing Memory Creation

1. **Start dev server**:
   ```bash
   pnpm dev
   ```

2. **Create memory via UI**:
   - Navigate to `/dashboard/memories`
   - Click "Add Memory"
   - Enter content and tags
   - Save

3. **Verify in database**:
   ```bash
   pnpm db:studio
   ```
   Check `memories` table

4. **Verify embedding** (if configured):
   - Check `embedding` column is populated
   - Non-null vector value

---

### Testing LLM Chat

1. **Configure LLM** in `.env.local`:
   ```bash
   LLM_API_URL=https://api.openai.com/v1/chat/completions
   LLM_API_KEY=sk-your-key
   ```

2. **Navigate to chat** at `/dashboard`

3. **Send test messages**:
   ```
   User: "I like hiking"
   Expected: LLM responds + saves memory
   
   User: "What do I like?"
   Expected: LLM recalls "hiking"
   ```

4. **Verify memory saved**:
   - Check `/dashboard/memories`
   - Should see new memory with tags

5. **Check memory marker stripping**:
   - LLM response should NOT contain `[MEMORY: ...]`

---

### Testing Vector Search

1. **Ensure embeddings enabled**:
   ```bash
   EMBEDDING_API_URL=...
   EMBEDDING_API_KEY=...
   ```

2. **Create memories** with related content:
   - "I love hiking in mountains"
   - "I enjoy outdoor activities"
   - "I work as a software engineer"

3. **Chat with LLM**:
   ```
   User: "What outdoor things do I like?"
   Expected: Recalls hiking/outdoor memories, NOT work memory
   ```

4. **Verify retrieval**:
   - Check server logs for `getNearestMemoriesForUser` calls
   - Distance should be > 0.65 for relevant memories

---

### Testing Duplicate Detection

1. **Create memory**: "I like pasta"

2. **Try similar memory** via chat:
   ```
   User: "I really enjoy pasta"
   Expected: LLM responds but doesn't save duplicate
   ```

3. **Check database**:
   - Should have only ONE pasta memory

4. **Check logs**:
   ```
   console.debug("Skipping duplicate memory: ...")
   ```

---

## Script-Based Testing

### Database Setup Test

```bash
pnpm db:setup
```

**Verify**:
- No errors
- Tables created
- Indexes created
- pgvector extension enabled

**Check**:
```sql
-- In psql or db:studio
SELECT * FROM pg_extension WHERE extname = 'vector';
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

---

### Seed Data Test

```bash
pnpm db:seed
```

**Verify**:
- Users created
- Memories created
- Tags populated

**Check**:
```bash
pnpm db:studio
```
Browse `users` and `memories` tables

---

### Embedding Backfill Test

```bash
pnpm backfill-embeddings
```

**What to check**:
- Progress output shows memories processed
- No errors for valid API keys
- Embeddings populated in database

**Verify**:
```sql
SELECT id, content, embedding IS NOT NULL as has_embedding 
FROM memories 
LIMIT 10;
```

---

## Code Quality Tools

### ESLint

**Config**: `.eslintrc.json`

**Run**:
```bash
pnpm lint
```

**Auto-fix**:
```bash
pnpm lint:fix
```

**Rules enforced**:
- No unused variables
- Consistent naming
- React hooks rules
- TypeScript best practices

---

### Prettier

**Config**: `.prettierrc`

**Run**:
```bash
pnpm format
```

**Check only**:
```bash
pnpm format:check
```

**Settings**:
- 2 spaces indentation
- Single quotes
- Trailing commas
- Print width: 80

---

## Integration Testing Patterns

### API Route Testing

Test API routes with curl:

```bash
# Test memory creation
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_TOKEN" \
  -d '{
    "content": "Test memory",
    "tags": ["test"]
  }'

# Test memory fetch
curl http://localhost:3000/api/memories \
  -H "Cookie: session=YOUR_SESSION_TOKEN"

# Test chat
curl -X POST http://localhost:3000/api/llm/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION_TOKEN" \
  -d '{
    "message": "Hello"
  }'
```

---

### Authentication Testing

**Test session creation**:
1. Register user at `/register`
2. Check cookie in browser DevTools
3. Decode JWT (dev only)
4. Verify expiration is 24h from now

**Test session validation**:
1. Create session
2. Make API request
3. Clear session cookie
4. Retry request → 401 Unauthorized

**Test expired session**:
1. Create session
2. Manually set `expires` to past date in JWT
3. Make request → 401 Unauthorized

---

## Error Handling Tests

### Database Failure

**Simulate**:
1. Stop Postgres: `brew services stop postgresql`
2. Make API request
3. Should fall back to dev store (if `USE_LOCAL_MEMORIES=1`)

**Expected**:
- Warning logged
- No 500 error
- Graceful degradation

---

### External Service Failure

**Simulate embedding failure**:
1. Set invalid `EMBEDDING_API_KEY`
2. Create memory
3. Should save without embedding

**Expected**:
- Memory saved
- `embedding` column is NULL
- Warning logged

**Simulate LLM failure**:
1. Set invalid `LLM_API_KEY`
2. Send chat message
3. Should return 500 with error message

**Expected**:
- Clear error message
- No crash
- Session still valid

---

## Security Testing

### Input Validation

**Test SQL injection protection**:
```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "content": "'; DROP TABLE memories; --"
  }'
```

**Expected**: Input sanitized by Drizzle ORM

**Test XSS protection**:
```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "content": "<script>alert(1)</script>"
  }'
```

**Expected**: Content escaped in UI

---

### Vector Validation

**Test invalid vector**:
```typescript
// In scripts/test-vector.ts
const invalidVec = [NaN, Infinity, "string"];
await getNearestMemoriesForUser(userId, invalidVec, 10);
```

**Expected**: Error thrown before SQL execution

---

## Performance Testing

### Memory Load Test

**Create many memories**:
```bash
# In scripts/load-test.ts
for (let i = 0; i < 1000; i++) {
  await db.insert(memories).values({
    userId: 1,
    content: `Test memory ${i}`,
    category: "test"
  });
}
```

**Test query performance**:
```bash
pnpm db:studio
# Run query manually and check execution time
```

---

### Vector Search Performance

**Test with many embeddings**:
1. Backfill 1000+ memories with embeddings
2. Run vector search via chat
3. Check response time

**Expected**: < 500ms for vector search

---

## Regression Testing Checklist

After changes, verify:

- [ ] Memory CRUD works (create, read, update, delete)
- [ ] LLM chat responds correctly
- [ ] Memory markers parsed and saved
- [ ] Duplicate detection prevents duplicates
- [ ] Vector search returns relevant results
- [ ] Authentication required for protected routes
- [ ] Input validation rejects invalid data
- [ ] Error handling graceful (no crashes)
- [ ] Dev fallback works when DB unavailable
- [ ] Type checking passes
- [ ] Linter passes
- [ ] Build completes successfully

---

## Future Testing Plans

### Unit Tests (Planned)

**Framework**: Vitest

**Priority areas**:
- Memory parsing regex
- Vector validation
- Session token verification
- Input sanitization

**Example**:
```typescript
// lib/memoryParser.test.ts
import { parseMemories } from "./memoryParser";

test("parses memory markers", () => {
  const text = "Hello [MEMORY: User likes pasta | food, preference]";
  const memories = parseMemories(text);
  
  expect(memories).toHaveLength(1);
  expect(memories[0].content).toBe("User likes pasta");
  expect(memories[0].tags).toEqual(["food", "preference"]);
});
```

---

### E2E Tests (Planned)

**Framework**: Playwright

**Priority flows**:
- User registration → login → create memory
- Chat with memory saving
- Memory search and filtering
- Memory editing and deletion

**Config**: `playwright.config.ts` (already present)

---

## Monitoring in Production

### Error Tracking

**Recommended**: Sentry or similar

**Key metrics**:
- API error rates
- Failed LLM calls
- Failed embedding requests
- Database query failures

---

### Performance Monitoring

**Recommended**: Vercel Analytics

**Key metrics**:
- API response times
- Memory query performance
- Vector search latency
- Page load times

---

## Debugging Tips

### Enable Debug Logging

In API routes:
```typescript
console.debug("Memory extraction:", { content, tags });
```

**View in dev**:
- Check terminal where `pnpm dev` runs
- Check browser console for client logs

---

### Inspect Database State

```bash
pnpm db:studio
```

Browse tables, run custom queries

---

### Test Specific Functions

Create test scripts in `scripts/`:

```typescript
// scripts/test-vector-search.ts
import { getNearestMemoriesForUser } from "@/lib/db/queries";

const testVec = [/* ... */];
const results = await getNearestMemoriesForUser(1, testVec, 10);
console.log(results);
```

Run:
```bash
tsx scripts/test-vector-search.ts
```
