/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IParams } from "@esri/arcgis-rest-request";

import {
  IExtent,
  ISpatialReference,
  IPoint
} from "@esri/arcgis-rest-common-types";

import { worldGeocoder, IEndpointRequestOptions } from "./helpers";

export interface IGeocodeParams extends IParams {
  /**
   * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
   * ```js
   * import { suggest, geocode } from '@esri/arcgis-rest-geocoder';
   * suggest("LAX")
   *   .then((response) => {
   *     response.suggestions[2].magicKey; // =>  "dHA9MCNsb2M9Mjk3ODc2MCNsbmc9MzMjcGw9ODkxNDg4I2xicz0xNDoxNDc4MTI1MA=="
   *   });
   * geocode("LAX, 1 World Way, Los Angeles, CA, 90045, USA", {magicKey: "dHA9MCN..."})
   * ```
   */
  magicKey?: string;
}

export interface IGeocodeRequestOptions extends IEndpointRequestOptions {
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
}

export interface IGeocodeResponse {
  spatialReference: ISpatialReference;
  candidates: Array<{
    address: string;
    location: IPoint;
    extent: IExtent;
    attributes: object;
  }>;
}

/**
 * Used to determine the [location](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm)  of a single address or point of interest.
 *
 * ```js
 * import { geocode } from '@esri/arcgis-rest-geocoder';
 *
 * geocode("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: { wkid: 4326 }  }
 *   });
 *
 * geocode({
 *   params: {
 *     address: "1600 Pennsylvania Ave",
 *     postal: 20500,
 *     countryCode: "USA"
 *   }
 * })
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -77.036533, y: 38.898719, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param address String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with address candidates for the request.
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
  }

  // add spatialReference property to individual matches
  return request(options.endpoint + "findAddressCandidates", options).then(
    response => {
      const sr = response.spatialReference;
      response.candidates.forEach(function(candidate: {
        location: IPoint;
        extent: IExtent;
      }) {
        candidate.location.spatialReference = sr;
        candidate.extent.spatialReference = sr;
      });
      return response;
    }
  );
}

export default {
  geocode
};
