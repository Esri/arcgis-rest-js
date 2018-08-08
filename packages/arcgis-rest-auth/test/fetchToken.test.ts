import * as fetchMock from "fetch-mock";
import { fetchToken } from "../src/index";

const TOKEN_URL = "https://www.arcgis.com/sharing/rest/oauth2/token";

describe("fetchToken()", () => {
  afterEach(fetchMock.restore);

  it("should request a token with `client_credentials`, `client_id` and `client_secret`", done => {
    fetchMock.postOnce(TOKEN_URL, {
      access_token: "token",
      expires_in: 1800
    });

    fetchToken(TOKEN_URL, {
      params: {
        client_id: "clientId",
        client_secret: "clientSecret",
        grant_type: "client_credentials"
      }
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          TOKEN_URL
        );
        expect(url).toEqual(TOKEN_URL);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("client_id=clientId");
        expect(options.body).toContain("client_secret=clientSecret");
        expect(options.body).toContain("grant_type=client_credentials");
        expect(response.token).toEqual("token");
        expect(response.expires).toBeGreaterThan(Date.now());
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should request a token with `authorization_code`, `client_id` and `redirect_uri`", done => {
    fetchMock.postOnce(TOKEN_URL, {
      access_token: "token",
      expires_in: 1800,
      refresh_token: "refreshToken",
      username: "Casey"
    });

    fetchToken(TOKEN_URL, {
      params: {
        client_id: "clientId",
        redirect_uri: "https://example-app.com/redirect-uri",
        code: "authorizationCode",
        grant_type: "authorization_code"
      }
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          TOKEN_URL
        );
        expect(url).toEqual(TOKEN_URL);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("client_id=clientId");
        expect(options.body).toContain(
          `redirect_uri=${encodeURIComponent(
            "https://example-app.com/redirect-uri"
          )}`
        );
        expect(options.body).toContain("grant_type=authorization_code");
        expect(options.body).toContain("code=authorizationCode");
        expect(response.token).toEqual("token");
        expect(response.refreshToken).toEqual("refreshToken");
        expect(response.username).toEqual("Casey");
        expect(response.expires).toBeGreaterThan(Date.now());
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
