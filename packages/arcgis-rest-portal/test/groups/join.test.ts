/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import { joinGroup, leaveGroup } from "../../src/groups/join.js";

import { GroupEditResponse } from "../mocks/groups/responses.js";

import { encodeParam, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("groups", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("authenticted methods", () => {
    const MOCK_REQOPTS = {
      authentication: new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "fake-token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "casey",
        password: "123456",
        portal: "https://myorg.maps.arcgis.com/sharing/rest"
      })
    };

    test("should help a user join a group", async () => {
      fetchMock.once("*", GroupEditResponse);
      await joinGroup({ id: "5bc", ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/join"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
    test("should help a user leave a group", async () => {
      fetchMock.once("*", GroupEditResponse);
      await leaveGroup({ id: "5bc", ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/leave"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
  });
});
