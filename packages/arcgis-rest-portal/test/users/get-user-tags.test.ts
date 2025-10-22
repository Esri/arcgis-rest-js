/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getUserTags } from "../../src/users/get-user-tags.js";
import { UserTagsResponse } from "../mocks/users/user-tags.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
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
  describe("getUserTags", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      password: "123456",
      token: "fake-token",
      tokenExpires: TOMORROW,
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    test("should make an authenticated request for tags used by a user", async () => {
      fetchMock.once("*", UserTagsResponse);

      await getUserTags({ authentication: session });
      expect(fetchMock.called()).toBe(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/tags"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should make an authenticated request for tags used by a different user", async () => {
      fetchMock.once("*", UserTagsResponse);

      await getUserTags({
        username: "jsmith",
        authentication: session
      });
      expect(fetchMock.called()).toBe(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith/tags"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
  });
});
