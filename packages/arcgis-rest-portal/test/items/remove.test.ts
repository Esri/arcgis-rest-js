/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import {
  removeFolder,
  removeItem,
  removeItemResource,
  removeItemRelationship
} from "../../src/items/remove";

import { ItemSuccessResponse } from "../mocks/items/item";

import { RemoveItemResourceResponse } from "../mocks/items/resources";

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

    it("should remove an item", done => {
      fetchMock.once("*", ItemSuccessResponse);
      removeItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove an item, no owner passed", done => {
      fetchMock.once("*", ItemSuccessResponse);
      removeItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should delete an item relationship", done => {
      fetchMock.once("*", { success: true });

      removeItemRelationship({
        originItemId: "3ef",
        destinationItemId: "ae7",
        relationshipType: "Area2CustomPackage",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/deleteRelationship"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("originItemId=3ef");
          expect(options.body).toContain("destinationItemId=ae7");
          expect(options.body).toContain("relationshipType=Area2CustomPackage");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a resource", done => {
      fetchMock.once("*", RemoveItemResourceResponse);
      removeItemResource({
        id: "3ef",
        owner: "dbouwman",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/removeResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(
            encodeParam("resource", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a resource, no owner passed", done => {
      fetchMock.once("*", RemoveItemResourceResponse);
      removeItemResource({
        id: "3ef",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/removeResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(
            encodeParam("resource", "image/banner.png")
          );
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a resource with deleteAll", done => {
      fetchMock.once("*", RemoveItemResourceResponse);
      removeItemResource({
        id: "3ef",
        owner: "dbouwman",
        resource: "image/banner.png",
        deleteAll: true,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/removeResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("deleteAll", "true"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a resource with extra params", done => {
      fetchMock.once("*", RemoveItemResourceResponse);
      removeItemResource({
        id: "3ef",
        resource: "image/banner.png",
        ...MOCK_USER_REQOPTS,
        params: {
          deleteAll: true
        }
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
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
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a folder", done => {
      fetchMock.once("*", ItemSuccessResponse);
      removeFolder({
        folderId: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/3ef/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a folder, no owner passed", done => {
      fetchMock.once("*", ItemSuccessResponse);
      removeFolder({
        folderId: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/3ef/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
