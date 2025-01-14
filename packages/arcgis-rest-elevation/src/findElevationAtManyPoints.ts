import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl, isValidLatitude, isValidLongitude } from "./utils.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to appendCustomParams below
type queryParams = Pick<
  operations["ElevationAtManyPointsPost"]["requestBody"]["content"]["application/json"],
  "coordinates" | "relativeTo"
>;

// get the correct type of the response format
type successResponse =
  operations["ElevationAtManyPointsPost"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode findElevationAtPoint};
 */
export interface IFindElevationAtManyPointsResponse extends successResponse {}

/**
 * Options for {@linkcode findElevationAtPoint}.
 */
export interface IFindElevationAtManyPointsOptions
  extends Omit<IRequestOptions, "httpMethod" | "f">,
    queryParams {}

/**
 * This method returns elevations in meters at given longitudes and latitudes
 * within the WGS84 coordinate system. The order of the points returned by this
 * request will be the same as the order of the points passed in the coordinates
 * parameter.
 *
 * If the distance between the furthest West and furthest East coordinate or
 * the furthest North and furthest South coordinate exceeds 50km, the service
 * will return a 400 HTTP response as the distance between these points is too
 * large.
 *
 * By default the elevation is measured with respect to the Earth's mean sea level.
 * It takes into account the local variations in gravity and provides a consistent
 * vertical reference.
 *
 * If the relativeTo query parameter is set to `ellipsoid`, the elevation will be
 * measured with respect to the ellipsoid. This is a mathematical model that
 * approximates the shape of the Earth. It does not consider local variations
 * in gravity and is commonly used in GPS positioning.
 *
 * ```
 * import { findElevationAtManyPoints } from "@esri/arcgis-rest-elevation";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const results = await findElevationAtManyPoints({
 *   coordinates: [[31.134167, 29.979167], [31.130833, 29.976111], [31.128333, 29.9725]],
 *   authentication: ApiKeyManager.fromKey("YOUR_ACCESS_TOKEN");
 * });
 *
 * console.log(results)
 * ```
 */
export function findElevationAtManyPoints(
  requestOptions: IFindElevationAtManyPointsOptions
): Promise<IFindElevationAtManyPointsResponse> {
  return (
    request(`${baseUrl}/elevation/at-many-points`, {
      ...requestOptions,
      params: {
        coordinates: JSON.stringify(requestOptions.coordinates),
        relativeTo: requestOptions.relativeTo
      }
    }) as Promise<successResponse>
  ).then((response) => {
    const r: IFindElevationAtManyPointsResponse = {
      ...response
    };

    return r;
  });
}
