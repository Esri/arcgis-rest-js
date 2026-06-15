/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, expect, test } from "vitest";
import { normalizeDeprecatedRequestOptions } from "../../src/utils/normalize-deprecated-request-options.js";

describe("normalizeDeprecatedRequestOptions", () => {
  test("should return normalized defaults when called without options", () => {
    const normalized = normalizeDeprecatedRequestOptions();

    expect(normalized.requestFlags).toEqual({});
    expect(normalized.fetchOptions).toEqual({ headers: {} });
    expect(normalized.params).toBeUndefined();
    expect(normalized.authentication).toBeUndefined();
    expect(normalized.portal).toBeUndefined();
  });

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

  test("should normalize tuple-based fetch headers", () => {
    const normalized = normalizeDeprecatedRequestOptions({
      headers: {
        "X-Deprecated": "legacy"
      },
      fetchOptions: {
        headers: [["X-Fetch-Tuple", "tuple-value"]]
      }
    });

    expect(normalized.fetchOptions?.headers).toEqual({
      "X-Deprecated": "legacy",
      "X-Fetch-Tuple": "tuple-value"
    });
  });

  test("should prefer tuple-based fetch headers over deprecated top-level headers", () => {
    const normalized = normalizeDeprecatedRequestOptions({
      headers: {
        "X-Test": "legacy-value",
        "X-Deprecated-Only": "legacy"
      },
      fetchOptions: {
        headers: [
          ["X-Test", "tuple-value"],
          ["X-Fetch-Only", "tuple-only"]
        ]
      }
    });

    expect(normalized.fetchOptions?.headers).toEqual({
      "X-Test": "tuple-value",
      "X-Deprecated-Only": "legacy",
      "X-Fetch-Only": "tuple-only"
    });
  });

  test("should normalize Headers instance in fetchOptions.headers", () => {
    if (typeof Headers === "undefined") {
      return;
    }

    const normalized = normalizeDeprecatedRequestOptions({
      headers: {
        "X-Deprecated": "legacy"
      },
      fetchOptions: {
        headers: new Headers([["X-Fetch-Headers", "headers-value"]])
      }
    });

    expect(normalized.fetchOptions?.headers).toEqual({
      "X-Deprecated": "legacy",
      "x-fetch-headers": "headers-value"
    });
  });

  test("should prefer Headers instance values over deprecated top-level headers", () => {
    if (typeof Headers === "undefined") {
      return;
    }

    const normalized = normalizeDeprecatedRequestOptions({
      headers: {
        "x-test": "legacy-value",
        "X-Deprecated-Only": "legacy"
      },
      fetchOptions: {
        headers: new Headers([
          ["X-Test", "headers-value"],
          ["X-Fetch-Only", "headers-only"]
        ])
      }
    });

    expect(normalized.fetchOptions?.headers).toEqual({
      "x-test": "headers-value",
      "X-Deprecated-Only": "legacy",
      "x-fetch-only": "headers-only"
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
