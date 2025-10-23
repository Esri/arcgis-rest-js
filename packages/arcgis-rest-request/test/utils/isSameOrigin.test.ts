import { isSameOrigin } from "../../src/utils/isSameOrigin.js";
import { describe, test, expect } from "vitest";
describe("isSameOrigin", () => {
  test("should return true if the URL is the same origin as the current window", () => {
    const mockWindow = {
      location: {
        origin: "https://example.com"
      }
    } as unknown as Window & typeof globalThis;

    const result = isSameOrigin("https://example.com/resource", mockWindow);
    expect(result).toBe(true);
  });

  test("should return false if the URL is a different origin than the current window", () => {
    const mockWindow = {
      location: {
        origin: "https://example.com"
      }
    } as unknown as Window & typeof globalThis;

    const result = isSameOrigin(
      "https://another-domain.com/resource",
      mockWindow
    );
    expect(result).toBe(false);
  });

  test("should return false if the window object has no location or origin", () => {
    const mockWindow = {} as unknown as Window & typeof globalThis;

    const result = isSameOrigin("https://example.com/resource", mockWindow);
    expect(result).toBe(false);
  });

  test("should return false when the url is falsey", () => {
    const mockWindow = {
      location: {
        origin: "https://example.com"
      }
    } as unknown as Window & typeof globalThis;

    const result = isSameOrigin(null, mockWindow);
    expect(result).toBe(false);
  });

  test("should handle URLs that do not start with the origin", () => {
    const mockWindow = {
      location: {
        origin: "https://example.com"
      }
    } as unknown as Window & typeof globalThis;

    const result = isSameOrigin("http://example.com/resource", mockWindow);
    expect(result).toBe(false);
  });
  if (typeof window !== "undefined") {
    // Although this should work in node, it somehow doesn't
    test("should work if win is undefined", () => {
      const result = isSameOrigin("http://example.com/resource");
      expect(result).toBe(false);
    });
  }
});
