/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getAvailableCountries } from "../src/getAvailableCountries";

import * as fetchMock from "fetch-mock";

describe("getAvailableCountries", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single getAvailableCountries request", done => {
    fetchMock.once("*", {});

    getAvailableCountries()
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a getAvailableCountries request with a countryCode", done => {
    fetchMock.once("*", {});

    getAvailableCountries({
      countryCode: 'us'
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries/us"
        );
        expect(options.body).not.toContain("countryCode=us");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a getAvailableCountries request with a param", done => {
    fetchMock.once("*", {});

    getAvailableCountries({
      params: {
        foo: "bar"
      }
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("foo=bar");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
