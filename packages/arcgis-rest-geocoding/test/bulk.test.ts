/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import { bulkGeocode } from "../src/bulk.js";
import { GeocodeAddresses } from "./mocks/responses.js";

const addresses = [
  {
    OBJECTID: 1,
    SingleLine: "380 New York St. Redlands 92373"
  },
  {
    OBJECTID: 2,
    SingleLine: "1 World Way Los Angeles 90045"
  },
  {
    OBJECTID: 3,
    SingleLine: "foo bar baz"
  }
];

describe("geocode", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should make a bulk geocoding request, even with an unmatchable record", async () => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await bulkGeocode({
      addresses,
      authentication: MOCK_AUTH
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `addresses=${encodeURIComponent(
        '{"records":[{"attributes":{"OBJECTID":1,"SingleLine":"380 New York St. Redlands 92373"}},{"attributes":{"OBJECTID":2,"SingleLine":"1 World Way Los Angeles 90045"}},{"attributes":{"OBJECTID":3,"SingleLine":"foo bar baz"}}]}'
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.spatialReference.latestWkid).toEqual(4326);
    expect(response.locations[0].address).toEqual(
      "380 New York St, Redlands, California, 92373"
    );
    expect(response.locations[0].location.x).toEqual(-117.19567031799994);
    // the only property this lib tacks on
    expect(response.locations[0].location.spatialReference.wkid).toEqual(4326);
    expect(response.locations[2].score).toEqual(0);
  });

  test("should throw an error when a bulk geocoding request is made without a token", async () => {
    fetchMock.once("*", GeocodeAddresses);

    await expect(bulkGeocode({ addresses })).rejects.toEqual(
      "bulk geocoding using the ArcGIS service requires authentication"
    );
  });

  test("should send a bulk geocoding request to a custom url without a token", async () => {
    fetchMock.once("*", GeocodeAddresses);

    const response = await bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/geocodeAddresses"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `addresses=${encodeURIComponent(
        '{"records":[{"attributes":{"OBJECTID":1,"SingleLine":"380 New York St. Redlands 92373"}},{"attributes":{"OBJECTID":2,"SingleLine":"1 World Way Los Angeles 90045"}},{"attributes":{"OBJECTID":3,"SingleLine":"foo bar baz"}}]}'
      )}`
    );
    // expect(options.body).toContain("token=token");
    expect(response.spatialReference.latestWkid).toEqual(4326);
    expect(response.locations[0].address).toEqual(
      "380 New York St, Redlands, California, 92373"
    );
    expect(response.locations[0].location.x).toEqual(-117.19567031799994);
    // the only property this lib tacks on
    expect(response.locations[0].location.spatialReference.wkid).toEqual(4326);
    expect(response.locations[2].address).toEqual("foo bar baz");
  });

  test("should send a bulk geocoding request with params correctly", async () => {
    fetchMock.once("*", GeocodeAddresses);

    const response = await bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/",
      params: {
        outSR: 4326,
        forStorage: true
      }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/geocodeAddresses"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("outSR=4326");
    expect(options.body).toContain("forStorage=true");
    expect(options.body).toContain(
      `addresses=${encodeURIComponent(
        '{"records":[{"attributes":{"OBJECTID":1,"SingleLine":"380 New York St. Redlands 92373"}},{"attributes":{"OBJECTID":2,"SingleLine":"1 World Way Los Angeles 90045"}},{"attributes":{"OBJECTID":3,"SingleLine":"foo bar baz"}}]}'
      )}`
    );
    // expect(options.body).toContain("token=token");
    expect(response.spatialReference.latestWkid).toEqual(4326);
    expect(response.locations[0].address).toEqual(
      "380 New York St, Redlands, California, 92373"
    );
    expect(response.locations[0].location.x).toEqual(-117.19567031799994);
    // the only property this lib tacks on
    expect(response.locations[0].location.spatialReference.wkid).toEqual(4326);
    expect(response.locations[2].address).toEqual("foo bar baz");
  });

  test("should send a bulk geocoding request with postal params correctly", async () => {
    fetchMock.once("*", GeocodeAddresses);
    const addresses = [
      {
        OBJECTID: 1,
        address: "380 New York St. Redlands",
        postal: 92373
      },
      {
        OBJECTID: 2,
        address: "1205 Williston Rd",
        postal: "05403"
      }
    ];

    const response = await bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/",
      params: {
        outSR: 4326,
        forStorage: true
      }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/geocodeAddresses"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("outSR=4326");
    expect(options.body).toContain("forStorage=true");
    expect(options.body).toContain(
      `addresses=${encodeURIComponent(
        '{"records":[{"attributes":{"OBJECTID":1,"address":"380 New York St. Redlands","postal":92373}},{"attributes":{"OBJECTID":2,"address":"1205 Williston Rd","postal":"05403"}}]}'
      )}`
    );
    expect(response.spatialReference.latestWkid).toEqual(4326);
  });

  test("should support rawResponse", async () => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response: any = await bulkGeocode({
      addresses,
      authentication: MOCK_AUTH,
      rawResponse: true
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
    );
    expect(options.method).toBe("POST");
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(response.body.Readable).not.toBe(null);
    const raw = await response.json();
    expect(raw).toEqual(GeocodeAddresses);
    // this used to work with isomorphic-fetch
    // expect(response instanceof Response).toBe(true);
  });
});
