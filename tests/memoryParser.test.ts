import { describe, expect, it } from "vitest";
import { parseMemories } from "../lib/memoryParser";

describe("parseMemories", () => {
  it("parses a single memory with tags", () => {
    const out = "Nice! [MEMORY: User likes pasta | food, preference, italian]";
    const parsed = parseMemories(out);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].content).toBe("User likes pasta");
    expect(parsed[0].tags).toEqual(["food", "preference", "italian"]);
  });

  it("parses multiple memories and trims whitespace", () => {
    const out = `First line. [MEMORY:  Loves coffee  |  beverage , preference ] Another bit. [MEMORY:Went to Paris in 2019| travel, memory ]`;
    const parsed = parseMemories(out);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].content).toBe("Loves coffee");
    expect(parsed[0].tags).toEqual(["beverage", "preference"]);
    expect(parsed[1].content).toBe("Went to Paris in 2019");
  });

  it("ignores malformed markers and respects tag limit", () => {
    const out =
      "[MEMORY: Short | a, b, c, d] [MEMORY: This one is long enough to save | t1, t2] [MEMORY:BadMarker no pipe]";
    const parsed = parseMemories(out);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].tags.length).toBe(3); // limited to 3
  });

  it("handles content containing pipe characters", () => {
    const out = "[MEMORY: Favorite dish: fish | food, favorite]";
    const parsed = parseMemories(out);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].content).toBe("Favorite dish: fish");
  });
});
