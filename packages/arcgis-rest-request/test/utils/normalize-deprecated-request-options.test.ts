/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, expect, test } from "vitest";
import { normalizeDeprecatedRequestOptions } from "../../src/utils/normalize-deprecated-request-options.js";

describe("normalizeDeprecatedRequestOptions", () => {
  test("should map deprecated top-level request options to requestFlags and fetchOptions", () => {
    const controller = new AbortController();

    const normalized = normalizeDeprecatedRequestOptions({
      hideToken: true,
      suppressWarnings: true,
      httpMethod: "GET",
      credentials: "include",
      headers: {
        "X-Test": "deprecated-header"
      },
      signal: controller.signal
    });

    expect(normalized.requestFlags).toEqual({
      hideToken: true,
      suppressWarnings: true
    });
    expect(normalized.fetchOptions).toEqual({
      method: "GET",
      credentials: "include",
      signal: controller.signal,
      headers: {
        "X-Test": "deprecated-header"
      }
    });
    expect(normalized.hideToken).toBeUndefined();
    expect(normalized.suppressWarnings).toBeUndefined();
    expect(normalized.httpMethod).toBeUndefined();
    expect(normalized.credentials).toBeUndefined();
    expect(normalized.headers).toBeUndefined();
    expect(normalized.signal).toBeUndefined();
  });

  test("should prefer explicit requestFlags and fetchOptions over deprecated top-level values", () => {
    const controller = new AbortController();

    const normalized = normalizeDeprecatedRequestOptions({
      hideToken: false,
      suppressWarnings: false,
      httpMethod: "POST",
      credentials: "omit",
      headers: {
        "X-Test": "deprecated-header",
        "X-Deprecated-Only": "true"
      },
      signal: controller.signal,
      requestFlags: {
        hideToken: true,
        suppressWarnings: true,
        ignoreMaxUrlLength: true
      },
      fetchOptions: {
        method: "GET",
        credentials: "include",
        headers: {
          "X-Test": "fetch-header",
          "X-Fetch-Only": "true"
        }
      }
    });

    expect(normalized.requestFlags).toEqual({
      hideToken: true,
      suppressWarnings: true,
      ignoreMaxUrlLength: true
    });
    expect(normalized.fetchOptions).toEqual({
      method: "GET",
      credentials: "include",
      signal: controller.signal,
      headers: {
        "X-Test": "fetch-header",
        "X-Deprecated-Only": "true",
        "X-Fetch-Only": "true"
      }
    });
  });

  test("should drop legacy options without v2 replacements", () => {
    const normalized = normalizeDeprecatedRequestOptions({
      maxUrlLength: 3000,
      rawResponse: true
    });

    expect(normalized.maxUrlLength).toBeUndefined();
    expect(normalized.rawResponse).toBeUndefined();
  });
});
