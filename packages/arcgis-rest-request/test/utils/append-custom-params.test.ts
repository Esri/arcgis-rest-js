/**
 * This test file is being added (maybe temporarily?) because the appendCustomParams function
 * is getting coverage indirectly by tests of methods in other packages that use it,
 * but doesnt have any unit tests on its own in request.
 */

import { appendCustomParams } from "../../src/index.js";
import { describe, test, expect } from "vitest";

describe("appendCustomParams", () => {
  test("merges custom options and base options, handles all value types, and omits invalid keys", () => {
    // this test should cover:
    // - omit keys not in keys
    // - deconstruct and merge customOptions into params
    // - omit empty string, null, undefined, NaN

    const customOptions = {
      // values that should be included
      str: "foo",
      num: 0,
      neg: false,
      pos: true,
      params: { a: 1 },
      // values that should be omitted
      extra: "bar",
      empty: "",
      nann: NaN,
      nil: null as any,
      undef: undefined as any
    };

    // customOptions keys to merge into params (excludes 'extra')
    const keys = ["str", "num", "neg", "pos", "empty"];
    const baseOptions = {
      httpMethod: "POST",
      credentials: "include"
    };

    const result = appendCustomParams(customOptions as any, keys, baseOptions);

    // params should not include empty string, null, undefined, or NaN values
    // params should not include keys not listed in keys (extra)
    expect(result.params).toEqual({
      // params should have appended all other customOptions
      str: "foo",
      neg: false,
      num: 0,
      pos: true,
      // params should have appended custom params as deconstructed options
      a: 1
    });

    // baseOptions keys should be present
    expect(result.httpMethod).toBe("POST");
    expect(result.credentials).toBe("include");

    // result should only retain keys listed in requestOptionsKeys
    Object.keys(result).forEach((key) => {
      expect([
        "params",
        "httpMethod",
        "rawResponse",
        "authentication",
        "hideToken",
        "portal",
        "credentials",
        "maxUrlLength",
        "headers",
        "signal",
        "suppressWarnings",
        "request"
      ]).toContain(key);
    });
  });
});
