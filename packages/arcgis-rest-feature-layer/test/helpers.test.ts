import { parseServiceUrl } from "../src/helpers";

describe("parseServiceUrl", () => {
  it("Trims service url to root", done => {
    const input = "https://gis.tempe.gov/arcgis/rest/services/Covid_Cases/FeatureServer/layers?f=json";
    const expected = "https://gis.tempe.gov/arcgis/rest/services/Covid_Cases/FeatureServer"
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
    done();
  });
  it("Removes query string from non-standard service url", done => {
    const input = "https://gis.tempe.gov/arcgis/non/traditional/path?f=json";
    const expected = "https://gis.tempe.gov/arcgis/non/traditional/path";
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
    done();
  });
  it("Removes trailing slash from non-standard service url", done => {
    const input = "https://gis.tempe.gov/arcgis/non/traditional/path/";
    const expected = "https://gis.tempe.gov/arcgis/non/traditional/path";
    const actual = parseServiceUrl(input);
    expect(actual).toBe(expected);
    done();
  });
});