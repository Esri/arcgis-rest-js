/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
} from "@esri/arcgis-rest-request";

import {
  ILocation,
  IPoint,
  IFeature,
  IFeatureSet,
} from "@esri/arcgis-rest-types";

import {
  ARCGIS_ONLINE_SERVICE_AREA_URL,
  IEndpointOptions,
  normalizeLocationsList,
  isFeatureSet,
} from "./helpers";

import { arcgisToGeoJSON } from "@terraformer/arcgis";

export interface IServiceAreaOptions extends IEndpointOptions {
  /**
   *  Specify one or more locations around which service areas are generated.
   */
  facilities: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
  /**
   *  Specify if the service should return routes.
   */
  travelDirection?: "incidentsToFacilities" | "facilitiesToIncidents";
  barriers?: Array<IPoint | ILocation | [number, number]> | IFeatureSet;
  polylineBarriers?: IFeatureSet;
  polygonBarriers?: IFeatureSet;
  outputLines?: boolean;
  returnFacilities?: boolean;
  returnBarriers?: boolean;
  returnPolylineBarriers?: boolean;
  returnPolygonBarriers?: boolean;
  preserveObjectID?: boolean;
}

interface IFeatureSetWithGeoJson extends IFeatureSet {
  geoJson?: any;
}

export interface IServiceAreaResponse {
  messages: string[];
  saPolygons?: IFeatureSetWithGeoJson;
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
 * import { serviceArea } from '@esri/arcgis-rest-routing';
 * //
 * serviceArea({
 *   facilities: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 * Used to find the area that can be reached from the input location within a given travel time or travel distance. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm) for more information.
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with service area polygons for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm
 */
export function serviceArea(
  requestOptions: IServiceAreaOptions
): Promise<IServiceAreaResponse> {
  const endpoint = requestOptions.endpoint || ARCGIS_ONLINE_SERVICE_AREA_URL;

  requestOptions.params = {
    returnFacilities: true,
    returnBarriers: true,
    returnPolylineBarriers: true,
    returnPolygonBarriers: true,
    preserveObjectID: true,
    ...requestOptions.params,
  };

  const options = appendCustomParams<IServiceAreaOptions>(requestOptions, [
    "barriers",
    "polylineBarriers",
    "polygonBarriers",
    "outputLines",
    "returnFacilities",
    "returnBarriers",
    "returnPolylineBarriers",
    "returnPolygonBarriers",
    "preserveObjectID",
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
    endpoint === ARCGIS_ONLINE_SERVICE_AREA_URL
  ) {
    return Promise.reject(
      "Finding service areas using the ArcGIS service requires authentication"
    );
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

  return request(`${cleanUrl(endpoint)}/solveServiceArea`, options).then(
    cleanResponse
  );
}

function cleanResponse(res: any): IServiceAreaResponse {
  // remove "fieldAliases" because it does not do anything.
  delete res.saPolygons.fieldAliases;

  // add "geoJson" property to "saPolygons"
  if (res.saPolygons.spatialReference.wkid === 4326) {
    res.saPolygons.geoJson = arcgisToGeoJSON(res.saPolygons);
  }
  return res;
}

export default {
  serviceArea,
};
