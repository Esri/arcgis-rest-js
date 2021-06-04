/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ApiKey } from "../src/index";
// import { ICredential } from "../src/UserSession";

import * as fetchMock from "fetch-mock";

describe("ApiKey", () => {
  afterEach(fetchMock.restore);

  describe(".getToken()", () => {
    it("should return the ApiKey", (done) => {
      const session = new ApiKey({
        key: "123456",
      });

      Promise.all([session.getToken()])
        .then(([token1]) => {
          expect(token1).toBe("123456");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
