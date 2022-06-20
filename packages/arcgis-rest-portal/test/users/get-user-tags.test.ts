/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getUserTags } from "../../src/users/get-user-tags.js";
import { UserTagsResponse } from "../mocks/users/user-tags.js";

import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(fetchMock.restore);

  describe("getUserTags", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      password: "123456",
      token: "fake-token",
      tokenExpires: TOMORROW,
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    it("should make an authenticated request for tags used by a user", (done) => {
      fetchMock.once("*", UserTagsResponse);

      getUserTags({ authentication: session })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/tags"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should make an authenticated request for tags used by a different user", (done) => {
      fetchMock.once("*", UserTagsResponse);

      getUserTags({
        username: "jsmith",
        authentication: session
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith/tags"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
