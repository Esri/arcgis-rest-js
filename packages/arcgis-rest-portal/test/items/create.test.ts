/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import {
  createFolder,
  createItem,
  createItemInFolder
} from "../../src/items/create.js";

import { ItemSuccessResponse } from "../mocks/items/item.js";

import { TOMORROW } from "../../../../scripts/test-helpers.js";
import {
  ArcGISIdentityManager,
  encodeParam,
  File
} from "@esri/arcgis-rest-request";

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

    test("should create an item with data", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
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
        data: {
          values: {
            key: "value"
          }
        }
      };
      await createItem({
        item: fakeItem,
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain("owner=dbouwman");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("extent", "1,2,3,4"));
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(
        encodeParam("properties", JSON.stringify(fakeItem.properties))
      );
    });

    test("should create an item without an explicit owner", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        title: "my fake item",
        owner: "dbouwman",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"],
        properties: {
          key: "somevalue"
        }
      };
      await createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain("owner=dbouwman");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(
        encodeParam("properties", JSON.stringify(fakeItem.properties))
      );
    });

    test("should create an item with only a username from auth", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"],
        properties: {
          key: "somevalue"
        }
      };
      // why not just use item.owner??
      await createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      // expect(options.body).toContain("owner=casey");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
      expect(options.body).toContain(
        encodeParam("properties", JSON.stringify(fakeItem.properties))
      );
    });

    test("should create an item with no tags or typeKeywords", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        title: "my fake item",
        description: "yep its fake",
        snippet: "so very fake",
        type: "Web Mapping Application",
        properties: {
          key: "somevalue"
        }
      };
      await createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("type", "Web Mapping Application")
      );
      // ensure the array props are serialized into strings
      expect(options.body).toContain(
        encodeParam("properties", JSON.stringify(fakeItem.properties))
      );
    });

    test("should create an item in a folder", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        owner: "dbouwman",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      await createItemInFolder({
        owner: "dbouwman",
        item: fakeItem,
        folderId: "fe8",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/fe8/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain("owner=dbouwman");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
    });

    test("should create an item in a folder and pass through arbitrary params", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        owner: "dbouwman",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      await createItemInFolder({
        owner: "dbouwman",
        item: fakeItem,
        folderId: "fe8",
        params: {
          foo: "bar"
        },
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/fe8/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain("owner=dbouwman");
      expect(options.body).toContain("foo=bar");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
    });

    test("should create an item in a folder when no owner is passed", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        owner: "casey",
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        typeKeywords: ["fake", "kwds"],
        tags: ["fakey", "mcfakepants"]
      };
      await createItemInFolder({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addItem"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain("owner=casey");
      // ensure the array props are serialized into strings
      expect(options.body).toContain(encodeParam("typeKeywords", "fake,kwds"));
      expect(options.body).toContain(encodeParam("tags", "fakey,mcfakepants"));
    });

    test("should create a folder", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const title = "an amazing folder";
      await createFolder({
        title,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createFolder"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("title=" + title.replace(/\s/g, "%20"));
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
    });

    test("should throw an error for a multipart request with no file name", async () => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        owner: "casey",
        title: "my fake item",
        type: "Web Mapping Application"
      };
      fetchMock.post("*", () => 200);
      await expect(
        createItemInFolder({
          item: fakeItem,
          file: new File(["some text"], undefined as unknown as string, {
            type: "text/html"
          }),
          multipart: true,
          // multipart is required for a multipart request
          filename: "",
          ...MOCK_USER_REQOPTS
        })
      ).rejects.toThrow("The filename is required for a multipart request.");
      expect(fetchMock.called()).toEqual(false);
    });
  }); // auth requests
});
