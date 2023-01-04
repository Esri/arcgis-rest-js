/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getUserProperties } from '../../src/users/get-user-properties'
import { UserPropertiesResponse } from '../mocks/users/user-properties'
import * as fetchMock from "fetch-mock";
import { encodeParam } from '@esri/arcgis-rest-request';

describe("users", () => {
  afterEach(fetchMock.restore);

  describe("getUserProperties", () => {
    it("should make an authenticated request for user properties", done => {
      fetchMock.once("*", UserPropertiesResponse);

      getUserProperties("c@sey")
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});