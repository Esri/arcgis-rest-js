import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getPlaceDetails } from "../src/index.js";
import { placeMock } from "./mocks/place.mock.js";

describe("getPlaceDetails()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should return a specific place", async () => {
    fetchMock.mock("*", placeMock);
    const placeId = "e78051acc722c55ab11ba930d8dd7772";

    const response = await getPlaceDetails({
      placeId,
      requestedFields: ["all"],
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(response).toEqual(placeMock as any);
    expect(url).toContain("token=MOCK_KEY");
    expect(url).toContain(`places/${placeId}`);
  });
});
