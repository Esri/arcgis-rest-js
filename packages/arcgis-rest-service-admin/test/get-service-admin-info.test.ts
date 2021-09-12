/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getServiceAdminInfo } from "../src/get-service-admin-info.js";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { UserSession } from "@esri/arcgis-rest-request";

describe("get-service-admin-info: ", () => {
  afterEach(fetchMock.restore);

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

  it("makes request to the admin url", () => {
    fetchMock.once("*", { foo: "bar" }, { method: "POST" });

    return getServiceAdminInfo(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer",
      MOCK_USER_SESSION
    ).then((result) => {
      const [url]: [string, RequestInit] = fetchMock.lastCall("*");

      expect(result.foo).toBe("bar", "should return the api response");
      expect(fetchMock.calls().matched.length).toBe(
        1,
        "should make one request"
      );
      expect(url).toBe(
        "https://servicesqa.arcgis.com/orgid/arcgis/rest/admin/services/mysevice/FeatureServer"
      );
    });
  });
});
