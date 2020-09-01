/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getPortalSettings } from "../../src/util/get-portal-settings";

import { PortalResponse } from "./../mocks/portal/response";

import * as fetchMock from "fetch-mock";

describe("portal", () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  });

  afterAll(() => {
    paramsSpy.calls.reset();
  });

  afterEach(() => fetchMock.restore());

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

    it("should get the portal settings by id", done => {
      fetchMock.once("*", PortalResponse);
      getPortalSettings("5BZFaKe", MOCK_REQOPTS)
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/5BZFaKe/settings?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should get the portal self settings if no id", done => {
      fetchMock.once("*", PortalResponse);
      getPortalSettings(null, MOCK_REQOPTS)
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/self/settings?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
