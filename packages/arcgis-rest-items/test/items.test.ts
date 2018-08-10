import * as fetchMock from "fetch-mock";

import { attachmentFile } from "../../arcgis-rest-feature-service/test/attachments.test";

import {
  searchItems,
  getItem,
  getItemData,
  removeItem,
  createItem,
  createItemInFolder,
  updateItem,
  addItemJsonData,
  addItemData,
  protectItem,
  unprotectItem,
  getItemResources,
  updateItemResource,
  removeItemResource,
  ISearchRequestOptions
} from "../src/index";

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

import { SearchResponse } from "./mocks/search";
import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("search", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single search request", done => {
    fetchMock.once("*", SearchResponse);

    searchItems("DC AND typekeywords:hubSiteApplication")
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
      searchForm: {
        q: "DC AND typekeywords:hubSiteApplication",
        num: 12,
        start: 22,
        sortField: "title",
        sortDir: "desc"
      }
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

  it("should pass through other requestOptions at the same time", done => {
    fetchMock.once("*", SearchResponse);

    searchItems({
      searchForm: {
        q: "DC AND typekeywords:hubSiteApplication",
        num: 12,
        start: 22,
        sortField: "title",
        sortDir: "desc"
      },
      httpMethod: "POST"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/search");
        expect(options.body).toContain(
          "q=DC%20AND%20typekeywords%3AhubSiteApplication&num=12&start=22&sortField=title&sortDir=desc"
        );
        expect(options.method).toBe("POST");
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

      const MOCK_USER_REQOPTS_SEARCH = MOCK_USER_REQOPTS as ISearchRequestOptions;

      MOCK_USER_REQOPTS_SEARCH.searchForm = {
        q: "DC AND typekeywords:hubSiteApplication"
      };

      searchItems(MOCK_USER_REQOPTS_SEARCH)
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
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should protect an item, no owner passed", done => {
      fetchMock.once("*", ItemSuccessResponse);
      protectItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/protect"
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
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should unprotect an item, no owner passed", done => {
      fetchMock.once("*", ItemSuccessResponse);
      unprotectItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/unprotect"
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
          expect(options.body).toContain("f=json");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("get item resources with extra parameters", done => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources({
        id: "3ef",
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      })
        .then(response => {
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
          expect(options.body).toContain(encodeParam("token", "fake-token"));
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
          expect(options.body).toContain("resourcesPrefix=foolder");
          expect(options.body).toContain(encodeParam("text", "jumbotron"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
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
  }); // auth requests
});
