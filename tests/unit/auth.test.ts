import {
  getSession,
  setSession,
  signToken,
  verifyToken,
} from "@/lib/auth/session";
import { cookies } from "next/headers";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("Auth Session", () => {
  type MockCookies = {
    get: ReturnType<typeof vi.fn>;
    getAll: ReturnType<typeof vi.fn>;
    has: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    size: number;
  };

  const mockCookies: MockCookies = {
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    size: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(cookies).mockReturnValue(mockCookies as any);
  });

  describe("getSession", () => {
    test("returns null when no session cookie", async () => {
      mockCookies.get.mockReturnValueOnce(undefined);
      const session = await getSession();
      expect(session).toBeNull();
    });

    test("returns null for invalid token", async () => {
      mockCookies.get.mockReturnValueOnce({ value: "invalid-token" });

      const session = await getSession();
      expect(session).toBeNull();
    });

    test("returns session for valid token", async () => {
      const mockSession = {
        user: { id: 1 },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      const mockToken = await signToken(mockSession);

      mockCookies.get.mockReturnValueOnce({
        value: mockToken,
      });

      const session = await getSession();
      expect(session).toBeDefined();
      if (session) {
        expect(session.user.id).toBe(mockSession.user.id);
        expect(session.expires).toBeDefined();
        expect(new Date(session.expires).getTime()).toBeGreaterThan(Date.now());
      }
    });
  });

  describe("setSession", () => {
    test("sets session cookie with encrypted token", async () => {
      const user = {
        id: 1,
        email: "test@example.com",
        passwordHash: "hashed",
        role: "member" as const,
      };

      await setSession(user);

      expect(mockCookies.set).toHaveBeenCalledTimes(1);
      const [name, value, options] = mockCookies.set.mock.calls[0];

      expect(name).toBe("session");
      expect(value).toBeDefined();
      expect(options).toEqual({
        expires: expect.any(Date),
        httpOnly: true,
        secure: false, // Development mode
        sameSite: "lax",
      });

      // Verify the token is valid
      const decodedSession = await verifyToken(value);
      expect(decodedSession).not.toBeNull();
      if (decodedSession) {
        expect(decodedSession.user.id).toBe(user.id);
        expect(decodedSession.expires).toBeDefined();
      }
    });
  });
});
