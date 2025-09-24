/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import { getServiceAdminInfo } from "../src/getServiceAdminInfo.js";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

describe("getServiceAdminInfo: ", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  const MOCK_USER_SESSION = new ArcGISIdentityManager({
    clientId: "clientId",
    redirectUri: "https://example-app.com/redirect-uri",
    token: "fake-token",
    tokenExpires: TOMORROW,
    refreshToken: "refreshToken",
    refreshTokenExpires: TOMORROW,
    username: "casey",
    password: "123456",
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  test("should return the api response when making a request to the admin url", async () => {
    fetchMock.once("*", { foo: "bar" }, { method: "POST" });

    const response = await getServiceAdminInfo(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer",
      MOCK_USER_SESSION
    );

    const [url] = fetchMock.lastCall("*");

    expect(response.foo).toBe("bar");
    expect(url).toBe(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/admin/services/mysevice/FeatureServer"
    );
  });
});
