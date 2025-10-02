/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getUser } from "../../src/users/get-user.js";
import { describe, test, expect, afterEach } from "vitest";

import {
  AnonUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse
} from "../mocks/users/user.js";

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("getUser", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      password: "123456",
      token: "fake-token",
      tokenExpires: TOMORROW,
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    test("should make a simple, unauthenticated request for information about a user", async () => {
      fetchMock.once("*", AnonUserResponse);

      await getUser("jsmith");
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/community/users/jsmith?f=json"
      );
      expect(options.method).toBe("GET");
    });

    test("should make an authenticated request for information about a user", async () => {
      fetchMock.once("*", GroupMemberUserResponse);

      await getUser({ authentication: session });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("should make an authenticated request for information about a different user", async () => {
      fetchMock.once("*", GroupAdminUserResponse);

      await getUser({
        username: "jsmith",
        authentication: session
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });
});
