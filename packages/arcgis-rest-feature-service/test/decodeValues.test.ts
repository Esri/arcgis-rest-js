/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import { decodeValues } from "../src/decodeValues.js";
import { cvdServiceFields, serviceFields } from "./mocks/fields.js";
import { getFeatureServiceResponse } from "./mocks/service.js";
import { queryResponse } from "./mocks/feature.js";
import {
  cvdQueryResponse,
  cvdFeaturesFormatted
} from "./mocks/cvdQueryResponse.js";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("formatCodedValues()", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  test("should format the cvd codes in a raw response", async () => {
    const response = await decodeValues({
      url: serviceUrl,
      fields: cvdServiceFields,
      queryResponse: cvdQueryResponse
    });

    expect(response.features[0]).toEqual(cvdFeaturesFormatted[0]);
  });

  test("should return the original response if there are no coded value domains", async () => {
    const response = await decodeValues({
      url: serviceUrl,
      fields: serviceFields,
      queryResponse
    });

    expect(response).toEqual(queryResponse);
  });

  test("should fetch metadata and then format cvd codes in a raw response", async () => {
    fetchMock.once("*", getFeatureServiceResponse);

    const response = await decodeValues({
      url: serviceUrl,
      queryResponse: cvdQueryResponse
    });

    expect(response.features[0]).toEqual(cvdFeaturesFormatted[0]);
  });

  test("should fetch metadata then skip decoding if no cvd codes", async () => {
    fetchMock.once("*", getFeatureServiceResponse);

    const attributesToIgnore = Object.create({ prototypeAttribute: "ignore" });

    const response = await decodeValues({
      url: serviceUrl,
      queryResponse: {
        ...cvdQueryResponse,
        features: [
          ...cvdQueryResponse.features,
          { attributes: attributesToIgnore }
        ]
      }
    });

    expect(response.features[0]).toEqual(cvdFeaturesFormatted[0]);
  });
});
