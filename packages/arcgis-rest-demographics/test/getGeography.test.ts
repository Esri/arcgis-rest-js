/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getGeography } from "../src/getGeography";

import * as fetchMock from "fetch-mock";

const MOCK_AUTH = {
  getToken() {
    return Promise.resolve("token");
  },
  portal: "https://mapsdev.arcgis.com"
};

describe("getGeography", () => {
  afterEach(fetchMock.restore);

  it("should throw an error when a getGeography request is made without a token", done => {
    fetchMock.once("*", {});

    getGeography({
      geographyIDs: ["35"]
    })
      // tslint:disable-next-line
      .catch(e => {
        expect(e).toEqual(
          "Geoenrichment using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should make a simple, single getGeography request", done => {
    fetchMock.once("*", {});

    const geographyIDs = ["35"];
    getGeography({
      authentication: MOCK_AUTH,
      geographyIDs
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/StandardGeographyQuery/execute"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("geographyIDs");
        expect(options.body).toContain(`geographyIDs=${encodeURIComponent(JSON.stringify(geographyIDs))}`);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a getGeography request with additional parameters", done => {
    fetchMock.once("*", {});

    // const studyAreas = [{"sourceCountry":"US","layer":"US.States","ids":["06"],"generalizationLevel":"6"}];
    // const dataCollections = ["KeyGlobalFacts"];
    // const analysisVariables = ["KeyGlobalFacts.TOTPOP"];
    const geographyLayers = ["CAN.PR"];
    const geographyIDs = ["92129", "92126"];
    getGeography({
      authentication: MOCK_AUTH,
      sourceCountry: 'US',
      optionalCountryDataset: 'JPN_EsriJapan_2018',
      geographyLayers,
      geographyIDs,
      geographyQuery: 'orange',
      returnSubGeographyLayer: true,
      subGeographyLayer: 'CAN.FSA',
      subGeographyQuery: '921*',
      outSR: 3857,
      returnGeometry: true,
      returnCentroids: true,
      generalizationLevel: 2,
      useFuzzySearch: true,
      featureLimit: 50,
      featureOffset: 100,
      langCode: 'en',
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/StandardGeographyQuery/execute"
        );
        
        expect(options.body).toContain(`sourceCountry=US`);
        expect(options.body).toContain(`optionalCountryDataset=JPN_EsriJapan_2018`);
        expect(options.body).toContain(`geographyLayers=${encodeURIComponent(JSON.stringify(geographyLayers))}`);
        expect(options.body).toContain(`geographyIDs=${encodeURIComponent(JSON.stringify(geographyIDs))}`);
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

        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
