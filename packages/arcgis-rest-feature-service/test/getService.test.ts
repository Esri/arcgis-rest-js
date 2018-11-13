/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getFeatureService } from "../src/getFeatureService";

import * as fetchMock from "fetch-mock";

import { getFeatureServiceResponse } from "./mocks/service";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("feature", () => {
  afterEach(fetchMock.restore);

  it("should fetch service metadata", done => {
    fetchMock.once("*", getFeatureServiceResponse);
    getFeatureService(serviceUrl)
      .then(response => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(serviceUrl);
        expect(options.method).toBe("POST");
        expect(response).toEqual(getFeatureServiceResponse);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
