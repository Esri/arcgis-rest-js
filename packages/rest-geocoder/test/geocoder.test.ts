import { FormData } from "@esri/rest-request";

import { single, suggest, reverse, bulk, serviceInfo } from "../src/index";

import * as fetchMock from "fetch-mock";

import {
  FindAddressCandidates,
  Suggest,
  ReverseGeocode,
  GeocodeAddresses,
  SharingInfo
} from "./mocks/responses";

const addresses = [
  {
    attributes: {
      OBJECTID: 1,
      SingleLine: "380 New York St. Redlands 92373"
    }
  },
  {
    attributes: {
      OBJECTID: 2,
      SingleLine: "1 World Way Los Angeles 90045"
    }
  }
];

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

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
        // the only property this lib tacks on
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
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a single geocoding request to a custom geocoding service", done => {
    fetchMock.once("*", FindAddressCandidates);

    single(null, { singleLine: "LAX" }, { endpoint: customGeocoderUrl })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("singleLine", "LAX");
        // the only property this lib tacks on
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
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding GET request", done => {
    fetchMock.once("*", ReverseGeocode);

    reverse([-118.409, 33.9425], {}, { httpMethod: "GET" })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=-118.409%2C33.9425"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
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
        expect(response).toEqual(Suggest); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a bulk geocoding request", done => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      }
    };

    bulk(addresses, { authentication: MOCK_AUTH })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
        );
        expect(options.method).toBe("POST");
        expect(paramsSpy).toHaveBeenCalledWith("f", "json");
        expect(paramsSpy).toHaveBeenCalledWith("token", "token");
        expect(response.spatialReference.latestWkid).toEqual(4326);
        expect(response.locations[0].address).toEqual(
          "380 New York St, Redlands, California, 92373"
        );
        expect(response.locations[0].location.x).toEqual(-117.19567031799994);
        // the only property this lib tacks on
        expect(response.locations[0].location.spatialReference.wkid).toEqual(
          4326
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw an error when a bulk geocoding request is made without a token", done => {
    fetchMock.once("*", GeocodeAddresses);
    // tslint:disable-next-line
    bulk(addresses, {}).then(response => {}).catch(e => {
      expect(e).toEqual("bulk geocoding requests require authentication");
      done();
    });
  });

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

  it("should make GET request for metadata from the World Geocoding Service", done => {
    fetchMock.once("*", SharingInfo);

    serviceInfo(null, { httpMethod: "GET" })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/?f=json"
        );
        expect(options.method).toBe("GET");
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

    serviceInfo(customGeocoderUrl)
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/"
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
