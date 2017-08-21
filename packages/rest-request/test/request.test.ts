import { request, FormData, ErrorTypes } from "../src/index";
import * as fetchMock from "fetch-mock";
import {
  SharingRestInfo,
  SharingRestInfoHTML
} from "./mocks/sharing-rest-info";
import { ArcGISOnlineError } from "./mocks/errors";
import { WebMapAsText, WebMapAsJSON } from "./mocks/webmap";
import { GeoJSONFeatureCollection } from "./mocks/geojson-feature-collection";

describe("request()", () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  });

  afterAll(() => {
    paramsSpy.calls.reset();
  });

  afterEach(fetchMock.restore);

  it("should make a basic POST request", () => {
    fetchMock.once("*", SharingRestInfo);

    request("https://www.arcgis.com/sharing/rest/info")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(response).toEqual(SharingRestInfo);
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request", () => {
    fetchMock.once("*", SharingRestInfo);

    request(
      "https://www.arcgis.com/sharing/rest/info",
      {},
      {
        httpMethod: "GET"
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info?f=json");
        expect(options.method).toBe("GET");
        expect(response).toEqual(SharingRestInfo);
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a basic GET request for text", done => {
    fetchMock.once("*", WebMapAsText);

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      { f: "text" },
      {
        httpMethod: "GET"
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

    request(
      "https://www.arcgis.com/sharing/rest/info",
      { f: "html" },
      {
        httpMethod: "GET"
      }
    )
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

  it("should make a basic GET request for geojson", () => {
    fetchMock.once("*", GeoJSONFeatureCollection);

    request(
      "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query",
      { where: "1=1", f: "geojson" },
      {
        httpMethod: "GET"
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer/0/query?f=geojson&where=1%3D1"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(GeoJSONFeatureCollection);
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should use the `authentication` option to authenticate a request", () => {
    fetchMock.once("*", WebMapAsText);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      }
    };

    request(
      "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data",
      {},
      {
        authentication: MOCK_AUTH
      }
    )
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/content/items/43a8e51789044d9480a20089a84129ad/data"
        );
        expect(paramsSpy).toHaveBeenCalledWith("token", "token");

        expect(response).toEqual(WebMapAsJSON);
      })
      .catch(e => {
        fail(e);
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
      expect(error.params).toEqual({ f: "json" });
      expect(error.options).toEqual({ httpMethod: "POST" });
      done();
    });
  });
});
