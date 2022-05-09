/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  ISpatialReference,
  IPoint
} from "@esri/arcgis-rest-request";

import {
  ARCGIS_ONLINE_BULK_GEOCODING_URL,
  IEndpointOptions
} from "./helpers.js";

// It would be better if doc did not display these properties in alphabetical order
export interface IAddressBulk {
  /**
   * A unique id must be passed along for each individual address.
   * TRIVIAL CHANGE DELETE THIS LINE
   */
  OBJECTID: number;
  address?: string;
  address2?: string;
  address3?: string;
  neighborhood?: string;
  city?: string;
  subregion?: string;
  /**
   * The World Geocoding Service considers US states regions.
   */
  region?: string;
  postal?: number;
  postalExt?: number;
  countryCode?: string;
}

export interface IBulkGeocodeOptions extends IEndpointOptions {
  addresses: IAddressBulk[];
}

export interface IBulkGeocodeResponse {
  spatialReference: ISpatialReference;
  locations: Array<{
    address: string;
    location?: IPoint; // candidates with a score of 0 wont include a location
    score: number;
    attributes: object;
  }>;
}

/**
 * Used to geocode a [batch](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm) of addresses.
 *
 * ```js
 * import { bulkGeocode } from '@esri/arcgis-rest-geocoding';
 * import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
 *
 * const addresses = [
 *   { "OBJECTID": 1, "SingleLine": "380 New York Street 92373" },
 *   { "OBJECTID": 2, "SingleLine": "1 World Way Los Angeles 90045" }
 * ];
 *
 * bulkGeocode({ addresses, authentication: session })
 *   .then((response) => {
 *     response.locations[0].location; // => { x: -117, y: 34, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param requestOptions - Request options to pass to the geocoder, including an array of addresses and authentication session.
 * @returns A Promise that will resolve with the data from the response. The spatial reference will be added to address locations unless `rawResponse: true` was passed.
 */
export function bulkGeocode(
  requestOptions: IBulkGeocodeOptions // must POST, which is the default
): Promise<IBulkGeocodeResponse> {
  const options: IBulkGeocodeOptions = {
    endpoint: ARCGIS_ONLINE_BULK_GEOCODING_URL,
    params: {},
    ...requestOptions
  };

  options.params.addresses = {
    records: requestOptions.addresses.map((address) => {
      return { attributes: address };
    })
  };

  // the SAS service does not support anonymous requests
  if (
    !requestOptions.authentication &&
    options.endpoint === ARCGIS_ONLINE_BULK_GEOCODING_URL
  ) {
    return Promise.reject(
      "bulk geocoding using the ArcGIS service requires authentication"
    );
  }

  return request(
    `${cleanUrl(options.endpoint)}/geocodeAddresses`,
    options
  ).then((response) => {
    if (options.rawResponse) {
      return response;
    }
    const sr = response.spatialReference;
    response.locations.forEach(function (address: { location: IPoint }) {
      if (address.location) {
        address.location.spatialReference = sr;
      }
    });
    return response;
  });
}
