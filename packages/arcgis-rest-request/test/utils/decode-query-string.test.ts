import { decodeQueryString } from "../../src/index.js";

describe("decodeQueryString()", () => {
  it("should decode a query string to an object", () => {
    const { foo, bar } = decodeQueryString("foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  it("should handle a leading hash (#)", () => {
    const { foo, bar } = decodeQueryString("#foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  it("should handle a leading question mark (?)", () => {
    const { foo, bar } = decodeQueryString("?foo=one&bar=two");
    expect(foo).toBe("one");
    expect(bar).toBe("two");
  });

  it("should return an empty query string for no input", () => {
    expect(decodeQueryString("")).toEqual({});
    expect(decodeQueryString()).toEqual({});
  });
});
