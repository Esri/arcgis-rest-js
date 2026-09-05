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
      // legacy request options still used in someone's? code that we should handle in some way.
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
      // legacy request options keys pass through so request() can warn and normalize them
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
    // requestOptions should preserve legacy options for request() to normalize.
    // requestOptions should prefer explicit options values over defaultOptions values.
    expect(requestOptions).toEqual({
      authentication: "none",
      httpMethod: "POST",
      credentials: "include",
      headers: {
        "X-Custom-Header": "value"
      },
      hideToken: true,
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

  test("should preserve top-level signal and keep it out of params", () => {
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
      // top-level signal is legacy and should pass through to requestOptions
      // (not get moved into params)
      signal: abortControllerTopLevel.signal,
      // fetchOptions.signal remains preferred and should be preserved as well
      ...requestOptions
    };

    const processed = processOptions(options, {
      // Even if forced into paramKeys from JS usage, signal should be treated as a
      // request option key and not moved into params.
      paramKeys: ["x", "y", "radius", "categoryIds", "signal" as any],
      extractKeys: []
    });

    expect(processed.requestOptions.fetchOptions?.signal).toBe(
      abortController.signal
    );
    expect(processed.requestOptions.signal).toBe(
      abortControllerTopLevel.signal
    );
    expect(processed.requestOptions.params).toEqual({
      x: -73,
      y: 40,
      radius: 1600,
      categoryIds: ["123456789987654321"]
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

  test("should apply defaultOptions and prefer original option values for top-level and nested request options", () => {
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
      // from paramKeys
      token: "from-top-level",
      // original options
      f: "json",
      culture: "fr-FR",
      // from defaultOptions
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
      token: "top-level-token",
      culture: "en-US",
      f: "json"
    });
  });

  test("should return extracted keys and pass through recognized request options", () => {
    const processedOptions = processOptions(
      {
        id: "route-id",
        routeType: "fastest",
        f: "json",
        params: {
          outSR: 4326
        },
        // should ignore unknown keys below
        extra: "ignore-me",
        // recognized legacy request options should pass through
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

    expect(processedOptions.id).toBe("route-id");
    expect(processedOptions.routeType).toBe("fastest");
    expect(processedOptions.requestOptions).toEqual({
      httpMethod: "POST",
      credentials: "include",
      headers: {
        "X-Test": "value"
      },
      hideToken: true,
      params: {
        outSR: 4326,
        f: "json"
      }
    });

    expect(processedOptions).not.toHaveProperty("extra");
    expect(processedOptions).not.toHaveProperty("httpMethod");
    expect(processedOptions).not.toHaveProperty("credentials");
    expect(processedOptions).not.toHaveProperty("headers");
    expect(processedOptions).not.toHaveProperty("hideToken");
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

    const processedOptions = processOptions(options, {
      paramKeys: ["f", "token"],
      extractKeys: ["id"]
    });

    expect(processedOptions.id).toBe("abc123");
    expect(processedOptions.requestOptions).toEqual({
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

  test("should merge requestOptions with defaultOptions when original options dont overlap", () => {
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

  test("should use defaultOptions when original options are missing", () => {
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
    const options: TestOptions = {
      f: "json",
      token: "abc123"
    };
    const result = processOptions(options, {
      paramKeys: ["f", "token"],
      extractKeys: []
    });

    expect(result.requestOptions.params).toEqual({
      f: "json",
      token: "abc123"
    });
  });

  test("should include explicitly undefined or null values in params", () => {
    type TestOptions = IRequestOptions & {
      f: "json";
      token: undefined;
      extra: null;
      params: {
        a: number;
        b: undefined;
        c: null;
      };
    };
    const options: TestOptions = {
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

  test("should hande case where optional keys are missing from options but included in paramKeys", () => {
    type TestOptionalsWithNoneDefined = IRequestOptions & {
      f?: "json";
      token?: "abc123";
    };
    const options: TestOptionalsWithNoneDefined = {
      authentication: "auth-from-options"
      // f and token are missing from options, but included in paramKeys
    };

    const result = processOptions(options, {
      paramKeys: ["f", "token"],
      extractKeys: []
    });

    expect(result.requestOptions.params).toBeUndefined();
    // assert shape
    expect(result.requestOptions.authentication).toBe("auth-from-options");
    expect(result.requestOptions).toEqual({
      authentication: "auth-from-options"
    });

    type TestOptionalsWithOneDefined = IRequestOptions & {
      f?: "json";
      token?: "abc123";
    };

    const optionsWithOneDefined: TestOptionalsWithOneDefined = {
      authentication: "auth-from-options",
      f: "json"
      // token is missing from options, but included in paramKeys
    };

    const resultWithOneDefined = processOptions(optionsWithOneDefined, {
      paramKeys: ["f", "token"],
      extractKeys: []
    });

    expect(resultWithOneDefined.requestOptions).toEqual({
      authentication: "auth-from-options",
      params: {
        f: "json"
      }
    });
  });

  test("should return empty requestOptions when options is an empty object", () => {
    const result = processOptions({} as IRequestOptions, {
      paramKeys: [],
      extractKeys: []
    });

    expect(result).toEqual({
      requestOptions: {}
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

  test("should return present but explicitly undefined optional properties when included in extractKeys", () => {
    interface TypedOptions extends IRequestOptions {
      id: string;
      routeType: "fastest" | "shortest";
      f: string;
      extra: string;
      optional?: string;
    }

    // User defines object without explicit undefined value
    const options: TypedOptions = {
      id: "route-id",
      routeType: "fastest",
      f: "json",
      extra: "ignored",
      optional: undefined
    };

    const processed = processOptions(options, {
      paramKeys: ["f"],
      extractKeys: ["id", "routeType", "optional"]
    });

    // since optional is on the object, it should be present in the result with a value of undefined
    expect(processed).toHaveProperty("optional");
    expect(processed.optional).toBeUndefined();
  });

  test("should throw when users bypass TypeScript to extractKeys that are not present on options", () => {
    try {
      processOptions(
        {
          f: "json",
          params: {
            outSR: 3857
          }
        },
        {
          paramKeys: ["f"],
          // Simulate a user bypassing TypeScript constraints.
          extractKeys: ["id", "routeType"] as any
        }
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect((e as Error).message).toBe(
        'processOptions() expected extracted key "id" to exist on options.'
      );
    }
  });
});

describe("processOptions strict type validation", () => {
  test("should return extracted keys when all extractKeys are present", () => {
    interface StrictOptions extends IRequestOptions {
      id: string;
      routeType?: "fastest" | "shortest";
      f: string;
    }

    const options: StrictOptions = {
      id: "route-id",
      routeType: "fastest",
      f: "json"
    };

    const processed = processOptions(options, {
      paramKeys: ["f"],
      extractKeys: ["id", "routeType"]
    });

    expect(processed).toHaveProperty("id");
    expect(processed).toHaveProperty("routeType");
    expect(processed).toHaveProperty("requestOptions");
  });

  test("should throw when a valid extractKey is missing from options at runtime", () => {
    interface StrictOptions extends IRequestOptions {
      id: string;
      routeType?: "fastest" | "shortest";
      f: string;
    }

    // routeType is missing from options, but included in extractKeys
    const options: StrictOptions = {
      id: "id",
      f: "json"
    };

    expect(() =>
      processOptions(options, {
        paramKeys: ["f"],
        extractKeys: ["id", "routeType"]
      })
    ).toThrow(
      'processOptions() expected extracted key "routeType" to exist on options.'
    );
  });
});
