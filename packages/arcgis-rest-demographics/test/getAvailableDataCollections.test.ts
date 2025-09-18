/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getAvailableDataCollections } from "../src/getAvailableDataCollections.js";
import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { dataCollectionsResponse } from "./mocks/responses.js";

describe("getAvailableDataCollections", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should make a simple, single dataCollections request", async () => {
    fetchMock.once("*", dataCollectionsResponse);

    await getAvailableDataCollections();

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
  });

  test("should make a dataCollections request with a countryCode", async () => {
    fetchMock.once("*", dataCollectionsResponse);

    await getAvailableDataCollections({
      countryCode: "us"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections/us"
    );
    expect(options.body).not.toContain("countryCode=us");
  });

  test("should make a dataCollections request with a countryCode and data collection", async () => {
    fetchMock.once("*", dataCollectionsResponse);

    await getAvailableDataCollections({
      countryCode: "us",
      dataCollection: "EducationalAttainment"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections/us/EducationalAttainment"
    );
    expect(options.body).not.toContain("countryCode=us");
    expect(options.body).not.toContain("dataCollection=EducationalAttainment");
  });

  test("should make a dataCollections request with additional parameters", async () => {
    fetchMock.once("*", dataCollectionsResponse);

    await getAvailableDataCollections({
      suppressNullValues: true,
      addDerivativeVariables: ["average", "index"]
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections"
    );
    expect(options.body).toContain("suppressNullValues=true");
    expect(options.body).toContain(
      `addDerivativeVariables=${encodeURIComponent('["average","index"]')}`
    );
  });

  test("makes a dataCollections request with a custom endpoint", async () => {
    fetchMock.once("*", dataCollectionsResponse);

    await getAvailableDataCollections({
      endpoint: "https://esri.com/test"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://esri.com/test/dataCollections");
  });
});
