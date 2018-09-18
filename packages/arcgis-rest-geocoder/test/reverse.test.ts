/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { reverseGeocode } from "../src/reverse";

import * as fetchMock from "fetch-mock";

import { ReverseGeocode } from "./mocks/responses";

describe("geocode", () => {
  afterEach(fetchMock.restore);

  it("should make a reverse geocoding request", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode({ x: -118.409, y: 33.9425 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent('{"x":-118.409,"y":33.9425}')}`
        );
        expect(response).toEqual(ReverseGeocode); // introspect the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding GET request and pass through a spatial reference", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode(
      { x: -118.409, y: 33.9425, spatialReference: { wkid: 4326 } },
      { httpMethod: "GET" }
    )
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=%7B%22x%22%3A-118.409%2C%22y%22%3A33.9425%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate lat/long JSON objects", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode({ longitude: -118.409, latitude: 33.9425 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118.409,33.9425")}`
        );
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate lat/long JSON abbreviated objects", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode({ lat: 33.9425, long: -118.409 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118.409,33.9425")}`
        );
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate a raw long,lat array", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode([-118, 34])
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118,34")}`
        );
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
