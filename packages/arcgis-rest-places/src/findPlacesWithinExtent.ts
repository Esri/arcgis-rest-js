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
  operations["withinExtentGet"]["parameters"]["query"],
  | "xmin"
  | "ymin"
  | "xmax"
  | "ymax"
  | "categoryIds"
  | "pageSize"
  | "offset"
  | "searchText"
>;

// get the correct type of the response format
type successResponse =
  operations["withinExtentGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode findPlacesWithinExtent};
 */
export interface IFindPlacesWithinExtentResponse extends successResponse {
  nextPage?: () => Promise<IFindPlacesWithinExtentResponse>;
}

/**
 * Options for {@linkcode findPlacesNearPoint}.
 */
export interface IFindPlaceWithinExtentOptions
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
 * Searches the world-wide set of places for those that are within an
 * extent, or bounding box. You must supply the `xmin`, `ymin`, `xmax` and
 * `ymax` coordinates of the extent. You could use this endpoint to search
 * for places in the visible extent of a user's screen.
 *
 * The returned places contain basic data such as name, category and
 * location. You can use the {@linkcode getPlace} method to get additional
 * details for a given place.
 *
 * You can also refine the results by supplying additional search parameters,
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
 * ```
 * import { findPlacesWithinExtent } from "@esri/arcgis-rest-places";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const results = await findPlacesWithinExtent({
 *   xmin: -118.013334,
 *   ymin: 33.78193,
 *   xmax: -117.795753,
 *   ymax: 33.873337,
 *   categoryIds: ["13002"],
 *   authentication: ApiKeyManager.fromKey("YOUR_API_KEY")
 * });
 *
 * console.log(results)
 * ```
 */
export function findPlacesWithinExtent(
  requestOptions: IFindPlaceWithinExtentOptions
): Promise<IFindPlacesWithinExtentResponse> {
  const options = appendCustomParams<IFindPlaceWithinExtentOptions>(
    requestOptions,
    [
      "xmin",
      "ymin",
      "xmax",
      "ymax",
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
    request(requestOptions.endpoint || `${baseUrl}/places/within-extent`, {
      ...options,
      httpMethod: "GET"
    }) as Promise<successResponse>
  ).then((response) => {
    const r: IFindPlacesWithinExtentResponse = {
      ...response
    };

    if (hasNextPage(response)) {
      r.nextPage = () => {
        const nextOptions = {
          ...requestOptions,
          ...getNextPageParams(requestOptions.offset, requestOptions.pageSize)
        };
        return findPlacesWithinExtent(nextOptions);
      };
    }
    return r;
  });
}
