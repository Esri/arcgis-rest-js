/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "../src/index";
import { ICredential } from "../src/UserSession";

import {
  request,
  ArcGISRequestError,
  ArcGISAuthError,
  ErrorTypes
} from "@esri/arcgis-rest-request";
import * as fetchMock from "fetch-mock";
import { YESTERDAY, TOMORROW } from "./utils";

describe("UserSession", () => {
  afterEach(fetchMock.restore);

  it("should serialize to and from JSON", () => {
    const session = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "c@sey",
      password: "123456"
    });

    const session2 = UserSession.deserialize(session.serialize());

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
    expect(session2.refreshTokenTTL).toEqual(1440);
  });

  describe(".getToken()", () => {
    it("should return unexpired tokens for trusted arcgis.com domains", done => {
      const session = new UserSession({
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
        .catch(e => {
          fail(e);
        });
    });

    it("should return unexpired tokens when an org url is passed", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.maps.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should return unexpired tokens when an org url is passed on other ArcGIS Online environments", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://custom.mapsdev.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should return unexpired tokens when there is an http/https mismatch", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "http://custom.mapsdev.arcgis.com/sharing/rest"
      });

      session
        .getToken(
          "https://services1dev.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should return unexpired tokens for the configured portal domain", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://gis.city.gov/sharing/rest"
      });

      session
        .getToken("https://gis.city.gov/sharing/rest/portals/self")
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should return unexpired tokens for the configured portal domain, regardless of CASING", done => {
      // This was a real configuration discovered on a portal instance
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW,
        portal: "https://pnp00035.esri.com/sharing/rest"
      });

      session
        .getToken("https://PNP00035.esri.com/sharing/rest/portals/self")
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should fetch token when contacting a server that is federated, even if on same domain, regardless of domain casing", done => {
      // This was a real configuration discovered on a portal instance
      // apparently when federating servers, the UI does not force the
      // server url to lowercase, and this any feature service items generated
      // will have the server name using the casing the admin entered.
      // this is just a test to ensure that the mis-matched casing does not
      // break the federation flow.
      const session = new UserSession({
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
          expires: TOMORROW
        }
      );

      // request the token twice, for the same domain, but with different casing
      // and we expect a single POST to generate a token once
      session
        .getToken(
          "https://PNP00035.esri.com/server/rest/services/Hosted/perimeters_dd83/FeatureServer"
        )
        .then(token => {
          expect(token).toBe("new-server-token");
          return session.getToken(
            "https://pnp00035.esri.com/server/rest/services/Hosted/otherService/FeatureServer"
          );
        })
        .then(token => {
          expect(token).toBe("new-server-token");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should fetch new tokens when tokens for trusted arcgis.com domains are expired", done => {
      const session = new UserSession({
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
        .catch(e => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server", done => {
      const session = new UserSession({
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .then(token => {
          expect(token).toBe("serverToken");
          return session.getToken(
            "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
          );
        })
        .then(token => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server admin call", done => {
      const session = new UserSession({
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
        )
        .then(token => {
          expect(token).toBe("serverToken");
          return session.getToken(
            "https://gisservices.city.gov/public/rest/admin/services/trees/FeatureServer/addToDefinition"
          );
        })
        .then(token => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should generate a token for an untrusted, federated server with user credentials", done => {
      const session = new UserSession({
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

      session
        .getToken(
          "https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .then(token => {
          expect(token).toBe("serverToken");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should only make 1 token request to an untrusted portal for similar URLs", done => {
      const session = new UserSession({
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
          expires: TOMORROW
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
        .catch(e => {
          fail(e);
        });
    });

    it("should throw an ArcGISAuthError when the owning system doesn't match", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

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
        .catch(e => {
          expect(e.name).toEqual(ErrorTypes.ArcGISAuthError);
          expect(e.code).toEqual("NOT_FEDERATED");
          expect(e.message).toEqual(
            "NOT_FEDERATED: https://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with https://www.arcgis.com/sharing/rest."
          );
          done();
        });
    });

    it("should throw a fully hydrated ArcGISAuthError when no owning system is advertised", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

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
      ).catch(e => {
        expect(e.name).toEqual(ErrorTypes.ArcGISAuthError);
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

    it("should not throw an ArcGISAuthError when the unfederated service is public", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.post("https://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120"
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
          authentication: session,
          params: {
            returnCount: true
          }
        }
      )
        .then(res => {
          expect(res.count).toEqual(123);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe(".refreshSession()", () => {
    it("should refresh with a username and password if expired", done => {
      const session = new UserSession({
        username: "c@sey",
        password: "123456"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        token: "token",
        expires: TOMORROW.getTime(),
        username: " c@sey"
      });

      session
        .refreshSession()
        .then(s => {
          expect(s.token).toBe("token");
          expect(s.tokenExpires).toEqual(TOMORROW);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should refresh with an unexpired refresh token", done => {
      const session = new UserSession({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey"
      });

      session
        .refreshSession()
        .then(s => {
          expect(s.token).toBe("newToken");
          expect(s.tokenExpires.getTime()).toBeGreaterThan(Date.now());
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should refresh with an expired refresh token", done => {
      const session = new UserSession({
        clientId: "clientId",
        token: "token",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: YESTERDAY,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " c@sey",
        refresh_token: "newRefreshToken"
      });

      session
        .refreshSession()
        .then(s => {
          expect(s.token).toBe("newToken");
          expect(s.tokenExpires.getTime()).toBeGreaterThan(Date.now());
          expect(s.refreshToken).toBe("newRefreshToken");
          expect(s.refreshTokenExpires.getTime()).toBeGreaterThan(Date.now());
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should reject if we cannot refresh the token", done => {
      const session = new UserSession({
        clientId: "clientId",
        token: "token",
        username: "c@sey"
      });

      session.refreshSession().catch(e => {
        expect(e instanceof ArcGISAuthError).toBeTruthy();
        expect(e.name).toBe("ArcGISAuthError");
        expect(e.message).toBe("Unable to refresh token.");
        done();
      });
    });

    it("should only make 1 token request to the portal for similar URLs", done => {
      const session = new UserSession({
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
        .catch(e => {
          fail(e);
        });
    });
  });

  describe(".beginOAuth2()", () => {
    it("should authorize via a popup", done => {
      const MockWindow: any = {
        open: jasmine.createSpy("spy")
      };

      UserSession.beginOAuth2(
        {
          clientId: "clientId123",
          redirectUri: "http://example-app.com/redirect",
          state: "abc123"
        },
        MockWindow
      )
        .then(session => {
          expect(session.token).toBe("token");
          expect(session.username).toBe("c@sey");
          expect(session.ssl).toBe(true);
          expect(session.tokenExpires).toEqual(TOMORROW);
          done();
        })
        .catch(e => {
          fail(e);
        });

      expect(MockWindow.open).toHaveBeenCalledWith(
        "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId123&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=abc123&locale=",
        "oauth-window",
        "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
      );

      MockWindow.__ESRI_REST_AUTH_HANDLER_clientId123(
        JSON.stringify(undefined),
        JSON.stringify({
          token: "token",
          expires: TOMORROW,
          username: "c@sey",
          ssl: true
        })
      );
    });

    it("should reject the promise if there is an error", done => {
      const MockWindow: any = {
        open: jasmine.createSpy("spy")
      };

      UserSession.beginOAuth2(
        {
          clientId: "clientId123",
          redirectUri: "http://example-app.com/redirect",
          locale: "fr"
        },
        MockWindow
      ).catch(e => {
        done();
      });

      expect(MockWindow.open).toHaveBeenCalledWith(
        "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId123&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=clientId123&locale=fr",
        "oauth-window",
        "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
      );

      MockWindow.__ESRI_REST_AUTH_HANDLER_clientId123(
        JSON.stringify({
          errorMessage: "unable to sign in",
          error: "SIGN_IN_FAILED"
        })
      );
    });

    it("should authorize in the same window/tab", () => {
      const MockWindow: any = {
        location: {
          href: ""
        }
      };

      // https://github.com/palantir/tslint/issues/3056
      void UserSession.beginOAuth2(
        {
          clientId: "clientId123",
          redirectUri: "http://example-app.com/redirect",
          popup: false
        },
        MockWindow
      );

      expect(MockWindow.location.href).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId123&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=clientId123&locale="
      );
    });

    it("should authorize using a social media provider", () => {
      const MockWindow: any = {
        location: {
          href: ""
        }
      };

      // https://github.com/palantir/tslint/issues/3056
      void UserSession.beginOAuth2(
        {
          clientId: "clientId123",
          redirectUri: "http://example-app.com/redirect",
          popup: false,
          provider: "facebook"
        },
        MockWindow
      );

      expect(MockWindow.location.href).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/social/authorize?client_id=clientId123&socialLoginProviderName=facebook&autoAccountCreateForSocial=true&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=clientId123&locale="
      );
    });

    it("should authorize using the other social media provider", () => {
      const MockWindow: any = {
        location: {
          href: ""
        }
      };

      // https://github.com/palantir/tslint/issues/3056
      void UserSession.beginOAuth2(
        {
          clientId: "clientId123",
          redirectUri: "http://example-app.com/redirect",
          popup: false,
          provider: "google"
        },
        MockWindow
      );

      expect(MockWindow.location.href).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/social/authorize?client_id=clientId123&socialLoginProviderName=google&autoAccountCreateForSocial=true&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=clientId123&locale="
      );
    });
  });

  describe(".completeOAuth2()", () => {
    it("should return a new user session if it cannot find a valid parent", () => {
      const MockWindow = {
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey&ssl=true&persist=true"
        },
        get parent() {
          return this;
        }
      };

      const session = UserSession.completeOAuth2(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockWindow
      );

      expect(session.token).toBe("token");
      expect(session.tokenExpires.getTime()).toBeGreaterThan(Date.now());
      expect(session.username).toBe("c@sey");
      expect(session.ssl).toBe(true);
    });

    it("should return a new user session with ssl as false when callback hash does not have ssl parameter", () => {
      const MockWindow = {
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey&persist=true"
        },
        get parent() {
          return this;
        }
      };

      const session = UserSession.completeOAuth2(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockWindow
      );
      expect(session.ssl).toBe(false);
    });

    it("should callback to create a new user session if finds a valid opener", done => {
      const MockWindow = {
        opener: {
          parent: {
            __ESRI_REST_AUTH_HANDLER_clientId(
              errorString: string,
              oauthInfoString: string
            ) {
              const oauthInfo = JSON.parse(oauthInfoString);
              expect(oauthInfo.token).toBe("token");
              expect(oauthInfo.username).toBe("c@sey");
              expect(oauthInfo.ssl).toBe(true);
              expect(new Date(oauthInfo.expires).getTime()).toBeGreaterThan(
                Date.now()
              );
            }
          }
        },
        close() {
          done();
        },
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey&ssl=true"
        }
      };

      UserSession.completeOAuth2(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockWindow
      );
    });

    it("should callback to create a new user session if finds a valid parent", done => {
      const MockWindow = {
        parent: {
          __ESRI_REST_AUTH_HANDLER_clientId(
            errorString: string,
            oauthInfoString: string
          ) {
            const oauthInfo = JSON.parse(oauthInfoString);
            expect(oauthInfo.token).toBe("token");
            expect(oauthInfo.username).toBe("c@sey");
            expect(oauthInfo.ssl).toBe(true);
            expect(new Date(oauthInfo.expires).getTime()).toBeGreaterThan(
              Date.now()
            );
          }
        },
        close() {
          done();
        },
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey&ssl=true"
        }
      };

      UserSession.completeOAuth2(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockWindow
      );
    });

    it("should throw an error from the authorization window", () => {
      const MockWindow = {
        location: {
          href:
            "https://example-app.com/redirect-uri#error=Invalid_Signin&error_description=Invalid_Signin"
        },
        get parent() {
          return this;
        }
      };

      expect(function() {
        UserSession.completeOAuth2(
          {
            clientId: "clientId",
            redirectUri: "https://example-app.com/redirect-uri"
          },
          MockWindow
        );
      }).toThrowError(ArcGISRequestError, "Invalid_Signin: Invalid_Signin");
    });

    it("should throw an error if the handler or parent window cannot be accessed", () => {
      const MockParent = {
        get parent() {
          throw new Error(
            "This window isn't where auth started, but was opened from somewhere else via window.open() perhaps from another domain which would cause a cross domain error when read."
          );
        }
      };

      const MockWindow = {
        location: {
          href:
            "https://example-app.com/redirect-uri#error=Invalid_Signin&error_description=Invalid_Signin"
        },
        get opener() {
          return MockParent;
        }
      };

      expect(function() {
        UserSession.completeOAuth2(
          {
            clientId: "clientId",
            redirectUri: "https://example-app.com/redirect-uri"
          },
          MockWindow
        );
      }).toThrowError(ArcGISAuthError);
    });
  });

  describe(".authorize()", () => {
    it("should redirect the request to the authorization page", done => {
      const spy = jasmine.createSpy("spy");
      const MockResponse: any = {
        writeHead: spy,
        end() {
          expect(spy.calls.mostRecent().args[0]).toBe(301);
          expect(spy.calls.mostRecent().args[1].Location).toBe(
            "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&duration=20160&response_type=code&redirect_uri=https%3A%2F%2Fexample-app.com%2Fredirect-uri"
          );
          done();
        }
      };

      UserSession.authorize(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        MockResponse
      );
    });
  });

  describe(".exchangeAuthorizationCode()", () => {
    let paramsSpy: jasmine.Spy;

    beforeEach(() => {
      paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
    });

    afterAll(() => {
      paramsSpy.calls.reset();
    });

    it("should exchange an authorization code for a new UserSession", done => {
      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "token",
        expires_in: 1800,
        refresh_token: "refreshToken",
        username: "Casey",
        ssl: true
      });

      UserSession.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      )
        .then(session => {
          expect(session.token).toBe("token");
          expect(session.tokenExpires.getTime()).toBeGreaterThan(Date.now());
          expect(session.username).toBe("Casey");
          expect(session.refreshToken).toBe("refreshToken");
          expect(session.ssl).toBe(true);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe(".getUser()", () => {
    afterEach(fetchMock.restore);

    it("should cache metadata about the user", done => {
      // we intentionally only mock one response
      fetchMock.once(
        "https://www.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=token",
        {
          username: "jsmith",
          fullName: "John Smith",
          role: "org_publisher"
        }
      );

      const session = new UserSession({
        clientId: "clientId",
        redirectUri: "https://example-app.com/redirect-uri",
        token: "token",
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        refreshTokenTTL: 1440,
        username: "jsmith",
        password: "123456"
      });

      session
        .getUser()
        .then(response => {
          expect(response.role).toEqual("org_publisher");
          session
            .getUser()
            .then(cachedResponse => {
              expect(cachedResponse.fullName).toEqual("John Smith");
              done();
            })
            .catch(e => {
              fail(e);
            });
        })
        .catch(e => {
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

    const MOCK_USER_SESSION = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "token",
      ssl: false,
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
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

    it("should create a UserSession from a credential", () => {
      const session = UserSession.fromCredential(MOCK_CREDENTIAL);
      expect(session.username).toEqual("jsmith");
      expect(session.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(session.ssl).toEqual(false);
      expect(session.token).toEqual("token");
      expect(session.tokenExpires).toEqual(new Date(TOMORROW));
    });

    it("should create a UserSession from a credential that came from a UserSession", () => {
      const creds = MOCK_USER_SESSION.toCredential();
      const credSession = UserSession.fromCredential(creds);
      expect(credSession.username).toEqual("jsmith");
      expect(credSession.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(credSession.ssl).toEqual(false);
      expect(credSession.token).toEqual("token");
      expect(credSession.tokenExpires).toEqual(new Date(TOMORROW));
    });
  });

  describe("getServerRootUrl()", () => {
    it("should lowercase domain names", () => {
      const session = new UserSession({
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
      const session = new UserSession({
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
      const session = new UserSession({
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
    it("shouldnt fetch a fresh token if the current one isnt expired.", done => {
      const MOCK_USER_SESSION = new UserSession({
        username: "c@sey",
        password: "123456",
        token: "token",
        tokenExpires: TOMORROW,
        server: "https://fakeserver.com/arcgis"
      });

      MOCK_USER_SESSION.getToken(
        "https://fakeserver.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then(token => {
          expect(token).toBe("token");
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it("should fetch a fresh token if the current one is expired.", done => {
      const MOCK_USER_SESSION = new UserSession({
        username: "jsmith",
        password: "123456",
        token: "token",
        tokenExpires: YESTERDAY,
        server: "https://fakeserver.com/arcgis"
      });

      fetchMock.postOnce("https://fakeserver.com/arcgis/rest/info", {
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
        .then(token => {
          expect(token).toBe("fresh-token");
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            "https://fakeserver.com/arcgis/tokens/"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("username=jsmith");
          expect(options.body).toContain("password=123456");
          expect(options.body).toContain("client=referer");
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it("should trim down the server url if necessary.", done => {
      const MOCK_USER_SESSION = new UserSession({
        username: "jsmith",
        password: "123456",
        token: "token",
        tokenExpires: YESTERDAY,
        server: "https://fakeserver.com/arcgis/rest/services/blah/"
      });

      fetchMock.postOnce("https://fakeserver.com/arcgis/rest/info", {
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
        .then(token => {
          expect(token).toBe("fresh-token");
          done();
        })
        .catch(err => {
          fail(err);
        });
    });

    it("should throw an error if the server isnt trusted.", done => {
      fetchMock.postOnce("https://fakeserver2.com/arcgis/rest/info", {
        currentVersion: 10.61,
        fullVersion: "10.6.1",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://fakeserver2.com/arcgis/tokens/"
        }
      });
      const MOCK_USER_SESSION = new UserSession({
        username: "c@sey",
        password: "123456",
        token: "token",
        tokenExpires: TOMORROW,
        server: "https://fakeserver.com/arcgis"
      });

      MOCK_USER_SESSION.getToken(
        "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/"
      )
        .then(token => {
          fail(token);
        })
        .catch(err => {
          expect(err.code).toBe("NOT_FEDERATED");
          expect(err.originalMessage).toBe(
            "https://fakeserver2.com/arcgis/rest/services/Fake/MapServer/ is not federated with any portal and is not explicitly trusted."
          );
          done();
        });
    });
  });
});
