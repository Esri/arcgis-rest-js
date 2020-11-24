/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { closestFacility } from "../src/closestFacility";

import * as fetchMock from "fetch-mock";

import {
  barriers,
  barriersFeatureSet,
  polylineBarriers,
  polygonBarriers,
} from "./mocks/inputs";

import { ClosestFacility, ClosestFacilityWebMercator } from "./mocks/responses";

import {
  IPoint,
  ILocation,
  IFeatureSet,
  IPolyline,
  IPolygon,
} from "@esri/arcgis-rest-types";

const incidents: Array<[number, number]> = [[-118.257363, 34.076763]];

const facilities: Array<[number, number]> = [
  [-118.3417932, 34.00451385],
  [-118.08788, 34.01752],
  [-118.20327, 34.19382],
];

const incidentsLatLong: ILocation[] = [
  {
    lat: 34.076763,
    long: -118.257363,
  },
];

const facilitiesLatLong: ILocation[] = [
  {
    lat: 34.00451385,
    long: -118.3417932,
  },
  {
    lat: 34.01752,
    long: -118.08788,
  },
  {
    lat: 34.19382,
    long: -118.20327,
  },
];

const incidentsLatitudeLongitude: ILocation[] = [
  {
    latitude: 34.076763,
    longitude: -118.257363,
  },
];

const facilitiesLatitudeLongitude: ILocation[] = [
  {
    latitude: 34.00451385,
    longitude: -118.3417932,
  },
  {
    latitude: 34.01752,
    longitude: -118.08788,
  },
  {
    latitude: 34.19382,
    longitude: -118.20327,
  },
];

const incidentsPoint: IPoint[] = [
  {
    x: -118.257363,
    y: 34.076763,
  },
];

const facilitiesPoint: IPoint[] = [
  {
    x: -118.3417932,
    y: 34.00451385,
  },
  {
    x: -118.08788,
    y: 34.01752,
  },
  {
    x: -118.20327,
    y: 34.19382,
  },
];

const incidentsFeatureSet: IFeatureSet = {
  spatialReference: {
    wkid: 4326,
  },

  features: [
    {
      geometry: {
        x: -122.4079,
        y: 37.78356,
      } as IPoint,
      attributes: {
        Name: "Fire Incident 1",
        Attr_TravelTime: 4,
      },
    },
    {
      geometry: {
        x: -122.404,
        y: 37.782,
      } as IPoint,
      attributes: {
        Name: "Crime Incident 45",
        Attr_TravelTime: 5,
      },
    },
  ],
};

const facilitiesFeatureSet: IFeatureSet = {
  spatialReference: {
    wkid: 4326,
  },

  features: [
    {
      geometry: {
        x: -122.4079,
        y: 37.78356,
      } as IPoint,
      attributes: {
        Name: "Fire Station 34",
        Attr_TravelTime: 4,
      },
    },
    {
      geometry: {
        x: -122.404,
        y: 37.782,
      } as IPoint,
      attributes: {
        Name: "Fire Station 29",
        Attr_TravelTime: 5,
      },
    },
  ],
};

// const customRoutingUrl =
//   "https://foo.com/ArcGIS/rest/services/Network/USA/NAServer/";

