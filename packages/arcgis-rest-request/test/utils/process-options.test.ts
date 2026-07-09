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
      // (Typescript will complain if you try to use them), but if you force them as any, they will be moved to params instead
      httpMethod: "POST",
      credentials: "include",
      headers: { "X-Custom-Header": "value" },
      hideToken: true,
      // requestOptions fetch options that will come through the final requestOptions object, unless absent and filled by defaultOptions
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
      defaultOptions: {
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
    // requestOptions should prefer explicit options values over defaultOptions values
    expect(requestOptions).toEqual({
      authentication: "none",
      fetchOptions: {
        method: "POST",
        credentials: "omit",
        signal: expect.anything()
      },
      requestFlags: {
        suppressWarnings: true
      },
      params: {
        a: 1,
        f: "json",
        token: "abc123"
      }
    });
  });

  test("should include abort controller signal in fetchOptions when provided", () => {
    const abortController = new AbortController();
    const abortControllerTopLevel = new AbortController();
    const requestOptions: IRequestOptions = {
      authentication: "fake-token",
      fetchOptions: {
        signal: abortController.signal
      }
    };
    const options = {
      x: -73,
      y: 40,
      radius: 1600, // 5 miles in meters
      categoryIds: ["123456789987654321"],
      // if signal is provided at top-level and included in paramKeys, it will be moved to params
      signal: abortControllerTopLevel.signal,
      // structure abort controller in requestOptions.fetchOptions instead of at top-level
      ...requestOptions
    };

    const processed = processOptions(options, {
      // typescript will complain about signal because it is a legacy top-level requestOption
      // and is excluded from ExtractableKey<T> type and should be included in requestOptions.fetchOptions,
      // but will be moved into params if you force it.
      paramKeys: ["x", "y", "radius", "categoryIds", "signal" as any],
      extractKeys: []
    });

    expect(processed.requestOptions.fetchOptions?.signal).toBe(
      abortController.signal
    );
    expect(processed.requestOptions).not.toHaveProperty("signal");
    expect(processed.requestOptions.params).toEqual({
      x: -73,
      y: 40,
      radius: 1600,
      categoryIds: ["123456789987654321"],
      signal: abortControllerTopLevel.signal
    });
  });

  test("should not chain merge params under params if user tries to include params", () => {
    const someUserBugThingShapeSearch = {
      q: "my awesome query here",
      start: 1,
      num: 100,
      params: {
        categories: "/Categories/Trending"
      }
    };

    const processed = processOptions(someUserBugThingShapeSearch, {
      // typescript will complain about params because it is already a requestOption key
      // but will not chain nest it if included in paramKeys.
      paramKeys: ["q", "start", "num", "params" as any],
      extractKeys: []
    });

    // processOptions should merge in { q, start, and num } from paramKeys since they are non requestOptions keys
    // and should pull in all params by default, since params is a requestOptions key.
    expect(processed.requestOptions.params).toEqual({
      q: "my awesome query here",
      start: 1,
      num: 100,
      categories: "/Categories/Trending"
    });
  });

  test("should apply defaultOptions and prefer explicit option values for top-level and nested request options", () => {
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
      defaultOptions: {
        authentication: "from-default",
        portal: "https://from-default.example.com/sharing/rest",
        fetchOptions: {
          method: "GET"
        },
        requestFlags: {
          suppressWarnings: false
        },
        params: {
          f: "json"
        }
      }
    });

    expect(result.requestOptions).toEqual({
      authentication: "from-options",
      portal: "https://from-options.example.com/sharing/rest",
      fetchOptions: {
        method: "POST",
        credentials: "include",
        signal: expect.anything()
      },
      requestFlags: {
        hideToken: true,
        suppressWarnings: true
      },
      params: {
        f: "json"
      }
    });
  });

  test("should merge params with precedence moved paramKeys > options.params > defaultOptions.params", () => {
    const result = processOptions(
      {
        token: "from-top-level",
        f: "pjson",
        params: {
          token: "from-options-params",
          f: "json",
          culture: "fr-FR"
        }
      },
      {
        paramKeys: ["token"],
        extractKeys: [],
        defaultOptions: {
          params: {
            token: "from-default",
            f: "html",
            culture: "en-US",
            outSR: 3857
          }
        }
      }
    );

    expect(result.requestOptions.params).toEqual({
      token: "from-top-level",
      f: "json",
      culture: "fr-FR",
      outSR: 3857
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
      // top level token was moved to params and overwrote the existing params.token value,
      // to preserve 'params-token', use extractKeys to extract top level keys instead of moving them into params.
      token: "top-level-token",
      culture: "en-US",
      f: "json"
    });
  });

  test("should return extracted keys and only keys included in toParams and toExtract", () => {
    const result = processOptions(
      {
        id: "route-id",
        routeType: "fastest",
        f: "json",
        params: {
          outSR: 4326
        },
        // should ignore all keys below
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

    expect(result).not.toHaveProperty("extra");
    expect(result).not.toHaveProperty("httpMethod");
    expect(result).not.toHaveProperty("credentials");
    expect(result).not.toHaveProperty("headers");
    expect(result).not.toHaveProperty("hideToken");
  });

  test("should build requestOptions correctly when defaultOptions is omitted", () => {
    const options = {
      id: "abc123",
      f: "json",
      token: "token-from-options",
      portal: "https://example.com/sharing/rest",
      params: {
        outSR: 3857
      },
      fetchOptions: {
        method: "POST"
      },
      requestFlags: {
        hideToken: true
      }
    };

    const result = processOptions(options, {
      paramKeys: ["f", "token"],
      extractKeys: ["id"]
    });

    expect(result.id).toBe("abc123");
    expect(result.requestOptions).toEqual({
      portal: "https://example.com/sharing/rest",
      fetchOptions: {
        method: "POST"
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
        paramKeys: ["f", "authentication" as any] as any,
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

  test("should build mergeable request options from defaultOptions when original options are absent", () => {
    const options = {
      fetchOptions: {
        credentials: "include" as RequestCredentials
      },
      requestFlags: {
        hideToken: true
      }
    };

    const result = processOptions(options, {
      paramKeys: [],
      extractKeys: [],
      defaultOptions: {
        fetchOptions: {
          method: "POST"
        },
        requestFlags: {
          suppressWarnings: true
        },
        params: {
          f: "json"
        }
      }
    });

    expect(result.requestOptions).toEqual({
      fetchOptions: {
        credentials: "include",
        method: "POST"
      },
      requestFlags: {
        hideToken: true,
        suppressWarnings: true
      },
      params: {
        f: "json"
      }
    });
  });

  test("should build mergeable request options from defaultOptions when original mergeable keys are missing", () => {
    const result = processOptions(
      {
        authentication: "auth-from-options",
        portal: "https://example.com/sharing/rest"
      },
      {
        paramKeys: [],
        extractKeys: [],
        defaultOptions: {
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
    // define custom object type
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

  test("should include explicitly undefined or null values in params", () => {
    const options = {
      f: "json",
      token: undefined,
      extra: null,
      params: {
        a: 1,
        b: undefined,
        c: null
      }
    };

    const result = processOptions(options, {
      paramKeys: ["f", "token", "extra"],
      extractKeys: []
    });

    expect(result.requestOptions.params).toEqual({
      f: "json",
      token: undefined,
      extra: null,
      a: 1,
      b: undefined,
      c: null
    });
  });

  test("should handle empty paramKeys and extractKeys", () => {
    const options = {
      // these will be discarded because they are not included in paramKeys or extractKeys
      f: "json",
      token: "abc123",
      // params will be included in output because it is a requestOptions key
      params: {
        a: 1
      }
    };

    const result = processOptions(options, {
      paramKeys: [],
      extractKeys: []
    });

    expect(result.requestOptions).toEqual({
      params: {
        a: 1
      }
    });
  });

  test("should return empty requestOptions when options is an empty object", () => {
    const result = processOptions({} as IRequestOptions, {
      paramKeys: [],
      extractKeys: []
    });

    expect(result.requestOptions).toEqual({});
  });

  test("should throw when options is undefined", () => {
    expect(() =>
      processOptions(undefined as any, {
        paramKeys: [],
        extractKeys: []
      })
    ).toThrow();
  });
});
