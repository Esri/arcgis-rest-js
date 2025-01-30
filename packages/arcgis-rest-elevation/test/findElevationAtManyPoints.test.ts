import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { findElevationAtManyPoints } from "../src/index.js";
import { atManyPointsDefaultResult } from "./mocks/atManyPointsDefault.mock.js";
import { atManyPointsEllipsoidResult } from "./mocks/atManyPointsEllipsoid.mock.js";

describe("findElevationAtManyPoints()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return elevation at points with mean sea level as the reference", async () => {
    fetchMock.mock("*", atManyPointsDefaultResult);

    let response = await findElevationAtManyPoints({
      coordinates: [
        [1.2, 3.4],
        [1.23, 3.45]
      ],
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");

    expect(response.result).toEqual(atManyPointsDefaultResult.result);
  });

  it("should return elevation at points with ellipsoid as the reference", async () => {
    fetchMock.mock("*", atManyPointsEllipsoidResult);

    const response = await findElevationAtManyPoints({
      coordinates: [
        [1.2, 3.4],
        [1.23, 3.45]
      ],
      relativeTo: "ellipsoid",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");

    expect(response.result).toEqual(atManyPointsEllipsoidResult.result);
  });
});
