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
    it("should create a new ApiKeyManager", (done) => {
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
  });
});
