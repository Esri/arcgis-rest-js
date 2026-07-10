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

    expect(response.result).toEqual(atManyPointsDefaultResult.result);
  });

  test("should return elevation at points with ellipsoid as the reference", async () => {
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

  test("Outbound Smoke Test to verify current code but this method needs to be reviewed", async () => {
    fetchMock.mock("*", atManyPointsDefaultResult);

    const coordinates: Array<[number, number]> = [
      [1.2, 3.4],
      [1.23, 3.45]
    ];

    await findElevationAtManyPoints({
      coordinates,
      // This forces the branch where processOptions keeps params.coordinates.
      params: { coordinates: "placeholder" },
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    } as any);

    const [url, options] = fetchMock.lastCall("*");
    const body = String(options?.body || "");
    const params = new URLSearchParams(body);

    expect(params.get("coordinates")).toEqual(JSON.stringify(coordinates));
  });
});
