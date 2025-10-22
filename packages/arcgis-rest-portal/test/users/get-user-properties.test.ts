/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getUserProperties } from "../../src/users/get-user-properties.js";
import { userPropertiesResponse } from "../mocks/users/user-properties.js";
import fetchMock from "fetch-mock";
import { describe, test, expect, afterEach } from "vitest";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  const session = new ArcGISIdentityManager({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  describe("getUserProperties", () => {
    test("should make a request for user properties", async () => {
      fetchMock.getOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token",
        userPropertiesResponse
      );

      await getUserProperties(session.username, { authentication: session });
      expect(fetchMock.called()).toBe(true);
      const [url, options] = fetchMock.lastCall();
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("should set mapViewer by default", async () => {
      fetchMock.getOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token",
        { properties: {} }
      );

      const response = await getUserProperties(session.username, {
        authentication: session
      });
      expect(fetchMock.called()).toBe(true);
      const [url, options] = fetchMock.lastCall();
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
      expect(response.mapViewer).toBe("modern");
    });
  });
});
