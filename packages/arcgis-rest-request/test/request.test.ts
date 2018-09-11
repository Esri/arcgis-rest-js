/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, ErrorTypes } from "../src/index";
import * as fetchMock from "fetch-mock";
import {
  SharingRestInfo,
  SharingRestInfoHTML
} from "./mocks/sharing-rest-info";
import { ArcGISOnlineError } from "./mocks/errors";
import { WebMapAsText, WebMapAsJSON } from "./mocks/webmap";
import { GeoJSONFeatureCollection } from "./mocks/geojson-feature-collection";

describe("request()", () => {
  afterEach(fetchMock.restore);

  it("should make a basic POST request", done => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingRestInfo);
        expect(options.body).toContain("f=json");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request", done => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request for text", done => {
    fetchMock.once("*", WebMapAsText);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        httpMethod: "GET",
        params: { f: "text" }
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data?f=text"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(WebMapAsText);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request for html", done => {
    fetchMock.once("*", SharingRestInfoHTML);

    request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET",
      params: { f: "html" }
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=html");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfoHTML);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request for geojson", done => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      {
        httpMethod: "GET",
        params: { where: "1=1", f: "geojson" }
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query?f=geojson&where=1%3D1"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(GeoJSONFeatureCollection);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should switch from GET to POST when url is longer than specified", done => {
    fetchMock.once("*", SharingRestInfo);
    const restInfoUrl = "https://www.arcgis.com/sharing/rest/info";

    request(restInfoUrl, {
      httpMethod: "GET",
      // typically consumers would base maxUrlLength on browser/server limits
      // but for testing, we use an artificially low limit
      // like this one that assumes no parameters will be added
      maxUrlLength: restInfoUrl.length
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should use the `authentication` option to authenticate a request", done => {
    fetchMock.once("*", WebMapAsText);

    const MOCK_AUTH = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      }
    };

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {
        authentication: MOCK_AUTH
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
        );
        expect(options.body).toContain("token=token");
        expect(response).toEqual(WebMapAsJSON);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should re-throw HTTP errors (404, 500, etc)", done => {
    fetchMock.once("*", 404);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
    ).catch(error => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe("HTTP 404: Not Found");
      expect(error instanceof Error).toBeTruthy();
      expect(error.url).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      );
      expect(error.options.params).toEqual({ f: "json" });
      expect(error.options.httpMethod).toEqual("POST");
      expect(typeof error.options.fetch).toEqual("function");
      expect(error.options.fetch.length).toEqual(2);
      done();
    });
  });

  it("should throw errors with information about the request", done => {
    fetchMock.once("*", ArcGISOnlineError);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
    ).catch(error => {
      expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
      expect(error.message).toBe("400: 'type' and 'title' property required.");
      expect(error instanceof Error).toBeTruthy();
      expect(error.url).toBe(
        "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
      );
      expect(error.options.params).toEqual({ f: "json" });
      expect(error.options.httpMethod).toEqual("POST");
      expect(typeof error.options.fetch).toEqual("function");
      expect(error.options.fetch.length).toEqual(2);
      done();
    });
  });

  it("should allow you to use custom implementations of `fetch`", done => {
    const MockFetchResponse = {
      ok: true,
      json() {
        return Promise.resolve(SharingRestInfo);
      },
      blob() {
        return Promise.resolve(new Blob([JSON.stringify(SharingRestInfo)]));
      },
      text() {
        return Promise.resolve(JSON.stringify(SharingRestInfo));
      }
    };

    const MockFetch = function() {
      return Promise.resolve(MockFetchResponse);
    };

    request("https://www.arcgis.com/sharing/rest/info", {
      fetch: MockFetch as any
    })
      .then(response => {
        expect(response).toEqual(SharingRestInfo);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  describe("should throw errors when required dependencies are missing", () => {
    const oldPromise = Promise;
    const oldFetch = fetch;
    const oldFormData = FormData;
    beforeEach(() => {
      Promise = undefined;
      FormData = undefined;
      Function("return this")().fetch = undefined;
    });

    afterEach(() => {
      Promise = oldPromise;
      FormData = oldFormData;
      Function("return this")().fetch = oldFetch;
    });
    it("should throw for missing dependencies", () => {
      expect(() => {
        request("https://www.arcgis.com/sharing/rest/info").catch();
      }).toThrowError(
        "`arcgis-rest-request` requires global variables for `fetch`, `Promise` and `FormData` to be present in the global scope. You are missing `fetch`, `Promise`, `FormData`. We recommend installing the `isomorphic-fetch`, `es6-promise`, `isomorphic-form-data` modules at the root of your application to add these to the global scope. See https://bit.ly/2KNwWaJ for more info."
      );
    });

    it("should not throw if fetch is not present but a custom fetch is defined", done => {
      Promise = oldPromise;
      FormData = oldFormData;

      const MockFetchResponse = {
        ok: true,
        json() {
          return Promise.resolve(SharingRestInfo);
        },
        blob() {
          return Promise.resolve(new Blob([JSON.stringify(SharingRestInfo)]));
        },
        text() {
          return Promise.resolve(JSON.stringify(SharingRestInfo));
        }
      };

      const MockFetch = function() {
        return Promise.resolve(MockFetchResponse);
      };

      request("https://www.arcgis.com/sharing/rest/info", {
        fetch: MockFetch as any
      })
        .then(response => {
          expect(response).toEqual(SharingRestInfo);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
