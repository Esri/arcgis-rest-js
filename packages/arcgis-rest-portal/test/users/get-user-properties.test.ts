/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IUserProperties, getUserProperties, setUserProperties } from '../../src/users/get-user-properties'
import { UserPropertiesResponse } from '../mocks/users/user-properties'
import * as fetchMock from "fetch-mock";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(fetchMock.restore);

  describe("getUserProperties", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      password: "123456",
      token: "fake-token",
      tokenExpires: TOMORROW,
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });
    
    it("should make a request for user properties", done => {
      fetchMock.once("*", UserPropertiesResponse);

      getUserProperties("c@sey", { authentication: session })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should make a request to set user properties", done => {
      fetchMock.once("*", UserPropertiesResponse);
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      }

      setUserProperties(properties, { authentication: session })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token"
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