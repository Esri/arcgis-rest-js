import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl } from "./utils.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to appendCustomParams below
type queryParams = Pick<
  operations["ElevationAtPointGet"]["parameters"]["query"],
  "lon" | "lat" | "relativeTo"
>;

// get the correct type of the response format
type successResponse =
  operations["ElevationAtPointGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode findElevationAtPoint};
 */
export interface IFindElevationAtPointResponse extends successResponse {}

/**
 * Options for {@linkcode findElevationAtPoint}.
 */
export interface IFindElevationAtPointOptions
  extends Omit<IRequestOptions, "httpMethod" | "f">,
    queryParams {}

/**
 * This method returns the elevation in meters at a given longitude and latitude
 * within the WGS84 coordinate system. By default the elevation is measured with
 * respect to the Earth's mean sea level. It takes into account the local
 * variations in gravity and provides a consistent vertical reference.
 *
 * If the relativeTo query parameter is set to `ellipsoid`, the elevation will be
 * measured with respect to the ellipsoid. This is a mathematical model that
 * approximates the shape of the Earth. It does not consider local variations
 * in gravity and is commonly used in GPS positioning.
 *
 * ```
 * import { findElevationAtPoint } from "@esri/arcgis-rest-elevation";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const results = await findElevationAtPoint({
 *   lon: -179.99,
 *   lat: -85.05,
 *   authentication: ApiKeyManager.fromKey("YOUR_ACCESS_TOKEN");
 * });
 *
 * console.log(results)
 * ```
 */
export function findElevationAtPoint(
  requestOptions: IFindElevationAtPointOptions
): Promise<IFindElevationAtPointResponse> {
  const options = appendCustomParams<IFindElevationAtPointOptions>(
    requestOptions,
    ["lon", "lat", "relativeTo"],
    {
      ...requestOptions
    }
  );

  return (
    request(`${baseUrl}/elevation/at-point`, {
      ...options,
      httpMethod: "GET"
    }) as Promise<successResponse>
  ).then((response) => {
    const r: IFindElevationAtPointResponse = {
      ...response
    };

    return r;
  });
}
