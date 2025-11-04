import { describe, expect, it } from "vitest";
import {
  safeStorageGet,
  safeStorageRemove,
  safeStorageSet,
} from "../lib/utils";

describe("safeStorage helpers", () => {
  const mockStorage = (() => {
    const map = new Map<string, string>();
    return {
      getItem: (k: string) => (map.has(k) ? map.get(k) ?? null : null),
      setItem: (k: string, v: string) => map.set(k, v),
      removeItem: (k: string) => map.delete(k),
    } as unknown as Storage;
  })();

  it("set/get/remove with valid key", () => {
    const ok = safeStorageSet(mockStorage, "foo", "bar");
    expect(ok).toBe(true);
    expect(safeStorageGet(mockStorage, "foo")).toBe("bar");
    expect(safeStorageRemove(mockStorage, "foo")).toBe(true);
    expect(safeStorageGet(mockStorage, "foo")).toBe(null);
  });

  it("rejects invalid keys", () => {
    expect(safeStorageSet(mockStorage, "", "x")).toBe(false);
    expect(safeStorageGet(mockStorage, "")).toBe(null);
    expect(safeStorageRemove(mockStorage, "")).toBe(false);
  });
});
