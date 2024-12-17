import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl } from "./utils.js";
import { IconOptions } from "./iconOptions.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to appendCustomParams below
type queryParams = Pick<
  operations["categoriesGet"]["parameters"]["query"],
  "filter"
>;

// get the correct type of the response format
type successResponse =
  operations["categoriesGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode getCategories};
 */
export interface IGetCategoriesResponse extends successResponse {}

/**
 * Options for {@linkcode getCategories}.
 */
export interface IGetCategoriesOptions
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
 * The ArcGIS Places service has many categories (or types) of place, from
 * art museums to zoos. This endpoint returns all the categories including
 * their label and `categoryId`. The category Id can be used to search for
 * types of places with a `places/near-point` or `places/within-extent`
 * request.
 *
 * Categories also have information on their `parent`. This allows you to
 * search for specific categories such as "French Restaurant" - or to
 * look for more generic types such as "Restaurant".
 *
 * ```js
 * import { getCategories } from "@esri/arcgis-rest-places";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const response = await getCategories({
 *   authentication: ApiKeyManager.fromKey("YOUR_API_KEY")
 * });
 *
 * console.log(response.categories);
 * ```
 */
export function getCategories(
  requestOptions: IGetCategoriesOptions
): Promise<IGetCategoriesResponse> {
  const options = appendCustomParams<IGetCategoriesOptions>(
    requestOptions,
    ["filter", "icon"],
    {
      ...requestOptions
    }
  );

  return request(requestOptions.endpoint || `${baseUrl}/categories`, {
    ...options,
    httpMethod: "GET"
  });
}
