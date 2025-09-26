/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { serviceArea } from "../src/serviceArea.js";

import fetchMock from "fetch-mock";
import { describe, afterEach, test, expect } from "vitest";

import {
  barriers,
  barriersFeatureSet,
  polylineBarriers,
  polygonBarriers
} from "./mocks/inputs.js";

import { ServiceArea, ServiceAreaWebMercator } from "./mocks/responses.js";

import {
  IPoint,
  ILocation,
  IFeatureSet,
  IPolyline,
  IPolygon
} from "@esri/arcgis-rest-request";

const facilities: Array<[number, number]> = [
  [-118.3417932, 34.00451385],
  [-118.08788, 34.01752],
  [-118.20327, 34.19382]
];

const facilitiesLatLong: ILocation[] = [
  {
    lat: 34.00451385,
    long: -118.3417932
  },
  {
    lat: 34.01752,
    long: -118.08788
  },
  {
    lat: 34.19382,
    long: -118.20327
  }
];

const facilitiesLatitudeLongitude: ILocation[] = [
  {
    latitude: 34.00451385,
    longitude: -118.3417932
  },
  {
    latitude: 34.01752,
    longitude: -118.08788
  },
  {
    latitude: 34.19382,
    longitude: -118.20327
  }
];

const facilitiesPoint: IPoint[] = [
  {
    x: -118.3417932,
    y: 34.00451385
  },
  {
    x: -118.08788,
    y: 34.01752
  },
  {
    x: -118.20327,
    y: 34.19382
  }
];

const facilitiesFeatureSet: IFeatureSet = {
  spatialReference: {
    wkid: 102100
  },
  features: [
    {
      geometry: {
        x: -122.4079,
        y: 37.78356
      } as IPoint,
      attributes: {
        Name: "Fire Station 34",
        Attr_TravelTime: 4
      }
    },
    {
      geometry: {
        x: -122.404,
        y: 37.782
      } as IPoint,
      attributes: {
        Name: "Fire Station 29",
        Attr_TravelTime: 5
      }
    }
  ]
};

// const customRoutingUrl =
//   "https://foo.com/ArcGIS/rest/services/Network/USA/NAServer/";

describe("serviceArea", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should throw an error when a serviceArea request is made without a token", async () => {
    fetchMock.once("*", ServiceArea);

    await expect(
      serviceArea({
        facilities
      })
    ).rejects.toEqual(
      "Finding service areas using the ArcGIS service requires authentication"
    );
  });

  test("should make a simple serviceArea request (Point Arrays)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain(
      `facilities=${encodeURIComponent(
        "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
      )}`
    );
    expect(options.body).toContain("token=token");

    expect(response.saPolygons.spatialReference.latestWkid).toEqual(4326);
    expect(response.saPolygons.features[0].attributes.Name).toEqual(
      "Location 2 : 10 - 15"
    );
  });

  test("should pass default values", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities,
      params: {
        outSR: 102100
      },
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain("returnFacilities=true");
    expect(options.body).toContain("returnBarriers=true");
    expect(options.body).toContain("returnPolylineBarriers=true");
    expect(options.body).toContain("returnPolygonBarriers=true");
    expect(options.body).toContain("preserveObjectID=true");
    expect(options.body).toContain("outSR=102100");
  });

  test("should allow default values to be overridden", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities,
      returnFacilities: false,
      returnBarriers: false,
      returnPolylineBarriers: false,
      returnPolygonBarriers: false,
      preserveObjectID: false,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain("returnFacilities=false");
    expect(options.body).toContain("returnBarriers=false");
    expect(options.body).toContain("returnPolylineBarriers=false");
    expect(options.body).toContain("returnPolygonBarriers=false");
    expect(options.body).toContain("preserveObjectID=false");
  });

  test("should make a simple serviceArea request (array of objects - lat/lon)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesLatLong,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `facilities=${encodeURIComponent(
        "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
      )}`
    );
  });

  test("should make a simple serviceArea request (array of objects - latitude/longitude)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesLatitudeLongitude,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `facilities=${encodeURIComponent(
        "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
      )}`
    );
  });

  test("should make a simple serviceArea request (array of IPoint)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `facilities=${encodeURIComponent(
        "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
      )}`
    );
  });

  test("should make a simple serviceArea request (FeatureSet)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesFeatureSet,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `facilities=${encodeURIComponent(JSON.stringify(facilitiesFeatureSet))}`
    );
  });

  test("should include proper travelDirection", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      travelDirection: "facilitiesToIncidents",
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `travelDirection=esriNATravelDirectionToFacility`
    );
  });

  test("should include proper travelDirection", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      travelDirection: "incidentsToFacilities",
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `travelDirection=esriNATravelDirectionFromFacility`
    );
  });

  test("should pass point barriers (array of IPoint)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      barriers,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `barriers=${encodeURIComponent("-117.1957,34.0564;-117.184,34.0546")}`
    );
  });

  test("should pass point barriers (FeatureSet)", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      barriers: barriersFeatureSet,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `barriers=${encodeURIComponent(JSON.stringify(barriersFeatureSet))}`
    );
  });

  test("should pass polyline barriers", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      polylineBarriers,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `polylineBarriers=${encodeURIComponent(JSON.stringify(polylineBarriers))}`
    );
  });

  test("should pass polygon barriers", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      polygonBarriers,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(options.body).toContain(
      `polygonBarriers=${encodeURIComponent(JSON.stringify(polygonBarriers))}`
    );
  });

  test("should not include routes.fieldAliases in the return", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(Object.keys(response.saPolygons)).not.toContain("fieldAliases");
  });

  test("should include routes.geoJson in the return", async () => {
    fetchMock.once("*", ServiceArea);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      authentication: MOCK_AUTH
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(Object.keys(response.saPolygons)).toContain("geoJson");
    expect(Object.keys(response.saPolygons.geoJson)).toContain("type");
    expect(response.saPolygons.geoJson.type).toEqual("FeatureCollection");
    expect(Object.keys(response.saPolygons.geoJson)).toContain("features");
    expect(response.saPolygons.geoJson.features.length).toBeGreaterThan(0);
  });

  test("should not include routes.geoJson in the return for non-4326", async () => {
    fetchMock.once("*", ServiceAreaWebMercator);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com"
    };

    const response = await serviceArea({
      facilities: facilitiesPoint,
      authentication: MOCK_AUTH,
      params: {
        outSR: 102100
      }
    });

    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(Object.keys(response.saPolygons)).not.toContain("geoJson");
  });
});
