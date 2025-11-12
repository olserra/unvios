# Contributing Guidelines

## Code Style

### Language
**ALL code, comments, and user-facing text MUST be in English.**
- Variable names: English only
- Function names: English only  
- Comments: English only
- UI strings: English only
- Error messages: English only
- Documentation: English only

No Portuguese or other languages permitted in codebase.

---

## File Naming

### Components
- React components: PascalCase with `.tsx` extension
- Examples: `MemoryEditor.tsx`, `ChatInterface.tsx`

### Utilities & Helpers
- Utility files: camelCase with `.ts` extension
- Examples: `memoryParser.ts`, `devMemories.ts`

### API Routes
- Use Next.js convention: `route.ts` for endpoints
- Dynamic routes: `[id]/route.ts`

### Configuration
- Kebab-case for config: `drizzle.config.ts`, `vitest.config.ts`

---

## Code Organization

### Imports
Order imports by:
1. External packages
2. Internal absolute imports (`@/...`)
3. Relative imports
4. Type imports (if separate)

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";

import type { Memory } from "./types";
```

---

### Component Structure

```typescript
// 1. Imports
import { useState } from "react";

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function Component({ title }: Props) {
  // State
  const [value, setValue] = useState("");
  
  // Handlers
  const handleClick = () => {
    // ...
  };
  
  // Render
  return <div>{title}</div>;
}

// 4. Sub-components (if small)
function SubComponent() {
  return null;
}
```

---

## TypeScript Conventions

### Type vs Interface
- **Prefer `type`** for most cases
- Use `interface` only for extendable contracts

```typescript
// Good
type Memory = {
  id: number;
  content: string;
};

// Also acceptable for extensibility
interface BaseProps {
  className?: string;
}
```

### Avoid `any`
```typescript
// Bad
function process(data: any) { }

// Good
function process(data: unknown) {
  if (typeof data === "string") {
    // ...
  }
}
```

### Use strict null checks
```typescript
// Good
const user: User | null = await getUser();
if (!user) return;

// Bad
const user = await getUser()!; // Avoid !
```

---

## React Patterns

### Server vs Client Components

**Default to Server Components** - only add `'use client'` when needed:
- State hooks (`useState`, `useReducer`)
- Effect hooks (`useEffect`, `useLayoutEffect`)
- Browser APIs (`window`, `document`)
- Event handlers that need client state

```typescript
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component (when needed)
'use client';
import { useState } from "react";

export default function Interactive() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Async Server Components
```typescript
// Good - fetch directly in component
export default async function Page() {
  const user = await getUser();
  return <Profile user={user} />;
}
```

### Props Destructuring
```typescript
// Good
function Component({ title, description }: Props) {
  return <div>{title}</div>;
}

// Avoid
function Component(props: Props) {
  return <div>{props.title}</div>;
}
```

---

## API Route Patterns

### Standard Structure
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth/session";
import { z } from "zod";

const schema = z.object({
  // Define schema
});

export async function POST(req: NextRequest) {
  // 1. Auth check
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // 2. Parse & validate
  const body = await req.json();
  const validation = schema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors[0].message },
      { status: 400 }
    );
  }
  
  // 3. Business logic
  const { data } = validation;
  const result = await doSomething(data);
  
  // 4. Response
  return NextResponse.json({ result });
}
```

### Error Handling
```typescript
try {
  // Try database
  const result = await db.query(...);
  return NextResponse.json({ result });
} catch (error) {
  console.debug("Operation failed, using fallback", error);
  // Fallback logic
  const fallback = await getFallback();
  return NextResponse.json({ result: fallback });
}
```

---

## Database Patterns

### Query Functions
Keep in `lib/db/queries.ts`:

```typescript
export async function getMemoriesForUser(userId: number) {
  return await db
    .select()
    .from(memories)
    .where(eq(memories.userId, userId))
    .orderBy(desc(memories.createdAt));
}
```

### Raw SQL (Vector Operations Only)
```typescript
// Only use client.unsafe for vector ops
const vecStr = "[" + vec.join(",") + "]";
await client.unsafe(
  `UPDATE memories SET embedding = $1::vector WHERE id = $2`,
  [vecStr, id]
);
```

### Validation Before Raw SQL
```typescript
// ALWAYS validate vector data
if (!vec.every(n => typeof n === "number" && Number.isFinite(n))) {
  throw new Error("Invalid vector data");
}
```

---

## Comments

### When to Comment
- **Complex logic** that isn't self-explanatory
- **Business rules** that might be unclear
- **Workarounds** or temporary fixes
- **Security considerations**

### When NOT to Comment
- Self-documenting code
- Obvious functionality
- Restating the code

```typescript
// Bad - obvious
// Set user to null
const user = null;

// Good - explains why
// Session expired, clear user state to force re-auth
const user = null;
```

### Comment Style
```typescript
// Single line comments for brief notes

