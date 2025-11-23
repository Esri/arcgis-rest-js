/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, beforeEach, expect, vi } from "vitest";
import {
  request,
  ErrorTypes,
  setDefaultRequestOptions,
  IRequestOptions,
  ArcGISIdentityManager
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
import { requestConfig } from "../src/requestConfig.js";

describe("request()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should make a basic POST request", async () => {
    fetchMock.once("*", SharingRestInfo);

    const response = await request("https://www.arcgis.com/sharing/rest/info");
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingRestInfo);
    expect(options.body).toContain("f=json");
  });

  test("should make a basic GET request", async () => {
    fetchMock.once("*", SharingRestInfo);

    const response = await request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
    expect(options.method).toBe("GET");
    expect(response).toEqual(SharingRestInfo);
  });

  test("should make a basic GET request for text", async () => {
    fetchMock.once("*", WebMapAsText);

    const response = await request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        httpMethod: "GET",
        params: { f: "text" }
      }
    );
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data?f=text"
    );
    expect(options.method).toBe("GET");
    expect(response).toEqual(WebMapAsText);
  });

  test("should make a basic GET request for html", async () => {
    fetchMock.once("*", SharingRestInfoHTML);

    const response = await request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET",
      params: { f: "html" }
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=html");
    expect(options.method).toBe("GET");
    expect(response).toEqual(SharingRestInfoHTML);
  });

  test("should make a basic GET request for geojson", async () => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    const response = await request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: { where: "1=1", f: "geojson" }
      }
    );
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query?f=geojson&where=1%3D1"
    );
    expect(options.method).toBe("GET");
    expect(response).toEqual(GeoJSONFeatureCollection);
  });

  test("should switch from GET to POST when url is longer than 2000 by default", async () => {
    fetchMock.once("*", { features: [] });

    const response = await request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: {
          where:
            "1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1 AND 1 = 1"
        }
      }
    );
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain(
      "where=1%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201%20AND%201%20%3D%201"
    );
    expect(response).toEqual({ features: [] });
  });

  test("should switch from GET to POST when url is longer than specified", async () => {
    fetchMock.once("*", SharingRestInfo);
    const restInfoUrl = "https://www.arcgis.com/sharing/rest/info";

    const response = await request(restInfoUrl, {
      httpMethod: "GET",
      // typically consumers would base maxUrlLength on browser/server limits
      // but for testing, we use an artificially low limit
      // like this one that assumes no parameters will be added
      maxUrlLength: restInfoUrl.length
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(response).toEqual(SharingRestInfo);
  });

  test("should use the `authentication` option to authenticate a request", async () => {
    fetchMock.once("*", WebMapAsText);

    const MOCK_AUTH = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      }
    };

    const response = await request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        authentication: MOCK_AUTH
      }
    );
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
    );
    expect(options.body).toContain("token=token");
    expect(response).toEqual(WebMapAsJSON);
  });

  test("should hide token in POST body in browser environments otherwise it should hide token in `X-ESRI_AUTHORIZATION` header in Node", async () => {
    fetchMock.once("*", SharingRestInfo);

    const MOCK_AUTH = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      }
    };

    const response = await request("https://www.arcgis.com/sharing/rest/info", {
      authentication: MOCK_AUTH,
      httpMethod: "GET",
      hideToken: true
    });
    // Test node path
    if (typeof window === "undefined") {
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
      expect(options.method).toBe("GET");
      expect(response).toEqual(SharingRestInfo);
      expect((options.headers as any)["X-Esri-Authorization"]).toBe(
        "Bearer token"
      );
    } else {
      // Test browser path
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("token=token");
      expect((options.headers as any)["X-Esri-Authorization"]).toBe(undefined);
      expect(response).toEqual(SharingRestInfo);
    }
  });

  test("it should set credential to include for platformSelf call w header", async () => {
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

    const response = await request(PLATFORM_SELF_URL, ro);
    const [url, options] = fetchMock.lastCall(PLATFORM_SELF_URL);
    expect(url).toEqual(PLATFORM_SELF_URL);
    const headers = options.headers || ({} as any);
    expect(headers["X-Esri-Auth-Redirect-Uri"]).toBe(
      "https://hub.arcgis.com/torii-provider-arcgis/redirect.html"
    );
    // fetch should send cookie
    expect(options.credentials).toBe("include");
    expect(headers["X-Esri-Auth-Client-Id"]).toBe("CLIENT-ID-ABC123");
    expect(response.token).toEqual("APP-TOKEN");
    expect(response.username).toEqual("jsmith");
  });

  test("should switch from GET to POST when url is longer than specified and replace token in header with token in POST body", async () => {
    fetchMock.once("*", SharingRestInfo);
    const restInfoUrl = "https://www.arcgis.com/sharing/rest/info";

    const MOCK_AUTH = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      }
    };

    const response = await request(restInfoUrl, {
      authentication: MOCK_AUTH,
      httpMethod: "GET",
      hideToken: true,
      // typically consumers would base maxUrlLength on browser/server limits
      // but for testing, we use an artificially low limit
      // like this one that assumes no parameters will be added
      maxUrlLength: restInfoUrl.length
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=token");
    expect((options.headers as any)["X-Esri-Authorization"]).toBe(undefined);
    expect(response).toEqual(SharingRestInfo);
  });

  test("should re-throw HTTP errors (404, 500, etc) without a JSON formatted body", async () => {
    fetchMock.once("*", 404);

    await expect(
      request(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      )
    ).rejects.toMatchObject({
      name: ErrorTypes.ArcGISRequestError,
      message: "HTTP 404: Not Found",
      url: "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      options: {
        params: { f: "json" },
        httpMethod: "POST"
      }
    });
  });

  test("should try to parse a JSON error out of an HTTP error  (404, 500, etc)", async () => {
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

    await expect(
      request("https://places-service.esri.com/rest/v1/world/places/near-point")
    ).rejects.toMatchObject({
      name: ErrorTypes.ArcGISRequestError,
      message:
        "HTTP 400 Bad Request: Parameter invalid. Invalid parameter: 'offset' value: '300'. The value must be a number between 0 and 200.",
      url: "https://places-service.esri.com/rest/v1/world/places/near-point"
    });
  });

  test("should handle a missing details array in a JSON body in a HTTP error  (404, 500, etc)", async () => {
    fetchMock.once("*", {
      status: 400,
      body: {
        error: {
          code: 400,
          message: "Parameter invalid"
        }
      }
    });

    await expect(
      request("https://places-service.esri.com/rest/v1/world/places/near-point")
    ).rejects.toMatchObject({
      name: ErrorTypes.ArcGISRequestError,
      message: "HTTP 400 Bad Request: Parameter invalid.",
      url: "https://places-service.esri.com/rest/v1/world/places/near-point"
    });
  });

  test("should throw errors with information about the request", async () => {
    fetchMock.once("*", ArcGISOnlineError);

    await expect(
      request(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      )
    ).rejects.toMatchObject({
      name: ErrorTypes.ArcGISRequestError,
      message: "400: 'type' and 'title' property required.",
      url: "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      options: {
        params: { f: "json" },
        httpMethod: "POST"
      }
    });
  });

  test("should return a raw response if requested", async () => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    const response = await request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: { where: "1=1", f: "geojson" },
        rawResponse: true
      }
    );
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(response.body.Readable).not.toBe(null);
    const raw = await response.json();
    expect(raw).toEqual(GeoJSONFeatureCollection);
  });

  test("should allow setting defaults for all requests", async () => {
    fetchMock.once("*", SharingRestInfo);

    setDefaultRequestOptions({
      headers: {
        "Test-Header": "Test"
      }
    });

    const response = await request("https://www.arcgis.com/sharing/rest/info");
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingRestInfo);
    expect(options.body).toContain("f=json");
    expect((options.headers as any)["Test-Header"]).toBe("Test");

    // since calling request is sync we can delete this right away
    setDefaultRequestOptions({
      httpMethod: "POST",
      params: {
        f: "json"
      }
      // fetch,
    });
  });

  test("should warn users when attempting to set default auth", () => {
    const oldWarn = console.warn;
    const warnSpy = vi.fn();
    console.warn = warnSpy;

    const MOCK_AUTH = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      }
    };

    setDefaultRequestOptions({
      authentication: MOCK_AUTH
    });

    setDefaultRequestOptions(
      {
        authentication: MOCK_AUTH
      },
      true
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);

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
    test("should encode a param that impliments IParamBuilder", async () => {
      fetchMock.once("*", GeoJSONFeatureCollection);

      const builder = new MockParamBuilder();

      const response = await request(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
        {
          params: { where: builder, f: "geojson" }
        }
      );
      const options = fetchMock.lastCall("*")[1];
      expect(options.body).toContain(`where=${encodeURIComponent("1=1")}`);
      expect(response).toEqual(GeoJSONFeatureCollection);
    });
  });

  if (isNode) {
    test("should tack on a generic referer header - in Node.js only", async () => {
      fetchMock.once("*", WebMapAsJSON);

      await request(
        "https://www.arcgis.com/sharing/rest/content/items/43a/data"
      );
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
    });

    test("should use referer header from request options - in Node.js only", async () => {
      fetchMock.once("*", WebMapAsJSON);

      await request(
        "https://www.arcgis.com/sharing/rest/content/items/43a/data",
        {
          headers: { referer: "test/referer" }
        }
      );
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
    });

    test("if no referer header is provided, but other headers are passed, a default should still be set - in Node.js only", async () => {
      fetchMock.once("*", WebMapAsJSON);

      await request(
        "https://www.arcgis.com/sharing/rest/content/items/43a/data",
        {
          headers: { foo: "bar" }
        }
      );
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
    });
  }

  test("should use a string passed to authentication option as the token", async () => {
    const oldWarn = console.warn;
    const warnSpy = vi.fn();
    console.warn = warnSpy;

    fetchMock.post("*", {
      username: "jsmith"
    });

    await request("https://www.arcgis.com/sharing/rest/portals/self", {
      authentication: "token"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/portals/self");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=token");

    console.warn = oldWarn;
  });

  describe("automatic retry", () => {
    test("should retry requests that fail with an invalid token error, by refreshing the token", async () => {
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

      const response = await request(
        "https://www.arcgis.com/sharing/rest/portals/self",
        {
          httpMethod: "GET",
          authentication: session
        }
      );
      expect(response.user.username).toBe("c@sey");
    });

    test("should retry requests that fail with an invalid token error, by refreshing the token and refresh token", async () => {
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

      const response = await request(
        "https://www.arcgis.com/sharing/rest/portals/self",
        {
          httpMethod: "GET",
          authentication: session
        }
      );
      expect(response.user.username).toBe("c@sey");
      expect(session.token).toBe("VALID_TOKEN");
      expect(session.refreshToken).toBe("NEW_REFRESH_TOKEN");
    });

    test("should throw the error from the refresh call if refreshing fails", async () => {
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

      await expect(
        request("https://www.arcgis.com/sharing/rest/portals/self", {
          httpMethod: "GET",
          authentication: session
        })
      ).rejects.toMatchObject({
        name: "ArcGISTokenRequestError",
        code: "REFRESH_TOKEN_EXCHANGE_FAILED",
        message: "REFRESH_TOKEN_EXCHANGE_FAILED: 498: Invalid refresh_token"
      });
    });

    test("should throw an error if it also fails with the new token", async () => {
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

      await expect(
        request("https://www.arcgis.com/sharing/rest/portals/self", {
          httpMethod: "GET",
          authentication: session
        })
      ).rejects.toMatchObject({
        code: 498,
        message: "498: Invalid token."
      });
    });
  });

  test("should use a passed in request function", async () => {
    const url =
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data";
    const options = {
      httpMethod: "GET",
      params: { f: "text" }
    } as const;
    const requestSpy = vi.fn().mockResolvedValue(WebMapAsText);
    await request(url, { ...options, request: requestSpy });
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(url, options);
  });

  describe("no-cors:", () => {
    beforeEach(() => {
      // Reset requestConfig before each test
      requestConfig.pendingNoCorsRequests = {};
      requestConfig.noCorsDomains = [];
      requestConfig.crossOriginNoCorsDomains = {};
    });

    test("should send no-cors request as first promise when needed", async () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      const url = "https://example.com/resource?foo=bar";
      // actual call
      fetchMock.post(url, SharingRestInfo);
      // no-cors request
      fetchMock.get("https://example.com/resource", { status: 200 });

      await request(url);
      let calls = fetchMock.calls("https://example.com/resource");
      expect(calls.length).toBe(1);

      // expect the first call to be a no-cors request
      const [firstUrl, firstOptions] = calls[0];
      expect(firstUrl).toBe("https://example.com/resource");

      expect(firstOptions.mode).toEqual("no-cors");
      expect(firstOptions.credentials).toEqual("include");

      // expect the second call to be a normal request
      calls = fetchMock.calls("https://example.com/resource?foo=bar");
      expect(calls.length).toBe(1);
      const [secondUrl, secondOptions] = calls[0];
      expect(secondUrl).toBe("https://example.com/resource?foo=bar");
      expect(secondOptions.method).toEqual("POST");
      expect(secondOptions.credentials).toEqual("include");
    });

    test("should skip no-cors request and and include credentials if already sent", async () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      requestConfig.crossOriginNoCorsDomains["https://example.com"] =
        Date.now();
      const url = "https://example.com/resource";
      fetchMock.once(url, SharingRestInfo);
      // fetchMock.postOnce(url, { status: 200 });
      await request(url);
      const [lastUrl, lastOptions] = fetchMock.lastCall()!;
      expect(lastUrl).toBe("https://example.com/resource");
      expect(lastOptions.credentials).toEqual("include");
    });

    test("should register no-cors domains if present on portal/self response", async () => {
      const url =
        "https://ent.portal.com/portal/sharing/rest/portals/self?f=json";
      fetchMock.post(url, {
        authorizedCrossOriginNoCorsDomains: [
          "https://server.portal.com",
          "https://ent.portal.com"
        ]
      });
      await request(url);
      const [lastUrl, lastOptions] = fetchMock.lastCall()!;
      expect(lastUrl).toBe(url);
      expect(requestConfig.noCorsDomains).toEqual([
        "https://server.portal.com",
        "https://ent.portal.com"
      ]);
      // it should not initialise the crossOriginNoCorsDomains
      expect(requestConfig.crossOriginNoCorsDomains).toEqual({});
    });

    test("should work without no-cors domains present on portal/self response", async () => {
      const url =
        "https://ent.portal.com/portal/sharing/rest/portals/self?f=json";
      fetchMock.post(url, {
        other: "props"
      });
      await request(url);
      const [lastUrl, lastOptions] = fetchMock.lastCall()!;
      expect(lastUrl).toBe(url);
      expect(requestConfig.noCorsDomains).toEqual([]);
      // it should not initialise the crossOriginNoCorsDomains
      expect(requestConfig.crossOriginNoCorsDomains).toEqual({});
    });
  });
});
