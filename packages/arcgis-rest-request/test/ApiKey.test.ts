/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ApiKey } from "../src/index.js";
import fetchMock from "fetch-mock";

describe("ApiKey", () => {
  afterEach(fetchMock.restore);

  describe(".getToken()", () => {
    it("should return the ApiKey", (done) => {
      const session = new ApiKey({
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
});
