/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { formatCodedValues } from "../src/formatCodedValues";

import * as fetchMock from "fetch-mock";

import {
  cvdQueryResponse,
  cvdFeaturesFormatted
} from "./mocks/cvdQueryResponse";
import { serviceFields } from "./mocks/fields";
import { getFeatureServiceResponse } from "./mocks/service";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("formatCodedValues()", () => {
  afterEach(fetchMock.restore);

  it("should format the cvd codes in a raw response", done => {
    formatCodedValues({
      url: serviceUrl,
      fields: serviceFields,
      queryResponse: cvdQueryResponse
    })
      .then(response => {
        expect(response.features[0]).toEqual(cvdFeaturesFormatted[0]);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should fetch metadata and then format cvd codes in a raw response", done => {
    fetchMock.once("*", getFeatureServiceResponse);

    formatCodedValues({
      url: serviceUrl,
      queryResponse: cvdQueryResponse
    })
      .then(response => {
        expect(response.features[0]).toEqual(cvdFeaturesFormatted[0]);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
