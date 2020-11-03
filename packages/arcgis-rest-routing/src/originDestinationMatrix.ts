/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IRequestOptions,
} from "@esri/arcgis-rest-request";

import {
  ILocation,
  IPoint,
  IFeature,
  IFeatureSet,
} from "@esri/arcgis-rest-types";

import {
  ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL,
  IEndpointOptions,
  normalizeLocationsList,
} from "./helpers";

import { arcgisToGeoJSON } from "@terraformer/arcgis";

export interface IOriginDestinationMatrixOptions extends IEndpointOptions {
  /**
   *  Specify the starting points from which to travel to the destinations.
   */
  origins: Array<IPoint | ILocation | [number, number]>; // TODO: but these can also be IFeatureSet; what does that mean for the type and subsequent `normalizeLocationsList()`?
  /**
   *  Specify the ending point locations to travel to from the origins.
   */
  destinations: Array<IPoint | ILocation | [number, number]>; // TODO: but these can also be IFeatureSet; what does that mean for the type and subsequent `normalizeLocationsList()`?
  /**
   *  Specify the type of output returned by the service. Defaults to "esriNAODOutputSparseMatrix".
   */
  outputType?:
    | "esriNAODOutputSparseMatrix"
    | "esriNAODOutputStraightLines"
    | "esriNAODOutputNoLines";
  barriers?: Array<IPoint | ILocation | [number, number]>;
  polylineBarriers?: IFeatureSet;
  polygonBarriers?: IFeatureSet;
  returnOrigins?: boolean;
  returnDestinations?: boolean;
  returnBarriers?: boolean;
  returnPolylineBarriers?: boolean;
  returnPolygonBarriers?: boolean;
}

interface IFeatureSetWithGeoJson extends IFeatureSet {
  geoJson?: any;
}

export interface IOriginDestinationMatrixResponse {
  messages: string[];
  /**
   *  Only present if outputType is "esriNAODOutputSparseMatrix". Full description is available at https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm#ESRI_SECTION2_114F8364507C4B56B780DFAD505270FB.
   */
  odCostMatrix?: any;
  /**
   *  Only present if outputType is "esriNAODOutputStraightLines" or "esriNAODOutputNoLines". Includes the geometry for the straight line connecting each origin-destination pair when the outputType is "esriNAODOutputStraightLines".
   */
  odLines?: IFeatureSetWithGeoJson;
  origins?: IFeatureSetWithGeoJson;
  destinations?: IFeatureSetWithGeoJson;
  barriers?: IFeatureSetWithGeoJson;
  polylineBarriers?: IFeatureSetWithGeoJson;
  polygonBarriers?: IFeatureSetWithGeoJson;
}

/**
 * ```js
 * import { originDestinationMatrix } from '@esri/arcgis-rest-routing';
 * //
 * originDestinationMatrix({
 *   origins: [
 *     [-90.404302, 38.600621],
 *     [-90.364293, 38.620427],
 *   ],
 *   destinations: [
 *     [-90.444716, 38.635501],
 *     [-90.311919, 38.633523],
 *     [-90.451147, 38.581107]
 *   ],
 *   authentication
 * })
 *   .then(response) // => { ... }
 * ```
 * Used to create an origin-destination (OD) cost matrix from multiple origins to multiple destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm) for more information.
 *
 * @param requestOptions Options to pass through to the routing service.
 * @returns A Promise that will resolve with travel time and/or distance for each origin-destination pair. It returns either odLines or odCostMatrix for this information depending on the outputType you specify.
 * @restlink https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm
 */
export function originDestinationMatrix(
  requestOptions: IOriginDestinationMatrixOptions
): Promise<IOriginDestinationMatrixResponse> {
  const endpoint =
    requestOptions.endpoint || ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL;

  requestOptions.params = {
    outputType: "esriNAODOutputSparseMatrix",
    returnOrigins: true,
    returnDestinations: true,
    returnBarriers: true,
    returnPolylineBarriers: true,
    returnPolygonBarriers: true,
    ...requestOptions.params,
  };

  const options = appendCustomParams<IOriginDestinationMatrixOptions>(
    requestOptions,
    [
      "outputType",
      "barriers",
      "polylineBarriers",
      "polygonBarriers",
      "returnOrigins",
      "returnDestinations",
      "returnBarriers",
      "returnPolylineBarriers",
      "returnPolygonBarriers",
    ]
  );

  // the SAAS service does not support anonymous requests
  if (
    !requestOptions.authentication &&
    endpoint === ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL
  ) {
    return Promise.reject(
      "Calculating the origin-destination cost matrix using the ArcGIS service requires authentication"
    );
  }

  // use a formatting helper for input params of this type: Array<IPoint | ILocation | [number, number]>
  options.params.origins = normalizeLocationsList(requestOptions.origins).join(
    ";"
  );

  options.params.destinations = normalizeLocationsList(
    requestOptions.destinations
  ).join(";");

  // point geometry barriers must be normalized, too (but not polylineBarriers or polygonBarriers)
  if (requestOptions.barriers) {
    options.params.barriers = normalizeLocationsList(
      requestOptions.barriers
    ).join(";");
  }

  return request(`${cleanUrl(endpoint)}/solveODCostMatrix`, options).then(
    function(res) {
      return cleanResponse(res, options);
    }
  );
}

function cleanResponse(
  res: any,
  options: IRequestOptions
): IOriginDestinationMatrixResponse {
  // add "geoJson" property to each response property that is an arcgis featureSet

  // res.odLines only exists and only includes geometry in this condition (out of 3 possible options.params.outputType conditions)
  if (
    options.params.outputType === "esriNAODOutputStraightLines" &&
    res.odLines &&
    res.odLines.spatialReference.wkid === 4326
  ) {
    res.odLines.geoJson = arcgisToGeoJSON(res.odLines);
  }

  if (res.origins && res.origins.spatialReference.wkid === 4326) {
    res.origins.geoJson = arcgisToGeoJSON(res.origins);
  }

  if (res.destinations && res.destinations.spatialReference.wkid === 4326) {
    res.destinations.geoJson = arcgisToGeoJSON(res.destinations);
  }

  if (res.barriers && res.barriers.spatialReference.wkid === 4326) {
    res.barriers.geoJson = arcgisToGeoJSON(res.barriers);
  }

  if (
    res.polygonBarriers &&
    res.polygonBarriers.spatialReference.wkid === 4326
  ) {
    res.polygonBarriers.geoJson = arcgisToGeoJSON(res.polygonBarriers);
  }

  if (
    res.polylineBarriers &&
    res.polylineBarriers.spatialReference.wkid === 4326
  ) {
    res.polylineBarriers.geoJson = arcgisToGeoJSON(res.polylineBarriers);
  }

  return res;
}

export default {
  originDestinationMatrix,
};
