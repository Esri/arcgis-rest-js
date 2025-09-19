/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import { reverseGeocode } from "../src/reverse.js";
import { ReverseGeocode } from "./mocks/responses.js";

describe("geocode", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should make a reverse geocoding request", async () => {
    fetchMock.once("*", ReverseGeocode);

    const response = await reverseGeocode({ x: -118.409, y: 33.9425 });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `location=${encodeURIComponent('{"x":-118.409,"y":33.9425}')}`
    );
    expect(response).toEqual(ReverseGeocode); // introspect the entire response
  });

  test("should make a reverse geocoding GET request and pass through a spatial reference", async () => {
    fetchMock.once("*", ReverseGeocode);

    const response = await reverseGeocode(
      { x: -118.409, y: 33.9425, spatialReference: { wkid: 4326 } },
      { httpMethod: "GET" }
    );
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=%7B%22x%22%3A-118.409%2C%22y%22%3A33.9425%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D"
    );
    expect(options.method).toBe("GET");
    expect(response).toEqual(ReverseGeocode); // this introspects the entire response
  });

  test("should make a reverse geocoding request and translate lat/long JSON objects", async () => {
    fetchMock.once("*", ReverseGeocode);

    const response = await reverseGeocode({
      longitude: -118.409,
      latitude: 33.9425
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `location=${encodeURIComponent("-118.409,33.9425")}`
    );
    expect(response).toEqual(ReverseGeocode); // this introspects the entire response
  });

  test("should make a reverse geocoding request and translate lat/long JSON abbreviated objects", async () => {
    fetchMock.once("*", ReverseGeocode);

    const response = await reverseGeocode({ lat: 33.9425, long: -118.409 });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `location=${encodeURIComponent("-118.409,33.9425")}`
    );
    expect(response).toEqual(ReverseGeocode); // this introspects the entire response
  });

  test("should make a reverse geocoding request and translate a raw long,lat array", async () => {
    fetchMock.once("*", ReverseGeocode);

    const response = await reverseGeocode([-118, 34]);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(`location=${encodeURIComponent("-118,34")}`);
    expect(response).toEqual(ReverseGeocode); // this introspects the entire response
  });
});
