/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getAvailableCountries } from "../src/getAvailableCountries.js";

describe("getAvailableCountries", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single getAvailableCountries request", (done) => {
    fetchMock.once("*", {});

    getAvailableCountries()
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const { request } = fetchMock.lastCall("*");
        const { url } = request;
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
        );
        expect(request.method).toBe("POST");
        expect(request.body).toContain("f=json");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a getAvailableCountries request with a countryCode", (done) => {
    fetchMock.once("*", {});

    getAvailableCountries({
      countryCode: "us"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const { request } = fetchMock.lastCall("*");
        const { url } = request;
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries/us"
        );
        expect(request.body).not.toContain("countryCode=us");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a getAvailableCountries request with a param", (done) => {
    fetchMock.once("*", {});

    getAvailableCountries({
      params: {
        foo: "bar"
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const { request } = fetchMock.lastCall("*");
        const { url } = request;
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
        );
        expect(request.method).toBe("POST");
        expect(request.body).toContain("f=json");
        expect(request.body).toContain("foo=bar");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a getAvailableCountries request with a custom endpoint", (done) => {
    fetchMock.once("*", {});

    getAvailableCountries({
      endpoint: "https://esri.com/test"
    })
      .then((response) => {
        const { request } = fetchMock.lastCall("*");
        const { url } = request;
        expect(url).toEqual("https://esri.com/test/countries");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
