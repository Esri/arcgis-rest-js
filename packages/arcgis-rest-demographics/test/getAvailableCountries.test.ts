/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getAvailableCountries } from "../src/getAvailableCountries.js";
import { describe, test, expect, beforeEach } from "vitest";
import fetchMock from "fetch-mock";

describe("getAvailableCountries", () => {
  beforeEach(() => {
    fetchMock.reset();
  });

  test("makes a single simple getAvailableCountries request", async () => {
    fetchMock.once("*", { prop: "val" });

    await getAvailableCountries();

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");

    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
  });

  test("should make a getAvailableCountries request with a countryCode", async () => {
    fetchMock.once("*", {});

    await getAvailableCountries({
      countryCode: "us"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries/us"
    );
    expect(options.body).not.toContain("countryCode=us");
  });

  test("should make a getAvailableCountries request with a param", async () => {
    fetchMock.once("*", {});

    await getAvailableCountries({
      params: {
        foo: "bar"
      }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/countries"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("foo=bar");
  });

  test("should make a getAvailableCountries request with a custom endpoint", async () => {
    fetchMock.once("*", {});

    await getAvailableCountries({
      endpoint: "https://esri.com/test"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://esri.com/test/countries");
  });
});
