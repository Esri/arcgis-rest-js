import fetchMock from "fetch-mock";
import { getAllLayersAndTables } from "../src/getAllLayersAndTables";

import { allLayersAndTablesResponse } from "./mocks/allLayersAndTablesResponse";

const layerUrlBase =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer";

describe("getAllLayersAndTables()", () => {
  afterEach(fetchMock.restore);

  it("should fetch all layers and table associated with the service", (done) => {
    fetchMock.once("*", allLayersAndTablesResponse);
    getAllLayersAndTables({ url: layerUrlBase + "/0" })
      .then((response) => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(layerUrlBase + "/layers");
        expect(options.method).toBe("POST");
        expect(response).toEqual(allLayersAndTablesResponse);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
