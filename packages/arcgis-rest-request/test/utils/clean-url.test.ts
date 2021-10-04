/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { cleanUrl } from "../../src/utils/clean-url.js";

const validUrl =
  "https://server.com/arcgis/rest/services/Custom Space/MapServer";

describe("cleanUrl", () => {
  it("should not mangle a valid url", () => {
    expect(
      cleanUrl(
        "https://server.com/arcgis/rest/services/Custom Space/MapServer/"
      )
    ).toEqual(validUrl);
  });

  it("should add a trailing slash", () => {
    expect(
      cleanUrl("https://server.com/arcgis/rest/services/Custom Space/MapServer")
    ).toEqual(validUrl);
  });

  it("should remove leading whitespace", () => {
    expect(
      cleanUrl(
        "  https://server.com/arcgis/rest/services/Custom Space/MapServer/"
      )
    ).toEqual(validUrl);
  });

  it("should remove trailing whitespace", () => {
    expect(
      cleanUrl(
        "https://server.com/arcgis/rest/services/Custom Space/MapServer/   "
      )
    ).toEqual(validUrl);
  });

  it("should do it all at once", () => {
    expect(
      cleanUrl(
        "  https://server.com/arcgis/rest/services/Custom Space/MapServer       "
      )
    ).toEqual(validUrl);
  });
  it("should not throw on a null string", () => {
    expect(cleanUrl(null)).toEqual(null);
  });
});