/**
 * Multi-line comments for functions with complex behavior.
 * Explain parameters, return values, side effects.
 */
function complexFunction() {
  // ...
}
```

---

## Naming Conventions

### Variables
- `camelCase` for variables and functions
- Descriptive names over abbreviations

```typescript
// Good
const userMemories = await getMemories();
const isAuthenticated = checkAuth();

// Avoid
const um = await getMemories();
const auth = checkAuth();
```

### Constants
- `SCREAMING_SNAKE_CASE` for true constants
- `camelCase` for config objects

```typescript
const MAX_TAGS = 3;
const API_TIMEOUT = 5000;

const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000
};
```

### Boolean Variables
Prefix with `is`, `has`, `should`, `can`:

```typescript
const isLoading = true;
const hasMemories = memories.length > 0;
const shouldFetch = !cache;
const canEdit = user?.role === "admin";
```

---

## Error Messages

### User-Facing
- Clear and actionable
- No technical jargon
- Suggest solutions

```typescript
// Good
"Please enter a memory with at least 10 characters"
"Your session has expired. Please log in again"

// Bad
"Invalid input"
"Auth error"
```

### Developer Logs
- Include context
- Use appropriate log level

```typescript
console.debug("Memory extraction:", { content, tags });
console.warn("Embedding API failed, skipping vector storage");
console.error("Database connection failed:", error);
```

---

## Git Workflow

### Branch Naming
```
feature/memory-search
fix/auth-cookie-expiry
refactor/database-queries
docs/api-documentation
```

### Commit Messages
Use conventional commits:

```
feat: add vector search to memories
fix: correct session expiration time
refactor: extract memory parsing logic
docs: update environment setup guide
chore: update dependencies
test: add memory parser tests
```

### Commit Scope
- Small, focused commits
- One logical change per commit
- Test before committing

---

## Pull Request Guidelines

### PR Title
Follow conventional commit format:
```
feat: add memory sharing feature
fix: resolve duplicate memory bug
```

### PR Description Template
```markdown
## What
Brief description of changes

## Why
Explanation of motivation

## How
Implementation details

## Testing
How this was tested

## Checklist
- [ ] Type check passes
- [ ] Linter passes
- [ ] Tested locally
- [ ] Updated documentation
```

---

## Architecture Decision Records (ADRs)

### When to Create ADR
Create ADR in `docs/adr/` for:
- Database schema changes
- Adding/changing external services
- Major refactoring
- New architectural patterns
- CI/CD changes

### ADR Format
**Filename**: `YYYY-MM-DD-brief-title.md`

**Structure**:
```markdown
# [Title]

**Date**: 2025-11-12
**Status**: Accepted | Proposed | Deprecated

## Context
What's the situation? What problem are we solving?

## Decision
What did we decide?

## Rationale
Why this decision? What alternatives did we consider?

## Consequences
What are the trade-offs? Migration steps?

## Next Steps
What needs to happen next?
```

---

## Testing Before Committing

### Pre-commit Checklist
```bash
# 1. Type check
pnpm type-check

# 2. Lint
pnpm lint

# 3. Format
pnpm format

# 4. Build
pnpm build

# 5. Test key flows manually
# - Auth flow
# - Memory CRUD
# - Chat functionality
```

---

## Documentation

### When to Update Docs
- Adding new env variables → update `environment.md`
- New API routes → update `backend-guide.md`
- New UI components → update `frontend-guide.md`
- Architecture changes → update `architecture.md` + create ADR
- New workflows → update `workflows.md`

### Keep README.md Current
- Update feature list
- Update setup instructions
- Update example .env

---

## Performance Considerations

### Database Queries
- Use `.limit()` on unbounded queries
- Add indexes for frequently queried columns
- Avoid N+1 queries

### React Performance
- Minimize client components
- Use Server Components for data fetching
- Memoize expensive computations

### API Routes
- Stream large responses
- Use pagination for lists
- Cache when appropriate

---

## Security Practices

### Input Validation
- **Always** validate with Zod schemas
- Never trust user input
- Sanitize before database operations

### Authentication
- Use `getUser()` / `getSession()` for auth checks
- Never skip auth on protected routes
- Validate session on every request

### Environment Variables
- Never commit secrets
- Use `.env.local` for local development
- Validate required vars at startup

### SQL Operations
- Use Drizzle ORM for all queries
- Only use `client.unsafe()` for vector operations
- Validate data before raw SQL

---

## Code Review Guidelines

### As Author
- Self-review before requesting review
- Provide context in PR description
- Test changes thoroughly
- Keep PRs focused and small

### As Reviewer
- Check for security issues
- Verify error handling
- Ensure tests pass
- Check documentation updates
- Be constructive and kind

---

## Getting Help

### Resources
- This documentation (`/.github/instructions/`)
- Existing code patterns
- TypeScript/Next.js docs

### Ask Questions
- When patterns are unclear
- Before major architectural changes
- When considering breaking changes
