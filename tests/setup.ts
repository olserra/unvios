import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock global browser APIs
// Polyfill TextEncoder/TextDecoder for test environment
import { TextDecoder, TextEncoder } from "node:util";

globalThis.TextEncoder =
  TextEncoder as unknown as typeof globalThis.TextEncoder;
globalThis.TextDecoder =
  TextDecoder as unknown as typeof globalThis.TextDecoder;

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/test-path",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock environment variables
process.env.POSTGRES_URL =
  "postgresql://postgres:postgres@localhost:5432/test_db";
process.env.AUTH_SECRET = "test_secret";
