/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import { createGroup } from "../../src/groups/create.js";
import { updateGroup } from "../../src/groups/update.js";
import { removeGroup } from "../../src/groups/remove.js";

import { GroupEditResponse } from "../mocks/groups/responses.js";

import {
  encodeParam,
  ArcGISIdentityManager,
  IGroupAdd
} from "@esri/arcgis-rest-request";

import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("groups", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("authenticated methods", () => {
    const MOCK_AUTH = new ArcGISIdentityManager({
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

    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    test("should create a group", async () => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        title: "fake group",
        owner: "fakeUser",
        tags: ["foo", "bar"],
        description: "my fake group",
        access: "public"
      } as IGroupAdd;
      await createGroup({ group: fakeGroup, ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/createGroup"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "fakeUser"));
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("tags", "foo,bar"));
      expect(options.body).toContain(encodeParam("access", "public"));
    });

    test("should create a group without an owner or tags", async () => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        title: "bone stock fake group",
        access: "org"
      } as IGroupAdd;
      await createGroup({ group: fakeGroup, ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/createGroup"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("title", "bone stock fake group")
      );
      expect(options.body).toContain(encodeParam("access", "org"));
    });

    test("should update a group", async () => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        id: "5bc",
        title: "fake group",
        owner: "fakeUser",
        tags: ["foo", "bar"],
        description: "my fake group"
      };
      await updateGroup({ group: fakeGroup, ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/update"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "fakeUser"));
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("tags", "foo,bar"));
    });

    test("should update a group with a custom param", async () => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        id: "5bc",
        title: "fake group",
        owner: "fakeUser",
        tags: ["foo", "bar"],
        description: "my fake group"
      };
      await updateGroup({
        group: fakeGroup,
        authentication: MOCK_AUTH,
        params: {
          clearEmptyFields: true
        }
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/update"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "fakeUser"));
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("tags", "foo,bar"));
      expect(options.body).toContain(encodeParam("clearEmptyFields", true));
    });

    test("should remove a group", async () => {
      fetchMock.once("*", GroupEditResponse);
      await removeGroup({ id: "5bc", ...MOCK_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
  });
});
