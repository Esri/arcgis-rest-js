/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import {
  IGetItemInfoOptions,
  getItemBaseUrl,
  getItem,
  getItemData,
  getItemResources,
  getItemGroups,
  getItemStatus,
  getItemParts,
  getRelatedItems,
  getItemInfo,
  getItemMetadata,
  getItemResource
} from "../../src/items/get.js";

import {
  ItemResponse,
  ItemDataResponse,
  ItemGroupResponse,
  RelatedItemsResponse,
  ItemInfoResponse,
  ItemMetadataResponse,
  ItemFormJsonResponse
} from "../mocks/items/item.js";

import { GetItemResourcesResponse } from "../mocks/items/resources.js";

import {
  ArcGISIdentityManager,
  IAuthenticationManager
} from "@esri/arcgis-rest-request";

import { TOMORROW } from "../../../../scripts/test-helpers.js";

describe("get base url", () => {
  it("should return base url when passed a portal url", () => {
    const id = "foo";
    const portalUrl = "https://org.maps.arcgis.com/sharing/rest/";
    const result = getItemBaseUrl(id, portalUrl);
    expect(result).toBe(`${portalUrl}/content/items/${id}`);
  });
});

describe("get", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it("should return an item by id", (done) => {
    fetchMock.once("*", ItemResponse);

    getItem("3ef")
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef?f=json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return an item data by id", (done) => {
    fetchMock.once("*", ItemDataResponse);

    getItemData("3ef")
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return binary item data by id", (done) => {
    // Blob() is only available in the browser
    if (typeof window !== "undefined") {
      fetchMock.once("*", {
        sendAsJson: false,
        headers: { "Content-Type": "application/zip" },
        body: new Blob()
      });

      getItemData("3ef", { file: true })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/data"
          );
          expect(options.method).toBe("GET");
          expect(response instanceof Blob).toBeTruthy();
          done();
        })
        .catch((e) => {
          fail(e);
        });
    } else {
      done();
    }
  });

  it("should return a valid response even when no data is retrieved", (done) => {
    fetchMock.once(
      "*",
      {
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: ""
      },
      {
        sendAsJson: false
      }
    );

    getItemData("3ef")
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
        );
        expect(options.method).toBe("GET");
        expect(response).toBe(undefined);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return related items", (done) => {
    fetchMock.once("*", RelatedItemsResponse);

    getRelatedItems({
      id: "3ef",
      relationshipType: "Service2Layer"
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return related items for more than one relationship type", (done) => {
    fetchMock.once("*", RelatedItemsResponse);

    getRelatedItems({
      id: "3ef",
      relationshipType: ["Service2Layer", "Area2CustomPackage"]
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipTypes=Service2Layer%2CArea2CustomPackage"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return item info by id", (done) => {
    fetchMock.once("*", ItemInfoResponse);

    getItemInfo("3ef")
      .then((response) => {
        expect(response).toBe(ItemInfoResponse);
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/info/iteminfo.xml"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return raw response item info if desired", (done) => {
    fetchMock.once("*", ItemFormJsonResponse);

    getItemInfo("3ef", {
      fileName: "form.json",
      rawResponse: true
    } as IGetItemInfoOptions)
      .then((response) => response.json())
      .then((formJson) => {
        expect(formJson).toEqual(ItemFormJsonResponse);
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/info/form.json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return item info JSON files", (done) => {
    fetchMock.once("*", ItemFormJsonResponse);

    getItemInfo("3ef", {
      fileName: "form.json",
      readAs: "json"
    } as IGetItemInfoOptions)
      .then((formJson) => {
        expect(formJson).toEqual(ItemFormJsonResponse);
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/info/form.json"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should return item metadata", (done) => {
    fetchMock.once("*", ItemMetadataResponse);
    const fileName = "metadata/metadata.xml";
    getItemMetadata("3ef")
      .then((response) => {
        expect(response).toBe(ItemMetadataResponse);
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/3ef/info/metadata/metadata.xml"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  describe("getItem thumbnail decoration", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    const MOCK_ITEM = {
      id: "3ef",
      title: "Item",
      thumbnail: "thumb.png"
    };

    it("should decorate public item thumbnail without token", (done) => {
      fetchMock.once("*", MOCK_ITEM);

      getItem("3ef")
        .then((item) => {
          expect(item.thumbnailUrl).toBe(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/info/thumb.png"
          );
          done();
        })
        .catch((e) => fail(e));
    });

    it("should decorate private item thumbnail with token", async () => {
      fetchMock.once("*", MOCK_ITEM);

      const fakeAuthManager = {
        getToken: (_url: string) => Promise.resolve("fake-token"),
        portal: "https://www.arcgis.com/sharing/rest"
      } as IAuthenticationManager;

      const item = await getItem("3ef", { authentication: fakeAuthManager });

      expect(item.thumbnailUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/info/thumb.png?fake-token"
      );
    });

    it("should not append token if item is public even with auth manager", async () => {
      fetchMock.once("*", { ...MOCK_ITEM, access: "public" });
      const fakeAuthManager = {
        getToken: () => Promise.resolve("fake-token"),
        portal: "https://www.arcgis.com/sharing/rest"
      } as IAuthenticationManager;

      const item = await getItem("3ef", { authentication: fakeAuthManager });
      expect(item.thumbnailUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/info/thumb.png"
      );
    });
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

    it("should return an item by id using a token", (done) => {
      fetchMock.once("*", ItemResponse);

      getItem("3ef", MOCK_USER_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return an item data by id using a token", (done) => {
      fetchMock.once("*", ItemDataResponse);

      getItemData("3ef", MOCK_USER_REQOPTS)
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/data?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get related items", (done) => {
      fetchMock.once("*", RelatedItemsResponse);
      getRelatedItems({
        id: "3ef",
        relationshipType: "Service2Layer",
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item resources", (done) => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources("3ef", {
        ...MOCK_USER_REQOPTS
      })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item resources with extra parameters", (done) => {
      fetchMock.once("*", GetItemResourcesResponse);
      getItemResources("3ef", {
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("resourcesPrefix=foolder");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    describe("getItemResource", function () {
      it("defaults to read as blob", (done) => {
        if (typeof Blob === "undefined") {
          done();
          return;
        }

        const resourceResponse = "<p>some text woohoo</p>";
        fetchMock.once("*", resourceResponse);

        getItemResource("3ef", {
          fileName: "resource.json",
          ...MOCK_USER_REQOPTS
        })
          .then((blob) => {
            const [url, options] = fetchMock.lastCall("*");
            expect(url).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
            );
            expect(options.method).toBe("POST");
            blob
              .text()
              .then((text: string) => expect(text).toEqual(resourceResponse))
              .then(done);
          })
          .catch((e) => {
            fail(e);
          });
      });

      it("reads JSON resource", (done) => {
        const resourceResponse = {
          foo: "bar"
        };
        fetchMock.once("*", resourceResponse);

        getItemResource("3ef", {
          fileName: "resource.json",
          readAs: "json",
          ...MOCK_USER_REQOPTS
        })
          .then(() => {
            const [url, options] = fetchMock.lastCall("*");
            expect(url).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
            );
            expect(options.method).toBe("POST");
            done();
          })
          .catch((e) => {
            fail(e);
          });
      });

      it("deals with control characters before parsing JSON resource", (done) => {
        const badJsonString = '{"foo":"foobarbaz"}';
        fetchMock.once("*", badJsonString);

        getItemResource("3ef", {
          fileName: "resource.json",
          readAs: "json",
          ...MOCK_USER_REQOPTS
        })
          .then((resource) => {
            const [url, options] = fetchMock.lastCall("*");
            expect(url).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
            );
            expect(options.method).toBe("POST");
            expect(resource.foo).toEqual("foobarbaz", "removed control chars");
            done();
          })
          .catch((e) => {
            fail(e);
          });
      });

      it("respects rawResponse setting with JSON resource", (done) => {
        const badJsonString = '{"foo":"foobarbaz"}';
        fetchMock.once("*", badJsonString);

        getItemResource("3ef", {
          fileName: "resource.json",
          rawResponse: true,
          ...MOCK_USER_REQOPTS
        })
          .then((response) => {
            const [url, options] = fetchMock.lastCall("*");
            expect(url).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
            );
            expect(options.method).toBe("POST");
            expect(response.json).toBeDefined("got a raw response");
            response
              .json()
              .then(() =>
                fail(
                  "parsing should fail because control characters still present"
                )
              )
              .catch((err: Error) => {
                expect(err).toBeDefined("JSON parse fails");
                done();
              });
          })
          .catch((e) => {
            fail(e);
          });
      });
    });

    it("get item groups anonymously", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemGroups("3ef")
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/3ef/groups"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item groups with credentials", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemGroups("3ef", { authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/groups"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item status", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemStatus({ id: "3ef", authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/status"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item status with optional parameters", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemStatus({
        id: "3ef",
        owner: "joe",
        jobType: "publish",
        jobId: "1dw",
        authentication: MOCK_USER_SESSION
      })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/status"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("jobType=publish");
          expect(options.body).toContain("jobId=1dw");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item parts", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemParts({ id: "3ef", authentication: MOCK_USER_SESSION })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/parts"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("get item parts with the owner parameter", (done) => {
      fetchMock.once("*", ItemGroupResponse);
      getItemParts({
        id: "3ef",
        owner: "joe",
        authentication: MOCK_USER_SESSION
      })
        .then(() => {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/parts"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }); // auth requests
});
