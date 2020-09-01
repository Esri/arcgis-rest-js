/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { decodeValues } from "../src/decodeValues";

import * as fetchMock from "fetch-mock";

import {
  cvdQueryResponse,
  cvdFeaturesFormatted
} from "./mocks/cvdQueryResponse";
import { cvdServiceFields, serviceFields } from "./mocks/fields";
import { getFeatureServiceResponse } from "./mocks/service";
import { queryResponse } from "./mocks/feature";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("formatCodedValues()", () => {
  afterEach(() => fetchMock.restore());

  it("should format the cvd codes in a raw response", done => {
    decodeValues({
      url: serviceUrl,
      fields: cvdServiceFields,
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

  it("should return the original response if there are no coded value domains", done => {
    decodeValues({
      url: serviceUrl,
      fields: serviceFields,
      queryResponse
    })
      .then(response => {
        expect(response).toEqual(queryResponse);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should fetch metadata and then format cvd codes in a raw response", done => {
    fetchMock.once("*", getFeatureServiceResponse);

    decodeValues({
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
