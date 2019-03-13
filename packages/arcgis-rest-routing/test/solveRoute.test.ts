/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { solveRoute } from "../src/solveRoute";

import * as fetchMock from "fetch-mock";

import { Solve } from "./mocks/responses";
import { IPoint, ILocation } from "@esri/arcgis-rest-common";

// -117.195677,34.056383;-117.918976,33.812092
const stops: Array<[number, number]> = [
  [-117.195677, 34.056383],
  [-117.918976, 33.812092]
];

const stopsObjectsLatLong: ILocation[] = [
  {
    lat: 34.056383,
    long: -117.195677
  },
  {
    lat: 33.812092,
    long: -117.918976
  }
];

const stopsObjectsLatitudeLongitude: ILocation[] = [
  {
    latitude: 34.056383,
    longitude: -117.195677
  },
  {
    latitude: 33.812092,
    longitude: -117.918976
  }
];

const stopsObjectsPoint: IPoint[] = [
  {
    x: -117.195677,
    y: 34.056383
  },
  {
    x: -117.918976,
    y: 33.812092
  }
];

// const customRoutingUrl =
//   "https://foo.com/ArcGIS/rest/services/Network/USA/NAServer/";

describe("solveRoute", () => {
  afterEach(fetchMock.restore);

  it("should throw an error when a solveRoute request is made without a token", done => {
    fetchMock.once("*", Solve);

    solveRoute({
      stops
    })
      // tslint:disable-next-line
      .catch(e => {
        expect(e).toEqual(
          "Routing using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should make a simple solveRoute request (array of stops)", done => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    solveRoute({ stops, authentication: MOCK_AUTH })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // "stops=-117.195677,34.056383;-117.918976,33.812092"
        expect(options.body).toContain(
          `stops=${encodeURIComponent(
            "-117.195677,34.056383;-117.918976,33.812092"
          )}`
        );
        expect(options.body).toContain("token=token");
        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Location 1 - Location 2"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple solveRoute request (array of objects - lat/lon)", done => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    solveRoute({
      stops: stopsObjectsLatLong,
      authentication: MOCK_AUTH
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // "stops=-117.195677,34.056383;-117.918976,33.812092"
        expect(options.body).toContain(
          `stops=${encodeURIComponent(
            "-117.195677,34.056383;-117.918976,33.812092"
          )}`
        );
        expect(options.body).toContain("token=token");
        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Location 1 - Location 2"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple solveRoute request (array of objects - latitude/longitude)", done => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    solveRoute({
      stops: stopsObjectsLatitudeLongitude,
      authentication: MOCK_AUTH
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // "stops=-117.195677,34.056383;-117.918976,33.812092"
        expect(options.body).toContain(
          `stops=${encodeURIComponent(
            "-117.195677,34.056383;-117.918976,33.812092"
          )}`
        );
        expect(options.body).toContain("token=token");
        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Location 1 - Location 2"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple solveRoute request (array of objects - latitude/longitude)", done => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    solveRoute({
      stops: stopsObjectsLatitudeLongitude,
      authentication: MOCK_AUTH
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // "stops=-117.195677,34.056383;-117.918976,33.812092"
        expect(options.body).toContain(
          `stops=${encodeURIComponent(
            "-117.195677,34.056383;-117.918976,33.812092"
          )}`
        );
        expect(options.body).toContain("token=token");
        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Location 1 - Location 2"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make a simple solveRoute request (array of IPoint)", done => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        // "stops=-117.195677,34.056383;-117.918976,33.812092"
        expect(options.body).toContain(
          `stops=${encodeURIComponent(
            "-117.195677,34.056383;-117.918976,33.812092"
          )}`
        );
        expect(options.body).toContain("token=token");
        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Location 1 - Location 2"
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
