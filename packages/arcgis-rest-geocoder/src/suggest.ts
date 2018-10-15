/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { worldGeocoder, IEndpointRequestOptions } from "./helpers";

export interface ISuggestRequestOptions extends IEndpointRequestOptions {
  /**
   * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
   * ```js
   * import { suggest, geocode } from '@esri/arcgis-rest-geocoder';
   * suggest("LAX")
   *   .then((response) => {
   *     geocode({
   *       singleLine: response.suggestions[1].text,
   *       magicKey: response.suggestions[1].magicKey
   *     })
   *   })
   * ```
   */
  magicKey?: string;
}

export interface ISuggestResponse {
  suggestions: Array<{
    text: string;
    magicKey: string;
    isCollection: boolean;
  }>;
}

/**
 * Used to return a placename [suggestion](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) for a partial string.
 *
 * ```js
 * import { suggest } from '@esri/arcgis-rest-geocoder';
 *
 * suggest("Starb")
 *   .then((response) => {
 *     response.text; // => "Starbucks"
 *   });
 * ```
 *
 * @param requestOptions - Options for the request including authentication and other optional parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export function suggest(
  partialText: string,
  requestOptions?: ISuggestRequestOptions
): Promise<ISuggestResponse> {
  const options: ISuggestRequestOptions = {
    endpoint: worldGeocoder,
    params: {},
    ...requestOptions
  };

  options.params.text = partialText;

  if (requestOptions && requestOptions.magicKey) {
    options.params.magicKey = requestOptions.magicKey;
  }

  return request(options.endpoint + "suggest", options);
}

export default {
  suggest
};
