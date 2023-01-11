/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import { IUserProperties, getUserProperties, setUserProperties } from '../../src/users/get-user-properties'
import { userPropertiesResponse, userSetPropertiesResponseFailure, userSetPropertiesResponseSuccess } from '../mocks/users/user-properties'
import * as fetchMock from "fetch-mock";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(fetchMock.restore);

  const session = new UserSession({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  describe("getUserProperties", () => {
    it("should make a request for user properties", done => {
      fetchMock.getOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token",
        userPropertiesResponse
      );

      getUserProperties("c@sey", { authentication: session })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall();
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

    it("should set mapViewer by default", done => {
      fetchMock.getOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token",
        { properties: {} }
      );

      getUserProperties("c@sey", { authentication: session })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall();
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/properties?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response.mapViewer).toBe('modern');
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe('setUserProperties', () => {
    it("should make a request to set user properties", done => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties", 
        userSetPropertiesResponseSuccess
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      }

      setUserProperties(properties, { authentication: session })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall();
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties"
          );
          expect(options.method).toBe("POST");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should handle set user property errors", done => {
      fetchMock.postOnce(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/setProperties", 
        userSetPropertiesResponseFailure
      );
      const properties: IUserProperties = {
        landingPage: {
          url: "index.html"
        },
        mapViewer: "modern"
      }

      setUserProperties(properties, { authentication: session })
        .then(() => {
          fail(new Error('API did not serve error response'));
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