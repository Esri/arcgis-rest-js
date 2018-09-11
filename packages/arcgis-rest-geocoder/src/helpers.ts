/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions, warn } from "@esri/arcgis-rest-request";

// https always
export const worldGeocoder =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";

export interface ILocation {
  latitude?: number;
  longitude?: number;
  lat?: number;
  long?: number;
}

// nice to have: verify custom endpoints contain 'GeocodeServer' and end in a '/'
export interface IEndpointRequestOptions extends IRequestOptions {
  /**
   * Any ArcGIS Geocoding service (example: http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer )
   */
  endpoint?: string;
}

export interface IGetGeocodeServiceResponse {
  currentVersion: number;
  serviceDescription: string;
  addressFields: any[];
  countries: string[];
  capabilities: string;
}

/**
 * Used to fetch metadata from a geocoding service.
 *
 * ```js
 * import { getGeocoderServiceInfo } from '@esri/arcgis-rest-geocoder';
 *
 * getGeocoderServiceInfo()
 *   .then((response) => {
 *     response.serviceDescription; // => 'World Geocoder'
 *   });
 * ```
 *
 * @param requestOptions - Request options can contain a custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the response.
 */
export function getGeocodeService(
  requestOptions?: IEndpointRequestOptions
): Promise<IGetGeocodeServiceResponse> {
  const url = (requestOptions && requestOptions.endpoint) || worldGeocoder;

  const options: IEndpointRequestOptions = {
    httpMethod: "GET",
    maxUrlLength: 2000,
    ...requestOptions
  };

  return request(url, options);
}

/**
 * Deprecated. Please use [`getGeocodeService()`](../getGeocodeService/) instead.
 *
 * @param requestOptions - Request options can contain a custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the response.
 */
export function serviceInfo(
  requestOptions?: IEndpointRequestOptions
): Promise<IGetGeocodeServiceResponse> {
  warn(
    "serviceInfo() will be deprecated in the next major release. please use getGeocoderServiceInfo() instead."
  );
  return getGeocodeService(requestOptions);
}

export default {
  getGeocodeService
};
