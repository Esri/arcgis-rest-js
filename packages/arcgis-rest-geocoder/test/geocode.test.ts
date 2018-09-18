/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { geocode } from "../src/geocode";

import * as fetchMock from "fetch-mock";

import { FindAddressCandidates } from "./mocks/responses";

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

describe("geocode", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single geocoding request", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode("LAX")
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple, single geocoding request with a custom parameter", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({ params: { singleLine: "LAX", countryCode: "USA" } })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        expect(options.body).toContain("countryCode=USA");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a single geocoding request to a custom geocoding service", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      }
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent("380 New York St")}`
        );
        expect(options.body).toContain("postal=92373");
        expect(options.body).toContain("outSr=3857");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should pass through all requestOptions when making a geocoding request", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      },
      httpMethod: "GET"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates?f=json&outSr=3857&address=380%20New%20York%20St&postal=92373"
        );
        expect(options.method).toBe("GET");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
