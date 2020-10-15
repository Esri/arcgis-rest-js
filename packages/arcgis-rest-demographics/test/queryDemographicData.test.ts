/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { queryDemographicData } from "../src/queryDemographicData";

import * as fetchMock from "fetch-mock";

const MOCK_AUTH = {
  getToken() {
    return Promise.resolve("token");
  },
  portal: "https://mapsdev.arcgis.com"
};

describe("queryDemographicData", () => {
  afterEach(fetchMock.restore);

  it("should throw an error when a queryDemographicData request is made without a token", done => {
    fetchMock.once("*", {});

    queryDemographicData({
      studyAreas: [{"geometry":{"x":-117.1956,"y":34.0572}}]
    })
      // tslint:disable-next-line
      .catch(e => {
        expect(e).toEqual(
          "Geoenrichment using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should make a simple, single queryDemographicData request", done => {
    fetchMock.once("*", {});

    queryDemographicData({
      authentication: MOCK_AUTH,
      studyAreas: [{"geometry":{"x":-117.1956,"y":34.0572}}]
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/enrich"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a queryDemographicData request with additional parameters", done => {
    fetchMock.once("*", {});

    const studyAreas = [{"sourceCountry":"US","layer":"US.States","ids":["06"],"generalizationLevel":"6"}];
    const dataCollections = ["KeyGlobalFacts"];
    const analysisVariables = ["KeyGlobalFacts.TOTPOP"];
    queryDemographicData({
      authentication: MOCK_AUTH,
      studyAreas,
      dataCollections,
      analysisVariables,
      addDerivativeVariables: false,
      returnGeometry: true,
      inSR: 4326,
      outSR: 4326
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/enrich"
        );
        expect(options.body).toContain(`studyAreas=${encodeURIComponent(JSON.stringify(studyAreas))}`);
        expect(options.body).toContain(`dataCollections=${encodeURIComponent(JSON.stringify(dataCollections))}`);
        expect(options.body).toContain(`analysisVariables=${encodeURIComponent(JSON.stringify(analysisVariables))}`);
        expect(options.body).toContain(`addDerivativeVariables=false`);
        expect(options.body).toContain(`returnGeometry=true`);
        expect(options.body).toContain(`inSR=4326`);
        expect(options.body).toContain(`outSR=4326`);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
