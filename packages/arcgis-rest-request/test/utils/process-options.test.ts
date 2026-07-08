/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { describe, test, expect } from "vitest";
import { processOptions } from "../../src/utils/process-options.js";
import { IRequestOptions } from "../../src/utils/IRequestOptions.js";
import { HTTPMethods } from "../../src/utils/HTTPMethods.js";

describe("processOptions", () => {
  test("should extract specified keys and merge request options", () => {
    // this interface should match the options object below
    interface TestOptions extends IRequestOptions {
      // user's custom-defined options object
      id: number;
      f: string;
      token: string;
      bogusOrMisspelledKey?: string;
      extra?: string;
      // legacy request options still used in (someone's?) code that we should handle in some way.
      httpMethod?: HTTPMethods;
      credentials?: RequestCredentials;
      headers?: Record<string, any>;
      hideToken?: boolean;
    }
    const options: TestOptions = {
      // extract key
      id: 123,
      // param keys
      f: "json",
      token: "abc123",
      // params.a should appear as "a:"" in params
      params: { a: 1 },
      // extra keys that should be ignored
      extra: "should be ignored",
      // legacy request options keys that should be ignored altogether, as processOptions is not intended to support legacy request options at all
      httpMethod: "POST",
      credentials: "include",
      headers: { "X-Custom-Header": "value" },
      hideToken: true,
      // requestOptions that should be in the final requestOptions object, but overridden by options if present
      fetchOptions: {
        method: "POST",
        credentials: "omit",
        signal: new AbortController().signal
      },
      requestFlags: {
        suppressWarnings: true
      }
    };

    const { id, requestOptions } = processOptions(options, {
      paramKeys: ["f", "token", "bogus-or-misspelled-key" as any],
      extractKeys: ["id"],
      overwriteOptions: {
        authentication: "none",
        fetchOptions: {
          method: "GET"
        },
        requestFlags: {
          suppressWarnings: false
        }
      }
    });

    // id should be extracted from options and returned
    expect(id).toBeDefined();
    // f, token, and params in requestOptions.params
    expect(requestOptions.params).toEqual(
      expect.objectContaining({
        f: expect.anything(),
        token: expect.anything(),
        a: expect.anything()
      })
    );
    // requestOptions should be a pure IRequestOptions object with no extra keys or legacy keys
    // requestOptions should reflect overriden values from options, if any
    expect(requestOptions).toEqual({
      authentication: "none",
      fetchOptions: {
        method: "GET",
        credentials: "omit",
        signal: expect.anything()
      },
      requestFlags: {
        suppressWarnings: false
      },
      params: {
        a: 1,
        f: "json",
        token: "abc123"
      }
    });
  });

  test("should apply overwriteOptions precedence for top-level and nested request options", () => {
    const options: IRequestOptions = {
      authentication: "from-options",
      portal: "https://from-options.example.com/sharing/rest",
      fetchOptions: {
        method: "POST",
        credentials: "include",
        signal: new AbortController().signal
      },
      requestFlags: {
        hideToken: true,
        suppressWarnings: true
      }
    };

    const result = processOptions(options, {
      paramKeys: [],
      extractKeys: [],
      overwriteOptions: {
        authentication: "from-overwrite",
        portal: "https://from-overwrite.example.com/sharing/rest",
        fetchOptions: {
          method: "GET"
        },
        requestFlags: {
          suppressWarnings: false
        }
      }
    });

    expect(result.requestOptions).toEqual({
      authentication: "from-overwrite",
      portal: "https://from-overwrite.example.com/sharing/rest",
      fetchOptions: {
        method: "GET",
        credentials: "include",
        signal: expect.anything()
      },
      requestFlags: {
        hideToken: true,
        suppressWarnings: false
      }
    });
  });

  test("should merge params and prefer moved paramKeys over existing params collisions", () => {
    const result = processOptions(
      {
        token: "top-level-token",
        f: "json",
        params: {
          token: "params-token",
          culture: "en-US"
        }
      },
      {
        paramKeys: ["token", "f"],
        extractKeys: []
      }
    );

    expect(result.requestOptions.params).toEqual({
      token: "top-level-token",
      culture: "en-US",
      f: "json"
    });
  });

  test("should return extracted keys and exclude extracted and unsupported keys from requestOptions", () => {
    const result = processOptions(
      {
        id: "route-id",
        routeType: "fastest",
        f: "json",
        params: {
          outSR: 4326
        },
        extra: "ignore-me",
        httpMethod: "POST",
        credentials: "include",
        headers: {
          "X-Test": "value"
        },
        hideToken: true
      },
      {
        paramKeys: ["f"],
        extractKeys: ["id", "routeType"]
      }
    );

    expect(result.id).toBe("route-id");
    expect(result.routeType).toBe("fastest");

    expect(result.requestOptions).toEqual({
      params: {
        outSR: 4326,
        f: "json"
      }
    });

    expect(result.requestOptions).not.toHaveProperty("id");
    expect(result.requestOptions).not.toHaveProperty("routeType");
    expect(result.requestOptions).not.toHaveProperty("extra");
    expect(result.requestOptions).not.toHaveProperty("httpMethod");
    expect(result.requestOptions).not.toHaveProperty("credentials");
    expect(result.requestOptions).not.toHaveProperty("headers");
    expect(result.requestOptions).not.toHaveProperty("hideToken");
  });

  test("should build requestOptions correctly when overwriteOptions is omitted", () => {
    const result = processOptions(
      {
        id: "abc123",
        portal: "https://example.com/sharing/rest",
        f: "json",
        token: "token-from-options",
        params: {
          outSR: 3857
        },
        fetchOptions: {
          method: "POST",
          credentials: "include"
        },
        requestFlags: {
          hideToken: true
        }
      },
      {
        paramKeys: ["f", "token"],
        extractKeys: ["id"]
      }
    );

    expect(result.id).toBe("abc123");

    expect(result.requestOptions).toEqual({
      portal: "https://example.com/sharing/rest",
      fetchOptions: {
        method: "POST",
        credentials: "include"
      },
      requestFlags: {
        hideToken: true
      },
      params: {
        outSR: 3857,
        f: "json",
        token: "token-from-options"
      }
    });

    expect(result.requestOptions).not.toHaveProperty("id");
  });

  test("should ignore reserved IRequestOptions keys forced into paramKeys", () => {
    const result = processOptions(
      {
        authentication: "auth-from-options",
        f: "json",
        params: {
          outSR: 102100
        }
      },
      {
        // Simulate a JS caller bypassing TypeScript constraints.
        paramKeys: ["f", "authentication"] as any,
        extractKeys: []
      }
    );

    expect(result.requestOptions.authentication).toBe("auth-from-options");
    expect(result.requestOptions.params).toEqual({
      outSR: 102100,
      f: "json"
    });
    expect(result.requestOptions.params).not.toHaveProperty("authentication");
  });

  test("should ignore extractKeys that are not present on options", () => {
    const result = processOptions(
      {
        f: "json",
        params: {
          outSR: 3857
        }
      },
      {
        paramKeys: ["f"],
        extractKeys: ["id", "routeType"] as any
      }
    );

    expect(result).not.toHaveProperty("id");
    expect(result).not.toHaveProperty("routeType");
    expect(result.requestOptions.params).toEqual({
      outSR: 3857,
      f: "json"
    });
  });

  test("should build mergeable request options from overwriteOptions when original options are absent", () => {
    const result = processOptions(
      {
        fetchOptions: {
          credentials: "include"
        },
        requestFlags: {
          hideToken: true
        }
      },
      {
        paramKeys: [],
        extractKeys: [],
        overwriteOptions: {
          fetchOptions: {
            method: "POST"
          },
          requestFlags: {
            suppressWarnings: true
          }
        }
      }
    );

    expect(result.requestOptions).toEqual({
      fetchOptions: {
        credentials: "include",
        method: "POST"
      },
      requestFlags: {
        hideToken: true,
        suppressWarnings: true
      }
    });
  });

  test("should build mergeable request options from overwriteOptions when original mergeable keys are missing", () => {
    const result = processOptions(
      {
        authentication: "auth-from-options",
        portal: "https://example.com/sharing/rest"
      },
      {
        paramKeys: [],
        extractKeys: [],
        overwriteOptions: {
          fetchOptions: {
            method: "POST",
            credentials: "omit"
          },
          requestFlags: {
            suppressWarnings: true
          }
        }
      }
    );

    expect(result.requestOptions).toEqual({
      authentication: "auth-from-options",
      portal: "https://example.com/sharing/rest",
      fetchOptions: {
        method: "POST",
        credentials: "omit"
      },
      requestFlags: {
        suppressWarnings: true
      }
    });
  });

  test("should create params when original options has no params object", () => {
    type TestOptions = IRequestOptions & {
      f: "json";
      token: "abc123";
    };
    const result = processOptions<TestOptions>(
      {
        f: "json",
        token: "abc123"
      },
      {
        paramKeys: ["f", "token"],
        extractKeys: []
      }
    );

    expect(result.requestOptions.params).toEqual({
      f: "json",
      token: "abc123"
    });
  });
});
