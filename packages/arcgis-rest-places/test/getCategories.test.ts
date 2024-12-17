import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getCategories, IconOptions } from "../src/index.js";
import { categoriesMock } from "./mocks/categories.mock.js";

describe("getCategories()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return categories", async () => {
    fetchMock.mock("*", categoriesMock);

    const response = await getCategories({
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(response).toEqual(categoriesMock as any);
    expect(url).toContain("token=MOCK_KEY");
  });

  it("verify endpoint", async () => {
    fetchMock.mock("*", categoriesMock);

    await getCategories({
      endpoint:
        "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories?f=json&token=MOCK_KEY"
    );
  });

  it("verify icon param", async () => {
    fetchMock.mock("*", categoriesMock);

    await getCategories({
      icon: IconOptions.SVG,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("icon=svg");
  });
});
