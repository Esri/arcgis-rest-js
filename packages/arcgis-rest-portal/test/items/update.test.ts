/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import {
  updateItem,
  updateItemInfo,
  updateItemResource,
  moveItem
} from "../../src/items/update.js";

import { ItemSuccessResponse } from "../mocks/items/item.js";

import {
  UpdateItemResourceResponse,
  UpdateItemInfoResponse
} from "../mocks/items/resources.js";

import { attachmentFile, TOMORROW } from "../../../../scripts/test-helpers.js";
import { encodeParam, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { FormData } from "@esri/arcgis-rest-form-data";

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

    test("should update an item, including data", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"],
        extent: [
          [1, 2],
          [3, 4]
        ],
        properties: {
          key: "somevalue"
        },
        text: JSON.stringify({
          values: {
            key: "value"
          }
        })
      };
      await updateItem({ item: fakeItem, ...MOCK_USER_REQOPTS });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "dbouwman"));
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("extent", "1,2,3,4"));
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(encodeParam("text", fakeItem.text));
    });

    test("should update an item with custom params", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"],
        properties: {
          key: "somevalue"
        },
        text: {
          values: {
            key: "value"
          }
        }
      };
      await updateItem({
        item: fakeItem,
        authentication: MOCK_USER_SESSION,
        params: {
          clearEmptyFields: true
        }
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "dbouwman"));
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(
        encodeParam("text", JSON.stringify(fakeItem.text))
      );
      expect(options.body).toContain(encodeParam("clearEmptyFields", true));
    });

    test("should update an item, including data and service proxy params", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"],
        properties: {
          key: "somevalue"
        },
        serviceProxyParams: {
          hitsPerInterval: 2,
          intervalSeconds: 60,
          referrers: ["http://<servername>"]
        },
        text: {
          values: {
            key: "value"
          }
        }
      };

      await updateItem({
        item: fakeItem,
        folderId: "aFolder",
        params: { foo: "bar" },
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/aFolder/items/5bc/update"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("owner", "dbouwman"));
      expect(options.body).toContain(encodeParam("foo", "bar"));
      expect(options.body).toContain(
        encodeParam(
          "serviceProxyParams",
          '{"hitsPerInterval":2,"intervalSeconds":60,"referrers":["http://<servername>"]}'
        )
      );
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(
        encodeParam("text", JSON.stringify(fakeItem.text))
      );
    });

    test("should delete thumbnailUrl if it matches decoratedThumbnail", async () => {
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        access: "private",
        title: "My fake item",
        description: "Updated description",
        thumbnail: "thumbnail.png",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      const itemUrl =
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update";

      fetchMock.once(itemUrl, { success: true });

      await updateItem({
        item: fakeItem,
        params: {
          thumbnailUrl:
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/5bc/info/thumbnail.png"
        },
        authentication: MOCK_USER_SESSION
      });
      expect(fetchMock.called(itemUrl)).toBe(true);
      const [, options] = fetchMock.lastCall(itemUrl)!;
      const body = options.body as any;
      const params = new URLSearchParams(body);
      const thumbnailValue = params.get("thumbnailUrl");
      expect(thumbnailValue).toBeNull();
    });

    test("should update thumbnail when thumbnail is a Blob", async () => {
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        access: "private",
        title: "my fake item",
        description: "old description",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      const itemUrl =
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update";
      const blobThumbnail = new Blob(["thumbnail data"], { type: "image/png" });

      fetchMock.postOnce(itemUrl, { success: true });

      await updateItem({
        item: fakeItem,
        params: { thumbnail: blobThumbnail },
        authentication: MOCK_USER_SESSION
      });
      expect(fetchMock.called(itemUrl)).toBe(true);
      const [, options] = fetchMock.lastCall(itemUrl)!;
      const body = options.body as any;
      const thumbnailValue = body.get("thumbnail");
      expect(typeof thumbnailValue).toBe("object");
      expect((thumbnailValue as Blob).type).toBe("image/png");
    });

    test("should update thumbnailUrl when it differs from decoratedThumbnail", async () => {
      const fakeItem = {
        id: "5bc",
        owner: "dbouwman",
        access: "private",
        title: "My fake item",
        description: "Old description",
        thumbnail: "thumbnail.png",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      const itemUrl =
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update";
      const newThumbnailUrl =
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/new-thumbnail.png";

      fetchMock.postOnce(itemUrl, { success: true });

      await updateItem({
        item: fakeItem,
        params: { thumbnailUrl: newThumbnailUrl },
        authentication: MOCK_USER_SESSION
      });
      expect(fetchMock.called(itemUrl)).toBe(true);
      const [, options] = fetchMock.lastCall(itemUrl)!;
      const body = options.body as any;
      const params = new URLSearchParams(body);
      const thumbnailValue = params.get("thumbnailUrl");
      expect(thumbnailValue).toBe(newThumbnailUrl);
    });

    test("update an item info file", async () => {
      fetchMock.once("*", UpdateItemInfoResponse);

      const file = attachmentFile();
      await updateItemInfo({
        id: "3ef",
        folderName: "subfolder",
        file,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateinfo"
      );
      expect(options.method).toBe("POST");
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("token")).toEqual("fake-token");
        expect(params.get("f")).toEqual("json");
        expect(params.get("file")).toEqual(file);
      }
    });

    test("update an item resource", async () => {
      fetchMock.once("*", UpdateItemResourceResponse);
      await updateItemResource({
        id: "3ef",
        owner: "dbouwman",
        name: "banner.png",
        prefix: "image",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("f")).toEqual("json");
        expect(params.get("fileName")).toEqual("banner.png");
        expect(params.get("resourcesPrefix")).toEqual("image");
        expect(params.get("text")).toEqual("jumbotron");
        expect(params.get("access")).toEqual(null);
        expect(params.get("token")).toEqual("fake-token");
      }
    });

    test("should update a binary resource to an item", async () => {
      fetchMock.once("*", { success: true });
      const file = attachmentFile();

      await updateItemResource({
        id: "3ef",
        // File() is only available in the browser
        resource: file,
        name: "thebigkahuna",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("token")).toEqual("fake-token");
        expect(params.get("f")).toEqual("json");
        expect(params.get("file")).toEqual(file);
        expect(params.get("fileName")).toEqual("thebigkahuna");
      }
    });

    test("update an item resource, no owner passed", async () => {
      fetchMock.once("*", UpdateItemResourceResponse);
      await updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("f")).toEqual("json");
        expect(params.get("fileName")).toEqual("image/banner.png");
        expect(params.get("text")).toEqual("jumbotron");
        expect(params.get("access")).toEqual(null);
        expect(params.get("token")).toEqual("fake-token");
      }
    });

    test("update an item resource with extra params", async () => {
      fetchMock.once("*", UpdateItemResourceResponse);
      await updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("f")).toEqual("json");
        expect(params.get("fileName")).toEqual("image/banner.png");
        expect(params.get("resourcesPrefix")).toEqual("foolder");
        expect(params.get("text")).toEqual("jumbotron");
        expect(params.get("access")).toEqual(null);
        expect(params.get("token")).toEqual("fake-token");
      }
    });

    test("update an item resource to make it secret", async () => {
      fetchMock.once("*", UpdateItemResourceResponse);
      await updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        private: true,
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("f")).toEqual("json");
        expect(params.get("fileName")).toEqual("image/banner.png");
        expect(params.get("access")).toEqual("private");
        expect(params.get("token")).toEqual("fake-token");
      }
    });

    test("update an item resource to spill the beans", async () => {
      fetchMock.once("*", UpdateItemResourceResponse);
      await updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        private: false,
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;
      if (params.get) {
        expect(params.get("f")).toEqual("json");
        expect(params.get("fileName")).toEqual("image/banner.png");
        expect(params.get("text")).toEqual("jumbotron");
        expect(params.get("access")).toEqual("inherit");
        expect(params.get("token")).toEqual("fake-token");
      }
    });

    test("should move an item to a folder", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "7c5";
      await moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
          itemId +
          "/move"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("folder=" + folderId);
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should move an item to the root folder 1", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      await moveItem({
        itemId,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
          itemId +
          "/move"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("folder=%2F&");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should move an item to the root folder 2", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "";
      await moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
          itemId +
          "/move"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("folder=%2F&");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should move an item to the root folder 3", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "/";
      await moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
          itemId +
          "/move"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("folder=%2F&");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });
  }); // auth requests
});
