/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getLayer } from "../src/getLayer.js";

import { getFeatureServiceResponse } from "./mocks/service.js";

const layerUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("feature", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it("should fetch service metadata", (done) => {
    fetchMock.once("*", getFeatureServiceResponse);
    getLayer({ url: layerUrl })
      .then((response) => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(layerUrl);
        expect(options.method).toBe("POST");
        expect(response).toEqual(getFeatureServiceResponse);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
