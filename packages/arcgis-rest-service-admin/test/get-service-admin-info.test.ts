/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as requestModule from "@esri/arcgis-rest-request";
import { getServiceAdminInfo } from "../src/get-service-admin-info";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { UserSession } from "@esri/arcgis-rest-auth";

describe("get-service-admin-info: ", () => {
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
  it("makes request to the admin url", () => {
    const spy = spyOn(requestModule, "request").and.callFake(() =>
      Promise.resolve({ foo: "bar" })
    );
    return getServiceAdminInfo(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer",
      MOCK_USER_SESSION
    ).then((result) => {
      expect(result.foo).toBe("bar", "should return the api response");
      expect(spy.calls.count()).toBe(1, "should make one request");
      expect(spy.calls.argsFor(0)[0]).toBe(
        "https://servicesqa.arcgis.com/orgid/arcgis/rest/admin/services/mysevice/FeatureServer"
      );
    });
  });
});
