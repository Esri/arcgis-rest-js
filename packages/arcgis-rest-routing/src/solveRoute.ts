/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import {
  ISpatialReference,
  IPoint,
  IFeature
} from "@esri/arcgis-rest-common-types";

import {
  worldRoutingService,
  ILocation,
  IEndpointRequestOptions
} from "./helpers";

export interface ISolveRouteRequestOptions extends IEndpointRequestOptions {
  stops: Array<IPoint | ILocation | [number, number]>;
  travelMode?: string;
  barriers?: string[];
  endpoint?: string;
}

export interface ISolveRouteResponse {
  messages: string[];
  checksum: string;
  routes: {
    fieldAliases: object;
    geometryType: string;
    spatialReference: ISpatialReference;
    features: IFeature[];
  };
  directions?: Array<{
    routeId: number;
    routeName: string;
    summary: object;
    features: IFeature[];
  }>;
}

function isLocationArray(
  coords: ILocation | IPoint | [number, number]
): coords is [number, number] {
  return (coords as [number, number]).length === 2;
}

function isLocation(
  coords: ILocation | IPoint | [number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}

/**
 * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
 *
 * ```js
 *   import { solveRoute } from '@esri/arcgis-rest-routing';
 *   import { ApplicationSession } from '@esri/arcgis-rest-auth';
 *
 *   solveRoute({
 *      stops: [
 *        {
 *          latitude: 34.056383,
 *          longitude: -117.195677
 *        },
 *        {
 *          latitude: 33.812092,
 *          longitude: -117.918976
 *        }
 *      ],
 *      authentication: session
 *   })
 *   .then((response) => {
 *     response.routes.features; // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}}
 *   });
 * ```
 *
 * @param address String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with routes and directions for the request.
 */
export function solveRoute(
  requestOptions: ISolveRouteRequestOptions
): Promise<ISolveRouteResponse> {
  const options: ISolveRouteRequestOptions = {
    endpoint: requestOptions.endpoint || worldRoutingService,
    params: {},
    ...requestOptions
  };

  // the SAAS service does not support anonymous requests
  if (
    !requestOptions.authentication &&
    options.endpoint === worldRoutingService
  ) {
    return Promise.reject(
      "Routing using the ArcGIS service requires authentication"
    );
  }

  const stops: string[] = requestOptions.stops.map(coords => {
    if (isLocationArray(coords)) {
      return coords.join();
    } else if (isLocation(coords)) {
      if (coords.lat) {
        return coords.long + "," + coords.lat;
      } else if (coords.latitude) {
        return coords.longitude + "," + coords.latitude;
      }
    } else {
      return coords.y + "," + coords.x;
    }
  });
  options.params.stops = stops.join(";");

  return request(options.endpoint + "solve", options);
}

export default {
  solveRoute
};
