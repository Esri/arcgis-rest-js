/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getUserProperties } from '../../src/users/get-user-properties'
import { UserPropertiesResponse } from '../mocks/users/user-properties'
import * as fetchMock from "fetch-mock";

describe("users", () => {
  afterEach(fetchMock.restore);

  describe("getUserProperties", () => {
    it("should make a request for user properties", done => {
      fetchMock.once("*", UserPropertiesResponse);

      getUserProperties("c@sey")
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/users/c%40sey/properties"
          );
          expect(options.method).toBe("POST");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});