/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as isServiceNameAvailableModule from "../../src/services/is-service-name-available.js";

import { getUniqueServiceName } from "../../src/services/get-unique-service-name.js";
import { UserSession } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("get-unique-service-name:", () => {
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
  xit("does single check if unique", () => {
    const spy = spyOn(
      isServiceNameAvailableModule,
      "isServiceNameAvailable"
    ).and.callFake(() => Promise.resolve({ available: true }));
    return getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    ).then((result) => {
      expect(result).toBe("myService", "should return name");
      expect(spy.calls.count()).toBe(1, "should check one name");
    });
  });

  xit("makes multiple calls if already taken", () => {
    let callNum = 1;
    const spy = spyOn(
      isServiceNameAvailableModule,
      "isServiceNameAvailable"
    ).and.callFake(() => {
      const result = callNum === 2;
      callNum++;
      return Promise.resolve({ available: result });
    });
    return getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    ).then((result) => {
      expect(result).toBe("myService_1", "should return name");
      expect(spy.calls.count()).toBe(2, "should check two names");
    });
  });
});
