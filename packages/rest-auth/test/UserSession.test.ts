import { UserSession, IFetchTokenResponse } from "../src/index";
import { ArcGISRequestError, ErrorTypes } from "@esri/rest-request";
import * as fetchMock from "fetch-mock";
import { YESTERDAY, TOMORROW } from "./utils";

describe("UserSession", () => {
  it("should serialze to and from JSON", () => {
    const session = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenDuration: 20160,
      username: "casey",
      password: "123456"
    });

    const session2 = UserSession.deserialize(session.serialize());

    expect(session2.clientId).toEqual("clientId");
    expect(session2.redirectUri).toEqual(
      "https://example-app.com/redirect-uri"
    );
    expect(session2.token).toEqual("token");
    expect(session2.tokenExpires).toEqual(TOMORROW);
    expect(session2.refreshToken).toEqual("refreshToken");
    expect(session2.refreshTokenExpires).toEqual(TOMORROW);
    expect(session2.username).toEqual("casey");
    expect(session2.password).toEqual("123456");
    expect(session2.tokenDuration).toEqual(20160);
    expect(session2.refreshTokenDuration).toEqual(20160);
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
      ]).then(([token1, token2]) => {
        expect(token1).toBe("token");
        expect(token2).toBe("token");
        done();
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
        });
    });

    it("should fetch new tokens when tokens for for trusted arcgis.com domains are expired", done => {
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
          username: "casey"
        },
        { times: 2, method: "POST" }
      );

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]).then(([token1, token2]) => {
        expect(token1).toBe("new");
        expect(token2).toBe("new");
        done();
      });
    });

    it("should generate a token for an untrusted server", done => {
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

      fetchMock.post("https://gis.city.gov/sharing/generateToken", {
        error: {
          code: 400,
          message: "Unable to generate token",
          details: ["Unable to generate token for this server"]
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
  });

  describe(".refreshSession()", () => {
    it("should refresh with a username and password if expired", done => {
      const session = new UserSession({
        username: "casey",
        password: "123456"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/generateToken", {
        token: "token",
        expires: TOMORROW.getTime(),
        username: " casey"
      });

      session.refreshSession().then(s => {
        expect(s.token).toBe("token");
        expect(s.tokenExpires).toEqual(TOMORROW);
        done();
      });
    });

    it("should refresh with an unexpired refresh token", done => {
      const session = new UserSession({
        clientId: "clientId",
        token: "token",
        username: "casey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " casey"
      });

      session.refreshSession().then(s => {
        expect(s.token).toBe("newToken");
        expect(s.tokenExpires.getTime()).toBeGreaterThan(Date.now());
        done();
      });
    });

    it("should refresh with an expired refresh token", done => {
      const session = new UserSession({
        clientId: "clientId",
        token: "token",
        username: "casey",
        refreshToken: "refreshToken",
        refreshTokenExpires: YESTERDAY,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.postOnce("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "newToken",
        expires_in: 60,
        username: " casey",
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
        username: "casey"
      });

      session.refreshSession().catch(e => {
        expect(e.message).toBe("Unable to refresh token.");
        done();
      });
    });
  });

  describe(".beginOAuth2()", () => {
    it("should authorize via a popup", done => {
      const MockWindow: any = {
        open: jasmine.createSpy("spy")
      };

      const signin = UserSession.beginOAuth2(
        {
          clientId: "clientId",
          redirectUri: "http://example-app.com/redirect"
        },
        MockWindow
      ).then(session => {
        expect(session.token).toBe("token");
        expect(session.username).toBe("Casey");
        expect(session.tokenExpires).toBe(TOMORROW);
        done();
      });

      expect(MockWindow.open).toHaveBeenCalledWith(
        "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect",
        "oauth-window",
        "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
      );

      MockWindow.__ESRI_REST_AUTH_HANDLER_clientId(null, {
        token: "token",
        expires: TOMORROW,
        username: "Casey"
      });
    });

    it("should reject the promise if there is an error", done => {
      const MockWindow: any = {
        open: jasmine.createSpy("spy")
      };

      const signin = UserSession.beginOAuth2(
        {
          clientId: "clientId",
          redirectUri: "http://example-app.com/redirect"
        },
        MockWindow
      ).catch(e => {
        done();
      });

      expect(MockWindow.open).toHaveBeenCalledWith(
        "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect",
        "oauth-window",
        "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
      );

      MockWindow.__ESRI_REST_AUTH_HANDLER_clientId(
        new ArcGISRequestError("unable to sign in", "SIGN_IN_FAILED")
      );
    });

    it("should authorize in the same window/tab", () => {
      const MockWindow: any = {
        location: {
          href: ""
        }
      };

      const signin = UserSession.beginOAuth2(
        {
          clientId: "clientId",
          redirectUri: "http://example-app.com/redirect",
          popup: false
        },
        MockWindow
      );

      expect(MockWindow.location.href).toBe(
        "https://arcgis.com/sharing/rest/oauth2/authorize?client_id=clientId&response_type=token&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect"
      );
    });
  });

  describe(".completeOAuth2()", () => {
    it("should return a new user session if it cannot find a valid parent", () => {
      const MockWindow = {
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=casey"
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
      expect(session.username).toBe("casey");
    });

    it("should callback to create a new user session if finds a valid opener", done => {
      const MockWindow = {
        opener: {
          parent: {
            __ESRI_REST_AUTH_HANDLER_clientId(
              error: any,
              oauthInfo: IFetchTokenResponse
            ) {
              expect(oauthInfo.token).toBe("token");
              expect(oauthInfo.username).toBe("casey");
              expect(oauthInfo.expires.getTime()).toBeGreaterThan(Date.now());
            }
          }
        },
        close() {
          done();
        },
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=casey"
        }
      };

      const session = UserSession.completeOAuth2(
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
            error: any,
            oauthInfo: IFetchTokenResponse
          ) {
            expect(oauthInfo.token).toBe("token");
            expect(oauthInfo.username).toBe("casey");
            expect(oauthInfo.expires.getTime()).toBeGreaterThan(Date.now());
          }
        },
        close() {
          done();
        },
        location: {
          href:
            "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=casey"
        }
      };

      const session = UserSession.completeOAuth2(
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
        }
      };

      expect(function() {
        const session = UserSession.completeOAuth2(
          {
            clientId: "clientId",
            redirectUri: "https://example-app.com/redirect-uri"
          },
          MockWindow
        );
      }).toThrowError(ArcGISRequestError, "Invalid_Signin: Invalid_Signin");
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
        username: "Casey"
      });

      UserSession.exchangeAuthorizationCode(
        {
          clientId: "clientId",
          redirectUri: "https://example-app.com/redirect-uri"
        },
        "code"
      ).then(session => {
        done();
      });
    });
  });
});
