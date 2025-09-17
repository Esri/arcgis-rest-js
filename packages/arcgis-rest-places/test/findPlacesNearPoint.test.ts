import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { findPlacesNearPoint, IconOptions } from "../src/index.js";
import { describe, test, expect, afterEach } from "vitest";
import fetchMock, { MockCall } from "fetch-mock";
import {
  placeNearPointMockNoMoreResults,
  placeNearPointMockMoreResults
} from "./mocks/nearPoint.mock.js";

const MOCK_AUTH = ApiKeyManager.fromKey("fake-token");

describe("findPlacesNearPoint()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should return places near a point and not return a next page when there are no more results", async () => {
    fetchMock.mock("*", placeNearPointMockNoMoreResults);

    const response = await findPlacesNearPoint({
      x: -3.1883,
      y: 55.9533,
      radius: 10,
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*") as MockCall;

    expect(response.results).toEqual(
      placeNearPointMockNoMoreResults.results as any
    );
    expect(response.results).toEqual(
      placeNearPointMockNoMoreResults.results as any
    );
    expect(response.nextPage).toBeUndefined();
    expect(url).toContain("token=fake-token");
  });

  test("should return places near a point and a next page when there are more results", async () => {
    fetchMock.mock("*", placeNearPointMockMoreResults);

    const firstPageResponse = await findPlacesNearPoint({
      x: -3.1883,
      y: 55.9533,
      authentication: MOCK_AUTH
    });

    const [firstPageUrl, firstPageOptions] = fetchMock.lastCall("*");

    expect(firstPageResponse.results).toEqual(
      placeNearPointMockMoreResults.results as any
    );
    expect(firstPageResponse.results).toEqual(
      placeNearPointMockMoreResults.results as any
    );
    expect(firstPageResponse.nextPage).toBeDefined();
    expect(firstPageUrl).toContain("token=fake-token");

    fetchMock.restore();
    fetchMock.mock("*", placeNearPointMockNoMoreResults);

    if (!firstPageResponse.nextPage) {
      fail("Expected next page function");
      return;
    }

    const nextPage = await firstPageResponse.nextPage();

    const [url, options] = fetchMock.lastCall("*");

    expect(nextPage.results).toEqual(
      placeNearPointMockNoMoreResults.results as any
    );
    expect(nextPage.results).toEqual(
      placeNearPointMockNoMoreResults.results as any
    );
    expect(nextPage.nextPage).toBeUndefined();
    expect(url).toContain("token=fake-token");
  });

  test("verify endpoint", async () => {
    fetchMock.mock("*", placeNearPointMockNoMoreResults);

    await findPlacesNearPoint({
      x: -3.1883,
      y: 55.9533,
      radius: 10,
      endpoint:
        "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/near-point",
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*") as MockCall;
    expect(url).toEqual(
      "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/near-point?f=json&x=-3.1883&y=55.9533&radius=10&token=fake-token"
    );
  });

  test("verify icon param", async () => {
    fetchMock.mock("*", placeNearPointMockNoMoreResults);

    await findPlacesNearPoint({
      x: -3.1883,
      y: 55.9533,
      radius: 10,
      icon: IconOptions.CIM,
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*") as MockCall;
    expect(url).toContain("&icon=cim");
  });
});
