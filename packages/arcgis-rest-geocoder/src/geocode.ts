/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  appendCustomParams,
  cleanUrl,
  IParams
} from "@esri/arcgis-rest-request";

import {
  IExtent,
  ISpatialReference,
  IPoint
} from "@esri/arcgis-rest-common-types";

import { worldGeocoder, IEndpointRequestOptions } from "./helpers";

// unused, will be removed in v2.0.0
export interface IGeocodeParams extends IParams {
  /**
   * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
   * ```js
   * import { suggest, geocode } from '@esri/arcgis-rest-geocoder';
   * suggest("LAX")
   *   .then((response) => {
   *     geocode({
   *       singleLine: response.suggestions[1].text,
   *       magicKey: response.suggestions[0].magicKey
   *     })
   *   })
   * ```
   */
  magicKey?: string;
}

export interface IGeocodeRequestOptions extends IEndpointRequestOptions {
  /**
   * use this if all your address info is contained in a single string.
   */
  singleLine?: string;
  address?: string;
  address2?: string;
  address3?: string;
  neighborhood?: string;
  city?: string;
  subregion?: string;
  /**
   * The World Geocoding Service expects US states to be passed in as a 'region'.
   */
  region?: string;
  postal?: number;
  postalExt?: number;
  countryCode?: string;
  /**
   * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
   * ```js
   * import { suggest, geocode } from '@esri/arcgis-rest-geocoder';
   * suggest("LAX")
   *   .then((response) => {
   *     geocode({
   *       singleLine: response.suggestions[1].text,
   *       magicKey: response.suggestions[0].magicKey
   *     })
   *   })
   * ```
   */
  magicKey?: string;
}

export interface IGeocodeResponse {
  spatialReference: ISpatialReference;
  candidates: Array<{
    address: string;
    location: IPoint;
    extent?: IExtent;
    score: number;
    attributes: object;
  }>;
}

/**
 * ```js
 * import { geocode } from '@esri/arcgis-rest-geocoder';
 * //
 * geocode("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: ...  }
 *   });
 * //
 * geocode({
 *   address: "1600 Pennsylvania Ave",
 *   postal: 20500,
 *   countryCode: "USA"
 * })
 *   .then((response) => {
 *     response.candidates[1].location; // => { x: -77.036533, y: 38.898719, spatialReference: ... }
 *   });
 * ```
 * Used to determine the location of a single address or point of interest. See the [REST Documentation](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm) for more information.
 * @param address String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with address candidates for the request. The spatial reference will be added to candidate locations and extents unless `rawResponse: true` was passed.
 */
export function geocode(
  address: string | IGeocodeRequestOptions
): Promise<IGeocodeResponse> {
  let options: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    params: {}
  };

  if (typeof address === "string") {
    options.params.singleLine = address;
  } else {
    options.endpoint = address.endpoint || worldGeocoder;
    options = {
      ...options,
      ...address
    };

    appendCustomParams(address, options);
  }

  // add spatialReference property to individual matches
  return request(
    `${cleanUrl(options.endpoint)}/findAddressCandidates`,
    options
  ).then(response => {
    if (options.rawResponse) {
      return response;
    }
    const sr = response.spatialReference;
    response.candidates.forEach(function(candidate: {
      location: IPoint;
      extent?: IExtent;
    }) {
      candidate.location.spatialReference = sr;
      if (candidate.extent) {
        candidate.extent.spatialReference = sr;
      }
    });
    return response;
  });
}

export default {
  geocode
};
