import {
  request,
  processOptions,
  IRequestOptions
} from "@esri/arcgis-rest-request";

import { operations } from "./openapi-types.js";
import { baseUrl } from "./utils.js";
import { IconOptions } from "./iconOptions.js";

// determine the list of allowed params we want to allow as options
// this should match the array given to processOptions below
type queryParams = operations["categoriesCategoryIdGet"]["parameters"]["query"];

// get the correct type of the response format
type successResponse =
  operations["categoriesCategoryIdGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode getCategory};
 */
export interface IGetCategoryResponse extends successResponse {}

type IRequestOptionsWithoutHttpMethod = Omit<
  IRequestOptions,
  "fetchOptions"
> & {
  fetchOptions?: Omit<RequestInit, "method">;
};

/**
 * Options for {@linkcode getCategory}.
 */
export interface IGetCategoryOptions
  extends IRequestOptionsWithoutHttpMethod,
    queryParams {
  categoryId: string;
  icon?: IconOptions;
  /**
   * Override the URL. This should be the full URL to the API endpoint you want to call. Used internally by Esri staff for testing.
   * @private
   */
  endpoint?: string;
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

  const { requestOptions: options } = processOptions(requestOptions, {
    paramKeys: ["icon"],
    extractKeys: []
  });

  return request(
    requestOptions.endpoint || `${baseUrl}/categories/${categoryId}`,
    {
      ...options,
      fetchOptions: {
        ...options.fetchOptions,
        method: "GET"
      }
    }
  );
}
