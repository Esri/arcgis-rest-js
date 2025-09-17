import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { getCategories, IconOptions } from "../src/index.js";
import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { categoriesMock } from "./mocks/categories.mock.js";

const MOCK_AUTH = ApiKeyManager.fromKey("fake-token");

describe("getCategories()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should return categories", async () => {
    fetchMock.mock("*", categoriesMock);

    const response = await getCategories({
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(response).toEqual(categoriesMock as any);
    expect(url).toContain("token=fake-token");
  });

  test("verify endpoint", async () => {
    fetchMock.mock("*", categoriesMock);

    await getCategories({
      endpoint:
        "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories",
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories?f=json&token=fake-token"
    );
  });

  test("verify icon param", async () => {
    fetchMock.mock("*", categoriesMock);

    await getCategories({
      icon: IconOptions.SVG,
      authentication: MOCK_AUTH
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("icon=svg");
  });
});
