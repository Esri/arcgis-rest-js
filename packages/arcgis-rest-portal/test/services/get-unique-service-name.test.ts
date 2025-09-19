/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as isServiceNameAvailableModule from "../../src/services/is-service-name-available.js";
import fetchMock from "fetch-mock";
import { getUniqueServiceName } from "../../src/services/get-unique-service-name.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("get-unique-service-name:", () => {
  beforeEach(() => {
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

  it("does single check if unique", () => {
    fetchMock.mock("*", { available: true }, { method: "GET" });

    return getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    ).then((result) => {
      const call = fetchMock.lastCall();
      expect(result).toBe("myService", "should return name");
    });
  });

  it("makes multiple calls if already taken", () => {
    fetchMock.get(
      `${MOCK_USER_SESSION.portal}/portals/self/isServiceNameAvailable?f=json&name=myService&type=Feature%20Service&token=fake-token`,
      {
        available: false
      }
    );

    fetchMock.get(
      `${MOCK_USER_SESSION.portal}/portals/self/isServiceNameAvailable?f=json&name=myService_1&type=Feature%20Service&token=fake-token`,
      {
        available: true
      }
    );

    return getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    ).then((result) => {
      expect(result).toBe("myService_1", "should return name");
    });
  });
});
