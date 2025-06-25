/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ApiKeyManager } from "../src/index.js";
import fetchMock from "fetch-mock";

describe("ApiKeyManager", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe(".getToken()", () => {
    it("should return the Api Key", (done) => {
      const session = new ApiKeyManager({
        key: "123456"
      });

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("123456");
          expect(token2).toBe("123456");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".fromKey()", () => {
    it("should create a new ApiKeyManager from a string", (done) => {
      const session = ApiKeyManager.fromKey("123456");

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("123456");
          expect(token2).toBe("123456");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should create a new ApiKeyManager from an options object", (done) => {
      const session = ApiKeyManager.fromKey({
        key: "123456",
        username: "c@sey"
      });

      expect(session.username).toBe("c@sey");

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("123456");
          expect(token2).toBe("123456");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".getUsername()", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it("should fetch the username via getUser()", (done) => {
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

      session
        .getUsername()
        .then((response) => {
          expect(response).toEqual("jsmith");

          // also test getting it from the cache.
          session
            .getUsername()
            .then((username) => {
              done();

              expect(username).toEqual("jsmith");
            })
            .catch((e) => {
              fail(e);
            });
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should use a username if passed in the session", (done) => {
      const session = ApiKeyManager.fromKey({
        key: "token",
        username: "jsmith"
      });

      session
        .getUsername()
        .then((response) => {
          expect(response).toEqual("jsmith");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".serialize() and .deserialize()", () => {
    it("should serialize to a string", () => {
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

    it("should deserialize to an object", () => {
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
