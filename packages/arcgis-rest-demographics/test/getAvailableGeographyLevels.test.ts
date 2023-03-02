/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getAvailableGeographyLevels } from "../src/getAvailableGeographyLevels.js";

describe("getAvailableGeographyLevels", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it("should make a simple, single dataCollections request", (done) => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    getAvailableGeographyLevels()
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/StandardGeographyLevels"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with a custom endpoint", (done) => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    getAvailableGeographyLevels({
      endpoint: "https://esri.com/test"
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url] = fetchMock.lastCall("*");
        expect(url).toEqual("https://esri.com/test/StandardGeographyLevels");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a dataCollections request with a param", (done) => {
    fetchMock.once("*", {}, { overwriteRoutes: true });

    getAvailableGeographyLevels({
      params: {
        foo: "bar"
      }
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/Geoenrichment/StandardGeographyLevels"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("foo=bar");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
