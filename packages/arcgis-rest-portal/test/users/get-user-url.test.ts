/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-request";

import { getUserUrl } from "../../src/users/get-user-url.js";

describe("getUserUrl", () => {
  it("should encode special characters", () => {
    const session = new UserSession({
      username: "c@sey"
    });

    expect(getUserUrl(session)).toEqual(
      "https://www.arcgis.com/sharing/rest/community/users/c%40sey"
    );
  });

  it("should recognize an explicit ArcGIS Online organization", () => {
    const session = new UserSession({
      username: "c@sey",
      portal: "https://custom.maps.arcgis.com/sharing/rest"
    });

    expect(getUserUrl(session)).toEqual(
      "https://custom.maps.arcgis.com/sharing/rest/community/users/c%40sey"
    );
  });

  it("should recognize ArcGIS Enterprise", () => {
    const session = new UserSession({
      username: "c@sey",
      portal: "https://gis.city.gov/sharing/rest"
    });

    expect(getUserUrl(session)).toEqual(
      "https://gis.city.gov/sharing/rest/community/users/c%40sey"
    );
  });
});
