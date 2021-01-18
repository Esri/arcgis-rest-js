/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { bulkGeocode } from "../src/bulk";
import { GeocodeAddresses } from "./mocks/responses";

import * as fetchMock from "fetch-mock";

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
  afterEach(fetchMock.restore);

  it("should make a bulk geocoding request, even with an unmatchable record", done => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    bulkGeocode({ addresses, authentication: MOCK_AUTH })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
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
        expect(response.locations[0].location.spatialReference.wkid).toEqual(
          4326
        );
        expect(response.locations[2].score).toEqual(0);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw an error when a bulk geocoding request is made without a token", done => {
    fetchMock.once("*", GeocodeAddresses);

    bulkGeocode({ addresses })
      // tslint:disable-next-line
      .catch(e => {
        expect(e).toEqual(
          "bulk geocoding using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should send a bulk geocoding request to a custom url without a token", done => {
    fetchMock.once("*", GeocodeAddresses);

    bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/"
    })
      // tslint:disable-next-line
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
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
        expect(response.locations[0].location.spatialReference.wkid).toEqual(
          4326
        );
        expect(response.locations[2].address).toEqual("foo bar baz");
        done();
      });
  });

  it("should send a bulk geocoding request with params correctly", done => {
    fetchMock.once("*", GeocodeAddresses);

    bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/",
      params: {
        outSR: 4326,
        forStorage: true
      }
    })
      // tslint:disable-next-line
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
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
        expect(response.locations[0].location.spatialReference.wkid).toEqual(
          4326
        );
        expect(response.locations[2].address).toEqual("foo bar baz");
        done();
      });
  });

  it("should support rawResponse", done => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    bulkGeocode({ addresses, authentication: MOCK_AUTH, rawResponse: true })
      .then((response: any) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
        );
        expect(options.method).toBe("POST");
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.body.Readable).not.toBe(null);
        response.json().then((raw: any) => {
          expect(raw).toEqual(GeocodeAddresses);
          done();
        });
        // this used to work with isomorphic-fetch
        // expect(response instanceof Response).toBe(true);
      })
      .catch(e => {
        fail(e);
      });
  });
});
