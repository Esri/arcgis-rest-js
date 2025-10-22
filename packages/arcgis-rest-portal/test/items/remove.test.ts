/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import {
  removeFolder,
  removeItem,
  removeItemResource,
  removeItemRelationship,
  removeItemThumbnail
} from "../../src/items/remove.js";

import { ItemSuccessResponse } from "../mocks/items/item.js";

import { RemoveItemResourceResponse } from "../mocks/items/resources.js";

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

    test("should remove an item", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      await removeItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should remove an item, no owner passed", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      await removeItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should delete an item relationship", async () => {
      fetchMock.once("*", { success: true });

      await removeItemRelationship({
        originItemId: "3ef",
        destinationItemId: "ae7",
        relationshipType: "Area2CustomPackage",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/deleteRelationship"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("originItemId=3ef");
      expect(options.body).toContain("destinationItemId=ae7");
      expect(options.body).toContain("relationshipType=Area2CustomPackage");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=fake-token");
    });

    test("should remove a resource", async () => {
      fetchMock.once("*", RemoveItemResourceResponse);
      await removeItemResource({
        id: "3ef",
        owner: "dbouwman",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/removeResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(
        encodeParam("resource", "image/banner.png")
      );
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should remove a resource, no owner passed", async () => {
      fetchMock.once("*", RemoveItemResourceResponse);
      await removeItemResource({
        id: "3ef",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/removeResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(
        encodeParam("resource", "image/banner.png")
      );
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should remove a resource with deleteAll", async () => {
      fetchMock.once("*", RemoveItemResourceResponse);
      await removeItemResource({
        id: "3ef",
        owner: "dbouwman",
        resource: "image/banner.png",
        deleteAll: true,
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/removeResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("deleteAll", "true"));
    });

    test("should remove a resource with extra params", async () => {
      fetchMock.once("*", RemoveItemResourceResponse);
      await removeItemResource({
        id: "3ef",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS,
        params: {
          deleteAll: true
        }
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/removeResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("deleteAll", "true"));
      expect(options.body).toContain(
        encodeParam("resource", "image/banner.png")
      );
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should remove a folder", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      await removeFolder({
        folderId: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/3ef/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should remove a folder, no owner passed", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      await removeFolder({
        folderId: "3ef",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/3ef/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should delete an item's thumbnail successfully", async () => {
      fetchMock.once("*", { success: true });

      await removeItemThumbnail({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/deleteThumbnail"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
  }); // auth requests
});
