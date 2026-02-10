import { compareKeysAndValues } from "./parserTestHelpers.js";
import { describe, test, expect } from "vitest";

describe("geojsonTestHelpers", () => {
  describe("compareKeysAndValues", () => {
    test("returns true for identical objects", () => {
      const a = { foo: 1, bar: "baz" };
      const b = { foo: 1, bar: "baz" };
      expect(compareKeysAndValues(a, b)).toBe(true);
    });
    test("returns value-mismatch for different values", () => {
      const a = { foo: 1, bar: "baz" };
      const b = { foo: 2, bar: "baz" };
      const result = compareKeysAndValues(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect(result).toHaveProperty("diffs");
    });
    test("returns key-mismatch for different keys", () => {
      const a = { foo: 1 };
      const b = { bar: 1 };
      const result = compareKeysAndValues(a, b);
      expect(result).toHaveProperty("type", "key-mismatch");
    });
    test("handles number precision", () => {
      const a = { foo: 1.1234567 };
      const b = { foo: 1.1234568 };
      expect(compareKeysAndValues(a, b, 6)).toBe(true);
      expect(compareKeysAndValues(a, b, 7)).not.toBe(true);
    });
    test("returns value-mismatch for multiple diffs", () => {
      const a = { foo: 1, bar: 2, baz: 3 };
      const b = { foo: 2, bar: 3, baz: 4 };
      const result = compareKeysAndValues(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect((result as any).diffs.length).toBe(3);
    });
    test("returns value-mismatch for non-number values", () => {
      const a = { foo: true, bar: "abc" };
      const b = { foo: false, bar: "def" };
      const result = compareKeysAndValues(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect((result as any).diffs.length).toBe(2);
    });
  });
});
