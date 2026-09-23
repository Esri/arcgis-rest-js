/**
 * This test file is being added (maybe temporarily?) because the appendCustomParams function
 * is getting coverage indirectly by tests of methods in other packages that use it,
 * but doesnt have any unit tests on its own in request.
 */

import { appendCustomParams } from "../../src/index.js";
import { describe, test, expect, vi } from "vitest";

describe("appendCustomParams", () => {
  test("warns once that appendCustomParams is deprecated", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      // no-op
    });

    appendCustomParams({ params: {}, f: "json" } as any, ["f"]);
    appendCustomParams({ params: {}, f: "json" } as any, ["f"]);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("appendCustomParams()");
    expect(warnSpy.mock.calls[0][0]).toContain("deprecated");

    warnSpy.mockRestore();
  });

  test("merges custom options and base options, handles all value types, omits invalid keys, and normalizes legacy request options", () => {
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

    // baseOptions keys should be normalized into fetchOptions
    expect(result.fetchOptions).toEqual({
      method: "POST",
      credentials: "include",
      headers: {}
    });

    // legacy keys should be normalized and removed
    expect(result.httpMethod).toBeUndefined();
    expect(result.credentials).toBeUndefined();

    // result should only retain keys listed in requestOptionsKeys
    Object.keys(result).forEach((key) => {
      expect([
        "params",
        "authentication",
        "requestFlags",
        "fetchOptions",
        "portal"
      ]).toContain(key);
    });
  });

  test("does not warn when suppressWarnings is true", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      // no-op
    });

    appendCustomParams(
      {
        params: {},
        f: "json",
        suppressWarnings: true
      } as any,
      ["f"]
    );

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  test("does not warn when requestFlags.suppressWarnings is true", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      // no-op
    });

    appendCustomParams(
      {
        params: {},
        f: "json",
        requestFlags: { suppressWarnings: true }
      } as any,
      ["f"]
    );

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
