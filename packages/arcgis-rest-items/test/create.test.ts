/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { createFolder, createItem, createItemInFolder } from "../src/create";

import { ItemSuccessResponse } from "./mocks/item";

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

    it("should create an item with data", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
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
      createItem({
        item: fakeItem,
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("owner=dbouwman");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          expect(options.body).toContain(
            encodeParam("properties", JSON.stringify(fakeItem.properties))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item without an explicit owner", done => {
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
      createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("owner=dbouwman");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          expect(options.body).toContain(
            encodeParam("properties", JSON.stringify(fakeItem.properties))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item with only a username from auth", done => {
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
      createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          // expect(options.body).toContain("owner=casey");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          expect(options.body).toContain(
            encodeParam("properties", JSON.stringify(fakeItem.properties))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item with no tags or typeKeywords", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeItem = {
        title: "my fake item",
        description: "yep its fake",
        snipped: "so very fake",
        type: "Web Mapping Application",
        properties: {
          key: "somevalue"
        }
      };
      createItem({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
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

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item in a folder", done => {
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
      createItemInFolder({
        owner: "dbouwman",
        item: fakeItem,
        folder: "someFolder",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/someFolder/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("owner=dbouwman");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item in a folder and pass through arbitrary params", done => {
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
      createItemInFolder({
        owner: "dbouwman",
        item: fakeItem,
        folder: "someFolder",
        params: {
          foo: "bar"
        },
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/someFolder/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("owner=dbouwman");
          expect(options.body).toContain("foo=bar");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create an item in a folder when no owner is passed", done => {
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
      createItemInFolder({
        item: fakeItem,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addItem"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain("owner=casey");
          // ensure the array props are serialized into strings
          expect(options.body).toContain(
            encodeParam("typeKeywords", "fake, kwds")
          );
          expect(options.body).toContain(
            encodeParam("tags", "fakey, mcfakepants")
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should create a folder", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const title = "an amazing folder";
      createFolder({
        title,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createFolder"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(
            "title=" + title.replace(/\s/g, "%20")
          );
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
