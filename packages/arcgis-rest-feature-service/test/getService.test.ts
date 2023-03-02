/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { getService } from "../src/getService.js";

import { getFeatureServerResponse } from "./mocks/service.js";

const layerUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer";

describe("getServer()", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  it("should fetch feature service metadata", (done) => {
    fetchMock.once("*", getFeatureServerResponse);
    getService({ url: layerUrl })
      .then((response) => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(layerUrl);
        expect(options.method).toBe("POST");
        expect(response).toEqual(getFeatureServerResponse);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
