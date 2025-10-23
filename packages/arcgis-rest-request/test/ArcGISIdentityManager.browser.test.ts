import { describe, test, expect, afterEach, beforeEach } from "vitest";
import fetchMock from "fetch-mock";
import { isBrowser, TOMORROW } from "../../../scripts/test-helpers.js";
import {
  ArcGISAuthError,
  ArcGISAccessDeniedError,
  ArcGISIdentityManager
} from "../src/index.js";

describe("ArcGISIdentityManager (browser)", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe(".refreshCredentials() browser tests", () => {
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

        afterEach(() => {
          MockWindow = null;
        });

        describe(".beginOAuth2() without PKCE", () => {
          test("should authorize via implicit grant in a popup", () => {
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
                expect(
                  session.tokenExpires.getUTCMinutes()
                ).toBeLessThanOrEqual(tomorrowMinutes + 1);
              })
              .catch((e) => {
                fail(e);
              });
          });

          test("should reject if there is an error in the popup", () => {
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

          test("should authorize in the same window/tab", () => {
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

          test("should authorize using a social media provider", () => {
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

          test("should authorize using the other social media provider", () => {
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

          test("should pass custom expiration", () => {
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
          test("should authorize via an implicit grant with an inline redirect", () => {
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

          test("should return a new user session with ssl as false when callback hash does not have ssl parameter", () => {
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

          test("should throw an error from the authorization window", () => {
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

          test("should throw an unknown error if the url has no error or access_token", () => {
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
          test("should authorize with a popup", () => {
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
                    clientId: "clientIdBasicPKCE",
                    redirectUri: "http://example-app.com/redirect"
                  },
                  PopupMockWindow
                );
              }, 100);
            });

            return ArcGISIdentityManager.beginOAuth2(
              {
                clientId: "clientIdBasicPKCE",
                redirectUri: "http://example-app.com/redirect"
              },
              MockWindow
            )
              .then((session) => {
                expect(MockWindow.open).toHaveBeenCalledWith(
                  "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientIdBasicPKCE&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo",
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

          test("should reject with an access denied error when a user cancels auth in a popup", () => {
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

          test("should authorize with an inline redirect", () => {
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

          test("should fallback to window.location.href if redirect URI is omitted in a popup workflow", () => {
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

          test("should authorize with an inline redirect with a plain challange", () => {
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

          test("should encode additional params", () => {
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

          test("should pass a custom state object", () => {
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

          test("should pass a custom state string", () => {
            let PopupMockWindow = createMock();
            PopupMockWindow.location.search =
              "?code=auth_code&state=%7B%22id%22%3A%22customStateString%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D";
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
                    clientId: "clientIdCustomStateString",
                    redirectUri: "http://example-app.com/redirect"
                  },
                  PopupMockWindow
                );
              }, 100);
            });

            return ArcGISIdentityManager.beginOAuth2(
              {
                clientId: "clientIdCustomStateString",
                redirectUri: "http://example-app.com/redirect",
                state: "customStateString"
              },
              MockWindow
            )
              .then((session) => {
                expect(MockWindow.open).toHaveBeenCalledWith(
                  "https://www.arcgis.com/sharing/rest/oauth2/authorize?client_id=clientIdCustomStateString&response_type=code&expiration=20160&redirect_uri=http%3A%2F%2Fexample-app.com%2Fredirect&state=%7B%22id%22%3A%22customStateString%22%2C%22originalUrl%22%3A%22https%3A%2F%2Ftest.com%22%7D&locale=&style=&code_challenge_method=S256&code_challenge=DwBzhbb51LfusnSGBa_hqYSgo7-j8BTQnip4TOnlzRo",
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
                  id: "customStateString",
                  originalUrl: "https://test.com"
                });
                expect(PopupMockWindow.close).toHaveBeenCalled();
              })
              .catch((e) => {
                fail(e);
              });
          });

          test("should reject .completeOAuth2() when the user denys the request during an inline redirect", () => {
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

          test("should reject .completeOAuth2() if the state ID does not match", () => {
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

          test("should reject .completeOAuth2() with a default error message", () => {
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

          test("should reject .completeOAuth2() if a state can not be found locally", () => {
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

          test("should reject .completeOAuth2() if a state can not be found in the URL", () => {
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

          test("should reject .completeOAuth2() if the code exchange fails with an error", () => {
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
  });
});
