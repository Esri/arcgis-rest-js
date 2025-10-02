/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IUserProperties } from "../../src/users/get-user-properties.js";
import { setUserProperties } from "../../src/users/set-user-properties.js";
import {
  userSetPropertiesResponseFailure,
  userSetPropertiesResponseSuccess
} from "../mocks/users/user-properties.js";

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

  describe("setUserProperties", () => {
    test("should make a request to set user properties", async () => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties",
        userSetPropertiesResponseSuccess
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      };

      await setUserProperties(session.username, properties, {
        authentication: session
      });

      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall();
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties"
      );
      expect(options.method).toBe("POST");
    });

    test("should handle set user property errors", async () => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties",
        userSetPropertiesResponseFailure
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      };

      await expect(
        setUserProperties(session.username, properties, {
          authentication: session
        })
      ).rejects.toThrow();

      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall();
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties"
      );
      expect(options.method).toBe("POST");
    });
  });
});
