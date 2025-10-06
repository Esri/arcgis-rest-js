/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { getUniqueServiceName } from "../../src/services/get-unique-service-name.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("get-unique-service-name:", () => {
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

  test("does single check if unique", async () => {
    fetchMock.mock("*", { available: true }, { method: "GET" });

    const result = await getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    );
    expect(result).toBe("myService");
  });

  test("makes multiple calls if already taken and should return unique name", async () => {
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

    const result = await getUniqueServiceName(
      "myService",
      "Feature Service",
      MOCK_USER_SESSION,
      0
    );
    expect(result).toBe("myService_1");
  });
});
