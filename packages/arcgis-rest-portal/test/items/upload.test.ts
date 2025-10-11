/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import {
  commitItemUpload,
  cancelItemUpload,
  addItemPart
} from "../../src/items/upload.js";
import { ItemSuccessResponse } from "../mocks/items/item.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW, attachmentFile } from "../../../../scripts/test-helpers.js";
import { FormData } from "@esri/arcgis-rest-form-data";

describe("search", () => {
  afterEach(() => {
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

    test("should commit the item upload", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      await commitItemUpload({
        id: "3ef",
        item: {
          title: "test",
          type: "PDF"
        },
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/commit"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=fake-token");
    });

    test("should commit the item upload for the other owner", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      await commitItemUpload({
        id: "3ef",
        item: {
          title: "test",
          type: "PDF"
        },
        owner: "fanny",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/fanny/items/3ef/commit"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=fake-token");
    });

    test("should cancel the item upload", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      await cancelItemUpload({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/cancel"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=fake-token");
    });

    test("should cancel the item upload for the other owner", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      await cancelItemUpload({
        id: "3ef",
        owner: "fanny",
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/fanny/items/3ef/cancel"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=fake-token");
    });

    test("should add a binary part to an item", async () => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      await addItemPart({
        id: "3ef",
        // File() is only available in the browser
        file,
        partNum: 1,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/addPart?partNum=1"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;

      if (params.get) {
        expect(params.get("token")).toEqual("fake-token");
        expect(params.get("f")).toEqual("json");
        expect(params.get("file")).toEqual(file);
      }
    });

    test("should add a binary part to an item with the owner parameter", async () => {
      fetchMock.once("*", {
        success: true
      });

      const file = attachmentFile();

      await addItemPart({
        id: "3ef",
        owner: "joe",
        // File() is only available in the browser
        file,
        partNum: 1,
        ...MOCK_USER_REQOPTS
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/joe/items/3ef/addPart?partNum=1"
      );
      expect(options.method).toBe("POST");
      expect(options.body instanceof FormData).toBeTruthy();
      const params = options.body as FormData;

      if (params.get) {
        expect(params.get("token")).toEqual("fake-token");
        expect(params.get("f")).toEqual("json");
        expect(params.get("file")).toEqual(file);
      }
    });

    test("should throw an error if the part number is invalid", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      const file = attachmentFile();

      await expect(
        addItemPart({
          id: "3ef",
          // File() is only available in the browser
          file,
          // partNum must be an integer
          partNum: null,
          ...MOCK_USER_REQOPTS
        })
      ).rejects.toThrow(
        "The part number must be an integer between 1 to 10000, inclusive."
      );
      expect(fetchMock.called()).toBeFalsy();
    });

    test("should throw an error if the part number is smaller than 1", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      const file = attachmentFile();

      await expect(
        addItemPart({
          id: "3ef",
          // File() is only available in the browser
          file,
          partNum: 0,
          ...MOCK_USER_REQOPTS
        })
      ).rejects.toThrow(
        "The part number must be an integer between 1 to 10000, inclusive."
      );
      expect(fetchMock.called()).toBeFalsy();
    });

    test("should throw an error if the part number is lager than 10000", async () => {
      fetchMock.once("*", ItemSuccessResponse);

      const file = attachmentFile();

      await expect(
        addItemPart({
          id: "3ef",
          // File() is only available in the browser
          file,
          partNum: 10002,
          ...MOCK_USER_REQOPTS
        })
      ).rejects.toThrow(
        "The part number must be an integer between 1 to 10000, inclusive."
      );
      expect(fetchMock.called()).toBeFalsy();
    });
  });
});
