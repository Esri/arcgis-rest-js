/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import { getGeocodeService } from "../src/helpers.js";
import { SharingInfo } from "./mocks/responses.js";

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

describe("geocode", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should retrieve metadata from the World Geocoding Service", async () => {
    fetchMock.once("*", SharingInfo);

    const response = await getGeocodeService();
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/?f=json"
    );
    expect(options.method).toBe("GET");
    // expect(response).toEqual(SharingInfo); // need to fix something in order introspect the whole response
    expect(response.currentVersion).toEqual(10.41);
    expect(response.serviceDescription).toEqual(
      "Sample geocoder for San Diego, California, USA"
    );
  });

  test("should make POST request for metadata from the World Geocoding Service", async () => {
    fetchMock.once("*", SharingInfo);

    const response = await getGeocodeService({ httpMethod: "POST" });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // expect(paramsSpy).toHaveBeenCalledWith("f", "json");
    // expect(response).toEqual(SharingInfo); // need to fix something in order introspect the whole response
    expect(response.currentVersion).toEqual(10.41);
    expect(response.serviceDescription).toEqual(
      "Sample geocoder for San Diego, California, USA"
    );
  });

  test("should retrieve metadata from custom geocoding services", async () => {
    fetchMock.once("*", SharingInfo);

    const response = await getGeocodeService({ endpoint: customGeocoderUrl });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/?f=json"
    );
    expect(options.method).toBe("GET");
    // how to introspect the whole response?
    // expect(response).toEqual(SharingInfo);
    expect(response.currentVersion).toEqual(10.41);
    expect(response.serviceDescription).toEqual(
      "Sample geocoder for San Diego, California, USA"
    );
  });
});
