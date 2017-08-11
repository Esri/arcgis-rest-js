import * as fetchMock from "fetch-mock";
import { fetchToken } from "../src/index";

const TOKEN_URL = "https://www.arcgis.com/sharing/rest/oauth2/token";

describe("fetchToken()", () => {
  it("should request a token with `client_credentials`, `client_id` and `client_secret`", () => {
    const paramsSpy = spyOn(FormData.prototype, "append");

    fetchMock.postOnce(TOKEN_URL, {
      access_token: "token",
      expires_in: 1800
    });

    fetchToken(TOKEN_URL, {
      client_id: "clientId",
      client_secret: "clientSecret",
      grant_type: "client_credentials"
    })
      .then(response => {
        const [url]: [string, RequestInit] = fetchMock.lastCall(TOKEN_URL);
        expect(url).toEqual(TOKEN_URL);
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("client_id", "clientId");
        expect(paramsSpy).toHaveBeenCalledWith("client_secret", "clientSecret");
        expect(paramsSpy).toHaveBeenCalledWith(
          "grant_type",
          "client_credentials"
        );
        expect(response.token).toEqual("token");
        expect(response.expires).toBeGreaterThan(Date.now());
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should request a token with `authorization_code`, `client_id` and `redirect_uri`", () => {
    const paramsSpy = spyOn(FormData.prototype, "append");

    fetchMock.postOnce(TOKEN_URL, {
      access_token: "token",
      expires_in: 1800,
      refresh_token: "refreshToken",
      username: "Casey"
    });

    fetchToken(TOKEN_URL, {
      client_id: "clientId",
      redirect_uri: "https://example-app.com/redirect-uri",
      code: "authorizationCode",
      grant_type: "authorization_code"
    })
      .then(response => {
        const [url]: [string, RequestInit] = fetchMock.lastCall(TOKEN_URL);
        expect(url).toEqual(TOKEN_URL);
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");

        expect(paramsSpy).toHaveBeenCalledWith("client_id", "clientId");
        expect(paramsSpy).toHaveBeenCalledWith(
          "redirect_uri",
          "https://example-app.com/redirect-uri"
        );
        expect(paramsSpy).toHaveBeenCalledWith(
          "grant_type",
          "authorization_code"
        );
        expect(paramsSpy).toHaveBeenCalledWith("code", "authorizationCode");
        expect(response.token).toEqual("token");
        expect(response.refreshToken).toEqual("refreshToken");
        expect(response.username).toEqual("Casey");
        expect(response.expires).toBeGreaterThan(Date.now());
      })
      .catch(e => {
        fail(e);
      });
  });
});
