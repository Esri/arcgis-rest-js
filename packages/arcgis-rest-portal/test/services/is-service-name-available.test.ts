/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as requestModule from "@esri/arcgis-rest-request";
import { isServiceNameAvailable } from "../../src/services/is-service-name-available";
import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

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
    portal: "https://myorg.maps.arcgis.com/sharing/rest",
  });

  it("returns server response", () => {
    const spy = spyOn(requestModule, "request").and.callFake(() =>
      Promise.resolve({ available: true })
    );
    return isServiceNameAvailable(
      "someService",
      "Feature Service",
      MOCK_USER_SESSION
    ).then((result) => {
      expect(result.available).toBe(true, "should return the api response");
      expect(spy.calls.count()).toBe(1, "should make one request");
      expect(spy.calls.argsFor(0)[0]).toBe(
        `${MOCK_USER_SESSION.portal}/portals/self/isServiceNameAvailable`
      );
      const opts = spy.calls.argsFor(0)[1];

      expect(opts.params.name).toBe(
        "someService",
        "passes in the service name"
      );
      expect(opts.params.type).toBe("Feature Service", "passes in the type");
    });
  });
});
