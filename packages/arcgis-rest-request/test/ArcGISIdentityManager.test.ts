/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/* tslint:disable:no-empty */
import fetchMock, { done } from "fetch-mock";
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
    it("should serialize to and from JSON", () => {
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

    it("should serialize to and from JSON with a server", () => {
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

    it("should serialize undefined dates as undefined, not invalid date objects", () => {
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
    it("should return unexpired tokens for trusted arcgis.com domains", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
      });

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("token");
          expect(token2).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return unexpired tokens when an org url is passed", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.maps.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return unexpired tokens when an org url is passed on other ArcGIS Online environments", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.mapsdev.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return unexpired tokens when there is an http/https mismatch", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "http://custom.mapsdev.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return unexpired tokens for the configured portal domain", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      session
        .getToken("https://gis.city.gov/sharing/rest/portals/self")
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return unexpired tokens for the configured portal domain, regardless of CASING", (done) => {
      // This was a real configuration discovered on a portal instance
      const session = new ArcGISIdentityManager({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://pnp00035.esri.com/sharing/rest"
      });

      session
        .getToken("https://PNP00035.esri.com/sharing/rest/portals/self")
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should fetch token when contacting a server that is federated, even if on same domain, regardless of domain casing", (done) => {
      // This was a real configuration discovered on a portal instance
      // apparently when federating servers, the UI does not force the
      // server url to lowercase, and this any feature service items generated
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
      session
        .getToken(
          "https://PNP00035.esri.com/server/rest/services/Hosted/perimeters_dd83/FeatureServer"
        )
        .then((token) => {
          expect(token).toBe("new-server-token");
          return session.getToken(
            "https://pnp00035.esri.com/server/rest/services/Hosted/otherService/FeatureServer"
          );
        })
        .then((token) => {
          expect(token).toBe("new-server-token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should fetch new tokens when tokens for trusted arcgis.com domains are expired", (done) => {
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

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("new");
          expect(token2).toBe("new");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should pass through a token when no token expiration is present", (done) => {
      const session = new ArcGISIdentityManager({
        token: "token"
      });

      session
        .getToken("https://www.arcgis.com/sharing/rest/portals/self")
        .then((token1) => {
          expect(token1).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server", (done) => {
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .then((token) => {
          expect(token).toBe("serverToken");
          return session.getToken(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          );
        })
        .then((token) => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should generate a fresh portal token and a new server token for an untrusted, federated server", (done) => {
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .then((token) => {
          expect(token).toBe("serverToken");
          return session.getToken(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          );
        })
        .then((token) => {
          expect(token).toBe("serverToken");
          expect(session.token).toBe("newToken");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server admin call", (done) => {
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
        )
        .then((token) => {
          expect(token).toBe("serverToken");
          return session.getToken(
            "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
          );
        })
        .then((token) => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server with user credentials", (done) => {
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .then((token) => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should only make 1 token request to an untrusted portal for similar URLs", (done) => {
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

      Promise.all([
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        ),
        session.getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("serverToken");
          expect(token2).toBe("serverToken");
          expect(
            fetchMock.calls("https://gis.city.gov/sharing/generateToken").length
          ).toBe(1);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should throw an ArcGISAuthError when the owning system doesn't match", (done) => {
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .catch((e) => {
          expect(e.name).toEqual(ErrorTypes.ArcGISTokenRequestError);
          expect(e.code).toEqual("NOT_FEDERATED");
          expect(e.message).toEqual(
            "NOT_FEDERATED: https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with https://www.arcgis.com/sharing/rest."
          );
          done();
        });
    });

    it("should throw a fully hydrated ArcGISAuthError when no owning system is advertised", (done) => {
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

      request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session,
          params: {
            foo: "bar"
          }
        }
      ).catch((e) => {
        expect(e.name).toEqual(ErrorTypes.ArcGISTokenRequestError);
        expect(e.code).toEqual("NOT_FEDERATED");
        expect(e.message).toEqual(
          "NOT_FEDERATED: https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with any portal and is not explicitly trusted."
        );
        expect(e.url).toEqual(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        );
        expect(e.options.params.foo).toEqual("bar");
        done();
      });
    });

    it("should not throw an ArcGISAuthError when the unfederated service is public", (done) => {
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

      request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session,
          params: {
            returnCount: true
          }
        }
      )
        .then((res) => {
          expect(res.count).toEqual(123);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".refreshCredentials()", () => {
    it("should refresh with a username and password if expired", (done) => {
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

      session
        .refreshCredentials()
        .then((s) => {
          expect(s.token).toBe("token");
          expect(s.tokenExpires).toEqual(TOMORROW);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should refresh with an unexpired refresh token", (done) => {
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

      session
        .refreshCredentials()
        .then((s) => {
          expect(s.token).toBe("newToken");
          expect(s.tokenExpires.getTime()).toBeGreaterThan(
            Date.now() - 5 * 60 * 1000
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should refresh with  a refresh token that it is about to expire", (done) => {
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

      session
        .refreshCredentials()
        .then((s) => {
          expect(s.token).toBe("newToken");
          expect(s.tokenExpires.getTime()).toBeGreaterThan(
            Date.now() - 5 * 60 * 1000
          );
          expect(s.refreshToken).toBe("newRefreshToken");
          expect(s.refreshTokenExpires.getTime()).toBeGreaterThan(
            Date.now() - 5 * 60 * 1000
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should reject with an ArcGISTokenRequestError if the token cannot be refreshed", () => {
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

      return session.refreshCredentials().catch((e) => {
        expect(e instanceof ArcGISTokenRequestError).toBe(true);
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.code).toBe(ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED);
        expect(e.message).toBe("TOKEN_REFRESH_FAILED: 400: Invalid client_id");
        return;
      });
    });

    it("should reject with an ArcGISTokenRequestError if the token cannot be refreshed with a username and password", () => {
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

      return session.refreshCredentials().catch((e) => {
        expect(e instanceof ArcGISTokenRequestError).toBe(true);
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.code).toBe(ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED);
        expect(e.message).toBe(
          "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
        );
        return;
      });
    });

    it("should reject with an ArcGISTokenRequestError if the refresh token cannot be refreshed", () => {
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

      return session.refreshCredentials().catch((e) => {
        expect(e instanceof ArcGISTokenRequestError).toBe(true);
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.code).toBe(
          ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED
        );
        expect(e.message).toBe(
          "REFRESH_TOKEN_EXCHANGE_FAILED: 400: Invalid client_id"
        );
        return;
      });
    });

    it("should reject if we cannot refresh the token", (done) => {
      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey"
      });

      expect(session.canRefresh).toBe(false);

      session.refreshCredentials().catch((e) => {
        expect(e instanceof ArcGISTokenRequestError).toBeTruthy();
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.message).toBe(
          "TOKEN_REFRESH_FAILED: Unable to refresh token. No refresh token or password present."
        );
        done();
      });
    });

    it("should only make 1 token request to the portal for similar URLs", (done) => {
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

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self")
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("new");
          expect(token2).toBe("new");
          expect(
            fetchMock.calls("https://www.arcgis.com/sharing/rest/oauth2/token")
              .length
          ).toBe(1);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should update the token and expiration from an external source", () => {
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

  /**
   * `beginOAuth2()` and `completeOAuth2()` only work on browsers due to their use of `dispatchEvent()` and `addEventListener()`.
   *
   * We COULD make these tests work in Node if we wanted to mock these calls but you actually have to trigger the events.
   */
  if (isBrowser) {
    describe("Client side oAuth 2.0", () => {
      let MockWindow: any;

      function createMock() {
        return {
          open: jasmine.createSpy(),
          close: jasmine.createSpy(),
          crypto: {
            getRandomValues: function () {
              return new Uint8Array(32);
            },
            subtle: {
              digest: function (...args: any) {
                return window.crypto.subtle.digest.apply(
                  window.crypto.subtle,
                  args
                );
              }
            }
          },
          isSecureContext: true,
          TextEncoder,
          localStorage: {
            getItem: function (key: string) {
              return window.localStorage.getItem(key);
            },
            setItem: function (key: string, value: any) {
              return window.localStorage.setItem(key, value);
            },
            removeItem: function (key: string) {
              return window.localStorage.removeItem(key);
            }
          },
          history: {
            replaceState: jasmine.createSpy()
          },
          // for most tests we actually need the event to fire to make sure the callback works as expected so we restore the browsers original behavior.
          addEventListener: function (...args: any) {
            return window.addEventListener.apply(window, args);
          },
          dispatchEvent: function (...args: any) {
            return window.dispatchEvent.apply(window, args);
          },
          opener: {
            dispatchEvent: jasmine.createSpy()
          },
          btoa: function (...args: any) {
            return window.btoa.apply(window, args);
          },
          location: {
            href: "https://test.com",
            search: "",
            hash: ""
          }
        };
      }

      beforeEach(() => {
        MockWindow = createMock();
      });

      describe(".beginOAuth2() without PKCE", () => {
        it("should authorize via implicit grant in a popup", () => {
          let PopupMockWindow: any;

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            PopupMockWindow = createMock();
            PopupMockWindow.location.hash =
              "#access_token=token&expires_in=86400&username=c%40sey&ssl=true&persist=true&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
            PopupMockWindow.opener = MockWindow;

            ArcGISIdentityManager.completeOAuth2(
              {
                clientId: "clientId123",
                redirectUri: "http://example-app.com/redirect",
                pkce: false
              },
              PopupMockWindow
            );
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId123",
              redirectUri: "http://example-app.com/redirect",
              style: "light",
              pkce: false
            },
            MockWindow
          )
            .then((session) => {
              expect(MockWindow.open).toHaveBeenCalledWith(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId123&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=light",
                "oauth-window",
                "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
              );
              expect(PopupMockWindow.close).toHaveBeenCalled();
              expect(session.token).toBe("token");
              expect(session.username).toBe("c@sey");
              expect(session.ssl).toBe(true);

              // The times will be off a few milliseconds because we have to wait for some async work to we just compare date, hour and minute values.
              expect(session.tokenExpires.toDateString()).toBe(
                TOMORROW.toDateString()
              );
              expect(session.tokenExpires.getUTCHours()).toBe(
                TOMORROW.getUTCHours()
              );
              const tomorrowMinutes = TOMORROW.getUTCMinutes();
              expect(
                session.tokenExpires.getUTCMinutes()
              ).toBeGreaterThanOrEqual(tomorrowMinutes - 1);
              expect(session.tokenExpires.getUTCMinutes()).toBeLessThanOrEqual(
                tomorrowMinutes + 1
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should reject if there is an error in the popup", () => {
          let PopupMockWindow: any;

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            PopupMockWindow = createMock();
            PopupMockWindow.location.hash =
              "#error=sign_in_failed&error_description=Request%20failed&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
            PopupMockWindow.opener = MockWindow;

            ArcGISIdentityManager.completeOAuth2(
              {
                clientId: "clientId234",
                redirectUri: "http://example-app.com/redirect",
                pkce: false
              },
              PopupMockWindow
            );
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId234",
              redirectUri: "http://example-app.com/redirect",
              locale: "fr",
              pkce: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e.code).toBe("sign_in_failed");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe("sign_in_failed: Request failed");
            expect(MockWindow.open).toHaveBeenCalledWith(
              "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId234&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=fr&style=",
              "oauth-window",
              "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
            );
            return Promise.resolve();
          });
        });

        it("should authorize in the same window/tab", () => {
          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId345",
              redirectUri: "http://example-app.com/redirect",
              popup: false,
              pkce: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId345&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style="
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should authorize using a social media provider", () => {
          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId456",
              redirectUri: "http://example-app.com/redirect",
              popup: false,
              provider: "facebook",
              pkce: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/social/authorize?client_id=clientId456&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&socialLoginProviderName=facebook&autoAccountCreateForSocial=true"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should authorize using the other social media provider", () => {
          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId567",
              redirectUri: "http://example-app.com/redirect",
              popup: false,
              provider: "google",
              pkce: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/social/authorize?client_id=clientId567&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&socialLoginProviderName=google&autoAccountCreateForSocial=true"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should pass custom expiration", () => {
          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId678",
              redirectUri: "http://example-app.com/redirect",
              popup: false,
              expiration: 9000,
              pkce: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId678&response_type=token&expiration=9000&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style="
              );
            })
            .catch((e) => {
              fail(e);
            });
        });
      });

      describe(".completeOAuth2() without PKCE", () => {
        it("should authorize via an implicit grant with an inline redirect", () => {
          MockWindow.location.hash =
            "#access_token=token&expires_in=86400&username=c%40sey&ssl=true&persist=true&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientId789`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientId789",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false,
              pkce: false
            },
            MockWindow
          )
            .then((session) => {
              expect(session.token).toBe("token");
              expect(session.tokenExpires.getTime()).toBeGreaterThan(
                Date.now()
              );
              expect(session.username).toBe("c@sey");
              expect(session.ssl).toBe(true);
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should return a new user session with ssl as false when callback hash does not have ssl parameter", () => {
          MockWindow.location.hash =
            "#access_token=token&expires_in=86400&username=c%40sey&&persist=true&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientId789`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientId789",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false,
              pkce: false
            },
            MockWindow
          )
            .then((session) => {
              expect(session.ssl).toBe(false);
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should throw an error from the authorization window", () => {
          MockWindow.location.hash =
            "#error=Invalid_Signin&error_description=Invalid_Signin&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientId890`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientId890",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false,
              pkce: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e.code).toBe("Invalid_Signin");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe("Invalid_Signin: Invalid_Signin");

            return;
          });
        });

        it("should throw an unknown error if the url has no error or access_token", () => {
          MockWindow.location.hash =
            "#state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientId901`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientId901",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false,
              pkce: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e.code).toBe("oauth-error");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe("oauth-error: Unknown error");

            return;
          });
        });
      });

      describe(".completeOAuth2() with PKCE", () => {
        it("should authorize with a popup", () => {
          let PopupMockWindow = createMock();
          PopupMockWindow.location.search =
            "?code=auth_code&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
          PopupMockWindow.opener = MockWindow;

          fetchMock.post("*", {
            access_token: "token",
            expires_in: 1800,
            username: "c@sey",
            ssl: true,
            refresh_token: "refresh_token",
            refresh_token_expires_in: 1209600
          });

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            setTimeout(() => {
              ArcGISIdentityManager.completeOAuth2(
                {
                  clientId: "clientId1234",
                  redirectUri: "http://example-app.com/redirect"
                },
                PopupMockWindow
              );
            }, 100);
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId1234",
              redirectUri: "http://example-app.com/redirect"
            },
            MockWindow
          )
            .then((session) => {
              expect(MockWindow.open).toHaveBeenCalledWith(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId1234&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo",
                "oauth-window",
                "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
              );

              expect(session.token).toBe("token");
              expect(session.username).toBe("c@sey");
              expect(session.ssl).toBe(true);
              expect(session.redirectUri).toBe(
                "http://example-app.com/redirect"
              );
              // now - 5 minutes (offset) + the above expiration (1800 seconds)
              const expectedDate = new Date(
                Date.now() - 5 * 60 * 1000 + 1800 * 1000
              );

              // // The times will be off a few milliseconds because we have to wait for some async work to we just compare date, hour and minute values.
              expect(session.tokenExpires.toDateString()).toBe(
                expectedDate.toDateString()
              );
              expect(session.tokenExpires.getUTCHours()).toBe(
                expectedDate.getUTCHours()
              );
              expect(session.tokenExpires.getUTCMinutes()).toBe(
                expectedDate.getUTCMinutes()
              );
              expect(session.state).toEqual({
                id: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                originalUrl: "https://test.com"
              });
              expect(PopupMockWindow.close).toHaveBeenCalled();
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should reject with an access denied error when a user cancels auth in a popup", () => {
          let PopupMockWindow: any;

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            PopupMockWindow = createMock();
            PopupMockWindow.location.search =
              "?error=access_denied&error_description=The%20user%20has%20denied%20your%20request&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
            PopupMockWindow.opener = MockWindow;

            ArcGISIdentityManager.completeOAuth2(
              {
                clientId: "testUserRejection",
                redirectUri: "http://example-app.com/redirect"
              },
              PopupMockWindow
            );
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "testUserRejection",
              redirectUri: "http://example-app.com/redirect"
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAccessDeniedError");
            expect(e instanceof ArcGISAccessDeniedError).toBe(true);
            expect(e.message).toBe(
              "The user has denied your authorization request."
            );
          });
        });

        it("should authorize with an inline redirect", () => {
          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId12345",
              redirectUri: "http://example-app.com/redirect",
              popup: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId12345&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should fallback to window.location.href if redirect URI is omitted in a popup workflow", () => {
          let PopupMockWindow: any;

          fetchMock.once("*", {
            access_token: "token",
            expires_in: 1800,
            username: "c@sey",
            ssl: true,
            refresh_token: "refresh_token",
            refresh_token_expires_in: 1209600
          });

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            PopupMockWindow = createMock();
            PopupMockWindow.location.href = "http://example-app.com/redirect";
            PopupMockWindow.location.search =
              "?code=auth_code&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
            PopupMockWindow.opener = MockWindow;

            ArcGISIdentityManager.completeOAuth2(
              {
                clientId: "clientId1234"
              } as any,
              PopupMockWindow
            );
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId1234",
              redirectUri: "http://example-app.com/redirect"
            },
            MockWindow
          )
            .then((session) => {
              expect(MockWindow.open).toHaveBeenCalledWith(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId1234&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo",
                "oauth-window",
                "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
              );

              expect(PopupMockWindow.close).toHaveBeenCalled();
              expect(session.redirectUri).toBe(
                "http://example-app.com/redirect"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should authorize with an inline redirect with a plain challange", () => {
          MockWindow.isSecureContext = false;

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId12345",
              redirectUri: "http://example-app.com/redirect",
              popup: false
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId12345&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=plain&code_challenge=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should encode additional params", () => {
          MockWindow.isSecureContext = false;

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "clientId12345",
              redirectUri: "http://example-app.com/redirect",
              popup: false,
              params: {
                foo: "bar"
              }
            },
            MockWindow
          )
            .then(() => {
              expect(MockWindow.location.href).toBe(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId12345&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=plain&code_challenge=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&foo=bar"
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should pass a custom state object", () => {
          let PopupMockWindow = createMock();
          PopupMockWindow.location.search =
            "?code=auth_code&state=%7B%22id%22%3A%22myCustomId%22%2C%22customStateProperty%22%3A%22test%22%7D";
          PopupMockWindow.opener = MockWindow;

          fetchMock.post("*", {
            access_token: "token",
            expires_in: 1800,
            username: "c@sey",
            ssl: true,
            refresh_token: "refresh_token",
            refresh_token_expires_in: 1209600
          });

          window.addEventListener("arcgis-rest-js-popup-auth-start", () => {
            setTimeout(() => {
              ArcGISIdentityManager.completeOAuth2(
                {
                  clientId: "customStateTestClientId",
                  redirectUri: "http://example-app.com/redirect"
                },
                PopupMockWindow
              );
            }, 100);
          });

          return ArcGISIdentityManager.beginOAuth2(
            {
              clientId: "customStateTestClientId",
              redirectUri: "http://example-app.com/redirect",
              state: {
                id: "myCustomId",
                customStateProperty: "test"
              }
            },
            MockWindow
          )
            .then((session) => {
              expect(MockWindow.open).toHaveBeenCalledWith(
                "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=customStateTestClientId&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22myCustomId%22%2C%22customStateProperty%22%3A%22test%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo",
                "oauth-window",
                "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
              );

              expect(session.state).toEqual({
                id: "myCustomId",
                customStateProperty: "test"
              });

              // now - 5 minutes (offset) + the above expiration (1800 seconds)
              const expectedDate = new Date(
                Date.now() - 5 * 60 * 1000 + 1800 * 1000
              );
            })
            .catch((e) => {
              fail(e);
            });
        });

        it("should reject .completeOAuth2() when the user denys the request during an inline redirect", () => {
          MockWindow.location.search =
            "?error=access_denied&error_description=The%20user%20has%20denied%20your%20request&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientIdInlineAccessDenied`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdInlineAccessDenied",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAccessDeniedError");
            expect(e instanceof ArcGISAccessDeniedError).toBe(true);
            expect(e.message).toBe(
              "The user has denied your authorization request."
            );

            return;
          });
        });

        it("should reject .completeOAuth2() if the state ID does not match", () => {
          MockWindow.location.search =
            "?code=auth_code&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientIdInlineStateMismatch`,
            "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdInlineStateMismatch",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe(
              "mismatched-auth-state: Saved client state did not match server sent state."
            );

            return;
          });
        });

        it("should reject .completeOAuth2() with a default error message", () => {
          MockWindow.location.search =
            "?error=weird_error&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientIdInlineWeirdError`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdInlineWeirdError",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe("weird_error: Unknown error");

            return;
          });
        });

        it("should reject .completeOAuth2() if a state can not be found locally", () => {
          MockWindow.location.search =
            "?code=auth_code&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdInlineStateMismatch",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe(
              "no-auth-state: No authentication state was found, call `ArcGISIdentityManager.beginOAuth2(...)` to start the authentication process."
            );

            return;
          });
        });

        it("should reject .completeOAuth2() if a state can not be found in the URL", () => {
          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdInlineStateMismatch",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe(
              "no-auth-state: No authentication state was found, call `ArcGISIdentityManager.beginOAuth2(...)` to start the authentication process."
            );

            return;
          });
        });

        it("should reject .completeOAuth2() if the code exchange fails with an error", () => {
          fetchMock.once("*", {
            error: {
              code: 400,
              error: "invalid_client_id",
              error_description: "Invalid client_id",
              message: "Invalid client_id",
              details: []
            }
          });

          MockWindow.location.search =
            "?code=auth_code&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";

          window.localStorage.setItem(
            `ARCGIS_REST_JS_AUTH_STATE_clientIdCodeExchangeError`,
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
          );

          return ArcGISIdentityManager.completeOAuth2(
            {
              clientId: "clientIdCodeExchangeError",
              redirectUri: "https://example-app.com/redirect-uri",
              popup: false
            },
            MockWindow
          ).catch((e) => {
            expect(e.name).toBe("ArcGISAuthError");
            expect(e instanceof ArcGISAuthError).toBe(true);
            expect(e.message).toBe("400: Invalid client_id");

            return;
          });
        });
      });
    });
  }

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

    it(".disablePostMessageAuth removes event listener", () => {
      const removeSpy = spyOn(MockWindow, "removeEventListener");
      const session = new ArcGISIdentityManager(token);

      session.disablePostMessageAuth(MockWindow);

      expect(removeSpy.calls.count()).toBe(
        1,
        "should call removeEventListener"
      );
    });

    it(".enablePostMessageAuth adds event listener", () => {
      const addSpy = spyOn(MockWindow, "addEventListener");

      const session = new ArcGISIdentityManager(token);

      session.enablePostMessageAuth(
        ["https://storymaps.arcgis.com"],
        MockWindow
      );

      expect(addSpy.calls.count()).toBe(1, "should call addEventListener");
    });

    it(".enablePostMessage handler returns credential to origin in list", () => {
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

      // enable postMessageAuth allowing storymaps.arcgis.com to recieve creds
      session.enablePostMessageAuth(["https://storymaps.arcgis.com"], Win);
      // create an event object, with a matching origin
      // an a source.postMessage fn that we can spy on
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
      const sourceSpy = spyOn(event.source, "postMessage");
      // Now, fire the handler, simulating what happens when a postMessage event comes
      // from an embedded iframe
      Win._fn(event);
      // Expectations...
      expect(sourceSpy.calls.count()).toBe(
        1,
        "souce.postMessage should be called in handler"
      );
      const args = sourceSpy.calls.argsFor(0);
      expect(args[0].type).toBe(
        "arcgis:auth:credential",
        "should send credential type"
      );
      expect(args[0].credential.userId).toBe(
        "jsmith",
        "should send credential"
      );
      // now the case where it's not a valid origin
      event.origin = "https://evil.com";
      Win._fn(event);
      expect(sourceSpy.calls.count()).toBe(
        1,
        "souce.postMessage should not be called in handler for invalid origin"
      );
    });

    it(".enablePostMessage handler returns error if session is expired", () => {
      // ok, this gets kinda gnarly...
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
          // enablePostMessageAuth passes in the handler, which is what we're actually testing
          Win._fn = fn;
        },
        removeEventListener() {}
      };

      // Create the session
      const session = new ArcGISIdentityManager(expiredCred);
      // enable postMessageAuth allowing storymaps.arcgis.com to recieve creds
      session.enablePostMessageAuth(["https://storymaps.arcgis.com"], Win);
      // create an event object, with a matching origin
      // an a source.postMessage fn that we can spy on
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
      const sourceSpy = spyOn(event.source, "postMessage");
      // Now, fire the handler, simulating what happens when a postMessage event comes
      // from an embedded iframe
      Win._fn(event);
      // Expectations...
      expect(sourceSpy.calls.count()).toBe(
        1,
        "souce.postMessage should be called in handler"
      );
      const args = sourceSpy.calls.argsFor(0);
      expect(args[0].type).toBe("arcgis:auth:error", "should send error type");
      expect(args[0].credential).not.toBeDefined();
      expect(args[0].error.name).toBe(
        "tokenExpiredError",
        "should recieve tokenExpiredError"
      );
    });

    it(".fromParent happy path", () => {
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

      return ArcGISIdentityManager.fromParent("https://origin.com", Win).then(
        (session) => {
          expect(session.username).toBe(
            "jsmith",
            "should use the cred wired throu the mock window"
          );
        }
      );
    });

    it(".fromParent ignores other messages, then intercepts the correct one", async () => {
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

      return ArcGISIdentityManager.fromParent("https://origin.com", Win).then(
        (resp) => {
          expect(resp.username).toBe(
            "jsmith",
            "should use the cred wired throu the mock window"
          );
        }
      );
    });

    it(".fromParent rejects if invlid cred", () => {
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

      return ArcGISIdentityManager.fromParent("https://origin.com", Win).catch(
        (err) => {
          expect(err).toBeDefined("Should reject");
        }
      );
    });

    it(".fromParent rejects if auth error recieved", () => {
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

      return ArcGISIdentityManager.fromParent("https://origin.com", Win).catch(
        (err) => {
          expect(err).toBeDefined("Should reject");
        }
      );
    });

    it(".fromParent rejects if auth unknown message", () => {
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

      return ArcGISIdentityManager.fromParent("https://origin.com", Win).catch(
        (err) => {
          expect(err.message).toBe("Unknown message type.", "Should reject");
        }
      );
    });
  });

  describe("validateAppAccess: ", () => {
    it("makes a request to /oauth2/validateAppAccess passing params", () => {
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
      return session
        .validateAppAccess("abc123")
        .then((response) => {
          const [url, options] = fetchMock.lastCall(VERIFYAPPACCESS_URL);
          expect(url).toEqual(VERIFYAPPACCESS_URL);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=FAKE-TOKEN");
          expect(options.body).toContain("client_id=abc123");
          expect(response.valid).toEqual(true);
          expect(response.viewOnlyUserTypeApp).toBe(false);
        })
        .catch((e) => fail(e));
    });
  });

  describe(".authorize()", () => {
    it("should redirect the request to the authorization page", (done) => {
      const spy = jasmine.createSpy("spy");
      const MockResponse: any = {
        writeHead: spy,
        end() {
          expect(spy.calls.mostRecent().args[0]).toBe(301);
          expect(spy.calls.mostRecent().args[1].Location).toBe(
            "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=20160&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
          );
          done();
        }
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockResponse
      );
    });

    it("should redirect the request to the authorization page with custom expiration", (done) => {
      const spy = jasmine.createSpy("spy");
      const MockResponse: any = {
        writeHead: spy,
        end() {
          expect(spy.calls.mostRecent().args[0]).toBe(301);
          expect(spy.calls.mostRecent().args[1].Location).toBe(
            "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10000&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
          );
          done();
        }
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri",
          expiration: 10000
        },
        MockResponse
      );
    });

    it("should redirect the request to the authorization page with custom state", (done) => {
      const spy = jasmine.createSpy("spy");
      const MockResponse: any = {
        writeHead: spy,
        end() {
          expect(spy.calls.mostRecent().args[0]).toBe(301);
          expect(spy.calls.mostRecent().args[1].Location).toBe(
            "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10000&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri&state=foo"
          );
          done();
        }
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
    });

    it("should redirect the request to the authorization page with custom duration (DEPRECATED)", (done) => {
      const spy = jasmine.createSpy("spy");
      const MockResponse: any = {
        writeHead: spy,
        end() {
          expect(spy.calls.mostRecent().args[0]).toBe(301);
          expect(spy.calls.mostRecent().args[1].Location).toBe(
            "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&expiration=10001&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
          );
          done();
        }
      };

      ArcGISIdentityManager.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri",
          expiration: 10001
        },
        MockResponse
      );
    });
  });

  describe(".exchangeAuthorizationCode()", () => {
    it("should exchange an authorization code for a new ArcGISIdentityManager", (done) => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "token",
        expires_in: 1800,
        refresh_token: "refreshToken",
        username: "Casey",
        ssl: true
      });

      ArcGISIdentityManager.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      )
        .then((session) => {
          expect(session.token).toBe("token");
          expect(session.tokenExpires.getTime()).toBeGreaterThan(Date.now());
          expect(session.username).toBe("Casey");
          expect(session.refreshToken).toBe("refreshToken");
          expect(session.ssl).toBe(true);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return a ArcGISIdentityManager where refreshTokenExpires is 2 weeks from now (within 5 minutes)", (done) => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "token",
        refresh_token: "refreshToken",
        refresh_token_expires_in: 1209600,
        username: "Casey",
        ssl: true
      });

      ArcGISIdentityManager.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      )
        .then((session) => {
          const twoWeeksFromNow = new Date(
            Date.now() + (20160 - 1) * 60 * 1000 - 1000 * 60 * 5
          );
          expect(session.refreshTokenExpires.getTime()).toBeGreaterThan(
            twoWeeksFromNow.getTime() - 1000 * 60 * 10
          );
          expect(session.refreshTokenExpires.getTime()).toBeLessThan(
            twoWeeksFromNow.getTime() + 1000 * 60 * 10
          );
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should throw an ArcGISTokenRequestError when there is an error exchanging the code", () => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        error: {
          code: 498,
          error: "invalid_request",
          error_description: "refresh_token expired",
          message: "refresh_token expired",
          details: []
        }
      });

      return ArcGISIdentityManager.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      ).catch((e) => {
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e instanceof ArcGISTokenRequestError).toBe(true);
        expect(e.code).toBe(
          ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED
        );
        expect(e.message).toBe(
          "REFRESH_TOKEN_EXCHANGE_FAILED: 498: refresh_token expired"
        );
      });
    });
  });

  describe(".getUser()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    it("should cache metadata about the user", (done) => {
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

      session
        .getUser()
        .then((response) => {
          expect(response.role).toEqual("org_publisher");
          session
            .getUser()
            .then((cachedResponse) => {
              expect(cachedResponse.fullName).toEqual("John Smith");
              done();
            })
            .catch((e) => {
              fail(e);
            });
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should never make more then 1 request", (done) => {
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

      Promise.all([session.getUser(), session.getUser()])
        .then(() => {
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".getUsername()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    it("should fetch the username via getUser()", (done) => {
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

      session
        .getUsername()
        .then((response) => {
          expect(response).toEqual("jsmith");

          // also test getting it from the cache.
          session
            .getUsername()
            .then((username) => {
              done();

              expect(username).toEqual("jsmith");
            })
            .catch((e) => {
              fail(e);
            });
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should use a username if passed in the session", (done) => {
      const session = new ArcGISIdentityManager({
        username: "jsmith"
      });

      session
        .getUsername()
        .then((response) => {
          expect(response).toEqual("jsmith");
          done();
        })
        .catch((e) => {
          fail(e);
        });
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

    it("should create a credential object from a session", () => {
      const creds = MOCK_USER_SESSION.toCredential();
      expect(creds.userId).toEqual("jsmith");
      expect(creds.server).toEqual("https://www.arcgis.com/sharing/rest");
      expect(creds.ssl).toEqual(false);
      expect(creds.token).toEqual("token");
      expect(creds.expires).toEqual(TOMORROW.getTime());
    });

    it("should create a ArcGISIdentityManager from a credential", () => {
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

    it("should create a ArcGISIdentityManager from a credential without adding /sharing/rest", () => {
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

    it("should create a manager for a specific server", () => {
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

    it("should create a ArcGISIdentityManager from a credential", () => {
      jasmine.clock().install();
      jasmine.clock().mockDate();

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

      jasmine.clock().uninstall();
    });
  });

  describe("getServerRootUrl()", () => {
    it("should lowercase domain names", () => {
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

    it("should not lowercase path names", () => {
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

    it("should respect the original https/http protocol", () => {
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
    it("shouldnt fetch a fresh token if the current one isn't expired.", (done) => {
      const MOCK_USER_SESSION = new ArcGISIdentityManager({
        username: "c@sey",
        password: "123456",
        token: "token",
        tokenExpires: TOMORROW,
        server: "https://fakeserver.com/arcgis"
      });

      MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it("should fetch a fresh token if the current one is expired.", (done) => {
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

      MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then((token) => {
          expect(token).toBe("fresh-token");
          const [url, options] = fetchMock.lastCall(
            "https://fakeserver.com/arcgis/tokens/generateToken"
          );
          expect(url).toBe(
            "https://fakeserver.com/arcgis/tokens/generateToken"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("username=jsmith");
          expect(options.body).toContain("password=123456");
          expect(options.body).toContain("client=referer");

          if (isNode) {
            expect(options.body).toContain("referer=%40esri%2Farcgis-rest-js");
          }

          if (isBrowser) {
            expect(options.body).toContain(
              `referer=${encodeURIComponent(window.location.origin)}`
            );
          }

          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it("should use provided referer.", (done) => {
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

      MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then((token) => {
          expect(token).toBe("fresh-token");
          const [url, options] = fetchMock.lastCall(
            "https://fakeserver.com/arcgis/tokens/generateToken"
          );
          expect(url).toBe(
            "https://fakeserver.com/arcgis/tokens/generateToken"
          );
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

          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it("should throw an error if there is an error generating the server token with a username and password.", () => {
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

      return MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      ).catch((e) => {
        expect(e instanceof ArcGISTokenRequestError);
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.message).toBe(
          "GENERATE_TOKEN_FOR_SERVER_FAILED: 498: Invalid token."
        );
        expect(e.code).toBe(
          ArcGISTokenRequestErrorCodes.GENERATE_TOKEN_FOR_SERVER_FAILED
        );
      });
    });

    it("should trim down the server url if necessary.", (done) => {
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

      MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then((token) => {
          expect(token).toBe("fresh-token");
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it("should throw an error if the server isnt trusted.", (done) => {
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

      MOCK_USER_SESSION.getToken(
        "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then((token) => {
          fail(token);
        })
        .catch((err) => {
          expect(err.code).toBe("NOT_FEDERATED");
          expect(err.originalMessage).toEqual(
            "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/ is not federated with any portal and is not explicitly trusted."
          );
          done();
        });
    });
  });

  describe(".getPortal()", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    it("should cache metadata about the portal", (done) => {
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

      session
        .getPortal()
        .then((response) => {
          expect(response.authorizedCrossOriginDomains).toEqual([
            "gis.city.com"
          ]);
          session
            .getPortal()
            .then((cachedResponse) => {
              expect(cachedResponse.authorizedCrossOriginDomains).toEqual([
                "gis.city.com"
              ]);
              done();
            })
            .catch((e) => {
              fail(e);
            });
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should never make more then 1 request", (done) => {
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

      Promise.all([session.getPortal(), session.getPortal()])
        .then(() => {
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("fetchAuthorizedDomains/getDomainCredentials", () => {
    it("should default to same-origin credentials when no domains are listed in authorizedCrossOriginDomains", (done) => {
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

      request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      )
        .then((response) => {
          const { credentials } = fetchMock.lastOptions(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          ) as RequestInit;
          expect(credentials).toEqual("same-origin");

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should set the credentials option to include when a server is listed in authorizedCrossOriginDomains", (done) => {
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

      request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      )
        .then((response) => {
          const { credentials } = fetchMock.lastOptions(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          ) as RequestInit;
          expect(credentials).toEqual("include");

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should ignore the case when comparing a server with the authorizedCrossOriginDomains list: variant 1", (done) => {
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

      request(
        "https://GISSERVICES.CITY.GOV/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      )
        .then((response) => {
          const { credentials } = fetchMock.lastOptions(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          ) as RequestInit;
          expect(credentials).toEqual("include");

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should ignore the case when comparing a server with the authorizedCrossOriginDomains list: variant 2", (done) => {
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

      request(
        "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
        {
          authentication: session
        }
      )
        .then((response) => {
          const { credentials } = fetchMock.lastOptions(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          ) as RequestInit;
          expect(credentials).toEqual("include");

          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  it("should still send same-origin credentials even if another domain is listed in authorizedCrossOriginDomains", (done) => {
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

    request(
      "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query",
      {
        authentication: session
      }
    )
      .then((response) => {
        const { credentials } = fetchMock.lastOptions(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        ) as RequestInit;
        expect(credentials).toEqual("same-origin");

        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should normalize optional protocols in authorizedCrossOriginDomains", (done) => {
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

    (session as any)
      .fetchAuthorizedDomains()
      .then(() => {
        expect((session as any).trustedDomains).toEqual([
          "https://one.city.gov",
          "https://two.city.gov"
        ]);
        done();
      })
      .catch((e: Error) => {
        fail(e);
      });
  });

  it("should not use domain credentials if portal is null", (done) => {
    const session = new ArcGISIdentityManager({
      clientId: "id",
      token: "token",
      refreshToken: "refresh",
      tokenExpires: TOMORROW,
      portal: null,
      server: "https://fakeserver.com/arcgis"
    });

    (session as any)
      .fetchAuthorizedDomains()
      .then(() => {
        done();
      })
      .catch((e: Error) => {
        fail(e);
      });
  });

  describe(".destroy()", () => {
    it("should revoke a refresh token with ArcGISIdentityManager", () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW
      });
      return ArcGISIdentityManager.destroy(session).then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(response).toEqual({ success: true });
        expect(url).toBe(
          "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
        );
        expect(options.body).toContain("auth_token=refreshToken");
        expect(options.body).toContain("client_id=clientId");
      });
    });

    it("should revoke a token with ArcGISIdentityManager", () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token"
      });
      return ArcGISIdentityManager.destroy(session).then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(response).toEqual({ success: true });
        expect(url).toBe(
          "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
        );
        expect(options.body).toContain("auth_token=token");
        expect(options.body).toContain("client_id=clientId");
      });
    });

    it("should revoke a token with the signOut() instance method", () => {
      fetchMock.once("*", { success: true });

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "token"
      });

      return session.signOut().then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(response).toEqual({ success: true });
        expect(url).toBe(
          "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
        );
        expect(options.body).toContain("auth_token=token");
        expect(options.body).toContain("client_id=clientId");
      });
    });
  });

  describe(".fromToken", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    it("should initialize a session from a token", () => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/self?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      return ArcGISIdentityManager.fromToken({
        token: "token",
        tokenExpires: TOMORROW
      }).then((session) => {
        expect(session.username).toEqual("jsmith");
        expect(session.token).toEqual("token");
        expect(session.tokenExpires).toEqual(TOMORROW);
      });
    });
  });

  describe(".signIn", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    it("should initialize a session from a username and password", () => {
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

      return ArcGISIdentityManager.signIn({
        username: "c@sey",
        password: "123456"
      }).then((session) => {
        expect(session.username).toEqual("c@sey");
        expect(session.token).toEqual("token");
        expect(session.tokenExpires).toEqual(TOMORROW);
      });
    });

    it("should initialize a session from a username and password and pass a referer", () => {
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

      return ArcGISIdentityManager.signIn({
        username: "c@sey",
        password: "123456",
        referer: "testreferer"
      }).then(() => {
        const [url, options] = fetchMock.lastCall(
          "https://www.arcgis.com/sharing/rest/generateToken"
        );

        if (isNode) {
          expect(options.body).toContain("referer=testreferer");
        }

        if (isBrowser) {
          expect(options.body).toContain(`referer=testreferer`);
        }
      });
    });
  });
});
