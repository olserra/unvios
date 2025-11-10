import { DELETE } from "@/app/api/memories/[id]/route";
import { GET, POST } from "@/app/api/memories/route";
import * as db from "@/lib/db/drizzle";
import * as auth from "@/lib/db/queries";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/db/queries", async () => {
  const getUser = vi.fn();
  const getSession = vi.fn();
  const getMemoriesGrouped = vi.fn();
  const getNearestMemoriesForUser = vi.fn();
  return {
    getUser,
    getSession,
    getMemoriesGrouped,
    getNearestMemoriesForUser,
  };
});

vi.mock("@/lib/db/drizzle", async () => {
  return {
    db: {
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
      update: vi.fn().mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      }),
      delete: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{ id: 1 }]),
        }),
      }),
    },
    client: {
      unsafe: vi.fn(),
    },
  };
});

vi.mock("@/lib/db/drizzle", () => {
  const mockDelete = vi.fn(() => ({
    where: vi.fn(() => ({
      returning: vi.fn(() => Promise.resolve([{ id: 1 }])),
    })),
  }));
  const mockSelect = vi.fn(() => ({
    orderBy: vi.fn(() => Promise.resolve([])),
  }));
  const mockInsert = vi.fn(() => ({
    values: vi.fn(() => ({ returning: vi.fn(() => Promise.resolve([])) })),
  }));

  return {
    db: {
      select: mockSelect,
      insert: mockInsert,
      delete: mockDelete,
    },
    client: {
      unsafe: vi.fn(),
    },
  };
});

describe("Memories API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/memories", () => {
    test("returns 401 when user is not authenticated", async () => {
      vi.mocked(auth.getUser).mockResolvedValueOnce(null);

      const response = await GET();

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: "User not authenticated",
      });
    });

    test("returns memories for authenticated user", async () => {
      vi.mocked(auth.getUser).mockResolvedValueOnce({
        id: 1,
        name: "Test User",
      } as any);

      vi.mocked(db.db.select).mockResolvedValueOnce([
        {
          id: 1,
          content: "Test memory",
          category: "general",
          tags: '["test"]',
          userId: 1,
          createdAt: new Date(),
        },
      ] as any);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("grouped");
      expect(data).toHaveProperty("items");
    });
  });

  describe("POST /api/memories", () => {
    test("returns 401 when user is not authenticated", async () => {
      vi.mocked(auth.getUser).mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          content: "Test memory",
          category: "general",
          tags: ["test"],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: "Not authenticated",
      });
    });

    test("creates memory for authenticated user", async () => {
      vi.mocked(auth.getUser).mockResolvedValueOnce({
        id: 1,
        name: "Test User",
      } as any);

      vi.mocked(db.db.insert).mockResolvedValueOnce([
        {
          id: 1,
          content: "Test memory",
          category: "general",
          tags: '["test"]',
          userId: 1,
          createdAt: new Date(),
        },
      ] as any);

      const request = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          content: "Test memory",
          category: "general",
          tags: ["test"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("memory");
    });
  });

  describe("DELETE /api/memories/[id]", () => {
    test("returns 401 when user is not authenticated", async () => {
      vi.mocked(auth.getUser).mockResolvedValueOnce(null);

      const response = await DELETE(new NextRequest("http://localhost"), {
        params: { id: "1" },
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({
        error: "Not authenticated",
      });
    });

    test("deletes memory for authenticated user", async () => {
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        passwordHash: "hashed",
        role: "member",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        mobileCountryCode: null,
        mobileNumber: null,
        mobileVerified: null,
        mobileVerificationToken: null,
        mobileVerificationExpires: null,
      };

      // Mock getUser for both POST and DELETE requests
      vi.mocked(auth.getUser).mockResolvedValue(mockUser);

      // Enable dev storage mode
      process.env.USE_LOCAL_MEMORIES = "1";

      // Create a test memory first
      const postRequest = new NextRequest("http://localhost", {
        method: "POST",
        body: JSON.stringify({
          content: "Test memory",
          category: "general",
          tags: ["test"],
        }),
      });

      const postResponse = await POST(postRequest);
      const { memory } = await postResponse.json();

      // Now try to delete it
      const response = await DELETE(new NextRequest("http://localhost"), {
        params: { id: memory.id.toString() },
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual({ ok: true });
    });
  });
});
