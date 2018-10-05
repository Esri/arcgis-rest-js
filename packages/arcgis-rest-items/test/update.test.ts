/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { attachmentFile } from "../../arcgis-rest-feature-service/test/attachments.test";

import { updateItem, updateItemResource, moveItem } from "../src/update";

import { ItemSuccessResponse } from "./mocks/item";

import { UpdateItemResourceResponse } from "./mocks/resources";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("search", () => {
  afterEach(fetchMock.restore);

  describe("Authenticated methods", () => {
    // setup a UserSession to use in all these tests
    const MOCK_USER_SESSION = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "casey",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    const MOCK_USER_REQOPTS = {
      authentication: MOCK_USER_SESSION
    };

    it("should update an item, including data", done => {
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
        data: {
          values: {
            key: "value"
          }
        }
      };
      updateItem({ item: fakeItem, ...MOCK_USER_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(encodeParam("owner", "dbouwman"));
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          expect(options.body).toContain(
            encodeParam("text", JSON.stringify(fakeItem.data))
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should update an item, including data and service proxy params", done => {
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
        data: {
          values: {
            key: "value"
          }
        }
      };

      updateItem({
        item: fakeItem,
        params: { foo: "bar" },
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/5bc/update"
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
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          expect(options.body).toContain(
            encodeParam("text", JSON.stringify(fakeItem.data))
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("update an item resource", done => {
      fetchMock.once("*", UpdateItemResourceResponse);
      updateItemResource({
        id: "3ef",
        owner: "dbouwman",
        name: "image/banner.png",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(
            encodeParam("fileName", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).not.toContain(encodeParam("access", "inherit"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should update a binary resource to an item", done => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      updateItemResource({
        id: "3ef",
        // File() is only available in the browser
        resource: file,
        name: "thebigkahuna",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
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

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("update an item resource, no owner passed", done => {
      fetchMock.once("*", UpdateItemResourceResponse);
      updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(
            encodeParam("fileName", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("update an item resource with extra params", done => {
      fetchMock.once("*", UpdateItemResourceResponse);
      updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(
            encodeParam("fileName", "image/banner.png")
          );
          expect(options.body).toContain("resourcesPrefix=foolder");
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).not.toContain(encodeParam("access", "inherit"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("update an item resource to make it secret", done => {
      fetchMock.once("*", UpdateItemResourceResponse);
      updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        private: true,
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(
            encodeParam("fileName", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(encodeParam("access", "private"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("update an item resource to spill the beans", done => {
      fetchMock.once("*", UpdateItemResourceResponse);
      updateItemResource({
        id: "3ef",
        name: "image/banner.png",
        content: "jumbotron",
        private: false,
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(
            encodeParam("fileName", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(encodeParam("access", "inherit"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should move an item to a folder", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "7c5";
      moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
              itemId +
              "/move"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("folder=" + folderId);
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should move an item to the root folder 1", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      moveItem({
        itemId,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
              itemId +
              "/move"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("folder=%2F&");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should move an item to the root folder 2", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "";
      moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
              itemId +
              "/move"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("folder=%2F&");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should move an item to the root folder 3", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const itemId = "3ef";
      const folderId = "/";
      moveItem({
        itemId,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
              itemId +
              "/move"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("folder=%2F&");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
