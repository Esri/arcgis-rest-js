/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { exchangeToken, platformSelf } from "../src/app-tokens";

describe("app-token functions: ", () => {
  describe("exchangeToken:", () => {
    it("makes a request to /oauth2/exchangeToken passing params", () => {
      const EXCHANGE_TOKEN_URL =
        "https://www.arcgis.com/sharing/rest/oauth2/exchangeToken";
      fetchMock.postOnce(EXCHANGE_TOKEN_URL, {
        token: "APP-TOKEN",
      });
      return exchangeToken("FAKE-TOKEN", "CLIENT-ID-ABC123")
        .then((response) => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            EXCHANGE_TOKEN_URL
          );
          expect(url).toEqual(EXCHANGE_TOKEN_URL);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=FAKE-TOKEN");
          expect(options.body).toContain("client_id=CLIENT-ID-ABC123");
          expect(response).toEqual("APP-TOKEN");
        })
        .catch((e) => fail(e));
    });
    it("takes a portalUrl", () => {
      const PORTAL_BASE_URL = "https://my-portal.com/instance/sharing/rest";
      const PORTAL_EXCHANGE_URL = `${PORTAL_BASE_URL}/oauth2/exchangeToken`;
      fetchMock.postOnce(PORTAL_EXCHANGE_URL, {
        valid: true,
        viewOnlyUserTypeApp: false,
      });
      return exchangeToken("FAKE-TOKEN", "CLIENT-ID-ABC123", PORTAL_BASE_URL)
        .then((response) => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            PORTAL_EXCHANGE_URL
          );
          expect(url).toEqual(PORTAL_EXCHANGE_URL);
        })
        .catch((e) => fail(e));
    });
  });

  describe("platformSelf:", () => {
    it("makes a request to /oauth2/platformSelf passing params", () => {
      const PLATFORM_SELF_URL =
        "https://www.arcgis.com/sharing/rest/oauth2/platformSelf";
      fetchMock.postOnce(PLATFORM_SELF_URL, {
        username: "jsmith",
        token: "APP-TOKEN",
      });
      return platformSelf(
        "CLIENT-ID-ABC123",
        "https://hub.arcgis.com/torii-provider-arcgis/redirect.html"
      )
        .then((response) => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            PLATFORM_SELF_URL
          );
          expect(url).toEqual(PLATFORM_SELF_URL);
          const headers = options.headers || ({} as any);
          expect(headers["X-Esri-Auth-Redirect-Uri"]).toBe(
            "https://hub.arcgis.com/torii-provider-arcgis/redirect.html"
          );
          expect(headers["X-Esri-Auth-Client-Id"]).toBe("CLIENT-ID-ABC123");
          expect(response.token).toEqual("APP-TOKEN");
          expect(response.username).toEqual("jsmith");
        })
        .catch((e) => fail(e));
    });
    it("takes a portalUrl", () => {
      const PORTAL_BASE_URL = "https://my-portal.com/instance/sharing/rest";
      const PORTAL_PLATFORM_SELF_URL = `${PORTAL_BASE_URL}/oauth2/platformSelf`;
      fetchMock.postOnce(PORTAL_PLATFORM_SELF_URL, {
        username: "jsmith",
        token: "APP-TOKEN",
      });
      return platformSelf("FAKE-TOKEN", "CLIENT-ID-ABC123", PORTAL_BASE_URL)
        .then((response) => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            PORTAL_PLATFORM_SELF_URL
          );
          expect(url).toEqual(PORTAL_PLATFORM_SELF_URL);
        })
        .catch((e) => fail(e));
    });
  });
});
