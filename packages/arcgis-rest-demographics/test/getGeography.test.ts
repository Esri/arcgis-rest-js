/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getGeography } from "../src/getGeography.js";
import { describe, expect, test, afterEach } from "vitest";
import fetchMock from "fetch-mock";

const MOCK_AUTH = {
  getToken() {
    return Promise.resolve("token");
  },
  portal: "https://mapsdev.arcgis.com"
};

describe("getGeography", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should throw an error when a getGeography request is made without a token", async () => {
    fetchMock.once("*", {});

    await expect(getGeography({ geographyIDs: ["35"] })).rejects.toEqual(
      "Geoenrichment using the ArcGIS service requires authentication"
    );
  });

  test("should make a simple, single getGeography request", async () => {
    fetchMock.once("*", {});

    const geographyIDs = ["35"];
    await getGeography({
      authentication: MOCK_AUTH,
      geographyIDs
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/StandardGeographyQuery/execute"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("geographyIDs");
    expect(options.body).toContain(
      `geographyIDs=${encodeURIComponent(JSON.stringify(geographyIDs))}`
    );
  });

  test("should make a getGeography request with a custom endpoint", async () => {
    fetchMock.once("*", {});

    const geographyIDs = ["35"];
    await getGeography({
      authentication: MOCK_AUTH,
      geographyIDs,
      endpoint: "https://esri.com/test"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://esri.com/test/execute");
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("geographyIDs");
    expect(options.body).toContain(
      `geographyIDs=${encodeURIComponent(JSON.stringify(geographyIDs))}`
    );
  });

  test("should make a getGeography request with additional parameters", async () => {
    fetchMock.once("*", {});

    // const studyAreas = [{"sourceCountry":"US","layer":"US.States","ids":["06"],"generalizationLevel":"6"}];
    // const dataCollections = ["KeyGlobalFacts"];
    // const analysisVariables = ["KeyGlobalFacts.TOTPOP"];
    const geographyLayers = ["CAN.PR"];
    const geographyIDs = ["92129", "92126"];
    await getGeography({
      authentication: MOCK_AUTH,
      sourceCountry: "US",
      optionalCountryDataset: "JPN_EsriJapan_2018",
      geographyLayers,
      geographyIDs,
      geographyQuery: "orange",
      returnSubGeographyLayer: true,
      subGeographyLayer: "CAN.FSA",
      subGeographyQuery: "921*",
      outSR: 3857,
      returnGeometry: true,
      returnCentroids: true,
      generalizationLevel: 2,
      useFuzzySearch: true,
      featureLimit: 50,
      featureOffset: 100,
      langCode: "en"
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/StandardGeographyQuery/execute"
    );

    expect(options.body).toContain(`sourceCountry=US`);
    expect(options.body).toContain(`optionalCountryDataset=JPN_EsriJapan_2018`);
    expect(options.body).toContain(
      `geographyLayers=${encodeURIComponent(JSON.stringify(geographyLayers))}`
    );
    expect(options.body).toContain(
      `geographyIDs=${encodeURIComponent(JSON.stringify(geographyIDs))}`
    );
    expect(options.body).toContain(`geographyQuery=orange`);
    expect(options.body).toContain(`returnSubGeographyLayer=true`);
    expect(options.body).toContain(`subGeographyLayer=CAN.FSA`);
    expect(options.body).toContain(`subGeographyQuery=921*`);
    expect(options.body).toContain(`outSR=3857`);
    expect(options.body).toContain(`returnGeometry=true`);
    expect(options.body).toContain(`returnCentroids=true`);
    expect(options.body).toContain(`generalizationLevel=2`);
    expect(options.body).toContain(`useFuzzySearch=true`);
    expect(options.body).toContain(`featureLimit=50`);
    expect(options.body).toContain(`featureOffset=100`);
    expect(options.body).toContain(`langCode=en`);
  });
});
