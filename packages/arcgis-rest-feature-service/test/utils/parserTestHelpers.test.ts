import { maxDifference, compareKeysAndValues } from "./parserTestHelpers.js";
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

  describe("maxDifference", () => {
    test("returns null for identical flat arrays", () => {
      expect(maxDifference([1, 2, 3], [1, 2, 3])).toBeNull();
    });

    test("returns correct max difference for flat arrays", () => {
      const result = maxDifference([1, 2, 3], [1, 2, 4]);
      expect(result).toEqual({ a: 3, b: 4, diff: 1 });
    });

    test("returns correct max difference for nested arrays", () => {
      const result = maxDifference(
        [
          [1, 2],
          [3, 4]
        ],
        [
          [1, 2],
          [3, 5]
        ]
      );
      expect(result).toEqual({ a: 4, b: 5, diff: 1 });
    });

    test("throws for arrays of different lengths", () => {
      expect(() => maxDifference([1, 2, 3], [1, 2])).toThrow(
        "Array lengths differ"
      );
    });

    test("handles negative numbers and zero", () => {
      const result = maxDifference([-5, 0, 10], [-5, 0, 8]);
      expect(result).toEqual({ a: 10, b: 8, diff: 2 });
    });

    test("throws for different nesting", () => {
      expect(() => maxDifference([1, [2, 3]], [1, 2, 3])).toThrow(
        "Array lengths differ"
      );
    });

    test("throws for type mismatch", () => {
      expect(() => maxDifference([1, 2], [1, "2"])).toThrow(
        "Type mismatch in structure"
      );
    });

    test("throws for value mismatch for non-number type", () => {
      expect(() => maxDifference(["a", "b"], ["a", "c"])).toThrow(
        "Value mismatch for non-number type"
      );
    });
  });
});
