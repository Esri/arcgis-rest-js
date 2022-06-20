/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeParam } from "../../src/utils/encode-query-string.js";

describe("encodeQueryString", () => {
  it("should encode simple value", () => {
    expect(encodeParam("key", "value")).toEqual("key=value");
  });

  it("should encode array", () => {
    expect(encodeParam("key", ["value1", "value2"])).toEqual(
      "key=value1%2Cvalue2"
    );
  });

  it("should encode array of arrays", () => {
    expect(encodeParam("key", [["value1a", "value1b"], ["value2"]])).toEqual(
      "key=value1a%2Cvalue1b&key=value2"
    );
  });
});
