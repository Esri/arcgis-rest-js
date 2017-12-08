import {
  searchItems,
  getItem,
  getItemData,
  removeItem,
  createItem,
  createItemInFolder,
  updateItem,
  addItemJsonData,
  protectItem,
  unprotectItem,
  getItemResources,
  updateItemResource,
  removeItemResource
} from "../src/index";

import * as fetchMock from "fetch-mock";

import { SearchResponse } from "./mocks/search";

import {
  ItemSuccessResponse,
  ItemResponse,
  ItemDataResponse
} from "./mocks/item";

import {
  GetItemResourcesResponse,
  UpdateItemResourceResponse,
  RemoveItemResourceResponse
} from "./mocks/resources";

import { UserSession, IFetchTokenResponse } from "@esri/arcgis-rest-auth";
import { TOMORROW, YESTERDAY } from "@esri/arcgis-rest-auth/test/utils";

describe("search", () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  });

  afterAll(() => {
    paramsSpy.calls.reset();
  });

  afterEach(fetchMock.restore);

  it("should make a simple, single search request", done => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC AND typekeywords:hubSiteApplication"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
  it("should take num, start, sortField, sortDir and construct the request", done => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      q: "DC AND typekeywords:hubSiteApplication",
      num: 12,
      start: 22,
      sortField: "title",
      sortDir: "desc"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&num=12&start=22&sortField=title&sortDir=desc"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
  it("should return an item by id", done => {
    fetchMock.once("*", ItemResponse);

    getItem("3ef")
      .then(response => {
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
      .then(response => {
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

    it("search should use the portal and token from Auth Manager", done => {
      fetchMock.once("*", SearchResponse);

      searchItems(
        {
          q: "DC AND typekeywords:hubSiteApplication"
        },
        MOCK_USER_REQOPTS
      )
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

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
        .then(response => {
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
      // why not just use item.owner??
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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          expect(paramsSpy).toHaveBeenCalledWith("owner", "dbouwman");
          // ensure the array props are serialized into strings
          expect(paramsSpy).toHaveBeenCalledWith("typeKeywords", "fake, kwds");
          expect(paramsSpy).toHaveBeenCalledWith("tags", "fakey, mcfakepants");
          expect(paramsSpy).toHaveBeenCalledWith(
            "properties",
            JSON.stringify(fakeItem.properties)
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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          expect(paramsSpy).toHaveBeenCalledWith("owner", "dbouwman");
          // ensure the array props are serialized into strings
          expect(paramsSpy).toHaveBeenCalledWith("typeKeywords", "fake, kwds");
          expect(paramsSpy).toHaveBeenCalledWith("tags", "fakey, mcfakepants");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          expect(paramsSpy).toHaveBeenCalledWith(
            "text",
            JSON.stringify(fakeData)
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          expect(paramsSpy).toHaveBeenCalledWith("owner", "dbouwman");
          // ensure the array props are serialized into strings
          expect(paramsSpy).toHaveBeenCalledWith("typeKeywords", "fake, kwds");
          expect(paramsSpy).toHaveBeenCalledWith("tags", "fakey, mcfakepants");
          expect(paramsSpy).toHaveBeenCalledWith(
            "text",
            JSON.stringify(fakeItem.data)
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should protect an item", done => {
      fetchMock.once("*", ItemSuccessResponse);
      protectItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/protect"
          );
          expect(options.method).toBe("POST");
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should unprotect an item", done => {
      fetchMock.once("*", ItemSuccessResponse);
      unprotectItem({
        id: "3ef",
        owner: "dbouwman",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/unprotect"
          );
          expect(options.method).toBe("POST");
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item resources", done => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
          );
          expect(options.method).toBe("POST");
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
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
        content: "image/banner.png",
        name: "jumbotron",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/dbouwman/items/3ef/updateResources"
          );
          expect(options.method).toBe("POST");
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith(
            "fileName",
            "image/banner.png"
          );
          expect(paramsSpy).toHaveBeenCalledWith("text", "jumbotron");
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
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
          expect(paramsSpy).toHaveBeenCalledWith("f", "json");
          expect(paramsSpy).toHaveBeenCalledWith(
            "resource",
            "image/banner.png"
          );
          expect(paramsSpy).toHaveBeenCalledWith("token", "fake-token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  }); // auth requests
});
