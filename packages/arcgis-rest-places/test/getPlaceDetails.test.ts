import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { getPlaceDetails, IconOptions } from "../src/index.js";
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

  it("verify endpoint", async () => {
    fetchMock.mock("*", placeMock);
    const placeId = "e78051acc722c55ab11ba930d8dd7772";

    await getPlaceDetails({
      placeId,
      requestedFields: ["all"],
      endpoint: `https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/${placeId}`,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/${placeId}?f=json&requestedFields=all&token=MOCK_KEY`
    );
  });

  it("verify icon param", async () => {
    fetchMock.mock("*", placeMock);
    const placeId = "e78051acc722c55ab11ba930d8dd7772";

    await getPlaceDetails({
      placeId,
      requestedFields: ["all"],
      icon: IconOptions.PNG,
      authentication: ApiKeyManager.fromKey("MOCK_KEY")
    });

    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain("icon=png");
  });
});
