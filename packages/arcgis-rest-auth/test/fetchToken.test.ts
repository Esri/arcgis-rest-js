/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { fetchToken } from "../src/index";

const TOKEN_URL = "https://www.arcgis.com/sharing/rest/oauth2/token";

describe("fetchToken()", () => {
  afterEach(fetchMock.restore);

  it("should request a token with `client_credentials`, `client_id` and `client_secret`", done => {
    fetchMock.postOnce(TOKEN_URL, {
      access_token: "token",
      expires_in: 1800,
      ssl: true
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
        expect(response.ssl).toEqual(true);
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
      username: "Casey",
      ssl: true
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
        expect(response.ssl).toEqual(true);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return ssl: false when there is no ssl property returned from endpoint response", done => {
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
        expect(response.ssl).toEqual(false);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
