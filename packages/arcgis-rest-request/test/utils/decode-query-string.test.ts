import { decodeQueryString } from "../../src/index.js";
import { describe, test, expect } from "vitest";

describe("decodeQueryString()", () => {
  test("should decode a query string to an object", () => {
    const { foo, bar } = decodeQueryString("foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  test("should handle a leading hash (#)", () => {
    const { foo, bar } = decodeQueryString("#foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  test("should handle a leading question mark (?)", () => {
    const { foo, bar } = decodeQueryString("?foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  test("should return an empty query string for no input", () => {
    expect(decodeQueryString("")).toEqual({});
    expect(decodeQueryString()).toEqual({});
  });
});
