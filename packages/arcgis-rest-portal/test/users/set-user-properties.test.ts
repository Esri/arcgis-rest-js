/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IUserProperties } from "../../src/users/get-user-properties.js";
import { setUserProperties } from "../../src/users/set-user-properties.js";
import {
  userSetPropertiesResponseFailure,
  userSetPropertiesResponseSuccess
} from "../mocks/users/user-properties.js";
import fetchMock from "fetch-mock";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(fetchMock.restore);

  const session = new ArcGISIdentityManager({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  describe("setUserProperties", () => {
    it("should make a request to set user properties", (done) => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties",
        userSetPropertiesResponseSuccess
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      };

      setUserProperties(session.username, properties, {
        authentication: session
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall();
          console.log("options:", options);
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties"
          );
          expect(options.method).toBe("POST");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should handle set user property errors", (done) => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties",
        userSetPropertiesResponseFailure
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      };

      setUserProperties(session.username, properties, {
        authentication: session
      })
        .then(() => {
          fail(new Error("API did not serve error response"));
        })
        .catch(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall();
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties"
          );
          expect(options.method).toBe("POST");
          done();
        });
    });
  });
});
