/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";

import {
  addItemData,
  addItemResource,
  addItemRelationship
} from "../../src/items/add.js";

import { ItemSuccessResponse } from "../mocks/items/item.js";

import { attachmentFile, TOMORROW } from "../../../../scripts/test-helpers.js";
import { encodeParam, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { FormData } from "@esri/arcgis-rest-form-data";

describe("search", () => {
  beforeEach(() => {
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

    it("should add data to an item", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemData({
        id: "3ef",
        owner: "dbouwman",
        text: JSON.stringify(fakeData),
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
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
        .catch((e) => {
          fail(e);
        });
    });

    it("should add data to an item, no owner passed", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemData({
        id: "3ef",
        text: JSON.stringify(fakeData),
        ...MOCK_USER_REQOPTS
      })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
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
        .catch((e) => {
          fail(e);
        });
    });

    it("should add data to an item, extra parameters", (done) => {
      fetchMock.once("*", ItemSuccessResponse);
      const fakeData = {
        values: {
          key: "someValue"
        }
      };
      // addItemData("3ef", "dbouwman", fakeData, MOCK_REQOPTS)
      addItemData({
        id: "3ef",
        text: JSON.stringify(fakeData),
        ...MOCK_USER_REQOPTS,
        params: {
          relationshipType: "WMA2Code"
        }
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
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
        .catch((e) => {
          fail(e);
        });
    });

    it("should add binary item data by id", (done) => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      addItemData({
        // this would work on item: { type: "Code Sample" }
        id: "3ef",
        file,
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/update"
          );
          expect(options.method).toBe("POST");
          expect(options.body instanceof FormData).toBeTruthy();
          // to do: figure out how to inspect these parameters from Node.js
          const params = options.body as FormData;
          if (params.get) {
            expect(params.get("token")).toEqual("fake-token");
            expect(params.get("f")).toEqual("json");
            expect(params.get("file")).toEqual(file);
          }

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should add a relationship to an item", (done) => {
      fetchMock.once("*", { success: true });

      addItemRelationship({
        originItemId: "3ef",
        destinationItemId: "ae7",
        relationshipType: "Area2CustomPackage",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/addRelationship"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("originItemId=3ef");
          expect(options.body).toContain("destinationItemId=ae7");
          expect(options.body).toContain("relationshipType=Area2CustomPackage");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should add a binary resource to an item", (done) => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      addItemResource({
        id: "3ef",
        // File() is only available in the browser
        resource: file,
        name: "thebigkahuna",
        prefix: "myfiles",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
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
            expect(params.get("resourcesPrefix")).toEqual("myfiles");
          }

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should add a binary resource to a secret item", (done) => {
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
          const [url, options] = fetchMock.lastCall("*");
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
        .catch((e) => {
          fail(e);
        });
    });

    it("should add a text resource", (done) => {
      fetchMock.once("*", {
        success: true
      });

      addItemResource({
        id: "3ef",
        content: "Text content",
        name: "thebigkahuna.txt",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/addResources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("text=Text%20content");
          expect(options.body).toContain("fileName=thebigkahuna");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }); // auth requests
});
