import { vi } from "vitest";

export function mockNextHeaders() {
  vi.mock("next/headers", () => ({
    headers: () => new Headers(),
    cookies: () => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }),
  }));
}

export function mockNextApiContext() {
  const mockHeaders = new Headers();
  const mockCookies = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  };

  vi.mock("next/headers", () => ({
    headers: () => mockHeaders,
    cookies: () => mockCookies,
  }));

  return {
    headers: mockHeaders,
    cookies: mockCookies,
  };
}
