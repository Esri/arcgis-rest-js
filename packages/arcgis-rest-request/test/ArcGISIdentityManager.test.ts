/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/* tslint:disable:no-empty */
import { describe, test, expect, afterEach, vi } from "vitest";
import fetchMock from "fetch-mock";
import {
  ArcGISIdentityManager,
  ICredential,
  ArcGISAuthError,
  request,
  ArcGISAccessDeniedError,
  ErrorTypes,
  ArcGISTokenRequestError,
  ArcGISTokenRequestErrorCodes,
  IServerInfo
} from "../src/index.js";
import {
  YESTERDAY,
  TOMORROW,
  FIVE_DAYS_FROM_NOW,
  isBrowser,
  isNode
} from "../../../scripts/test-helpers.js";
describe("ArcGISIdentityManager", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe(".serialize() and ArcGISIdentityManager.deserialize", () => {
    test("should serialize to and from JSON", () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "c@sey",
        password: "123456"
      });

      const session2 = ArcGISIdentityManager.deserialize(session.serialize());

      expect(session2.clientId).toEqual("clientId");
      expect(session2.redirectUri).toEqual(
        "https://example-app.com/redirect-uri"
      );
      expect(session2.ssl).toBe(undefined);
      expect(session2.token).toEqual("token");
      expect(session2.tokenExpires).toEqual(TOMORROW);
      expect(session2.refreshToken).toEqual("refreshToken");
      expect(session2.refreshTokenExpires).toEqual(TOMORROW);
      expect(session2.username).toEqual("c@sey");
      expect(session2.password).toEqual("123456");
      expect(session2.tokenDuration).toEqual(20160);
    });

    test("should serialize to and from JSON with a server", () => {
      const session = new ArcGISIdentityManager({
        portal: undefined,
        server: "https://myserver.com/",
        token: "token",
        tokenExpires: TOMORROW
      });

      const session2 = ArcGISIdentityManager.deserialize(session.serialize());

      expect(session2.server).toEqual("https://myserver.com/");
      expect(session2.token).toEqual("token");
      expect(session2.tokenExpires).toEqual(TOMORROW);
    });

    test("should serialize undefined dates as undefined, not invalid date objects", () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        username: "c@sey",
        password: "123456"
      });

      const session2 = ArcGISIdentityManager.deserialize(session.serialize());

      expect(session2.refreshToken).toBeUndefined();
      expect(session2.refreshTokenExpires).toBeUndefined();
    });
  });

  describe(".getToken()", () => {
    test("should return unexpired tokens for trusted arcgis.com domains", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
      });

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("token");
      expect(token2).toBe("token");
    });

    test("should return unexpired tokens when an org url is passed", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.maps.arcgis.com/sharing/rest"
      });

      const token = await session.getToken(
        "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
      );
      expect(token).toBe("token");
    });

    test("should return unexpired tokens when an org url is passed on other ArcGIS Online environments", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.mapsdev.arcgis.com/sharing/rest"
      });

      const token = await session.getToken(
        "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
      );
      expect(token).toBe("token");
    });

    test("should return unexpired tokens when there is an http/https mismatch", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "http://custom.mapsdev.arcgis.com/sharing/rest"
      });

      const token = await session.getToken(
        "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
      );
      expect(token).toBe("token");
    });

    test("should return unexpired tokens for the configured portal domain", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      const token = await session.getToken(
        "https://gis.city.gov/sharing/rest/portals/self"
      );
      expect(token).toBe("token");
    });

    test("should return unexpired tokens for the configured portal domain, regardless of CASING", async () => {
      // This was a real configuration discovered on a portal instance
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://pnp00035.esri.com/sharing/rest"
      });

      const token = await session.getToken(
        "https://PNP00035.esri.com/sharing/rest/portals/self"
      );
      expect(token).toBe("token");
    });

    test("should fetch token when contacting a server that is federated, even if on same domain, regardless of domain casing", async () => {
      // This was a real configuration discovered on a portal instance
      // apparently when federating servers, the UI does not force the
      // server url to lowercase, and thus any feature service items generated
      // will have the server name using the casing the admin entered.
      // this is just a test to ensure that the mis-matched casing does not
      // break the federation flow.
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "existing-session-token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://pnp00035.esri.com/portal/sharing/rest"
      });

      fetchMock.postOnce("https://pnp00035.esri.com/server/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        owningSystemUrl: "https://pnp00035.esri.com/portal",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl:
            "https://pnp00035.esri.com/portal/sharing/rest/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://pnp00035.esri.com/portal/sharing/rest/portals/self?f=json&token=existing-session-token",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://pnp00035.esri.com/portal/sharing/rest/info", {
        owningSystemUrl: "https://pnp00035.esri.com/portal",
        authInfo: {
          tokenServicesUrl:
            "https://pnp00035.esri.com/portal/sharing/rest/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce(
        "https://pnp00035.esri.com/portal/sharing/rest/generateToken",
        {
          token: "new-server-token",
          expires: TOMORROW.getTime()
        }
      );

      // request the token twice, for the same domain, but with different casing
      // and we expect a single POST to generate a token once
      const [token1, token2] = await Promise.all([
        session.getToken(
          "https://PNP00035.esri.com/server/rest/services/Hosted/perimeters_dd83/FeatureServer"
        ),
        session.getToken(
          "https://pnp00035.esri.com/server/rest/services/Hosted/otherService/FeatureServer"
        )
      ]);
      expect(token1).toBe("new-server-token");
      expect(token2).toBe("new-server-token");
    });

    test("should fetch new tokens when tokens for trusted arcgis.com domains are expired", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.mock(
        "https://www.arcgis.com/sharing/rest/oauth2/token",
        {
          access_token: "new",
          expires_in: 1800,
          username: "c@sey"
        },
        { repeat: 2, method: "POST" }
      );

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("new");
      expect(token2).toBe("new");
    });

    test("should pass through a token when no token expiration is present", async () => {
      const session = new ArcGISIdentityManager({
        token: "token"
      });

      const token1 = await session.getToken(
        "https://www.arcgis.com/sharing/rest/portals/self"
      );
      expect(token1).toBe("token");
    });

    test("should generate a token for an untrusted, federated server", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      const [token1, token2] = await Promise.all([
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        ),
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
      ]);
      expect(token1).toBe("serverToken");
      expect(token2).toBe("serverToken");
    });

    test("should generate a fresh portal token and a new server token for an untrusted, federated server", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: new Date(Date.now() - 1000 * 60 * 5),
        refreshToken: "refresh",
        refreshTokenExpires: FIVE_DAYS_FROM_NOW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=newToken",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.post("https://gis.city.gov/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      const [token1, token2] = await Promise.all([
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        ),
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
      ]);
      expect(token1).toBe("serverToken");
      expect(token2).toBe("serverToken");
    });

    test("should generate a token for an untrusted, federated server admin call", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      const token1 = await session.getToken(
        "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
      );
      expect(token1).toBe("serverToken");
      const token2 = await session.getToken(
        "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
      );
      expect(token2).toBe("serverToken");
    });

    test("should generate a token for an untrusted, federated server with user credentials", async () => {
      const session = new ArcGISIdentityManager({
        username: "c@sey",
        password: "jones",
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/generateToken", {
        token: "portalToken"
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=portalToken",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      const token = await session.getToken(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
      );
      expect(token).toBe("serverToken");
    });

    test("should only make 1 token request to an untrusted portal for similar URLs", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.mock(
        "https://gisservices.city.gov/public/rest/info",
        {
          currentVersion: 10.51,
          fullVersion: "10.5.1.120",
          owningSystemUrl: "https://gis.city.gov",
          authInfo: {
            isTokenBasedSecurity: true,
            tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
          }
        },
        { repeat: 1, method: "POST" }
      );

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.mock(
        "https://gis.city.gov/sharing/rest/info",
        {
          owningSystemUrl: "http://gis.city.gov",
          authInfo: {
            tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
            isTokenBasedSecurity: true
          }
        },
        { repeat: 1, method: "POST" }
      );

      fetchMock.mock(
        "https://gis.city.gov/sharing/generateToken",
        {
          token: "serverToken",
          expires: TOMORROW.getTime()
        },
        { repeat: 1, method: "POST" }
      );

      const [token1, token2] = await Promise.all([
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        ),
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
      ]);
      expect(token1).toBe("serverToken");
      expect(token2).toBe("serverToken");
      expect(
        fetchMock.calls("https://gis.city.gov/sharing/generateToken").length
      ).toBe(1);
    });

    test("should throw an ArcGISAuthError when the owning system doesn't match", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      // similates refreshing the token with the refresh token
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=newToken",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.post("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      await expect(
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
      ).rejects.toMatchObject({
        name: ErrorTypes.ArcGISTokenRequestError,
        code: "NOT_FEDERATED",
        message:
          "NOT_FEDERATED: https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with https://www.arcgis.com/sharing/rest."
      });
    });

    test("should throw a fully hydrated ArcGISAuthError when no owning system is advertised", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=newToken",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.post("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120"
      });

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          error: {
            code: 499,
            message: "Token Required",
            details: []
          }
        }
      );

      await expect(
        request(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
          {
            authentication: session,
            params: {
              foo: "bar"
            }
          }
        )
      ).rejects.toMatchObject({
        name: ErrorTypes.ArcGISTokenRequestError,
        code: "NOT_FEDERATED",
        message:
          "NOT_FEDERATED: https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with any portal and is not explicitly trusted.",
        url: "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        options: {
          params: {
            foo: "bar"
          }
        }
      });
    });

    test("should not throw an ArcGISAuthError when the unfederated service is public", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.post("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=newToken",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          count: 123
        }
      );

      const res = await request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session,
          params: {
            returnCount: true
          }
        }
      );
      expect(res.count).toEqual(123);
    });
  });

  describe(".refreshCredentials()", () => {
    test("should refresh with a username and password if expired", async () => {
      const session = new ArcGISIdentityManager({
        username: "c@sey",
        password: "123456"
      });

      expect(session.canRefresh).toBe(true);

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        token: "token",
        expires: TOMORROW.getTime(),
        username: " c@sey"
      });

      const refreshedSession = await session.refreshCredentials();
      expect(refreshedSession.token).toBe("token");
      expect(refreshedSession.tokenExpires).toEqual(TOMORROW);
    });

    test("should refresh with an unexpired refresh token", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      expect(session.canRefresh).toBe(true);

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      const refreshedSession = await session.refreshCredentials();
      expect(refreshedSession.token).toBe("newToken");
      expect(refreshedSession.tokenExpires.getTime()).toBeGreaterThan(
        Date.now() - 5 * 60 * 1000
      );
    });

    test("should refresh with a refresh token that it is about to expire", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: new Date(Date.now() + 1000 * 60 * 60), // expires in one hour
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey",
        refresh_token: "newRefreshToken",
        refresh_token_expires_in: 1209600
      });

      const refreshedSession = await session.refreshCredentials();
      expect(refreshedSession.token).toBe("newToken");
      expect(refreshedSession.tokenExpires.getTime()).toBeGreaterThan(
        Date.now() - 5 * 60 * 1000
      );
      expect(refreshedSession.refreshToken).toBe("newRefreshToken");
      expect(refreshedSession.refreshTokenExpires.getTime()).toBeGreaterThan(
        Date.now() - 5 * 60 * 1000
      );
    });

    test("should reject with an ArcGISTokenRequestError if the token cannot be refreshed", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: FIVE_DAYS_FROM_NOW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        error: {
          code: 400,
          error: "invalid_client_id",
          error_description: "Invalid client_id",
          message: "Invalid client_id",
          details: []
        }
      });

      await expect(session.refreshCredentials()).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED,
        message: "TOKEN_REFRESH_FAILED: 400: Invalid client_id"
      });
    });

    test("should reject with an ArcGISTokenRequestError if the token cannot be refreshed with a username and password", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        tokenExpires: YESTERDAY,
        username: "c@sey",
        password: "password"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        error: {
          code: 400,
          message: "Unable to generate token.",
          details: ["Invalid username or password."]
        }
      });

      await expect(session.refreshCredentials()).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED,
        message: "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
      });
    });

    test("should reject with an ArcGISTokenRequestError if the refresh token cannot be refreshed", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: new Date(Date.now() + 1000 * 60 * 60), // expires in one hour
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        error: {
          code: 400,
          error: "invalid_client_id",
          error_description: "Invalid client_id",
          message: "Invalid client_id",
          details: []
        }
      });

      await expect(session.refreshCredentials()).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED,
        message: "REFRESH_TOKEN_EXCHANGE_FAILED: 400: Invalid client_id"
      });
    });

    test("should reject if we cannot refresh the token", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey"
      });

      expect(session.canRefresh).toBe(false);

      await expect(session.refreshCredentials()).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED,
        message:
          "TOKEN_REFRESH_FAILED: Unable to refresh token. No refresh token or password present."
      });
    });

    test("should only make 1 token request to the portal for similar URLs", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.mock(
        "https://www.arcgis.com/sharing/rest/oauth2/token",
        {
          access_token: "new",
          expires_in: 1800,
          username: "c@sey"
        },
        { repeat: 1, method: "POST" }
      );

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self")
      ]);
      expect(token1).toBe("new");
      expect(token2).toBe("new");
      expect(
        fetchMock.calls("https://www.arcgis.com/sharing/rest/oauth2/token")
          .length
      ).toBe(1);
    });

    test("should update the token and expiration from an external source", () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: YESTERDAY
      });

      session.updateToken("newToken", TOMORROW);

      expect(session.token).toBe("newToken");
      expect(session.tokenExpires).toBe(TOMORROW);
    });
  });

  // -------------------------------------- removed browser mocks and tests here ---------------------------------------

  describe("postmessage auth :: ", () => {
    const MockWindow = {
      addEventListener: () => {},
      removeEventListener: () => {},
      parent: {
        postMessage: () => {}
      }
    };

    const token = {
      tokenExpires: TOMORROW,
      portal: "https://www.arcgis.com/sharing/rest",
      token: "token",
      username: "jsmith"
    };

    const credential: ICredential = {
      expires: TOMORROW.getTime(),
      server: token.portal,
      ssl: false,
      token: token.token,
      userId: token.username
    };

    test(".disablePostMessageAuth removes event listener", () => {
      const removeSpy = vi.spyOn(MockWindow, "removeEventListener");
      const session = new ArcGISIdentityManager(token);

      session.disablePostMessageAuth(MockWindow);
      // should call removeEventListener
      expect(removeSpy).toHaveBeenCalledTimes(1);
    });

    test(".enablePostMessageAuth adds event listener", () => {
      const addSpy = vi.spyOn(MockWindow, "addEventListener");

      const session = new ArcGISIdentityManager(token);

      session.enablePostMessageAuth(
        ["https://storymaps.arcgis.com"],
        MockWindow
      );
      // should call addEventListener
      expect(addSpy).toHaveBeenCalledTimes(1);
    });

    test(".enablePostMessage handler returns credential to origin in list", () => {
      // ok, this gets kinda gnarly...

      // create a mock window object
      // that will hold the passed in event handler so we can fire it manually
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          // enablePostMessageAuth passes in the handler, which is what we're actually testing
          Win._fn = fn;
        },
        removeEventListener() {}
      };
      // Create the session
      const session = new ArcGISIdentityManager(token);

      // enable postMessageAuth allowing storymaps.arcgis.com to receive creds
      session.enablePostMessageAuth(["https://storymaps.arcgis.com"], Win);
      // create an event object, with a matching origin
      // and a source.postMessage fn that we can spy on
      const event = {
        origin: "https://storymaps.arcgis.com",
        source: {
          postMessage(msg: any, origin: string) {}
        },
        data: {
          type: "arcgis:auth:requestCredential"
        }
      };
      // create the spy
      const sourceSpy = vi.spyOn(event.source, "postMessage");
      // Now, fire the handler, simulating a postMessage event from an embedded iframe
      Win._fn(event);
      // Expectations...
      // source.postMessage should be called in handler
      expect(sourceSpy).toHaveBeenCalledTimes(1);
      const args = sourceSpy.mock.calls[0];
      // should send credential type
      expect(args[0].type).toBe("arcgis:auth:credential");
      expect(args[0].credential.userId).toBe("jsmith");
      // now the case where it's not a valid origin
      event.origin = "https://evil.com";
      Win._fn(event);
      expect(sourceSpy).toHaveBeenCalledTimes(1);
    });

    test(".enablePostMessage handler returns error if session is expired", () => {
      const expiredCred = {
        tokenExpires: YESTERDAY,
        portal: "https://www.arcgis.com/sharing/rest",
        token: "token",
        username: "jsmith"
      };
      // create a mock window object
      // that will hold the passed in event handler so we can fire it manually
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {}
      };

      // Create the session
      const session = new ArcGISIdentityManager(expiredCred);
      // enable postMessageAuth allowing storymaps.arcgis.com to receive creds
      session.enablePostMessageAuth(["https://storymaps.arcgis.com"], Win);
      // create an event object, with a matching origin
      // and a source.postMessage fn that we can spy on
      const event = {
        origin: "https://storymaps.arcgis.com",
        source: {
          postMessage(msg: any, origin: string) {}
        },
        data: {
          type: "arcgis:auth:requestCredential"
        }
      };
      // create the spy
      const sourceSpy = vi.spyOn(event.source, "postMessage");
      // Fire the handler, simulating a postMessage event from an embedded iframe
      Win._fn(event);
      // Expectations...
      expect(sourceSpy).toHaveBeenCalledTimes(1);
      const args = sourceSpy.mock.calls[0];
      // should send error type
      expect(args[0].type).toBe("arcgis:auth:error");
      expect(args[0].credential).not.toBeDefined();
      // should receive tokenExpiredError
      expect(args[0].error.name).toBe("tokenExpiredError");
    });

    test(".fromParent happy path", async () => {
      // create a mock window that will fire the handler
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {},
        parent: {
          postMessage(msg: any, origin: string) {
            Win._fn({
              origin: "https://origin.com",
              data: { type: "arcgis:auth:credential", credential },
              source: Win.parent
            });
          }
        }
      };

      // Should use the cred wired through the mock window
      const session = await ArcGISIdentityManager.fromParent(
        "https://origin.com",
        Win
      );
      expect(session.username).toBe("jsmith");
    });

    test(".fromParent ignores other messages, then intercepts the correct one", async () => {
      // create a mock window that will fire the handler
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {},
        parent: {
          postMessage(msg: any, origin: string) {
            // fire one we intend to ignore
            Win._fn({
              origin: "https://notorigin.com",
              data: { type: "other:random", foo: { bar: "baz" } },
              source: "Not Parent Object"
            });
            // fire a second we want to intercept
            Win._fn({
              origin: "https://origin.com",
              data: { type: "arcgis:auth:credential", credential },
              source: Win.parent
            });
          }
        }
      };

      // should use the cred wired throu the mock window
      const resp = await ArcGISIdentityManager.fromParent(
        "https://origin.com",
        Win
      );
      expect(resp.username).toBe("jsmith");
    });

    test(".fromParent rejects if invalid cred", async () => {
      // create a mock window that will fire the handler
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {},
        parent: {
          postMessage(msg: any, origin: string) {
            Win._fn({
              origin: "https://origin.com",
              data: {
                type: "arcgis:auth:credential",
                credential: { foo: "bar" }
              },
              source: Win.parent
            });
          }
        }
      };

      await expect(
        ArcGISIdentityManager.fromParent("https://origin.com", Win)
      ).rejects.toBeTruthy();
    });

    test(".fromParent rejects if auth error recieved", async () => {
      // create a mock window that will fire the handler
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {},
        parent: {
          postMessage(msg: any, origin: string) {
            Win._fn({
              origin: "https://origin.com",
              data: {
                type: "arcgis:auth:error",
                error: { message: "Rejected authentication request." }
              },
              source: Win.parent
            });
          }
        }
      };

      await expect(
        ArcGISIdentityManager.fromParent("https://origin.com", Win)
      ).rejects.toBeDefined();
    });

    test(".fromParent rejects if auth unknown message", async () => {
      // create a mock window that will fire the handler
      const Win = {
        _fn: (evt: any) => {},
        addEventListener(evt: any, fn: any) {
          Win._fn = fn;
        },
        removeEventListener() {},
        parent: {
          postMessage(msg: any, origin: string) {
            Win._fn({
              origin: "https://origin.com",
              data: { type: "arcgis:auth:other" },
              source: Win.parent
            });
          }
        }
      };

      await expect(
        ArcGISIdentityManager.fromParent("https://origin.com", Win)
      ).rejects.toHaveProperty("message", "Unknown message type.");
    });
  });

  describe("validateAppAccess: ", () => {
    test("makes a request to /oauth2/validateAppAccess passing params", async () => {
      const VERIFYAPPACCESS_URL =
        "https://www.arcgis.com/sharing/rest/oauth2/validateAppAccess";
      fetchMock.postOnce(VERIFYAPPACCESS_URL, {
        valid: true,
        viewOnlyUserTypeApp: false
      });
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "FAKE-TOKEN",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "jsmith",
        password: "123456"
      });

      const response = await session.validateAppAccess("abc123");
      const [url, options] = fetchMock.lastCall(VERIFYAPPACCESS_URL);
      expect(url).toEqual(VERIFYAPPACCESS_URL);
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=FAKE-TOKEN");
      expect(options.body).toContain("client_id=abc123");
      expect(response.valid).toEqual(true);
      expect(response.viewOnlyUserTypeApp).toBe(false);
    });
  });

  describe(".authorize()", () => {
    test("should redirect the request to the authorization page", () => {
      const spy = vi.fn();
      const endSpy = vi.fn();
      const MockResponse: any = {
        writeHead: spy,
        end: endSpy
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockResponse
      );

      expect(spy).toHaveBeenCalledWith(301, {
        Location:
          "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=20160&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
      });
      expect(endSpy).toHaveBeenCalled();
    });

    test("should redirect the request to the authorization page with custom expiration", () => {
      const spy = vi.fn();
      const endSpy = vi.fn();
      const MockResponse: any = {
        writeHead: spy,
        end: endSpy
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri",
          expiration: 10000
        },
        MockResponse
      );

      expect(spy).toHaveBeenCalledWith(301, {
        Location:
          "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10000&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
      });
      expect(endSpy).toHaveBeenCalled();
    });

    test("should redirect the request to the authorization page with custom state", () => {
      const spy = vi.fn();
      const endSpy = vi.fn();
      const MockResponse: any = {
        writeHead: spy,
        end: endSpy
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri",
          expiration: 10000,
          state: "foo"
        },
        MockResponse
      );

      expect(spy).toHaveBeenCalledWith(301, {
        Location:
          "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10000&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri&state=foo"
      });
      expect(endSpy).toHaveBeenCalled();
    });

    test("should redirect the request to the authorization page with custom duration (DEPRECATED)", () => {
      const spy = vi.fn();
      const endSpy = vi.fn();
      const MockResponse: any = {
        writeHead: spy,
        end: endSpy
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri",
          expiration: 10001
        },
        MockResponse
      );

      expect(spy).toHaveBeenCalledWith(301, {
        Location:
          "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10001&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
      });
      expect(endSpy).toHaveBeenCalled();
    });
  });

  describe(".exchangeAuthorizationCode()", () => {
    test("should exchange an authorization code for a new ArcGISIdentityManager", async () => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "token",
        expires_in: 1800,
        refresh_token: "refreshToken",
        username: "Casey",
        ssl: true
      });

      const session = await ArcGISIdentityManager.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      );
      expect(session.token).toBe("token");
      expect(session.tokenExpires.getTime()).toBeGreaterThan(Date.now());
      expect(session.username).toBe("Casey");
      expect(session.refreshToken).toBe("refreshToken");
      expect(session.ssl).toBe(true);
    });

    test("should return a ArcGISIdentityManager where refreshTokenExpires is 2 weeks from now (within 5 minutes)", async () => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "token",
        refresh_token: "refreshToken",
        refresh_token_expires_in: 1209600,
        username: "Casey",
        ssl: true
      });

      const session = await ArcGISIdentityManager.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      );
      const twoWeeksFromNow = new Date(
        Date.now() + (20160 - 1) * 60 * 1000 - 1000 * 60 * 5
      );
      expect(session.refreshTokenExpires.getTime()).toBeGreaterThan(
        twoWeeksFromNow.getTime() - 1000 * 60 * 10
      );
      expect(session.refreshTokenExpires.getTime()).toBeLessThan(
        twoWeeksFromNow.getTime() + 1000 * 60 * 10
      );
    });

    test("should throw an ArcGISTokenRequestError when there is an error exchanging the code", async () => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        error: {
          code: 498,
          error: "invalid_request",
          error_description: "refresh_token expired",
          message: "refresh_token expired",
          details: []
        }
      });

      await expect(
        ArcGISIdentityManager.exchangeAuthorizationCode(
          {
            clientId: "clientId",
            redirectUri: "https://example-app.com/redirect-uri"
          },
          "code"
        )
      ).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED,
        message: "REFRESH_TOKEN_EXCHANGE_FAILED: 498: refresh_token expired"
      });
    });
  });

  describe(".getUser()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    test("should cache metadata about the user", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "jsmith",
        password: "123456"
      });

      const response = await session.getUser();
      expect(response.role).toEqual("org_publisher");
      const cachedResponse = await session.getUser();
      expect(cachedResponse.fullName).toEqual("John Smith");
    });

    test("should never make more then 1 request", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "jsmith",
        password: "123456"
      });

      await Promise.all([session.getUser(), session.getUser()]);
      // expect only one call to fetch
      expect(fetchMock.calls().length).toBe(1);
    });
  });

  describe(".getUsername()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    test("should fetch the username via getUser() and cache it", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith"
        }
      );

      const session = new ArcGISIdentityManager({
        token: "token"
      });

      const response = await session.getUsername();
      expect(response).toEqual("jsmith");

      // also test getting it from the cache.
      const username = await session.getUsername();
      expect(username).toEqual("jsmith");
    });

    test("should use a username if passed in the session", async () => {
      const session = new ArcGISIdentityManager({
        username: "jsmith"
      });

      const response = await session.getUsername();
      expect(response).toEqual("jsmith");
    });
  });

  describe("to/fromCredential()", () => {
    const MOCK_CREDENTIAL: ICredential = {
      expires: TOMORROW.getTime(),
      server: "https://www.arcgis.com",
      ssl: false,
      token: "token",
      userId: "jsmith"
    };

    const MOCK_SERVER_INFO: IServerInfo = {
      hasPortal: true,
      hasServer: false,
      server: "https://www.arcgis.com"
    };

    const MOCK_USER_SESSION = new ArcGISIdentityManager({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "token",
      ssl: false,
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      username: "jsmith",
      password: "123456"
    });

    test("should create a credential object from a session", () => {
      const creds = MOCK_USER_SESSION.toCredential();
      expect(creds.userId).toEqual("jsmith");
      expect(creds.server).toEqual("https://www.arcgis.com/sharing/rest");
      expect(creds.ssl).toEqual(false);
      expect(creds.token).toEqual("token");
      expect(creds.expires).toEqual(TOMORROW.getTime());
    });

    test("should create a ArcGISIdentityManager from a credential", () => {
      const session = ArcGISIdentityManager.fromCredential(
        MOCK_CREDENTIAL,
        MOCK_SERVER_INFO
      );
      expect(session.username).toEqual("jsmith");
      expect(session.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(session.server).toBeUndefined();
      expect(session.ssl).toEqual(false);
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(new Date(TOMORROW));
    });

    test("should create a ArcGISIdentityManager from a credential without adding /sharing/rest", () => {
      const MOCK_SERVER_INFO: IServerInfo = {
        hasPortal: true,
        hasServer: false,
        server: "https://www.arcgis.com/sharing/rest"
      };

      const MOCK_CREDENTIAL: ICredential = {
        expires: TOMORROW.getTime(),
        server: "https://www.arcgis.com/sharing/rest",
        ssl: false,
        token: "token",
        userId: "jsmith"
      };

      const session = ArcGISIdentityManager.fromCredential(
        MOCK_CREDENTIAL,
        MOCK_SERVER_INFO
      );
      expect(session.username).toEqual("jsmith");
      expect(session.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(session.server).toBeUndefined();
      expect(session.ssl).toEqual(false);
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(new Date(TOMORROW));
    });

    test("should create a manager for a specific server", () => {
      const MOCK_SERVER_CREDENTIAL: ICredential = {
        expires: TOMORROW.getTime(),
        server:
          "https://services.arcgis.com/arcgis/services/test/FeatureServer",
        ssl: false,
        token: "token",
        userId: "jsmith"
      };

      const MOCK_SERVER_INFO_FOR_SERVER: IServerInfo = {
        hasPortal: true,
        hasServer: true,
        server: "https://services.arcgis.com/arcgis/services/test/FeatureServer"
      };

      const session = ArcGISIdentityManager.fromCredential(
        MOCK_SERVER_CREDENTIAL,
        MOCK_SERVER_INFO_FOR_SERVER
      );

      expect(session.username).toEqual("jsmith");
      expect(session.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(session.server).toBe(
        "https://services.arcgis.com/arcgis/services/test/FeatureServer"
      );
      expect(session.ssl).toEqual(false);
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(new Date(TOMORROW));
    });
  });

  describe("fromCredential() when credential doesn't have an expiration date or ssl", () => {
    const MOCK_CREDENTIAL: ICredential = {
      expires: undefined,
      server: "https://www.arcgis.com",
      ssl: undefined,
      token: "token",
      userId: "jsmith"
    };

    test("should create a ArcGISIdentityManager from a credential", () => {
      // lock Date.now() to test that token expires after 2 hours
      vi.useFakeTimers();
      vi.setSystemTime(new Date());

      const MOCK_SERVER_INFO: IServerInfo = {
        hasPortal: true,
        hasServer: true,
        server: "https://www.arcgis.com"
      };

      const session = ArcGISIdentityManager.fromCredential(
        MOCK_CREDENTIAL,
        MOCK_SERVER_INFO
      );
      expect(session.username).toEqual("jsmith");
      expect(session.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(session.ssl).toBeTruthy();
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(
        new Date(Date.now() + 7200000 /* 2 hours */)
      );

      vi.useRealTimers();
    });
  });

  describe("getServerRootUrl()", () => {
    test("should lowercase domain names", () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
      });

      const root = session.getServerRootUrl(
        "https://PNP00035.esri.com/server/rest/services/Hosted/perimeters_dd83/FeatureServer"
      );
      expect(root).toEqual("https://pnp00035.esri.com/server");
    });

    test("should not lowercase path names", () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
      });

      const root = session.getServerRootUrl(
        "https://pnp00035.esri.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/NB_Stereographic/VectorTileServer"
      );
      expect(root).toEqual(
        "https://pnp00035.esri.com/tiles/LkFyxb9zDq7vAOAm/arcgis"
      );
    });

    test("should respect the original https/http protocol", () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
      });

      const root = session.getServerRootUrl(
        "http://pnp00035.esri.com/tiles/LkFyxb9zDq7vAOAm/arcgis/rest/services/NB_Stereographic/VectorTileServer"
      );
      expect(root).toEqual(
        "http://pnp00035.esri.com/tiles/LkFyxb9zDq7vAOAm/arcgis"
      );
    });
  });

  describe("non-federated server", () => {
    test("shouldnt fetch a fresh token if the current one isn't expired.", async () => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "c@sey",
        password: "123456",
        token: "token",
        tokenExpires: TOMORROW,
        server: "https://fakeserver.com/arcgis"
      });

      const token = await MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      );
      expect(token).toBe("token");
    });

    test("should fetch a fresh token if the current one is expired.", async () => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "jsmith",
        password: "123456",
        token: "token",
        tokenExpires: YESTERDAY,
        server: "https://fakeserver.com/arcgis"
      });

      fetchMock.post("https://fakeserver.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver.com/arcgis/tokens/generateToken"
        }
      });

      fetchMock.post("https://fakeserver.com/arcgis/tokens/generateToken", {
        token: "fresh-token",
        expires: TOMORROW.getTime(),
        username: " jsmith"
      });

      const token = await MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      );
      expect(token).toBe("fresh-token");
      const [url, options] = fetchMock.lastCall(
        "https://fakeserver.com/arcgis/tokens/generateToken"
      );
      expect(url).toBe("https://fakeserver.com/arcgis/tokens/generateToken");
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("username=jsmith");
      expect(options.body).toContain("password=123456");
      expect(options.body).toContain("client=referer");

      if (isNode) {
        expect(options.body).toContain("referer=%40esri%2Farcgis-rest-js");
      }
      // TODO_: check if need to move out to browser-specific test file
      if (isBrowser) {
        expect(options.body).toContain(
          `referer=${encodeURIComponent(window.location.origin)}`
        );
      }
    });

    test("should use provided referer.", async () => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "jsmith",
        password: "123456",
        token: "token",
        tokenExpires: YESTERDAY,
        server: "https://fakeserver.com/arcgis",
        referer: "testreferer"
      });

      fetchMock.post("https://fakeserver.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver.com/arcgis/tokens/generateToken"
        }
      });

      fetchMock.post("https://fakeserver.com/arcgis/tokens/generateToken", {
        token: "fresh-token",
        expires: TOMORROW.getTime(),
        username: " jsmith"
      });

      const token = await MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      );
      expect(token).toBe("fresh-token");
      const [url, options] = fetchMock.lastCall(
        "https://fakeserver.com/arcgis/tokens/generateToken"
      );
      expect(url).toBe("https://fakeserver.com/arcgis/tokens/generateToken");
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("username=jsmith");
      expect(options.body).toContain("password=123456");
      expect(options.body).toContain("client=referer");

      if (isNode) {
        expect(options.body).toContain("referer=testreferer");
      }

      if (isBrowser) {
        expect(options.body).toContain(`referer=testreferer`);
      }
    });

    test("should throw an error if there is an error generating the server token with a username and password.", async () => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "jsmith",
        password: "123456",
        server: "https://fakeserver.com/arcgis"
      });

      fetchMock.post("https://fakeserver.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver.com/arcgis/tokens/generateToken"
        }
      });

      fetchMock.post("https://fakeserver.com/arcgis/tokens/generateToken", {
        error: {
          code: 498,
          message: "Invalid token.",
          details: []
        }
      });

      await expect(
        MOCK_USER_SESSION.getToken(
          "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
        )
      ).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        message: "GENERATE_TOKEN_FOR_SERVER_FAILED: 498: Invalid token.",
        code: ArcGISTokenRequestErrorCodes.GENERATE_TOKEN_FOR_SERVER_FAILED
      });
    });

    test("should trim down the server url if necessary.", async () => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "jsmith",
        password: "123456",
        token: "token",
        tokenExpires: YESTERDAY,
        server: "https://fakeserver.com/arcgis/rest/services/blah/"
      });

      fetchMock.post("https://fakeserver.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver.com/arcgis/tokens/"
        }
      });

      fetchMock.postOnce("https://fakeserver.com/arcgis/tokens/", {
        token: "fresh-token",
        expires: TOMORROW.getTime(),
        username: " jsmith"
      });

      const token = await MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      );

      expect(token).toBe("fresh-token");
    });

    test("should throw an error if the server isnt trusted.", async () => {
      fetchMock.postOnce("https://fakeserver2.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver2.com/arcgis/tokens/"
        }
      });
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "c@sey",
        password: "123456",
        token: "token",
        tokenExpires: TOMORROW,
        server: "https://fakeserver.com/arcgis"
      });

      await expect(
        MOCK_USER_SESSION.getToken(
          "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/"
        )
      ).rejects.toMatchObject({
        code: "NOT_FEDERATED",
        originalMessage:
          "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/ is not federated with any portal and is not explicitly trusted."
      });
    });
  });

  describe(".getPortal()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    test("should cache metadata about the portal", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: ["gis.city.com"]
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "jsmith",
        password: "123456"
      });

      const response = await session.getPortal();
      expect(response.authorizedCrossOriginDomains).toEqual(["gis.city.com"]);
      const cachedResponse = await session.getPortal();
      expect(cachedResponse.authorizedCrossOriginDomains).toEqual([
        "gis.city.com"
      ]);
    });

    test("should never make more then 1 request", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: ["gis.city.com"]
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        username: "jsmith",
        password: "123456"
      });

      await Promise.all([session.getPortal(), session.getPortal()]);
      // expect only one call to fetch
      expect(fetchMock.calls().length).toBe(1);
    });
  });

  describe("fetchAuthorizedDomains/getDomainCredentials", () => {
    test("should default to same-origin credentials when no domains are listed in authorizedCrossOriginDomains", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: []
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          count: 123
        }
      );

      await request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      );

      const { credentials } = fetchMock.lastOptions(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
      ) as RequestInit;
      expect(credentials).toEqual("same-origin");
    });

    test("should set the credentials option to include when a server is listed in authorizedCrossOriginDomains", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: ["https://gisservices.city.gov"]
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          count: 123
        }
      );

      await request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      );
      const { credentials } = fetchMock.lastOptions(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
      ) as RequestInit;
      expect(credentials).toEqual("include");
    });

    test("should ignore the case when comparing a server with the authorizedCrossOriginDomains list: variant 1", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: ["https://gisservices.city.gov"]
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          count: 123
        }
      );

      await request(
        "https://GISSERVICES.CITY.GOV/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      );
      const { credentials } = fetchMock.lastOptions(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
      ) as RequestInit;
      expect(credentials).toEqual("include");
    });

    test("should ignore the case when comparing a server with the authorizedCrossOriginDomains list: variant 2", async () => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "https://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.getOnce(
        "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
        {
          authorizedCrossOriginDomains: ["https://GISSERVICES.city.gov"]
        }
      );

      fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
          isTokenBasedSecurity: true
        }
      });

      fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
        token: "serverToken",
        expires: TOMORROW.getTime()
      });

      fetchMock.post(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          count: 123
        }
      );

      await request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      );
      const { credentials } = fetchMock.lastOptions(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
      ) as RequestInit;
      expect(credentials).toEqual("include");
    });
  });

  test("should still send same-origin credentials even if another domain is listed in authorizedCrossOriginDomains", async () => {
    const session = new ArcGISIdentityManager({
      clientId: "id",
      token: "token",
      refreshToken: "refresh",
      tokenExpires: TOMORROW,
      portal: "https://gis.city.gov/sharing/rest"
    });

    fetchMock.postOnce("https://gisservices.city.gov/public/rest/info", {
      currentVersion: 10.51,
      fullVersion: "10.5.1.120",
      owningSystemUrl: "https://gis.city.gov",
      authInfo: {
        isTokenBasedSecurity: true,
        tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
      }
    });

    fetchMock.getOnce(
      "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
      {
        authorizedCrossOriginDomains: ["https://other.city.gov"]
      }
    );

    fetchMock.postOnce("https://gis.city.gov/sharing/rest/info", {
      owningSystemUrl: "http://gis.city.gov",
      authInfo: {
        tokenServicesUrl: "https://gis.city.gov/sharing/generateToken",
        isTokenBasedSecurity: true
      }
    });

    fetchMock.postOnce("https://gis.city.gov/sharing/generateToken", {
      token: "serverToken",
      expires: TOMORROW
    });

    fetchMock.post(
      "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
      {
        count: 123
      }
    );

    await request(
      "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
      {
        authentication: session
      }
    );
    const { credentials } = fetchMock.lastOptions(
      "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
    ) as RequestInit;
    expect(credentials).toEqual("same-origin");
  });

  test("should normalize optional protocols in authorizedCrossOriginDomains", async () => {
    const session = new ArcGISIdentityManager({
      clientId: "id",
      token: "token",
      refreshToken: "refresh",
      tokenExpires: TOMORROW,
      portal: "https://gis.city.gov/sharing/rest"
    });

    fetchMock.getOnce(
      "https://gis.city.gov/sharing/rest/portals/self?f=json&token=token",
      {
        authorizedCrossOriginDomains: ["one.city.gov", "https://two.city.gov"]
      }
    );

    await (session as any).fetchAuthorizedDomains();
    expect((session as any).trustedDomains).toEqual([
      "https://one.city.gov",
      "https://two.city.gov"
    ]);
  });

  test("should not use domain credentials if portal is null", async () => {
    const session = new ArcGISIdentityManager({
      clientId: "id",
      token: "token",
      refreshToken: "refresh",
      tokenExpires: TOMORROW,
      portal: null,
      server: "https://fakeserver.com/arcgis"
    });

    await (session as any).fetchAuthorizedDomains();
    expect((session as any).trustedDomains).toEqual([]);
  });

  describe(".destroy()", () => {
    test("should revoke a refresh token with ArcGISIdentityManager", async () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW
      });
      const response = await ArcGISIdentityManager.destroy(session);
      const [url, options] = fetchMock.lastCall("*");
      expect(response).toEqual({ success: true });
      expect(url).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
      );
      expect(options.body).toContain("auth_token=refreshToken");
      expect(options.body).toContain("client_id=clientId");
    });

    test("should revoke a token with ArcGISIdentityManager", async () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token"
      });
      const response = await ArcGISIdentityManager.destroy(session);
      const [url, options] = fetchMock.lastCall("*");
      expect(response).toEqual({ success: true });
      expect(url).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
      );
      expect(options.body).toContain("auth_token=token");
      expect(options.body).toContain("client_id=clientId");
    });

    test("should revoke a token with the signOut() instance method", async () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token"
      });

      const response = await session.signOut();
      const [url, options] = fetchMock.lastCall("*");
      expect(response).toEqual({ success: true });
      expect(url).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
      );
      expect(options.body).toContain("auth_token=token");
      expect(options.body).toContain("client_id=clientId");
    });
  });

  describe(".fromToken", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    test("should initialize a session from a token", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      const session = await ArcGISIdentityManager.fromToken({
        token: "token",
        tokenExpires: TOMORROW
      });
      expect(session.username).toEqual("jsmith");
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(TOMORROW);
    });
  });

  describe(".signIn", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    test("should initialize a session from a username and password", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        token: "token",
        expires: TOMORROW.getTime(),
        username: " c@sey"
      });

      const session = await ArcGISIdentityManager.signIn({
        username: "c@sey",
        password: "123456"
      });
      expect(session.username).toEqual("c@sey");
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(TOMORROW);
    });

    test("should initialize a session from a username and password and pass a referer", async () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        token: "token",
        expires: TOMORROW.getTime(),
        username: " c@sey"
      });

      await ArcGISIdentityManager.signIn({
        username: "c@sey",
        password: "123456",
        referer: "testreferer"
      });
      const [url, options] = fetchMock.lastCall(
        "https://www.arcgis.com/sharing/rest/generateToken"
      );

      if (isNode) {
        expect(options.body).toContain("referer=testreferer");
      }
      // TODO_: check if need to move out to browser-specific test file
      if (isBrowser) {
        expect(options.body).toContain(`referer=testreferer`);
      }
    });
  });
});
