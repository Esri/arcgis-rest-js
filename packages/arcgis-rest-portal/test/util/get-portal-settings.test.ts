/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { getPortalSettings } from "../../src/util/get-portal-settings.js";
import { PortalResponse } from "./../mocks/portal/response.js";

describe("portal", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("getPortalSettings", () => {
    // setup an authmgr to use in all these tests
    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("fake-token");
      },
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    };
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    test("should get the portal settings by id", async () => {
      fetchMock.once("*", PortalResponse);
      const response = await getPortalSettings("5BZFaKe", MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe/settings?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("should get the portal self settings if no id", async () => {
      fetchMock.once("*", PortalResponse);
      const response = await getPortalSettings(null, MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/settings?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });
});
