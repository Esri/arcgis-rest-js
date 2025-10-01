import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import { getAllLayersAndTables } from "../src/getAllLayersAndTables.js";
import { allLayersAndTablesResponse } from "./mocks/allLayersAndTablesResponse.js";

const layerUrlBase =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer";

describe("getAllLayersAndTables()", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  test("should fetch all layers and table associated with the service", async () => {
    fetchMock.once("*", allLayersAndTablesResponse);

    const response = await getAllLayersAndTables({ url: layerUrlBase + "/0" });

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(layerUrlBase + "/layers");
    expect(options.method).toBe("POST");
    expect(response).toEqual(allLayersAndTablesResponse);
  });
});
