/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

// https always
export const ARCGIS_ONLINE_GEOCODING_URL =
  "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
export const ARCGIS_ONLINE_BULK_GEOCODING_URL =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";

// nice to have: verify custom endpoints contain 'GeocodeServer' and end in a '/'
export interface IEndpointOptions extends IRequestOptions {
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
 * import { getGeocoderServiceInfo } from '@esri/arcgis-rest-geocoding';
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
  requestOptions?: IEndpointOptions
): Promise<IGetGeocodeServiceResponse> {
  const url =
    (requestOptions && requestOptions.endpoint) || ARCGIS_ONLINE_GEOCODING_URL;

  const options: IEndpointOptions = {
    httpMethod: "GET",
    maxUrlLength: 2000,
    ...requestOptions
  };

  return request(url, options);
}
