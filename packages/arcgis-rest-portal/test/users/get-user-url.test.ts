/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getUserUrl } from "../../src/users/get-user-url.js";
import { describe, test, expect } from "vitest";

describe("getUserUrl", () => {
  test("should encode special characters", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey"
    });
    expect(getUserUrl(session)).toBe(
      "https://www.arcgis.com/sharing/rest/community/users/c%40sey"
    );
  });

  test("should recognize an explicit ArcGIS Online organization", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      portal: "https://custom.maps.arcgis.com/sharing/rest"
    });
    expect(getUserUrl(session)).toBe(
      "https://custom.maps.arcgis.com/sharing/rest/community/users/c%40sey"
    );
  });

  test("should recognize ArcGIS Enterprise", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      portal: "https://gis.city.gov/sharing/rest"
    });
    expect(getUserUrl(session)).toBe(
      "https://gis.city.gov/sharing/rest/community/users/c%40sey"
    );
  });
});
