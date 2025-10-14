/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import { Blob } from "@esri/arcgis-rest-form-data";
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
  test("should return base url when passed a portal url", () => {
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

  test("should return an item by id", async () => {
    fetchMock.once("*", ItemResponse);
    await getItem("3ef");
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef?f=json"
    );
    expect(options.method).toBe("GET");
  });

  test("should return an item data by id", async () => {
    fetchMock.once("*", ItemDataResponse);
    await getItemData("3ef");
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
    );
    expect(options.method).toBe("GET");
  });

  test("should return binary item data by id", async () => {
    // using Blob from ponyfill to test in node and be consistent with other instances of testing file attachments
    fetchMock.once("*", {
      sendAsJson: false,
      headers: { "Content-Type": "application/zip" },
      body: new Blob()
    });
    const response = await getItemData("3ef", { file: true });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/data"
    );
    expect(options.method).toBe("GET");
    expect(response instanceof Blob).toBeTruthy();
  });

  test("should return a valid response even when no data is retrieved", async () => {
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
    const response = await getItemData("3ef");
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/data?f=json"
    );
    expect(options.method).toBe("GET");
    expect(response).toBe(undefined);
  });

  test("should pass through error when request fails with a non-empty-response error", async () => {
    fetchMock.once("*", {
      throws: new Error("Pass-through error")
    });

    await expect(getItemData("3ef")).rejects.toThrow("Pass-through error");
  });

  test("should return related items", async () => {
    fetchMock.once("*", RelatedItemsResponse);
    await getRelatedItems({
      id: "3ef",
      relationshipType: "Service2Layer"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer"
    );
    expect(options.method).toBe("GET");
  });

  test("should return related items for more than one relationship type", async () => {
    fetchMock.once("*", RelatedItemsResponse);
    await getRelatedItems({
      id: "3ef",
      relationshipType: ["Service2Layer", "Area2CustomPackage"]
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipTypes=Service2Layer%2CArea2CustomPackage"
    );
    expect(options.method).toBe("GET");
  });

  test("should return item info by id", async () => {
    fetchMock.once("*", ItemInfoResponse);
    const response = await getItemInfo("3ef");
    expect(response).toBe(ItemInfoResponse);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/info/iteminfo.xml"
    );
    expect(options.method).toBe("GET");
  });

  test("should return raw response item info if desired", async () => {
    fetchMock.once("*", ItemFormJsonResponse);
    const response = await getItemInfo("3ef", {
      fileName: "form.json",
      rawResponse: true
    } as IGetItemInfoOptions);
    const formJson = await response.json();
    expect(formJson).toEqual(ItemFormJsonResponse);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/info/form.json"
    );
    expect(options.method).toBe("GET");
  });

  test("should return item info JSON files", async () => {
    fetchMock.once("*", ItemFormJsonResponse);
    const formJson = await getItemInfo("3ef", {
      fileName: "form.json",
      readAs: "json"
    } as IGetItemInfoOptions);
    expect(formJson).toEqual(ItemFormJsonResponse);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/info/form.json"
    );
    expect(options.method).toBe("GET");
  });

  test("should return item metadata", async () => {
    fetchMock.once("*", ItemMetadataResponse);
    const fileName = "metadata/metadata.xml";
    const response = await getItemMetadata("3ef");
    expect(response).toBe(ItemMetadataResponse);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/3ef/info/metadata/metadata.xml"
    );
    expect(options.method).toBe("GET");
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

    test("should decorate public item thumbnail without token", async () => {
      fetchMock.once("*", MOCK_ITEM);
      const item = await getItem("3ef");
      expect(item.thumbnailUrl).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/info/thumb.png"
      );
    });

    test("should decorate private item thumbnail with token", async () => {
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

    test("should not append token if item is public even with auth manager", async () => {
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

    test("should return an item by id using a token", async () => {
      fetchMock.once("*", ItemResponse);
      await getItem("3ef", MOCK_USER_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("should return an item data by id using a token", async () => {
      fetchMock.once("*", ItemDataResponse);
      await getItemData("3ef", MOCK_USER_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/data?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("get related items", async () => {
      fetchMock.once("*", RelatedItemsResponse);
      await getRelatedItems({
        id: "3ef",
        relationshipType: "Service2Layer",
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/relatedItems?f=json&relationshipType=Service2Layer&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    test("get item resources", async () => {
      fetchMock.once("*", GetItemResourcesResponse);
      await getItemResources("3ef", {
        ...MOCK_USER_REQOPTS
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });

    test("get item resources with extra parameters", async () => {
      fetchMock.once("*", GetItemResourcesResponse);
      await getItemResources("3ef", {
        ...MOCK_USER_REQOPTS,
        params: {
          resourcesPrefix: "foolder"
        }
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("resourcesPrefix=foolder");
    });

    describe("getItemResource", () => {
      test("defaults to read as blob", async () => {
        if (typeof Blob === "undefined") {
          return;
        }

        const resourceResponse = "<p>some text woohoo</p>";
        fetchMock.once("*", resourceResponse);

        const blob = await getItemResource("3ef", {
          fileName: "resource.json",
          ...MOCK_USER_REQOPTS
        });
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
        );
        expect(options.method).toBe("POST");
        const text = await blob.text();
        expect(text).toEqual(resourceResponse);
      });

      test("reads JSON resource", async () => {
        const resourceResponse = {
          foo: "bar"
        };
        fetchMock.once("*", resourceResponse);

        await getItemResource("3ef", {
          fileName: "resource.json",
          readAs: "json",
          ...MOCK_USER_REQOPTS
        });
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
        );
        expect(options.method).toBe("POST");
      });

      test("deals with control characters before parsing JSON resource by removing control chars", async () => {
        const badJsonString = '{"foo":"foobarbaz"}';
        fetchMock.once("*", badJsonString);

        const resource = await getItemResource("3ef", {
          fileName: "resource.json",
          readAs: "json",
          ...MOCK_USER_REQOPTS
        });
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
        );
        expect(options.method).toBe("POST");
        expect(resource.foo).toEqual("foobarbaz");
      });

      test("respects rawResponse setting with JSON resource", async () => {
        const badJsonString = '{"foo":"foobarbaz"}';
        fetchMock.once("*", badJsonString);

        const response = await getItemResource("3ef", {
          fileName: "resource.json",
          rawResponse: true,
          ...MOCK_USER_REQOPTS
        });
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/resources/resource.json"
        );
        expect(options.method).toBe("POST");
        expect(response.json).toBeDefined();
        await expect(response.json()).rejects.toBeDefined();
      });
    });

    test("get item groups anonymously", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemGroups("3ef");
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/content/items/3ef/groups"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });

    test("get item groups with credentials", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemGroups("3ef", { authentication: MOCK_USER_SESSION });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/3ef/groups"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });

    test("get item status", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemStatus({ id: "3ef", authentication: MOCK_USER_SESSION });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/status"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });

    test("get item status with optional parameters", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemStatus({
        id: "3ef",
        owner: "joe",
        jobType: "publish",
        jobId: "1dw",
        authentication: MOCK_USER_SESSION
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/status"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("jobType=publish");
      expect(options.body).toContain("jobId=1dw");
    });

    test("get item parts", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemParts({ id: "3ef", authentication: MOCK_USER_SESSION });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/parts"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });

    test("get item parts with the owner parameter", async () => {
      fetchMock.once("*", ItemGroupResponse);
      await getItemParts({
        id: "3ef",
        owner: "joe",
        authentication: MOCK_USER_SESSION
      });
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/parts"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
    });
  }); // auth requests
});
