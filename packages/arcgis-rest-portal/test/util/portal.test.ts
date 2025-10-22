/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { getSelf, getPortal } from "../../src/util/get-portal.js";
import { getSubscriptionInfo } from "../../src/util/get-subscription-info.js";
import {
  PortalResponse,
  SubscriptionInfoResponse
} from "./../mocks/portal/response.js";

describe("portal", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("getPortal", () => {
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

    test("should get the portal by id", async () => {
      fetchMock.once("*", PortalResponse);
      const response = await getPortal("5BZFaKe", MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
    test("should get the portal self if no id", async () => {
      fetchMock.once("*", PortalResponse);
      const response = await getPortal(null, MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });
  describe("getSelf", () => {
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

    test("should get the portal by id", async () => {
      fetchMock.once("*", PortalResponse);
      const response = await getSelf(MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });

  describe("getSubscriptionInfo", () => {
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

    test("should get the portal subscriptionInfo by id", async () => {
      fetchMock.once("*", SubscriptionInfoResponse);
      const response = await getSubscriptionInfo("5BZFaKe", MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe/subscriptionInfo?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("should get the portal self subscriptionInfo if no id", async () => {
      fetchMock.once("*", SubscriptionInfoResponse);
      const response = await getSubscriptionInfo(null, MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/portals/self/subscriptionInfo?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });
});
