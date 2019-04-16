/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  ILocation,
  ISpatialReference,
  IPoint,
  IFeature
} from "@esri/arcgis-rest-request";

import { worldRoutingService, IEndpointRequestOptions } from "./helpers";

export interface ISolveRouteRequestOptions extends IEndpointRequestOptions {
  /**
   * Specify two or more locations between which the route is to be found.
   */
  stops: Array<
    IPoint | ILocation | [number, number] | [number, number, number]
  >;
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
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is [number, number] | [number, number, number] {
  return (
    (coords as [number, number]).length === 2 ||
    (coords as [number, number, number]).length === 3
  );
}

function isLocation(
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}

/**
 * ```js
 * import { solveRoute } from '@esri/arcgis-rest-routing';
 * //
 * solveRoute({
 *   stops: [
 *     [-117.195677, 34.056383],
 *     [-117.918976, 33.812092],
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
 *
 * @param requestOptions Options to pass through to the routing service.
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
        return (
          coords.long + "," + coords.lat + (coords.z ? "," + coords.z : "")
        );
      } else {
        return (
          coords.longitude +
          "," +
          coords.latitude +
          (coords.z ? "," + coords.z : "")
        );
      }
    } else {
      return coords.x + "," + coords.y + (coords.z ? "," + coords.z : "");
    }
  });
  options.params.stops = stops.join(";");

  return request(`${cleanUrl(options.endpoint)}/solve`, options);
}

export default {
  solveRoute
};
