import { db } from "@/lib/db/drizzle";
import { memories, users } from "@/lib/db/schema";

export async function clearTestDatabase() {
  await db.delete(memories);
  await db.delete(users);
}

export async function createTestUser() {
  const [user] = await db
    .insert(users)
    .values({
      name: "Test User",
      email: "test@example.com",
      passwordHash: "hashed_password",
    })
    .returning();
  return user;
}

export async function createTestMemory(userId: number) {
  const [memory] = await db
    .insert(memories)
    .values({
      content: "Test memory",
      category: "general",
      tags: JSON.stringify(["test"]),
      userId,
    })
    .returning();
  return memory;
}

export function mockNextRequest(method: string, body?: any) {
  return new Request("http://localhost", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function mockLLMResponse(content: string) {
  return {
    ok: true,
    headers: {
      get: () => "application/json",
    },
    json: async () => ({
      choices: [
        {
          message: {
            content,
          },
        },
      ],
    }),
  };
}
