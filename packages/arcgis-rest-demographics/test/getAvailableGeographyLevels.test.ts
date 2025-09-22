/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getAvailableGeographyLevels } from "../src/getAvailableGeographyLevels.js";
import { describe, expect, test, beforeEach } from "vitest";
import fetchMock from "fetch-mock";

describe("getAvailableGeographyLevels", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  test("should make a simple, single dataCollections request", async () => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    await getAvailableGeographyLevels();
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/StandardGeographyLevels"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
  });

  test("should make a dataCollections request with a custom endpoint", async () => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    await getAvailableGeographyLevels({
      endpoint: "https://esri.com/test"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url] = fetchMock.lastCall("*");
    expect(url).toEqual("https://esri.com/test/StandardGeographyLevels");
  });

  test("should make a dataCollections request with a param", async () => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    await getAvailableGeographyLevels({
      params: {
        foo: "bar"
      }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/StandardGeographyLevels"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("foo=bar");
  });
});
