import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { findPlacesWithinExtent, IconOptions } from "../src/index.js";
import {
  placesWithinExtentMockNoMoreResults,
  placesWithinExtentMockMoreResults
} from "./mocks/withinExtent.mock.js";

describe("findPlacesWithinExtent()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return places within an extent and not return a next page when there are more results", async () => {
    fetchMock.mock("*", placesWithinExtentMockNoMoreResults);

    const response = await findPlacesWithinExtent({
      xmin: -118.013334,
      ymin: 33.78193,
      xmax: -117.795753,
      ymax: 33.873337,
      categoryIds: ["13002"],
      pageSize: 5,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(response.results).toEqual(
      placesWithinExtentMockNoMoreResults.results as any
    );
    expect(response.nextPage).toBeUndefined();
    expect(url).toContain("token=MOCK_KEY");
  });

  it("should return places within an extent and a next page when there are more results", async () => {
    fetchMock.mock("*", placesWithinExtentMockMoreResults);

    const firstPageResponse = await findPlacesWithinExtent({
      xmin: -118.013334,
      ymin: 33.78193,
      xmax: -117.795753,
      ymax: 33.873337,
      categoryIds: ["13002"],
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [firstPageUrl, firstPageOptions] = fetchMock.lastCall("*");

    expect(firstPageResponse.results).toEqual(
      placesWithinExtentMockMoreResults.results as any
    );
    expect(firstPageResponse.nextPage).toBeDefined();
    expect(firstPageUrl).toContain("token=MOCK_KEY");

    fetchMock.restore();
    fetchMock.mock("*", placesWithinExtentMockNoMoreResults);

    const nextPage = await firstPageResponse.nextPage();

    const [url, options] = fetchMock.lastCall("*");

    expect(nextPage.results).toEqual(
      placesWithinExtentMockNoMoreResults.results as any
    );
    expect(nextPage.nextPage).toBeUndefined();
    expect(url).toContain("token=MOCK_KEY");
  });

  it("verify endpoint", async () => {
    fetchMock.mock("*", placesWithinExtentMockNoMoreResults);

    await findPlacesWithinExtent({
      xmin: -118.013334,
      ymin: 33.78193,
      xmax: -117.795753,
      ymax: 33.873337,
      categoryIds: ["13002"],
      pageSize: 5,
      endpoint:
        "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/within-extent",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/within-extent?f=json&xmin=-118.013334&ymin=33.78193&xmax=-117.795753&ymax=33.873337&categoryIds=13002&pageSize=5&token=MOCK_KEY"
    );
  });

  it("verify icon param", async () => {
    fetchMock.mock("*", placesWithinExtentMockNoMoreResults);

    await findPlacesWithinExtent({
      xmin: -118.013334,
      ymin: 33.78193,
      xmax: -117.795753,
      ymax: 33.873337,
      categoryIds: ["13002"],
      pageSize: 5,
      icon: IconOptions.PNG,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("&icon=png");
  });
});
