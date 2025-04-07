/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getSelf, getPortal } from "../../src/util/get-portal.js";
import { getSubscriptionInfo } from "../../src/util/get-subscription-info.js";

import {
  PortalResponse,
  SubscriptionInfoResponse
} from "./../mocks/portal/response.js";

// setup an authmgr to use in all these tests
const MOCK_AUTH = {
  token: "fake-token",
  getToken() {
    return Promise.resolve("fake-token");
  },
  portal: "https://myorg.maps.arcgis.com/sharing/rest"
};

describe("portal", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("getPortal", () => {
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should get the portal by id", (done) => {
      fetchMock.once("*", PortalResponse);
      getPortal("5BZFaKe", MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
    it("should get the portal self if no id", (done) => {
      fetchMock.once("*", PortalResponse);
      getPortal(null, MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/self?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
  describe("getSelf", () => {
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should get the portal by id", (done) => {
      fetchMock.once("*", PortalResponse);
      getSelf(MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/self?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("getSubscriptionInfo", () => {
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should get the portal subscriptionInfo by id", (done) => {
      fetchMock.once("*", SubscriptionInfoResponse);
      getSubscriptionInfo("5BZFaKe", MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe/subscriptionInfo?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should get the portal self subscriptionInfo if no id", (done) => {
      fetchMock.once("*", SubscriptionInfoResponse);
      getSubscriptionInfo(null, MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/self/subscriptionInfo?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
