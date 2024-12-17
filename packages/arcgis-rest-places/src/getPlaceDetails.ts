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
  operations["placeIdGet"]["parameters"]["query"],
  "requestedFields"
>;

// get the correct type of the response format
type successResponse =
  operations["placeIdGet"]["responses"]["200"]["content"]["application/json"];

/**
 * The response format for {@linkcode getPlace};
 */
export interface IGetPlaceResponse extends successResponse {}

/**
 * Options for {@linkcode getPlace}.
 */
export interface IGetPlaceOptions
  extends Omit<IRequestOptions, "httpMethod">,
    queryParams {
  placeId: string;
  /**
   * Override the URL. This should be the full URL to the API endpoint you want to call. Used internally by Esri staff for testing.
   * @private
   */
  endpoint?: string;
  icon?: IconOptions;
}

/**
 * Returns a single place, including additional details, such as:
 *
 * - contact details
 * - address
 * - price information
 * - user rating
 * - opening hours
 *
 * This endpoint can be used to fetch additional details for a specific
 * place, returned from a places search request.
 *
 * Note that some fields, such as opening hours, are not available for
 * every place. Where a field is not available it will be omitted from the
 * response and you will not be charged for this data.
 *
 *  ```js
 * import { getPlaceDetails } from "@esri/arcgis-rest-places";
 * import { ApiKeyManager } from "@esri/arcgis-rest-request";
 *
 * const place = getPlaceDetails({
 *   placeId: "e78051acc722c55ab11ba930d8dd7772",
 *   authentication: ApiKeyManager.fromKey("YOUR_API_KEY")
 * });
 *
 * console.log(place);
 * ```
 */
export function getPlaceDetails(
  requestOptions: IGetPlaceOptions
): Promise<IGetPlaceResponse> {
  const { placeId } = requestOptions;

  const options = appendCustomParams<IGetPlaceOptions>(
    requestOptions,
    ["requestedFields", "icon"],
    {
      ...requestOptions
    }
  );

  return request(requestOptions.endpoint || `${baseUrl}/places/${placeId}`, {
    ...options,
    httpMethod: "GET"
  });
}
