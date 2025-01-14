import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { findElevationAtPoint } from "../src/index.js";
import { atPointDefaultResult } from "./mocks/atPointDefault.mock.js";
import { atPointEllipsoidResult } from "./mocks/atPointEllipsoid.mock.js";

describe("findElevationAtPoint()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return elevation at a point with mean sea level as the reference", async () => {
    fetchMock.mock("*", atPointDefaultResult);

    const response = await findElevationAtPoint({
      lon: -3.1883,
      lat: 55.9533,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");

    expect(response.result).toEqual(atPointDefaultResult.result);
    expect(url).toContain("lon=-3.1883");
    expect(url).toContain("lat=55.9533");
    expect(url).toContain("token=MOCK_KEY");
  });

  it("should return elevation at a point with ellipsoid as the reference", async () => {
    fetchMock.mock("*", atPointEllipsoidResult);

    const response = await findElevationAtPoint({
      lon: -3.1883,
      lat: 55.9533,
      relativeTo: "ellipsoid",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");

    expect(response.result).toEqual(atPointEllipsoidResult.result);
    expect(url).toContain("lon=-3.1883");
    expect(url).toContain("lat=55.9533");
    expect(url).toContain("token=MOCK_KEY");
  });
});
