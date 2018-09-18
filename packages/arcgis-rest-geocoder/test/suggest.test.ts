/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { suggest } from "../src/suggest";

import * as fetchMock from "fetch-mock";

import { Suggest } from "./mocks/responses";

describe("geocode", () => {
  afterEach(fetchMock.restore);

  it("should make a request for suggestions", done => {
    fetchMock.once("*", Suggest);

    suggest("LAX")
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("text=LAX");
        expect(response).toEqual(Suggest); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a request for suggestions with magic key", done => {
    fetchMock.once("*", Suggest);

    suggest("LAX", { magicKey: "foo" })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("text=LAX");
        expect(options.body).toContain("magicKey=foo");
        expect(response).toEqual(Suggest); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a request for suggestions with other parameters", done => {
    fetchMock.once("*", Suggest);

    suggest("LAX", { params: { category: "Address,Postal" } })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("text=LAX");
        expect(options.body).toContain("category=Address%2CPostal");
        expect(response).toEqual(Suggest); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
