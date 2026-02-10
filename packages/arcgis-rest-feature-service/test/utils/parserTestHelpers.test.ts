import { compareCoordinates, compareProperties } from "./parserTestHelpers.js";
import { describe, test, expect } from "vitest";

describe("geojsonTestHelpers", () => {
  describe("compareCoordinates", () => {
    test("returns empty array for identical arrays", () => {
      const a = [
        [1, 2],
        [3, 4]
      ];
      const b = [
        [1, 2],
        [3, 4]
      ];
      expect(compareCoordinates(a, b)).toEqual([]);
    });
    test("returns diffs for different arrays", () => {
      const a = [
        [1, 2],
        [3, 4]
      ];
      const b = [
        [1, 2],
        [3, 5]
      ];
      expect(compareCoordinates(a, b)).toEqual([{ a: 4, b: 5, diff: 1.0 }]);
    });
    test("handles precision", () => {
      const a = [[1.1234567, 2.1234567]];
      const b = [[1.1234568, 2.1234566]];
      // Should be equal at precision 6
      expect(compareCoordinates(a, b, 6)).toEqual([]);
      // Should not be equal at precision 7
      expect(compareCoordinates(a, b, 7)).not.toEqual([]);
    });
    test("returns length diff for different shapes", () => {
      const a = [
        [1, 2],
        [3, 4]
      ];
      const b = [[1, 2]];
      expect(compareCoordinates(a, b)).toEqual([{ a: 2, b: 1, diff: 1.0 }]);
    });
    test("handles 3D arrays", () => {
      const a = [
        [
          [1, 2],
          [3, 4]
        ]
      ];
      const b = [
        [
          [1, 2],
          [3, 5]
        ]
      ];
      expect(compareCoordinates(a, b)).toEqual([{ a: 4, b: 5, diff: 1.0 }]);
    });
    test("handles 4D arrays", () => {
      const a = [
        [
          [
            [1, 2],
            [3, 4]
          ]
        ]
      ];
      const b = [
        [
          [
            [1, 2],
            [3, 5]
          ]
        ]
      ];
      expect(compareCoordinates(a, b)).toEqual([{ a: 4, b: 5, diff: 1.0 }]);
    });
  });

  describe("compareProperties", () => {
    test("returns true for identical objects", () => {
      const a = { foo: 1, bar: "baz" };
      const b = { foo: 1, bar: "baz" };
      expect(compareProperties(a, b)).toBe(true);
    });
    test("returns value-mismatch for different values", () => {
      const a = { foo: 1, bar: "baz" };
      const b = { foo: 2, bar: "baz" };
      const result = compareProperties(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect(result).toHaveProperty("diffs");
    });
    test("returns key-mismatch for different keys", () => {
      const a = { foo: 1 };
      const b = { bar: 1 };
      const result = compareProperties(a, b);
      expect(result).toHaveProperty("type", "key-mismatch");
    });
    test("handles number precision", () => {
      const a = { foo: 1.1234567 };
      const b = { foo: 1.1234568 };
      expect(compareProperties(a, b, 6)).toBe(true);
      expect(compareProperties(a, b, 7)).not.toBe(true);
    });
    test("returns value-mismatch for multiple diffs", () => {
      const a = { foo: 1, bar: 2, baz: 3 };
      const b = { foo: 2, bar: 3, baz: 4 };
      const result = compareProperties(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect((result as any).diffs.length).toBe(3);
    });
    test("returns value-mismatch for non-number values", () => {
      const a = { foo: true, bar: "abc" };
      const b = { foo: false, bar: "def" };
      const result = compareProperties(a, b);
      expect(result).toHaveProperty("type", "value-mismatch");
      expect((result as any).diffs.length).toBe(2);
    });
  });
});
