import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getCategories } from "../src/index.js";
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
});
