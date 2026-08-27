/* Copyright (c) 2026 Environmental Systems Research Institute, Inc. */

import { describe, expect, test } from "vitest";
import { processOptionsStrict } from "../../src/utils/process-options-strict.js";
import { IRequestOptions } from "../../src/utils/IRequestOptions.js";

describe("processOptionsStrict", () => {
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

    const processed = processOptionsStrict(options, {
      paramKeys: ["f"],
      extractKeys: ["id", "routeType"]
    });

    const idTypeCheck: string = processed.id;
    expect(idTypeCheck).toBe("route-id");

    expect(processed).toEqual(
      expect.objectContaining({
        id: "route-id",
        routeType: "fastest",
        requestOptions: expect.objectContaining({
          params: {
            f: "json"
          }
        })
      })
    );
  });

  test("should throw when an extractKey is missing from options", () => {
    interface StrictOptions extends IRequestOptions {
      id: string;
      routeType?: "fastest" | "shortest";
      f: string;
    }

    const options: StrictOptions = {
      id: "route-id",
      f: "json"
    };

    expect(() =>
      processOptionsStrict(options, {
        paramKeys: ["f"],
        extractKeys: ["id", "routeType"]
      })
    ).toThrow(
      'processOptionsStrict() expected extracted key "routeType" to exist on options.'
    );
  });

  test("should return extracted keys when all extractKeys are present", () => {
    interface StrictOptions extends IRequestOptions {
      id: string;
      routeType?: "fastest" | "shortest";
      f: string;
      optional?: string;
      optionalNotDefined?: string;
    }

    const options: StrictOptions = {
      id: "route-id",
      routeType: "fastest",
      f: "json",
      optional: "optional-value"
    };

    const processed = processOptionsStrict(options, {
      paramKeys: ["f"],
      extractKeys: ["id", "routeType", "optional"]
    });

    const idTypeCheck: string = processed.id;
    expect(idTypeCheck).toBe("route-id");

    expect(processed).toEqual(
      expect.objectContaining({
        id: "route-id",
        routeType: "fastest",
        requestOptions: expect.objectContaining({
          params: {
            f: "json"
          }
        })
      })
    );
  });
});
