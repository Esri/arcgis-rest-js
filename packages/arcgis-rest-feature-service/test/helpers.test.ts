import { describe, test, expect } from "vitest";
import { parseServiceUrl } from "../src/helpers.js";

describe("parseServiceUrl", () => {
  test("Trims service url to root", async () => {
    const input =
      "https://gis.tempe.gov/arcgis/rest/services/Covid_Cases/FeatureServer/layers?f=json";
    const expected =
      "https://gis.tempe.gov/arcgis/rest/services/Covid_Cases/FeatureServer";
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
  });

  test("Removes query string from non-standard service url", async () => {
    const input = "https://gis.tempe.gov/arcgis/non/traditional/path?f=json";
    const expected = "https://gis.tempe.gov/arcgis/non/traditional/path";
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
  });

  test("Removes trailing slash from non-standard service url", async () => {
    const input = "https://gis.tempe.gov/arcgis/non/traditional/path/";
    const expected = "https://gis.tempe.gov/arcgis/non/traditional/path";
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
  });
});
