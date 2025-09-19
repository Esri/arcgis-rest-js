/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import { suggest } from "../src/suggest.js";
import { Suggest } from "./mocks/responses.js";

describe("geocode", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should make a request for suggestions", async () => {
    fetchMock.once("*", Suggest);

    const response = await suggest("LAX");
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("text=LAX");
    expect(response).toEqual(Suggest); // this introspects the entire response
  });

  test("should make a request for suggestions with other parameters", async () => {
    fetchMock.once("*", Suggest);

    const response = await suggest("LAX", {
      params: { category: "Address,Postal" }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("text=LAX");
    expect(options.body).toContain("category=Address%2CPostal");
    expect(response).toEqual(Suggest); // this introspects the entire response
  });
});
