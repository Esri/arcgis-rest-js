/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { geocode } from "../src/geocode.js";
import {
  FindAddressCandidates,
  FindAddressCandidates3857,
  FindAddressCandidatesNullExtent
} from "./mocks/responses.js";

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

describe("geocode", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should make a simple, single geocoding request", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode("LAX")
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        // the only properties this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        expect(response.geoJson.features.length).toBeGreaterThan(0);
        expect(response.geoJson.features[0].properties.score).toBeGreaterThan(
          0
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should a geocoding request with custom parameters", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({ address: "1600 Pennsylvania Avenue", city: "Washington D.C." })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent("1600 Pennsylvania Avenue")}`
        );
        expect(options.body).toContain(
          `city=${encodeURIComponent("Washington D.C.")}`
        );
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple, single geocoding request with a named parameter", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      singleLine: "380 New York Street",
      outFields: ["Addr_type", "Score"]
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        const singleLineEncoded = encodeURIComponent("380 New York Street");
        expect(options.body).toContain(`singleLine=${singleLineEncoded}`);
        const outFieldsEncoded = encodeURIComponent(
          ["Addr_type", "Score"].join(",")
        );
        expect(options.body).toContain(`outFields=${outFieldsEncoded}`);
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple, single geocoding request with a custom parameter", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      params: {
        singleLine: "LAX",
        countryCode: "USA",
        outFields: ["Addr_type", "Score"]
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        expect(options.body).toContain("countryCode=USA");
        const outFieldsEncoded = encodeURIComponent(
          ["Addr_type", "Score"].join(",")
        );
        expect(options.body).toContain(`outFields=${outFieldsEncoded}`);
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a single geocoding request to a custom geocoding service", (done) => {
    fetchMock.once("*", FindAddressCandidates3857);

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
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
        // the only properties this lib tacks on
        expect(response.spatialReference.wkid).toEqual(102100);
        expect(response.geoJson).toBeUndefined();
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass through all requestOptions when making a geocoding request", (done) => {
    fetchMock.once("*", FindAddressCandidates3857);

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      },
      httpMethod: "GET"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates?f=json&outSr=3857&address=380%20New%20York%20St&postal=92373"
        );
        expect(options.method).toBe("GET");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(102100);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should handle geocoders that return null extents for location candidates", (done) => {
    fetchMock.once("*", FindAddressCandidatesNullExtent);

    geocode("LAX")
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        expect(
          response.candidates.every((candidate) => candidate.extent == null)
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should support rawResponse", (done) => {
    fetchMock.once("*", FindAddressCandidates);
    geocode({
      address: "1600 Pennsylvania Avenue",
      city: "Washington D.C.",
      rawResponse: true
    })
      .then((response: any) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent("1600 Pennsylvania Avenue")}`
        );
        expect(options.body).toContain(
          `city=${encodeURIComponent("Washington D.C.")}`
        );
        expect(options.method).toBe("POST");
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.body.Readable).not.toBe(null);
        response.json().then((raw: any) => {
          expect(raw).toEqual(FindAddressCandidates);
          done();
        });
        // this used to work with isomorphic-fetch
        // expect(response instanceof Response).toBe(true);
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a single geocoding request with a postal code as a string", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      params: {
        address: "1205 Williston Rd",
        postal: "05403"
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent("1205 Williston Rd")}`
        );
        expect(options.body).toContain("postal=05403");

        expect(response.spatialReference.wkid).toEqual(4326);
        expect(response.geoJson.features.length).toBeGreaterThan(0);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a single geocoding request with a postal code as a number", (done) => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      params: {
        address: "380 New York St, Redlands, California",
        postal: 92373
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent(
            "380 New York St, Redlands, California"
          )}`
        );
        expect(options.body).toContain("postal=92373");

        expect(response.spatialReference.wkid).toEqual(4326);
        expect(response.geoJson.features.length).toBeGreaterThan(0);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
