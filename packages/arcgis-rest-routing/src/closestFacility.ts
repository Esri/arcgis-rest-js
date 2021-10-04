/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import type {
  ILocation,
  IPoint,
  IFeature,
  IFeatureSet
} from "@esri/arcgis-rest-types";

import {
  ARCGIS_ONLINE_CLOSEST_FACILITY_URL,
  IEndpointOptions,
  normalizeLocationsList,
  isFeatureSet
} from "./helpers.js";

import { arcgisToGeoJSON } from "@terraformer/arcgis";

export interface IClosestFacilityOptions extends IEndpointOptions {
  /**
   * Specify one or more locations from which the service searches for the nearby locations. These locations are referred to as incidents.
   */
  incidents: Array<IPoint | ILocation | [number, number]> | IFeatureSet;

  /**
   * Specify one or more locations that are searched for when finding the closest location.
   */
  facilities: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
  /**
   *  Specify if the service should return routes.
   */
  returnCFRoutes: boolean;
  travelDirection?: "incidentsToFacilities" | "facilitiesToIncidents";
  barriers?: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
  polylineBarriers?: IFeatureSet;
  polygonBarriers?: IFeatureSet;
  returnDirections?: boolean;
  directionsOutputType?:
    | "esriDOTComplete"
    | "esriDOTCompleteNoEvents"
    | "esriDOTInstructionsOnly"
    | "esriDOTStandard"
    | "esriDOTSummaryOnly"
    | "esriDOTFeatureSets";
  directionsLengthUnits?:
    | "esriNAUCentimeters"
    | "esriNAUDecimalDegrees"
    | "esriNAUDecimeters"
    | "esriNAUFeet"
    | "esriNAUInches"
    | "esriNAUKilometers"
    | "esriNAUMeters"
    | "esriNAUMiles"
    | "esriNAUMillimeters"
    | "esriNAUNauticalMiles"
    | "esriNAUPoints"
    | "esriNAUYards";
  outputLines?: boolean;
  returnFacilities?: boolean;
  returnIncidents?: boolean;
  returnBarriers?: boolean;
  returnPolylineBarriers?: boolean;
  returnPolygonBarriers?: boolean;
  preserveObjectID?: boolean;
}

interface IFeatureSetWithGeoJson extends IFeatureSet {
  geoJson?: any;
}

export interface IClosestFacilityResponse {
  messages: string[];
  routes?: IFeatureSetWithGeoJson;
  directions?: Array<{
    routeId: number;
    routeName: string;
    summary: object;
    features: IFeature[];
  }>;
  incidents?: IFeatureSet;
  facilities?: IFeatureSet;
  barriers?: IFeatureSet;
  polygonBarriers?: IFeatureSet;
  polylineBarriers?: IFeatureSet;
}

function getTravelDirection(
  key: "incidentsToFacilities" | "facilitiesToIncidents"
): "esriNATravelDirectionFromFacility" | "esriNATravelDirectionToFacility" {
  if (key === "incidentsToFacilities") {
    return "esriNATravelDirectionFromFacility";
  } else {
    return "esriNATravelDirectionToFacility";
  }
}

/**
 * ```js
 * import { closestFacility } from '@esri/arcgis-rest-routing';
 * //
 * closestFacility({
 *   incidents: [
 *     [-90.404302, 38.600621],
 *     [-90.364293, 38.620427],
 *    ],
 *   facilities: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 * Used to find a route to the nearest of several possible destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm) for more information.
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm
 * @inline IClosestFacilityOptions
 */
export function closestFacility(
  requestOptions: IClosestFacilityOptions
): Promise<IClosestFacilityResponse> {
  const endpoint =
    requestOptions.endpoint || ARCGIS_ONLINE_CLOSEST_FACILITY_URL;

  requestOptions.params = {
    returnFacilities: true,
    returnDirections: true,
    returnIncidents: true,
    returnBarriers: true,
    returnPolylineBarriers: true,
    returnPolygonBarriers: true,
    preserveObjectID: true,
    ...requestOptions.params
  };

  const options = appendCustomParams<IClosestFacilityOptions>(requestOptions, [
    "returnCFRoutes",
    // "travelDirection",
    "barriers",
    "polylineBarriers",
    "polygonBarriers",
    "returnDirections",
    "directionsOutputType",
    "directionsLengthUnits",
    "outputLines",
    "returnFacilities",
    "returnIncidents",
    "returnBarriers",
    "returnPolylineBarriers",
    "returnPolygonBarriers",
    "preserveObjectID"
  ]);

  // Set travelDirection
  if (requestOptions.travelDirection) {
    options.params.travelDirection = getTravelDirection(
      requestOptions.travelDirection
    );
  }

  // the SAAS service does not support anonymous requests
  if (
    !requestOptions.authentication &&
    endpoint === ARCGIS_ONLINE_CLOSEST_FACILITY_URL
  ) {
    return Promise.reject(
      "Finding the closest facility using the ArcGIS service requires authentication"
    );
  }

  if (isFeatureSet(requestOptions.incidents)) {
    options.params.incidents = requestOptions.incidents;
  } else {
    options.params.incidents = normalizeLocationsList(
      requestOptions.incidents
    ).join(";");
  }

  if (isFeatureSet(requestOptions.facilities)) {
    options.params.facilities = requestOptions.facilities;
  } else {
    options.params.facilities = normalizeLocationsList(
      requestOptions.facilities
    ).join(";");
  }

  // optional input param that may need point geometry normalizing
  if (requestOptions.barriers) {
    if (isFeatureSet(requestOptions.barriers)) {
      options.params.barriers = requestOptions.barriers;
    } else {
      // optional point geometry barriers must be normalized, too
      // but not if provided as IFeatureSet type
      // note that optional polylineBarriers and polygonBarriers do not need to be normalized
      options.params.barriers = normalizeLocationsList(
        requestOptions.barriers
      ).join(";");
    }
  }

  return request(`${cleanUrl(endpoint)}/solveClosestFacility`, options).then(
    cleanResponse
  );
}

function cleanResponse(res: any): IClosestFacilityResponse {
  // add "geoJson" property to "routes"
  if (res.routes.spatialReference.wkid === 4326) {
    res.routes.geoJson = arcgisToGeoJSON(res.routes);
  }
  return res;
}

export default {
  closestFacility
};
