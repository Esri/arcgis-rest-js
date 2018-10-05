/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { attachmentFile } from "../../arcgis-rest-feature-service/test/attachments.test";

import { addItemJsonData, addItemData, addItemResource } from "../src/add";

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

    it("should add data to an item", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemJsonData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemJsonData({
        id: "3ef",
        owner: "dbouwman",
        data: fakeData,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/update"
          );
          expect(options.method).toBe("POST");

          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");
          expect(options.body).toContain(
            encodeParam("text", JSON.stringify(fakeData))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should add data to an item, no owner passed", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemJsonData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemJsonData({
        id: "3ef",
        data: fakeData,
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/update"
          );
          expect(options.method).toBe("POST");

          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");
          expect(options.body).toContain(
            encodeParam("text", JSON.stringify(fakeData))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should add data to an item, extra parameters", done => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemJsonData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemJsonData({
        id: "3ef",
        data: fakeData,
        ...MOCK_USER_REQOPTS,
        params: {
          relationshipType: "WMA2Code"
        }
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/update"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("relationshipType=WMA2Code");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");
          expect(options.body).toContain(
            encodeParam("text", JSON.stringify(fakeData))
          );

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should add binary item data by id", done => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      addItemData({
        id: "3ef",
        // File() is only available in the browser
        data: file,
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/update"
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          const params = options.body as FormData;
          if (params.get) {
            expect(params.get("token")).toEqual("fake-token");
            expect(params.get("f")).toEqual("json");
            expect(params.get("file")).toEqual(file);
          }

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should add a binary resource to an item", done => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      addItemResource({
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
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/addResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          const params = options.body as FormData;
          if (params.get) {
            expect(params.get("token")).toEqual("fake-token");
            expect(params.get("f")).toEqual("json");
            expect(params.get("file")).toEqual(file);
            expect(params.get("access")).toEqual("inherit");
            expect(params.get("fileName")).toEqual("thebigkahuna");
          }

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should add a binary resource to a secret item", done => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      addItemResource({
        id: "3ef",
        // File() is only available in the browser
        resource: file,
        name: "thebigkahuna",
        private: true,
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/addResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          const params = options.body as FormData;
          if (params.get) {
            expect(params.get("token")).toEqual("fake-token");
            expect(params.get("f")).toEqual("json");
            expect(params.get("file")).toEqual(file);
            expect(params.get("access")).toEqual("private");
            expect(params.get("fileName")).toEqual("thebigkahuna");
          }

          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
