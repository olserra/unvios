import { POST } from "@/app/api/llm/chat/route";
import * as session from "@/lib/auth/session";
import * as auth from "@/lib/db/queries";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("@/lib/db/queries", async () => {
  const getUser = vi.fn();
  const getMemoriesGrouped = vi.fn(() => []);
  const getNearestMemoriesForUser = vi.fn(() => []);
  return {
    getUser,
    getMemoriesGrouped,
    getNearestMemoriesForUser,
  };
});

vi.mock("@/lib/auth/session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/db/drizzle", () => ({
  db: {
    select: vi.fn(),
  },
  client: {
    unsafe: vi.fn(),
  },
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("LLM Chat API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.LLM_API_URL = "http://test.llm.api";
  });

  afterEach(() => {
    delete process.env.LLM_API_URL;
  });

  test("returns 401 when user is not authenticated", async () => {
    vi.mocked(session.getSession).mockResolvedValueOnce(null);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        message: "Test message",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Not authenticated",
    });
  });

  test("processes chat message and returns LLM response", async () => {
    vi.mocked(session.getSession).mockResolvedValueOnce({} as any);
    vi.mocked(auth.getUser).mockResolvedValueOnce({
      id: 1,
      name: "Test User",
    } as any);

    // Mock LLM API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: async () => ({
        choices: [
          {
            message: {
              content: "Test response",
            },
          },
        ],
      }),
    });

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        message: "Test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("output");
    expect(data.output).toContain("Test response");
  });

  test("validates input message", async () => {
    vi.mocked(session.getSession).mockResolvedValueOnce({} as any);
    vi.mocked(auth.getUser).mockResolvedValueOnce({
      id: 1,
      name: "Test User",
    } as any);

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        message: "",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("Message is required");
  });

  test("handles LLM API errors", async () => {
    vi.mocked(session.getSession).mockResolvedValueOnce({} as any);
    vi.mocked(auth.getUser).mockResolvedValueOnce({
      id: 1,
      name: "Test User",
    } as any);

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve("LLM call failed"),
    });

    const request = new NextRequest("http://localhost", {
      method: "POST",
      body: JSON.stringify({
        message: "Test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error");
    expect(data.error).toContain("LLM call failed");
  });
});
