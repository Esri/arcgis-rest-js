/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { protectGroup, unprotectGroup } from "../src/protect";

import { GroupEditResponse } from "./mocks/responses";

import { encodeParam } from "@esri/arcgis-rest-request";
import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(fetchMock.restore);

  describe("authenticted methods", () => {
    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("fake-token");
      },
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    };
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should protect a group", done => {
      fetchMock.once("*", GroupEditResponse);

      protectGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/protect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should unprotect a group", done => {
      fetchMock.once("*", GroupEditResponse);

      unprotectGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/unprotect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
