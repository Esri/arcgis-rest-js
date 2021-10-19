/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getViewSources } from "../src/get-view-sources.js";
import { UserSession } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../scripts/test-helpers.js";

describe("get-view-sources: ", () => {
  const MOCK_USER_SESSION = new UserSession({
    clientId: "clientId",
    redirectUri: "https://example-app.com/redirect-uri",
    token: "fake-token",
    tokenExpires: TOMORROW,
    refreshToken: "refreshToken",
    refreshTokenExpires: TOMORROW,
    refreshTokenTTL: 1440,
    username: "casey",
    password: "123456",
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });
  afterEach(fetchMock.restore);
  
  it("makes request to the admin url", () => {
    fetchMock.once("*", { currentVersion: 1234 }, { method: "POST" });

    return getViewSources(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer",
      MOCK_USER_SESSION
    ).then((result) => {
      expect(result.currentVersion).toBe(
        1234,
        "should return the api response"
      );

      const [url]: [string, RequestInit] = fetchMock.lastCall("*");

      expect(fetchMock.calls().matched.length).toBe(
        1,
        "should make one request"
      );

      expect(url).toContain(
        "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer/sources"
      );
    });
  });
});
