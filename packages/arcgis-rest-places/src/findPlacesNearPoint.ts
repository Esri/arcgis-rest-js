import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl, hasNextPage, getNextPageParams } from "./utils.js";
import { IconOptions } from "./iconOptions.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to appendCustomParams below
type queryParams = Pick<
  operations["nearPointGet"]["parameters"]["query"],
  "x" | "y" | "radius" | "categoryIds" | "pageSize" | "offset" | "searchText"
>;

// get the correct type of the response format
type successResponse =
  operations["nearPointGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode findPlacesNearPoint};
 */
export interface IFindPlacesNearPointResponse extends successResponse {
  nextPage?: () => Promise<IFindPlacesNearPointResponse>;
}

/**
 * Options for {@linkcode findPlacesNearPoint}.
 */
export interface IFindPlacesNearPointOptions
  extends Omit<IRequestOptions, "httpMethod" | "f">,
    queryParams {
  /**
   * Override the URL. This should be the full URL to the API endpoint you want to call. Used internally by Esri staff for testing.
   * @private
   */
  endpoint?: string;
  icon?: IconOptions;
}

/**
 * Searches places that are within a given radius of a geographic point.
 * You must supply the `x` and `y` coordinates of the point that you wish
 * to search from. You can either specify a search radius, or use the
 * default (500 meters).  You could use this method to search for places
 * around a user's GPS position, or a location clicked on a map.
 *
 * The returned places contain basic data such as name, category and
 * location. You can use the {@linkcode getPlace} method to get additional
 * details for a given place.
 *
 * You can refine the results by supplying additional search parameters,
 * including:
 *
 * - A list of category Ids, see {@linkcode searchCategories} or {@linkcode getCategories}.
 * - A partial name filter with `name` option
 *
 * As this request can return many results, pagination is supported.
 * When a query results in more than [pageSize] places, the response will contain the property
 * `pagination` in addition to place results. If `pagination` exists, an additional method
 * `response.nextPage()` can be used to get the next page of results.
 *
 * ```js
 * import { findPlacesNearPoint } from "@esri/arcgis-rest-places";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const response = await findPlacesNearPoint({
 *   x: -3.1883,
 *   y: 55.9533,
 *   radius: 100,
 *   authentication: ApiKeyManager.fromKey("YOUR_API_KEY");
 * });
 *
 * console.log(response);
 * ```
 */
export function findPlacesNearPoint(
  requestOptions: IFindPlacesNearPointOptions
): Promise<IFindPlacesNearPointResponse> {
  const options = appendCustomParams<IFindPlacesNearPointOptions>(
    requestOptions,
    [
      "x",
      "y",
      "radius",
      "categoryIds",
      "pageSize",
      "offset",
      "searchText",
      "icon"
    ],
    {
      ...requestOptions
    }
  );

  return (
    request(requestOptions.endpoint || `${baseUrl}/places/near-point`, {
      ...options,
      httpMethod: "GET"
    }) as Promise<successResponse>
  ).then((response) => {
    const r: IFindPlacesNearPointResponse = {
      ...response
    };

    if (hasNextPage(response)) {
      r.nextPage = () => {
        const nextOptions = {
          ...requestOptions,
          ...getNextPageParams(requestOptions.offset, requestOptions.pageSize)
        };
        return findPlacesNearPoint(nextOptions);
      };
    }

    return r;
  });
}
