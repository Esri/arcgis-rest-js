import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { hasNextPage } from "../src/utils.js";

describe("hasNextPage()", () => {
  it("should return if a response has a next page of results", async () => {
    expect(
      hasNextPage({
        maxResultsExceeded: true,
        links: {
          next: "next"
        }
      })
    ).toBeTruthy();

    expect(
      hasNextPage({
        maxResultsExceeded: false
      })
    ).toBeFalsy();

    expect(
      hasNextPage({
        maxResultsExceeded: true,
        links: {}
      })
    ).toBeFalsy();

    expect(hasNextPage(undefined)).toBeFalsy();
  });
});
