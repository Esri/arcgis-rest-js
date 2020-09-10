/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import {
  getItemBaseUrl,
  getItem,
  getItemData,
  getItemResources,
  getItemGroups,
  getItemStatus,
  getItemParts,
  getRelatedItems
} from "../../src/items/get";

import {
  ItemResponse,
  ItemDataResponse,
  ItemGroupResponse,
  RelatedItemsResponse
} from "../mocks/items/item";

import { GetItemResourcesResponse } from "../mocks/items/resources";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

describe("get base url", () => {
  it("should return base url when passed a portal url", () => {
    const id = "foo";
    const portalUrl = "https://org.maps.arcgis.com/sharing/rest/";
    const result = getItemBaseUrl(id, portalUrl);
    expect(result).toBe(`${portalUrl}/content/items/${id}`);
  });
});

describe("get", () => {
  afterEach(fetchMock.restore);

  it("should return an item by id", done => {
    fetchMock.once("*", ItemResponse);

    getItem("3ef")
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef?f=json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return an item data by id", done => {
    fetchMock.once("*", ItemDataResponse);

    getItemData("3ef")
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return binary item data by id", done => {
    // Blob() is only available in the browser
    if (typeof window !== "undefined") {
      fetchMock.once("*", {
        sendAsJson: false,
        headers: { "Content-Type": "application/zip" },
        body: new Blob()
      });

      getItemData("3ef", { file: true })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/data"
          );
          expect(options.method).toBe("GET");
          expect(response instanceof Blob).toBeTruthy();
          done();
        })
        .catch(e => {
          fail(e);
        });
    } else {
      done();
    }
  });

  it("should return a valid response even when no data is retrieved", done => {
    fetchMock.once("*", {
      sendAsJson: false,
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: ""
    });

    getItemData("3ef")
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
        );
        expect(options.method).toBe("GET");
        expect(response).toBe(undefined);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return related items", done => {
    fetchMock.once("*", RelatedItemsResponse);

    getRelatedItems({
      id: "3ef",
      relationshipType: "Service2Layer"
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return related items for more than one relationship type", done => {
    fetchMock.once("*", RelatedItemsResponse);

    getRelatedItems({
      id: "3ef",
      relationshipType: ["Service2Layer", "Area2CustomPackage"]
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipTypes=Service2Layer%2CArea2CustomPackage"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

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

    it("should return an item by id using a token", done => {
      fetchMock.once("*", ItemResponse);

      getItem("3ef", MOCK_USER_REQOPTS)
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should return an item data by id using a token", done => {
      fetchMock.once("*", ItemDataResponse);

      getItemData("3ef", MOCK_USER_REQOPTS)
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/data?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get related items", done => {
      fetchMock.once("*", RelatedItemsResponse);
      getRelatedItems({
        id: "3ef",
        relationshipType: "Service2Layer",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item resources", done => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources("3ef", {
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item resources with extra parameters", done => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources("3ef", {
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("resourcesPrefix=foolder");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item groups anonymously", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemGroups("3ef")
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/groups"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item groups with credentials", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemGroups("3ef", { authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/groups"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item status", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemStatus({ id: "3ef", authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/status"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item status with optional parameters", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemStatus({
        id: "3ef",
        owner: "joe",
        jobType: "publish",
        jobId: "1dw",
        authentication: MOCK_USER_SESSION
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/status"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("jobType=publish");
          expect(options.body).toContain("jobId=1dw");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item parts", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemParts({ id: "3ef", authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/parts"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item parts with the owner parameter", done => {
      fetchMock.once("*", ItemGroupResponse);
      getItemParts({
        id: "3ef",
        owner: "joe",
        authentication: MOCK_USER_SESSION
      })
        .then(() => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/parts"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
