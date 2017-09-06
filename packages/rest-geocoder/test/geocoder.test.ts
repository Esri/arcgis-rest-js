import { FormData } from "@esri/rest-request";
import { UserSession } from "@esri/rest-auth";

import { single, suggest, reverse, bulk, serviceInfo } from "../src/index";

import * as fetchMock from "fetch-mock";

import {
  FindAddressCandidates,
  Suggest,
  ReverseGeocode,
  GeocodeAddresses,
  SharingInfo
} from "./mocks/responses";

// to do:
// write more requests with custom geocoding parameters
// mock authenticated requests and check for token
// test a couple GET requests

describe("request()", () => {
  let paramsSpy: jasmine.Spy;

  beforeEach(() => {
    paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  });

  afterAll(() => {
    paramsSpy.calls.reset();
  });

  afterEach(fetchMock.restore);

  it("should make a simple, single geocoding request", done => {
    fetchMock.once("*", FindAddressCandidates);

    single("LAX")
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("singleLine", "LAX");
        // expect(response).toEqual(SharingInfo); can we introspect the whole response?
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple, single geocoding request with a custom parameter", done => {
    fetchMock.once("*", FindAddressCandidates);

    single(null, { singleLine: "LAX" })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("singleLine", "LAX");
        // expect(response).toEqual(SharingInfo); can we introspect the whole response?
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request", done => {
    fetchMock.once("*", ReverseGeocode);

    reverse([-118.409, 33.9425])
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("location", "-118.409,33.9425");
        // expect(response).toEqual(SharingInfo); can we introspect the whole response?
        expect(response.address.Match_addr).toEqual("LA Airport");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

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
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("text", "LAX");
        // expect(response).toEqual(SharingInfo); can we introspect the whole response?
        expect(response.suggestions[0].text).toEqual(
          "LAX, Los Angeles, CA, USA"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  // it("should make a bulk geocoding request", done => {
  //   fetchMock.once('*', GeocodeAddresses);
  //   const addresses = [
  //       {
  //           "attributes": {
  //               "OBJECTID": 1,
  //               "SingleLine": "380 New York St. Redlands 92373"
  //           }
  //       },
  //       {
  //           "attributes": {
  //               "OBJECTID": 2,
  //               "SingleLine": "1 World Way Los Angeles 90045"
  //           }
  //       }
  //   ];

  //   const session = new UserSession({
  //     token: 'token'
  //   })
  //   bulk(addresses, {authentication: session})
  //     .then(response => {
  //       expect(fetchMock.called()).toEqual(true);
  //       const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
  //       expect(url).toEqual("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses");
  //       expect(options.method).toBe("POST");
  //       expect(paramsSpy).toHaveBeenCalledWith("f", "json");
  //       expect(paramsSpy).toHaveBeenCalledWith("token", "token");
  //       // expect(response).toEqual(SharingInfo); can we introspect the whole response?
  //       // expect(response.suggestions[0].text).toEqual("LAX, Los Angeles, CA, USA");
  //       done();
  //     })
  //     .catch(e => {
  //       fail(e);
  //     });
  // });

  it("should retrieve metadata from the World Geocoding Service", done => {
    fetchMock.once("*", SharingInfo);

    serviceInfo()
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        // expect(response).toEqual(SharingInfo); can we introspect the whole response?
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

    serviceInfo(
      "https://arcgisserver.com/arcgis/rest/services/Custom/GeocodeServer"
    )
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://arcgisserver.com/arcgis/rest/services/Custom/GeocodeServer"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
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
});
