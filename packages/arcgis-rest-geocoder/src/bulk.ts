/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { ISpatialReference, IPoint } from "@esri/arcgis-rest-common-types";

import { worldGeocoder, IEndpointRequestOptions } from "./helpers";

// it'd be better if doc didnt display these properties in alphabetical order
export interface IAddressBulk {
  /**
   * A unique id must be passed along for each individual address.
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

export interface IBulkGeocodeRequestOptions extends IEndpointRequestOptions {
  addresses: IAddressBulk[];
}

export interface IBulkGeocodeResponse {
  spatialReference: ISpatialReference;
  locations: Array<{
    address: string;
    location: IPoint;
    score: number;
    attributes: object;
  }>;
}

/**
 * Used to geocode a [batch](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm) of addresses.
 *
 * ```js
 * import { bulkGeocode } from '@esri/arcgis-rest-geocoder';
 * import { ApplicationSession } from '@esri/arcgis-rest-auth';
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
 * @returns A Promise that will resolve with the data from the response.
 */
export function bulkGeocode(
  requestOptions: IBulkGeocodeRequestOptions // must POST
) {
  const options: IBulkGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    params: {
      forStorage: true,
      addresses: { records: [] }
    },
    ...requestOptions
  };

  requestOptions.addresses.forEach(address => {
    options.params.addresses.records.push({ attributes: address });
  });

  // the SAS service doesnt support anonymous requests
  if (!requestOptions.authentication && options.endpoint === worldGeocoder) {
    return Promise.reject(
      "bulk geocoding using the ArcGIS service requires authentication"
    );
  }

  return request(options.endpoint + "geocodeAddresses", options).then(
    response => {
      const sr = response.spatialReference;
      response.locations.forEach(function(address: { location: IPoint }) {
        address.location.spatialReference = sr;
      });
      return response;
    }
  );
}

export default {
  bulkGeocode
};
