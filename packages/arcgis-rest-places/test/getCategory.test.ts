import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getCategory, IconOptions } from "../src/index.js";
import { categoryMock } from "./mocks/category.mock.js";

describe("getCategory()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return categories", async () => {
    fetchMock.mock("*", categoryMock);

    const response = await getCategory({
      categoryId: "10000",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(response).toEqual(categoryMock as any);
    expect(url).toContain("token=MOCK_KEY");
  });

  it("verify endpoint", async () => {
    fetchMock.mock("*", categoryMock);

    await getCategory({
      categoryId: "10000",
      endpoint:
        "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories/10000",
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories/10000?f=json&token=MOCK_KEY"
    );
  });

  it("verify icon param", async () => {
    fetchMock.mock("*", categoryMock);

    await getCategory({
      categoryId: "10000",
      icon: IconOptions.CIM,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("icon=cim");
  });
});
