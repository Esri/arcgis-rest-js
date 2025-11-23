/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import { ApiKeyManager } from "../src/index.js";
import fetchMock from "fetch-mock";

describe("ApiKeyManager", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe(".getToken()", () => {
    test("should return the Api Key", async () => {
      const session = new ApiKeyManager({
        key: "123456"
      });

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("123456");
      expect(token2).toBe("123456");
    });
  });

  describe(".fromKey()", () => {
    test("should create a new ApiKeyManager from a string", async () => {
      const session = ApiKeyManager.fromKey("123456");

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("123456");
      expect(token2).toBe("123456");
    });

    test("should create a new ApiKeyManager from an options object", async () => {
      const session = ApiKeyManager.fromKey({
        key: "123456",
        username: "c@sey"
      });

      expect(session.username).toBe("c@sey");

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("123456");
      expect(token2).toBe("123456");
    });
  });

  describe(".getUsername()", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    test("should fetch the username via getUser()", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith"
        }
      );

      const session = ApiKeyManager.fromKey({
        key: "token"
      });

      const response = await session.getUsername();
      expect(response).toEqual("jsmith");

      // also test getting it from the cache.
      const username = await session.getUsername();
      expect(username).toEqual("jsmith");
    });

    test("should use a username if passed in the session", async () => {
      const session = ApiKeyManager.fromKey({
        key: "token",
        username: "jsmith"
      });

      const response = await session.getUsername();
      expect(response).toEqual("jsmith");
    });
  });

  describe(".serialize() and .deserialize()", () => {
    test("should serialize to a string", () => {
      const session = new ApiKeyManager({
        key: "123456",
        username: "c@sey"
      });

      const serialized = session.serialize();
      expect(serialized).toBe(
        JSON.stringify({
          type: "ApiKeyManager",
          token: "123456",
          username: "c@sey",
          portal: "https://www.arcgis.com/sharing/rest"
        })
      );
    });

    test("should deserialize to an object", () => {
      const session = new ApiKeyManager({
        key: "123456",
        username: "c@sey"
      });

      const serialized = session.serialize();
      const deserialized = ApiKeyManager.deserialize(serialized);
      expect(deserialized.token).toEqual("123456");
      expect(deserialized.username).toEqual("c@sey");
      expect(deserialized.portal).toEqual(
        "https://www.arcgis.com/sharing/rest"
      );
      expect(deserialized instanceof ApiKeyManager).toBeTruthy();
    });
  });
});
