import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getCategory } from "../src/index.js";
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
});
