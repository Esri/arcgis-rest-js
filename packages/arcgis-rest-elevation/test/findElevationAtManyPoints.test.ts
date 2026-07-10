import { expect, test, describe, afterEach } from "vitest";
import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { findElevationAtManyPoints } from "../src/index.js";
import { atManyPointsDefaultResult } from "./mocks/atManyPointsDefault.mock.js";
import { atManyPointsEllipsoidResult } from "./mocks/atManyPointsEllipsoid.mock.js";

describe("findElevationAtManyPoints()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should return elevation at points with mean sea level as the reference", async () => {
    fetchMock.mock("*", atManyPointsDefaultResult);
    const response = await findElevationAtManyPoints({
      coordinates: [
        [1.2, 3.4],
        [1.23, 3.45]
      ],
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    console.log("options.body", options.body);
    expect(url).toContain("/elevation/at-many-points");
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      "coordinates=%5B%5B1.2%2C3.4%5D%2C%5B1.23%2C3.45%5D%5D"
    );
  });

  test("should return elevation at points with ellipsoid as the reference", async () => {
    fetchMock.mock("*", atManyPointsEllipsoidResult);

    const coordinates = [
      [1.2, 3.4],
      [1.23, 3.45]
    ];

    const response = await findElevationAtManyPoints({
      coordinates,
      relativeTo: "ellipsoid",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("/elevation/at-many-points");
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      "coordinates=%5B%5B1.2%2C3.4%5D%2C%5B1.23%2C3.45%5D%5D"
    );
  });
});
