import { ApiKeyManager } from "@esri/arcgis-rest-request";
import fetchMock from "fetch-mock";
import { hasNextPage } from "../src/utils.js";

describe("hasNextPage()", () => {
  it("should return if a response has a next page of results", async () => {
    expect(
      hasNextPage({
        links: {
          next: "next"
        }
      })
    ).toBeTruthy();

    expect(
      hasNextPage({
        pagination: {
          nextUrl: "next"
        }
      })
    ).toBeTruthy();

    expect(hasNextPage({})).toBeFalsy();
    expect(hasNextPage(undefined)).toBeFalsy();

    expect(
      hasNextPage({
        links: {}
      })
    ).toBeFalsy();

    expect(
      hasNextPage({
        pagination: {}
      })
    ).toBeFalsy();
  });
});
