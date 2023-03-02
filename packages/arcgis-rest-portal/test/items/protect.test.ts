/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { protectItem, unprotectItem } from "../../src/items/protect.js";

import { ItemSuccessResponse } from "../mocks/items/item.js";

import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";

describe("search", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("Authenticated methods", () => {
    // setup a ArcGISIdentityManager to use in all these tests
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

    const MOCK_USER_REQOPTS = {
      authentication: MOCK_USER_SESSION
    };

    it("should protect an item", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      protectItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/protect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should protect an item, no owner passed", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      protectItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/protect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should unprotect an item", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      unprotectItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/unprotect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should unprotect an item, no owner passed", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      unprotectItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/unprotect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }); // auth requests
});
