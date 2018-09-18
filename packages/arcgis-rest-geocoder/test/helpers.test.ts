/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { serviceInfo, getGeocodeService } from "../src/helpers";

import * as fetchMock from "fetch-mock";

import { SharingInfo } from "./mocks/responses";

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

describe("geocode", () => {
  afterEach(fetchMock.restore);

  it("should retrieve metadata from the World Geocoding Service", done => {
    fetchMock.once("*", SharingInfo);

    getGeocodeService()
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/?f=json"
        );
        expect(options.method).toBe("GET");
        // expect(response).toEqual(SharingInfo); // need to fix something in order introspect the whole response
        expect(response.currentVersion).toEqual(10.41);
        expect(response.serviceDescription).toEqual(
          "Sample geocoder for San Diego, California, USA"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make POST request for metadata from the World Geocoding Service", done => {
    fetchMock.once("*", SharingInfo);

    getGeocodeService({ httpMethod: "POST" })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        // expect(response).toEqual(SharingInfo); // need to fix something in order introspect the whole response
        expect(response.currentVersion).toEqual(10.41);
        expect(response.serviceDescription).toEqual(
          "Sample geocoder for San Diego, California, USA"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should retrieve metadata from custom geocoding services", done => {
    fetchMock.once("*", SharingInfo);

    getGeocodeService({ endpoint: customGeocoderUrl })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/?f=json"
        );
        expect(options.method).toBe("GET");
        // how to introspect the whole response?
        // expect(response).toEqual(SharingInfo);
        expect(response.currentVersion).toEqual(10.41);
        expect(response.serviceDescription).toEqual(
          "Sample geocoder for San Diego, California, USA"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should retrieve metadata from the World Geocoding Service using the old method name", done => {
    fetchMock.once("*", SharingInfo);

    // intercept deprecation warning
    console.warn = jasmine.createSpy("warning");

    serviceInfo()
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/?f=json"
        );
        expect(options.method).toBe("GET");
        // expect(response).toEqual(SharingInfo); // need to fix something in order introspect the whole response
        expect(response.currentVersion).toEqual(10.41);
        expect(response.serviceDescription).toEqual(
          "Sample geocoder for San Diego, California, USA"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
