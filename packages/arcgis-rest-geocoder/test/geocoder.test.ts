import { geocode } from "../src/geocode";

import { suggest } from "../src/suggest";

import { reverseGeocode } from "../src/reverse";

import { bulkGeocode } from "../src/bulk";

import { serviceInfo, getGeocodeService } from "../src/helpers";

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
    OBJECTID: 1,
    SingleLine: "380 New York St. Redlands 92373"
  },
  {
    OBJECTID: 2,
    SingleLine: "1 World Way Los Angeles 90045"
  }
];

const customGeocoderUrl =
  "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/";

describe("geocode", () => {
  afterEach(fetchMock.restore);

  it("should make a simple, single geocoding request", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode("LAX")
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
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

    geocode({ params: { singleLine: "LAX", countryCode: "USA" } })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("singleLine=LAX");
        expect(options.body).toContain("countryCode=USA");
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

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      }
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `address=${encodeURIComponent("380 New York St")}`
        );
        expect(options.body).toContain("postal=92373");
        expect(options.body).toContain("outSr=3857");
        // the only property this lib tacks on
        expect(response.spatialReference.wkid).toEqual(4326);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should pass through all requestOptions when making a geocoding request", done => {
    fetchMock.once("*", FindAddressCandidates);

    geocode({
      endpoint: customGeocoderUrl,
      params: {
        outSr: 3857,
        address: "380 New York St",
        postal: 92373
      },
      httpMethod: "GET"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://foo.com/arcgis/rest/services/Custom/GeocodeServer/findAddressCandidates?f=json&outSr=3857&address=380%20New%20York%20St&postal=92373"
        );
        expect(options.method).toBe("GET");
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

    reverseGeocode({ x: -118.409, y: 33.9425 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent('{"x":-118.409,"y":33.9425}')}`
        );
        expect(response).toEqual(ReverseGeocode); // introspect the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding GET request and pass through a spatial reference", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode(
      { x: -118.409, y: 33.9425, spatialReference: { wkid: 4326 } },
      { httpMethod: "GET" }
    )
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=%7B%22x%22%3A-118.409%2C%22y%22%3A33.9425%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D"
        );
        expect(options.method).toBe("GET");
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate lat/long JSON objects", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode({ longitude: -118.409, latitude: 33.9425 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118.409,33.9425")}`
        );
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate lat/long JSON abbreviated objects", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode({ lat: 33.9425, long: -118.409 })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118.409,33.9425")}`
        );
        expect(response).toEqual(ReverseGeocode); // this introspects the entire response
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a reverse geocoding request and translate a raw long,lat array", done => {
    fetchMock.once("*", ReverseGeocode);

    reverseGeocode([-118, 34])
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `location=${encodeURIComponent("-118,34")}`
        );
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

  it("should make a bulk geocoding request", done => {
    fetchMock.once("*", GeocodeAddresses);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    bulkGeocode({ addresses, authentication: MOCK_AUTH })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `addresses=${encodeURIComponent(
            '{"records":[{"attributes":{"OBJECTID":1,"SingleLine":"380 New York St. Redlands 92373"}},{"attributes":{"OBJECTID":2,"SingleLine":"1 World Way Los Angeles 90045"}}]}'
          )}`
        );
        expect(options.body).toContain("token=token");
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

    bulkGeocode({ addresses })
      // tslint:disable-next-line
      .catch(e => {
        expect(e).toEqual(
          "bulk geocoding using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should send a bulk geocoding request to a custom url without a token", done => {
    fetchMock.once("*", GeocodeAddresses);

    bulkGeocode({
      addresses,
      endpoint:
        "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/"
    })
      // tslint:disable-next-line
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://customer.gov/arcgis/rest/services/CompositeGeocoder/GeocodeServer/geocodeAddresses"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `addresses=${encodeURIComponent(
            '{"records":[{"attributes":{"OBJECTID":1,"SingleLine":"380 New York St. Redlands 92373"}},{"attributes":{"OBJECTID":2,"SingleLine":"1 World Way Los Angeles 90045"}}]}'
          )}`
        );
        // expect(options.body).toContain("token=token");
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
      });
  });

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
