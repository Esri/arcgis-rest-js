/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getAvailableDataCollections } from "../src/getAvailableDataCollections.js";
import { dataCollectionsResponse } from "./mocks/responses.js";

describe("getAvailableDataCollections", () => {
  beforeEach(() => {
    fetchMock.restore();
  });
  it("should make a simple, single dataCollections request", (done) => {
    fetchMock.once("*", dataCollectionsResponse);

    getAvailableDataCollections()
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with a countryCode", (done) => {
    fetchMock.once("*", dataCollectionsResponse);

    getAvailableDataCollections({
      countryCode: "us"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections/us"
        );
        expect(options.body).not.toContain("countryCode=us");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with a countryCode and data collection", (done) => {
    fetchMock.once("*", dataCollectionsResponse);

    getAvailableDataCollections({
      countryCode: "us",
      dataCollection: "EducationalAttainment"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections/us/EducationalAttainment"
        );
        expect(options.body).not.toContain("countryCode=us");
        expect(options.body).not.toContain(
          "dataCollection=EducationalAttainment"
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with additional parameters", (done) => {
    fetchMock.once("*", dataCollectionsResponse);

    getAvailableDataCollections({
      suppressNullValues: true,
      addDerivativeVariables: ["average", "index"]
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/dataCollections"
        );
        expect(options.body).toContain("suppressNullValues=true");
        expect(options.body).toContain(
          `addDerivativeVariables=${encodeURIComponent('["average","index"]')}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with a custom endpoint", (done) => {
    fetchMock.once("*", dataCollectionsResponse);

    getAvailableDataCollections({
      endpoint: "https://esri.com/test"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual("https://esri.com/test/dataCollections");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
