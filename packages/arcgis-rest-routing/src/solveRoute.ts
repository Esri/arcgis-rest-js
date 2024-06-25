/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  ILocation,
  IPoint,
  IFeature,
  IFeatureSet
} from "@esri/arcgis-rest-request";

import {
  ARCGIS_ONLINE_ROUTING_URL,
  IEndpointOptions,
  decompressGeometry,
  isFeatureSet
} from "./helpers.js";

import { arcgisToGeoJSON } from "@terraformer/arcgis";

interface IFeatureWithCompressedGeometry extends IFeature {
  compressedGeometry?: string;
}

interface IFeatureSetWithGeoJson extends IFeatureSet {
  geoJson?: {};
}

export interface ISolveRouteOptions extends IEndpointOptions {
  /**
   * Specify two or more locations between which the route is to be found.
   */
  stops:
    | Array<IPoint | ILocation | [number, number] | [number, number, number]>
    | IFeatureSet;
}

export interface ISolveRouteResponse {
  messages: string[];
  checksum: string;
  routes: IFeatureSetWithGeoJson;
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
 * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
 *
 * ```js
 * import { solveRoute } from '@esri/arcgis-rest-routing';
 *
 * solveRoute({
 *   stops: [
 *     [-117.195677, 34.056383],
 *     [-117.918976, 33.812092],
 *    ],
 *    authentication
 * })
 *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
 * ```
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with routes and directions for the request.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm
 */
export function solveRoute(
  requestOptions: ISolveRouteOptions
): Promise<ISolveRouteResponse> {
  const options: ISolveRouteOptions = {
    endpoint: requestOptions.endpoint || ARCGIS_ONLINE_ROUTING_URL,
    params: {},
    ...requestOptions
  };

  // the SAAS service does not support anonymous requests
  if (
    !requestOptions.authentication &&
    options.endpoint === ARCGIS_ONLINE_ROUTING_URL
  ) {
    return Promise.reject(
      "Routing using the ArcGIS service requires authentication"
    );
  }

  if (isFeatureSet(requestOptions.stops)) {
    options.params.stops = requestOptions.stops;
  } else {
    const stops: string[] = requestOptions.stops.map((coords) => {
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
  }

  return request(`${cleanUrl(options.endpoint)}/solve`, options).then(
    (response) => {
      if (requestOptions.rawResponse) {
        return response;
      }
      return cleanResponse(response);
    }
  );
}

function cleanResponse(res: any): ISolveRouteResponse {
  if (res.directions && res.directions.length > 0) {
    res.directions = res.directions.map(
      (direction: {
        features: IFeatureWithCompressedGeometry[];
        routeId: number;
        routeName: string;
        summary: {};
      }) => {
        direction.features = direction.features.map(
          (feature: IFeatureWithCompressedGeometry) => {
            feature.geometry = decompressGeometry(feature.compressedGeometry);
            return feature;
          }
        );
        return direction;
      }
    );
  }

  // add "geoJson" property to "routes"
  if (res.routes.spatialReference.wkid === 4326) {
    const features = res.routes.features.map((feature: any) => {
      return {
        type: "Feature",
        geometry: arcgisToGeoJSON(feature.geometry),
        properties: Object.assign({}, feature.attributes)
      };
    });

    res.routes.geoJson = {
      type: "FeatureCollection",
      features
    };
  }
  return res;
}

export default {
  solveRoute
};
