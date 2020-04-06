/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { encodeParam } from "../../src/utils/encode-query-string";

describe("encode-query-string", () => {
  it("should encode parameters other than categories", () => {
    const encodedParam = encodeParam("q", "look for this");
    expect(encodedParam).toEqual("q=look%20for%20this");
  });

  it("should encode single categories parameter", () => {
    const encodedParam = encodeParam("categories", ["/Categories/Water,/Categories/Forest"]);
    expect(encodedParam).toEqual("categories=%2FCategories%2FWater%2C%2FCategories%2FForest");
  });

  it("should encode multiple categories parameters", () => {
    const encodedParam = encodeParam("categories", ["/Categories/Water,/Categories/Forest", "/Region/United States"]);
    expect(encodedParam).toEqual(
      "categories=%2FCategories%2FWater%2C%2FCategories%2FForest&categories=%2FRegion%2FUnited%20States");
  });
});
