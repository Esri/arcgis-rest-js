/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { isServiceNameAvailable } from "../../src/services/is-service-name-available.js";
import { UserSession } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("is-service-name-available", () => {
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

  it("returns server response", () => {
    fetchMock.once("*", { available: true }, { method: "GET" });

    return isServiceNameAvailable(
      "someService",
      "Feature Service",
      MOCK_USER_SESSION
    ).then((result) => {
      const [url]: [string, RequestInit] = fetchMock.lastCall("*");

      expect(result.available).toBe(true, "should return the api response");
      expect(url).toContain(
        `${MOCK_USER_SESSION.portal}/portals/self/isServiceNameAvailable`
      );
      expect(url).toContain("name=someService");
      expect(url).toContain("type=Feature");
    });
  });
});
