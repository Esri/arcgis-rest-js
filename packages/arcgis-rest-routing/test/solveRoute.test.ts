/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { solveRoute } from "../src/solveRoute.js";
import fetchMock from "fetch-mock";
import { describe, afterEach, test, expect } from "vitest";

import {
  Solve,
  SolveNoDirections,
  SolveWebMercator
} from "./mocks/responses.js";
import { IPoint, ILocation, IFeatureSet } from "@esri/arcgis-rest-request";

// -117.195677,34.056383;-117.918976,33.812092
const stops: Array<[number, number]> = [
  [-117.195677, 34.056383],
  [-117.918976, 33.812092]
];

// -117.195677,34.056383,10.11;-117.918976,33.812092,8.43
const stops3: Array<[number, number, number]> = [
  [-117.195677, 34.056383, 10.11],
  [-117.918976, 33.812092, 8.43]
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

const stopsObjectsLatLong3: ILocation[] = [
  {
    lat: 34.056383,
    long: -117.195677,
    z: 10.11
  },
  {
    lat: 33.812092,
    long: -117.918976,
    z: 8.43
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

const stopsObjectsLatitudeLongitude3: ILocation[] = [
  {
    latitude: 34.056383,
    longitude: -117.195677,
    z: 10.11
  },
  {
    latitude: 33.812092,
    longitude: -117.918976,
    z: 8.43
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

const stopsObjectsPoint3: IPoint[] = [
  {
    x: -117.195677,
    y: 34.056383,
    z: 10.11
  },
  {
    x: -117.918976,
    y: 33.812092,
    z: 8.43
  }
];

const stopsFeatureSet: IFeatureSet = {
  features: [
    {
      geometry: {
        x: -117.195677,
        y: 34.056383,
        spatialReference: {
          wkid: 4326
        }
      } as IPoint,
      attributes: {}
    },
    {
      geometry: {
        x: -117.918976,
        y: 33.812092,
        spatialReference: {
          wkid: 4326
        }
      } as IPoint,
      attributes: {}
    }
  ]
};

// const customRoutingUrl =
//   "https://foo.com/ArcGIS/rest/services/Network/USA/NAServer/";

describe("solveRoute", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should throw an error when a solveRoute request is made without a token", async () => {
    fetchMock.once("*", Solve);

    await expect(solveRoute({ stops })).rejects.toEqual(
      "Routing using the ArcGIS service requires authentication"
    );
  });

  test("should make a simple solveRoute request (array of stops)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({ stops, authentication: MOCK_AUTH });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make a simple solveRoute request (array of 3d stops)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stops3,
      authentication: MOCK_AUTH
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // "stops=-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
    expect(options.body).toContain(
      `stops=${encodeURIComponent(
        "-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should make a simple solveRoute request (array of objects - lat/lon)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatLong,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make a simple solveRoute request (array of objects - 3d lat/lon)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatLong3,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // "stops=-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
    expect(options.body).toContain(
      `stops=${encodeURIComponent(
        "-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should make a simple solveRoute request (array of objects - latitude/longitude)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatitudeLongitude,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make a simple solveRoute request (array of objects - 3d latitude/longitude)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatitudeLongitude3,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // "stops=-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
    expect(options.body).toContain(
      `stops=${encodeURIComponent(
        "-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should make a simple solveRoute request (array of objects - latitude/longitude)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatitudeLongitude,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make a simple solveRoute request (array of objects - 3d latitude/longitude)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsLatitudeLongitude3,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // "stops=-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
    expect(options.body).toContain(
      `stops=${encodeURIComponent(
        "-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should make a simple solveRoute request (array of IPoint)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make a simple solveRoute request (array of 3d IPoint)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint3,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    // "stops=-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
    expect(options.body).toContain(
      `stops=${encodeURIComponent(
        "-117.195677,34.056383,10.11;-117.918976,33.812092,8.43"
      )}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should make a simple solveRoute request (FeatureSet)", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsFeatureSet,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `stops=${encodeURIComponent(JSON.stringify(stopsFeatureSet))}`
    );
    expect(options.body).toContain("token=token");
    expect(response.routes.spatialReference.latestWkid).toEqual(4326);
    expect(response.routes.features[0].attributes.Name).toEqual(
      "Location 1 - Location 2"
    );
  });

  test("should transform compressed geometry into geometry", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    expect(response.directions[0].features[0].geometry).toEqual(
      expect.any(Object)
    );
  });

  test("should not fail when no directions are returned", async () => {
    fetchMock.once("*", SolveNoDirections);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH,
      params: {
        returnDirections: false
      }
    });

    expect(fetchMock.called()).toEqual(true);
    expect(response.directions).toEqual(undefined);
  });

  test("should include routes.geoJson in the return", async () => {
    fetchMock.once("*", Solve);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(Object.keys(response.routes)).toContain("geoJson");
  });

  test("should not include routes.geoJson in the return for non-4326", async () => {
    fetchMock.once("*", SolveWebMercator);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await solveRoute({
      stops: stopsObjectsPoint,
      authentication: MOCK_AUTH,
      params: {
        outSR: 102100
      }
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(Object.keys(response.routes)).not.toContain("geoJson");
  });
});
