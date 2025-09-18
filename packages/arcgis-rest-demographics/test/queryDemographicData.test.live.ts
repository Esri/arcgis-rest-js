/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { queryDemographicData } from "../src/queryDemographicData.js";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import "dotenv/config";
import { describe, expect, test } from "vitest";

const addEnv = (params: any) => {
  if (
    process.env.UNIT_TESTING_API_KEY &&
    process.env.UNIT_TESTING_API_KEY !== ""
  ) {
    params.authentication = new ApiKeyManager({
      key: process.env.UNIT_TESTING_API_KEY
    });
  } else {
    console.error("Error - No API key specified in .ENV file.");
  }

  if (
    process.env.GEOENRICHMENTSERVER_URL &&
    process.env.GEOENRICHMENTSERVER_URL !== ""
  ) {
    params.endpoint = process.env.GEOENRICHMENTSERVER_URL;
  }
  return params;
};

describe("queryDemographicData", () => {
  test("should make a simple, single queryDemographicData request", async () => {
    const params = addEnv({
      studyAreas: [{ geometry: { x: -117.1956, y: 34.0572 } }]
    });

    const response = await queryDemographicData(params);
    expect(Object.keys(response)).toContain("results");
    expect(Object.keys(response)).toContain("messages");
    expect(response.results.length).toBeGreaterThan(0);
    expect(response.results[0].value.FeatureSet.length).toBeGreaterThan(0);
    expect(
      response.results[0].value.FeatureSet[0].features.length
    ).toBeGreaterThan(0);
  });
});