describe("closestFacility", () => {
  afterEach(fetchMock.restore);

  it("should throw an error when a closestFacility request is made without a token", (done) => {
    fetchMock.once("*", ClosestFacility);

    closestFacility({
      incidents,
      facilities,
      returnCFRoutes: true,
    })
      // tslint:disable-next-line
      .catch((e) => {
        expect(e).toEqual(
          "Finding the closest facility using the ArcGIS service requires authentication"
        );
        done();
      });
  });

  it("should make a simple closestFacility request (Point Arrays)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents,
      facilities,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World/solveClosestFacility"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain(
          `incidents=${encodeURIComponent("-118.257363,34.076763")}`
        );
        expect(options.body).toContain(
          `facilities=${encodeURIComponent(
            "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
          )}`
        );
        expect(options.body).toContain("token=token");

        expect(response.routes.spatialReference.latestWkid).toEqual(4326);
        expect(response.routes.features[0].attributes.Name).toEqual(
          "Echo Park Ave & W Sunset Blvd, Los Angeles, California, 90026 - Flint Wash Trail"
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass default values", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents,
      facilities,
      params: {
        outSR: 102100,
      },
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain("returnDirections=true");
        expect(options.body).toContain("returnFacilities=true");
        expect(options.body).toContain("returnIncidents=true");
        expect(options.body).toContain("returnBarriers=true");
        expect(options.body).toContain("returnPolylineBarriers=true");
        expect(options.body).toContain("returnPolygonBarriers=true");
        expect(options.body).toContain("preserveObjectID=true");
        expect(options.body).toContain("outSR=102100");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should allow default values to be overridden", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents,
      facilities,
      returnCFRoutes: true,
      returnDirections: false,
      returnFacilities: false,
      returnIncidents: false,
      returnBarriers: false,
      returnPolylineBarriers: false,
      returnPolygonBarriers: false,
      preserveObjectID: false,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain("returnDirections=false");
        expect(options.body).toContain("returnFacilities=false");
        expect(options.body).toContain("returnIncidents=false");
        expect(options.body).toContain("returnBarriers=false");
        expect(options.body).toContain("returnPolylineBarriers=false");
        expect(options.body).toContain("returnPolygonBarriers=false");
        expect(options.body).toContain("preserveObjectID=false");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple closestFacility request (array of objects - lat/lon)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsLatLong,
      facilities: facilitiesLatLong,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `incidents=${encodeURIComponent("-118.257363,34.076763")}`
        );
        expect(options.body).toContain(
          `facilities=${encodeURIComponent(
            "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple closestFacility request (array of objects - latitude/longitude)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsLatitudeLongitude,
      facilities: facilitiesLatitudeLongitude,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `incidents=${encodeURIComponent("-118.257363,34.076763")}`
        );
        expect(options.body).toContain(
          `facilities=${encodeURIComponent(
            "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple closestFacility request (array of IPoint)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `incidents=${encodeURIComponent("-118.257363,34.076763")}`
        );
        expect(options.body).toContain(
          `facilities=${encodeURIComponent(
            "-118.3417932,34.00451385;-118.08788,34.01752;-118.20327,34.19382"
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should make a simple closestFacility request (FeatureSet)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsFeatureSet,
      facilities: facilitiesFeatureSet,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `incidents=${encodeURIComponent(JSON.stringify(incidentsFeatureSet))}`
        );
        expect(options.body).toContain(
          `facilities=${encodeURIComponent(
            JSON.stringify(facilitiesFeatureSet)
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should include proper travelDirection", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      travelDirection: "facilitiesToIncidents",
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `travelDirection=esriNATravelDirectionToFacility`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should include proper travelDirection", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      travelDirection: "incidentsToFacilities",
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `travelDirection=esriNATravelDirectionFromFacility`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass point barriers (array of IPoint)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      barriers,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `barriers=${encodeURIComponent("-117.1957,34.0564;-117.184,34.0546")}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass point barriers (FeatureSet)", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      barriers: barriersFeatureSet,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `barriers=${encodeURIComponent(JSON.stringify(barriersFeatureSet))}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass polyline barriers", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      polylineBarriers,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `polylineBarriers=${encodeURIComponent(
            JSON.stringify(polylineBarriers)
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should pass polygon barriers", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      polygonBarriers,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(options.body).toContain(
          `polygonBarriers=${encodeURIComponent(
            JSON.stringify(polygonBarriers)
          )}`
        );
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should include routes.geoJson in the return", (done) => {
    fetchMock.once("*", ClosestFacility);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(Object.keys(response.routes)).toContain("geoJson");
        expect(Object.keys(response.routes.geoJson)).toContain("type");
        expect(response.routes.geoJson.type).toEqual("FeatureCollection");
        expect(Object.keys(response.routes.geoJson)).toContain("features");
        expect(response.routes.geoJson.features.length).toBeGreaterThan(0);

        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should not include routes.geoJson in the return for non-4326", (done) => {
    fetchMock.once("*", ClosestFacilityWebMercator);

    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("token");
      },
      portal: "https://mapsdev.arcgis.com",
    };

    closestFacility({
      incidents: incidentsPoint,
      facilities: facilitiesPoint,
      returnCFRoutes: true,
      authentication: MOCK_AUTH,
      params: {
        outSR: 102100,
      },
    })
      .then((response) => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(Object.keys(response.routes)).not.toContain("geoJson");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
