import { getFeature } from "../src/index";

import * as fetchMock from "fetch-mock";

import { featureResponse } from "./mocks/feature";

describe("feature", () => {
  afterEach(fetchMock.restore);

  it("should return a feature by id", done => {
    const params = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      id: 42
    };
    fetchMock.once("*", featureResponse);
    getFeature(params).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${params.url}/42?f=json`);
      expect(options.method).toBe("GET");
      expect(response.attributes.FID).toEqual(42);
      done();
    });
  });
});
