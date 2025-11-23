/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeParam } from "../../src/utils/encode-query-string.js";
import { describe, test, expect } from "vitest";

describe("encodeQueryString", () => {
  test("should encode simple value", () => {
    expect(encodeParam("key", "value")).toEqual("key=value");
  });

  test("should encode array", () => {
    expect(encodeParam("key", ["value1", "value2"])).toEqual(
      "key=value1%2Cvalue2"
    );
  });

  test("should encode array of arrays", () => {
    expect(encodeParam("key", [["value1a", "value1b"], ["value2"]])).toEqual(
      "key=value1a%2Cvalue1b&key=value2"
    );
  });
});
