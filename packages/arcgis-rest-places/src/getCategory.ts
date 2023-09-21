import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl } from "./utils.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to appendCustomParams below
type queryParams = operations["categoriesCategoryIdGet"]["parameters"]["query"];

// get the correct type of the response format
type successResponse =
  operations["categoriesCategoryIdGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode getCategory};
 */
export interface IGetCategoryResponse extends successResponse {}

/**
 * Options for {@linkcode getCategory}.
 */
export interface IGetCategoryOptions
  extends Omit<IRequestOptions, "httpMethod">,
    queryParams {
  categoryId: string;
}

/**
 * Returns details about a single category by Id.
 *
 * ```js
 * import { getCategories } from "@esri/arcgis-rest-places";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const response = getCategory({
 *   categoryId: "10000",
 *   authentication: ApiKeyManager.fromKey("YOUR_API_KEY")
 * });
 *
 * console.log(response);
 * ```
 **/
export function getCategory(
  requestOptions: IGetCategoryOptions
): Promise<IGetCategoryResponse> {
  const { categoryId } = requestOptions;

  const options = appendCustomParams<IGetCategoryOptions>(requestOptions, [], {
    ...requestOptions
  });

  return request(`${baseUrl}/categories/${categoryId}`, {
    ...options,
    httpMethod: "GET"
  });
}
