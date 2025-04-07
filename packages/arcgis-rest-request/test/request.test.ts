/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  ErrorTypes,
  setDefaultRequestOptions,
  IRequestOptions,
  ArcGISIdentityManager,
  ArcGISTokenRequestError,
  ArcGISRequestError
} from "../src/index.js";
import fetchMock from "fetch-mock";
import {
  SharingRestInfo,
  SharingRestInfoHTML
} from "./mocks/sharing-rest-info.js";
import { MockParamBuilder } from "./mocks/param-builder.js";
import { ArcGISOnlineError } from "./mocks/errors.js";
import { WebMapAsText, WebMapAsJSON } from "./mocks/webmap.js";
import { GeoJSONFeatureCollection } from "./mocks/geojson-feature-collection.js";
import {
  TOMORROW,
  FIVE_DAYS_FROM_NOW,
  isNode
} from "../../../scripts/test-helpers.js";

const MOCK_AUTH = {
  token: "token",
  portal: "https://www.arcgis.com/sharing/rest",
  getToken() {
    return Promise.resolve("token");
  }
};

describe("request()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should make a basic POST request", (done) => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info")
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingRestInfo);
        expect(options.body).toContain("f=json");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a basic GET request", (done) => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET"
    })
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a basic GET request for text", (done) => {
    fetchMock.once("*", WebMapAsText);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        httpMethod: "GET",
        params: { f: "text" }
      }
    )
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data?f=text"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(WebMapAsText);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a basic GET request for html", (done) => {
    fetchMock.once("*", SharingRestInfoHTML);

    request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET",
      params: { f: "html" }
    })
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=html");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfoHTML);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a basic GET request for geojson", (done) => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: { where: "1=1", f: "geojson" }
      }
    )
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query?f=geojson&where=1%3D1"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(GeoJSONFeatureCollection);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should switch from GET to POST when url is longer than specified", (done) => {
    fetchMock.once("*", SharingRestInfo);
    const restInfoUrl = "https://www.arcgis.com/sharing/rest/info";

    request(restInfoUrl, {
      httpMethod: "GET",
      // typically consumers would base maxUrlLength on browser/server limits
      // but for testing, we use an artificially low limit
      // like this one that assumes no parameters will be added
      maxUrlLength: restInfoUrl.length
    })
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should use the `authentication` option to authenticate a request", (done) => {
    fetchMock.once("*", WebMapAsText);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        authentication: MOCK_AUTH
      }
    )
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
        );
        expect(options.body).toContain("token=token");
        expect(response).toEqual(WebMapAsJSON);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should hide token in POST body in browser environments otherwise it should hide token in `X-ESRI_AUTHORIZATION` header in Node", (done) => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info", {
      authentication: MOCK_AUTH,
      httpMethod: "GET",
      hideToken: true
    })
      .then((response) => {
        // Test Node path with Jasmine in Node
        if (typeof window === "undefined") {
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/info?f=json"
          );
          expect(options.method).toBe("GET");
          expect(response).toEqual(SharingRestInfo);
          expect((options.headers as any)["X-Esri-Authorization"]).toBe(
            "Bearer token"
          );
        } else {
          // Test browser path when run in browser with Karma
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=token");
          expect((options.headers as any)["X-Esri-Authorization"]).toBe(
            undefined
          );
          expect(response).toEqual(SharingRestInfo);
        }
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("it should set credential to include for platformSelf call w header", () => {
    const PLATFORM_SELF_URL =
      "https://www.arcgis.com/sharing/rest/oauth2/platformSelf?f=json";
    fetchMock.postOnce(PLATFORM_SELF_URL, {
      username: "jsmith",
      token: "APP-TOKEN"
    });
    const ro = {
      method: "POST",
      headers: {
        "X-Esri-Auth-Client-Id": "CLIENT-ID-ABC123",
        "X-Esri-Auth-Redirect-Uri":
          "https://hub.arcgis.com/torii-provider-arcgis/redirect.html"
      },
      // Note: request has logic to include the cookie
      // for platformSelf calls w/ the X-Esri-Auth-Client-Id header
      params: {
        f: "json"
      }
    } as IRequestOptions;

    return request(PLATFORM_SELF_URL, ro).then((response) => {
      const [url, options] = fetchMock.lastCall(PLATFORM_SELF_URL);
      expect(url).toEqual(PLATFORM_SELF_URL);
      const headers = options.headers || ({} as any);
      expect(headers["X-Esri-Auth-Redirect-Uri"]).toBe(
        "https://hub.arcgis.com/torii-provider-arcgis/redirect.html"
      );
      expect(options.credentials).toBe("include", "fetch should send cookie");
      expect(headers["X-Esri-Auth-Client-Id"]).toBe("CLIENT-ID-ABC123");
      expect(response.token).toEqual("APP-TOKEN");
      expect(response.username).toEqual("jsmith");
    });
  });

  it("should switch from GET to POST when url is longer than specified and replace token in header with token in POST body", (done) => {
    fetchMock.once("*", SharingRestInfo);
    const restInfoUrl = "https://www.arcgis.com/sharing/rest/info";

    request(restInfoUrl, {
      authentication: MOCK_AUTH,
      httpMethod: "GET",
      hideToken: true,
      // typically consumers would base maxUrlLength on browser/server limits
      // but for testing, we use an artificially low limit
      // like this one that assumes no parameters will be added
      maxUrlLength: restInfoUrl.length
    })
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=token");
        expect((options.headers as any)["X-Esri-Authorization"]).toBe(
          undefined
        );
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should re-throw HTTP errors (404, 500, etc) without a JSON formatted body", () => {
    fetchMock.once("*", 404);

    return request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
    ).catch((error) => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe("HTTP 404: Not Found");
      expect(error instanceof Error).toBeTruthy();
      expect(error.url).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      );
      expect(error.options.params).toEqual({ f: "json" });
      expect(error.options.httpMethod).toEqual("POST");
    });
  });

  it("should try to parse a JSON error out of an HTTP error  (404, 500, etc)", () => {
    fetchMock.once("*", {
      status: 400,
      body: {
        error: {
          code: 400,
          message: "Parameter invalid",
          details: [
            "Invalid parameter: 'offset' value: '300'. The value must be a number between 0 and 200."
          ]
        }
      }
    });

    return request(
      "https://places-service.esri.com/rest/v1/world/places/near-point"
    ).catch((error) => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe(
        "HTTP 400 Bad Request: Parameter invalid. Invalid parameter: 'offset' value: '300'. The value must be a number between 0 and 200."
      );
      expect(error instanceof ArcGISRequestError).toBeTruthy();
      expect(error.url).toBe(
        "https://places-service.esri.com/rest/v1/world/places/near-point"
      );
    });
  });

  it("should handle a missing details array in a JSON body in a HTTP error  (404, 500, etc)", () => {
    fetchMock.once("*", {
      status: 400,
      body: {
        error: {
          code: 400,
          message: "Parameter invalid"
        }
      }
    });

    return request(
      "https://places-service.esri.com/rest/v1/world/places/near-point"
    ).catch((error) => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe("HTTP 400 Bad Request: Parameter invalid.");
      expect(error instanceof ArcGISRequestError).toBeTruthy();
      expect(error.url).toBe(
        "https://places-service.esri.com/rest/v1/world/places/near-point"
      );
    });
  });

  it("should throw errors with information about the request", (done) => {
    fetchMock.once("*", ArcGISOnlineError);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
    ).catch((error) => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe("400: 'type' and 'title' property required.");
      expect(error instanceof Error).toBeTruthy();
      expect(error.url).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      );
      expect(error.options.params).toEqual({ f: "json" });
      expect(error.options.httpMethod).toEqual("POST");
      // expect(typeof error.options.fetch).toEqual("function");
      // expect(error.options.fetch.length).toEqual(2);
      done();
    });
  });

  it("should return a raw response if requested", (done) => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: { where: "1=1", f: "geojson" },
        rawResponse: true
      }
    )
      .then((response) => {
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.body.Readable).not.toBe(null);
        response.json().then((raw: any) => {
          expect(raw).toEqual(GeoJSONFeatureCollection);
          done();
        });
        // this used to work with isomorphic-fetch
        // expect(response instanceof Response).toBe(true);
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should allow setting defaults for all requests", (done) => {
    fetchMock.once("*", SharingRestInfo);

    setDefaultRequestOptions({
      headers: {
        "Test-Header": "Test"
      }
    });

    request("https://www.arcgis.com/sharing/rest/info")
      .then((response) => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingRestInfo);
        expect(options.body).toContain("f=json");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch((e) => {
        fail(e);
      });

    // since calling request is sync we can delete this right away
    setDefaultRequestOptions({
      httpMethod: "POST",
      params: {
        f: "json"
      }
      // fetch,
    });
  });

  it("should warn users when attempting to set default auth", () => {
    const oldWarn = console.warn;

    console.warn = jasmine.createSpy().and.callFake(() => {
      return;
    });

    setDefaultRequestOptions({
      authentication: MOCK_AUTH
    });

    setDefaultRequestOptions(
      {
        authentication: MOCK_AUTH
      },
      true
    );

    expect(console.warn).toHaveBeenCalledTimes(1);

    // since calling request is  sync we can delete this right away
    setDefaultRequestOptions({
      httpMethod: "POST",
      params: {
        f: "json"
      }
    });

    console.warn = oldWarn;
  });

  describe("should impliment the IParamBuilder and IParamsBuilder interfaces builder", () => {
    it("should encode a param that impliments IParamBuilder", (done) => {
      fetchMock.once("*", GeoJSONFeatureCollection);

      const builder = new MockParamBuilder();

      request(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
        {
          params: { where: builder, f: "geojson" }
        }
      )
        .then((response) => {
          const options = fetchMock.lastCall("*")[1];
          expect(options.body).toContain(`where=${encodeURIComponent("1=1")}`);
          expect(response).toEqual(GeoJSONFeatureCollection);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  if (isNode) {
    it("should tack on a generic referer header - in Node.js only", (done) => {
      fetchMock.once("*", WebMapAsJSON);

      request("https://www.arcgis.com/sharing/rest/content/items/43a/data")
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/43a/data"
          );
          expect(options.method).toBe("POST");
          expect(options.headers).toEqual({
            referer: "@esri/arcgis-rest-js",
            "Content-Type": "application/x-www-form-urlencoded"
          });
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should use referer header from request options - in Node.js only", (done) => {
      fetchMock.once("*", WebMapAsJSON);

      request("https://www.arcgis.com/sharing/rest/content/items/43a/data", {
        headers: { referer: "test/referer" }
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/43a/data"
          );
          expect(options.method).toBe("POST");
          expect(options.headers).toEqual({
            referer: "test/referer",
            "Content-Type": "application/x-www-form-urlencoded"
          });
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("if no referer header is provided, but other headers are passed, a default should still be set - in Node.js only", (done) => {
      fetchMock.once("*", WebMapAsJSON);

      request("https://www.arcgis.com/sharing/rest/content/items/43a/data", {
        headers: { foo: "bar" }
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/items/43a/data"
          );
          expect(options.method).toBe("POST");
          expect(options.headers).toEqual({
            "Content-Type": "application/x-www-form-urlencoded",
            referer: "@esri/arcgis-rest-js",
            foo: "bar"
          });
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }

  it("should use a string passed to authentication option as the token", () => {
    const oldWarn = console.warn;

    console.warn = jasmine.createSpy().and.callFake(() => {
      return;
    });

    fetchMock.post("*", {
      username: "jsmith"
    });

    return request("https://www.arcgis.com/sharing/rest/portals/self", {
      authentication: "token"
    })
      .then(() => {
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/portals/self");
        expect(console.warn).toHaveBeenCalledTimes(1);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=token");
      })
      .catch((e) => {
        fail(e);
      })
      .finally(() => {
        console.warn = oldWarn;
      });
  });

  describe("automatic retry", () => {
    it("should retry requests that fail with an invalid token error, by refreshing the token", () => {
      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=INVALID_TOKEN",
        { error: { code: 498, message: "Invalid token.", details: [] } }
      );

      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=VALID_TOKEN",
        {
          user: {
            username: "c@sey"
          }
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "INVALID_TOKEN",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: FIVE_DAYS_FROM_NOW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      expect(session.canRefresh).toBe(true);

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "VALID_TOKEN",
        expires_in: 60,
        username: " c@sey"
      });

      return request("https://www.arcgis.com/sharing/rest/portals/self", {
        httpMethod: "GET",
        authentication: session
      })
        .then((response) => {
          expect(response.user.username).toBe("c@sey");
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should retry requests that fail with an invalid token error, by refreshing the token and refresh token", () => {
      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=INVALID_TOKEN",
        { error: { code: 498, message: "Invalid token.", details: [] } }
      );

      fetchMock.getOnce(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=VALID_TOKEN",
        {
          user: {
            username: "c@sey"
          }
        }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "INVALID_TOKEN",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      expect(session.canRefresh).toBe(true);

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "VALID_TOKEN",
        expires_in: 60,
        username: " c@sey",
        refresh_token: "NEW_REFRESH_TOKEN",
        refresh_token_expires_in: 1209600
      });

      return request("https://www.arcgis.com/sharing/rest/portals/self", {
        httpMethod: "GET",
        authentication: session
      })
        .then((response) => {
          expect(response.user.username).toBe("c@sey");
          expect(session.token).toBe("VALID_TOKEN");
          expect(session.refreshToken).toBe("NEW_REFRESH_TOKEN");
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should throw the error from the refresh call if refreshing fails", () => {
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=INVALID_TOKEN",
        { error: { code: 498, message: "Invalid token.", details: [] } }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "INVALID_TOKEN",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token", {
        error: {
          code: 498,
          error: "invalid_request",
          error_description: "Invalid refresh_token",
          message: "Invalid refresh_token",
          details: []
        }
      });

      return request("https://www.arcgis.com/sharing/rest/portals/self", {
        httpMethod: "GET",
        authentication: session
      }).catch((e) => {
        expect(e instanceof ArcGISTokenRequestError).toBe(true);
        expect(e.name).toBe("ArcGISTokenRequestError");
        expect(e.code).toBe("REFRESH_TOKEN_EXCHANGE_FAILED");
        expect(e.message).toBe(
          "REFRESH_TOKEN_EXCHANGE_FAILED: 498: Invalid refresh_token"
        );
        return;
      });
    });

    it("should throw an error if it also fails with the new token", () => {
      fetchMock.get(
        "https://www.arcgis.com/sharing/rest/portals/self?f=json&token=TOKEN",
        { error: { code: 498, message: "Invalid token.", details: [] } }
      );

      const session = new ArcGISIdentityManager({
        clientId: "clientId",
        token: "TOKEN",
        username: "c@sey",
        refreshToken: "refreshToken",
        refreshTokenExpires: FIVE_DAYS_FROM_NOW,
        redirectUri: "https://example-app.com/redirect-uri"
      });

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token", {
        access_token: "TOKEN",
        expires_in: 60,
        username: " c@sey"
      });

      return request("https://www.arcgis.com/sharing/rest/portals/self", {
        httpMethod: "GET",
        authentication: session
      }).catch((e) => {
        expect(e.code).toBe(498);
        expect(e.message).toBe("498: Invalid token.");
        return;
      });
    });
  });
});
