/* Copyright (c) 2026 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, expect, test } from "vitest";
import { mergeHeaders } from "../../src/utils/merge-headers.js";

describe("mergeHeaders", () => {
  test("should merge plain object headers", () => {
    const merged = mergeHeaders(
      {
        "X-Test": "from-defaults",
        "X-Defaults-Only": "true"
      },
      {
        "X-Test": "from-request",
        "X-Request-Only": "true"
      }
    );

    expect(merged).toEqual({
      "X-Test": "from-request",
      "X-Defaults-Only": "true",
      "X-Request-Only": "true"
    });
  });

  test("should merge tuple headers", () => {
    const merged = mergeHeaders([
      ["X-Token", "abc123"],
      ["X-Custom", "custom-value"]
    ]);

    expect(merged).toEqual({
      "X-Token": "abc123",
      "X-Custom": "custom-value"
    });
  });

  test("should merge Headers instance", () => {
    if (typeof Headers === "undefined") {
      return;
    }

    const headerObject = mergeHeaders(
      { "X-Initial": "true" },
      new Headers([["X-From-Headers", "true"]])
    );

    expect(headerObject["X-Initial"]).toBe("true");
    expect(headerObject["x-from-headers"]).toBe("true");
  });

  test("should omit undefined object header values", () => {
    const headerObject = mergeHeaders({
      "X-Defined": "true",
      "X-Undefined": undefined as any
    });

    expect(headerObject).toEqual({
      "X-Defined": "true"
    });
    expect(headerObject["X-Undefined"]).toBeUndefined();
  });

  test("should ignore undefined header sets", () => {
    const headerObject = mergeHeaders(undefined, {
      "X-Defined": "true"
    });

    expect(headerObject).toEqual({
      "X-Defined": "true"
    });
  });
});
