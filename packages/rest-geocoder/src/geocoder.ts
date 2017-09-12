/*
to do:
verify custom endpoints contain 'GeocodeServer' and end in a '/'
*/
import { request, IRequestOptions, IParams } from "@esri/rest-request";

import { IExtent, ISpatialReference, IPoint } from "@esri/rest-common-types";

// https always
const worldGeocoder =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";

export interface IGeocodeRequestOptions extends IRequestOptions {
  endpoint?: string;
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

export interface IReverseGeocodeResponse {
  address: {
    [key: string]: any;
  };
  location: IPoint;
}

export interface ISuggestResponse {
  suggestions: Array<{
    text: string;
    magicKey: string;
    isCollection: boolean;
  }>;
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

export interface IGeocodeServiceInfoResponse {
  currentVersion: number;
  serviceDescription: string;
  addressFields: any[];
  countries: string[];
  capabilities: string;
}

/**
 * Used to determine the location of a single address or point of interest
 *
 * ```js
 * import EsriRestGeocoder from '@esri/arcgis-geocoder';
 *
 * EsriRestGeocoder.single("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: { wkid: 4326 }  }
 *   });
 *
 * EsriRestGeocoder.single("Disneyland", { countryCode: "FRA" })
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: 2.796, y: 8.876, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param string - Address or POI to pass to the endpoint.
 * @param requestParams - Other arguments to pass to the endpoint.
 * @param requestOptions - Additional options for the request including authentication.
 * @returns A Promise that will resolve with the address candidates for the request.
 */
export function single(
  text?: string,
  requestParams?: IParams,
  requestOptions?: IGeocodeRequestOptions
): Promise<IGeocodeResponse> {
  const { endpoint }: IGeocodeRequestOptions = {
    ...{ endpoint: worldGeocoder },
    ...requestOptions
  };

  const params: IParams = {
    ...{ singleLine: null },
    ...requestParams
  };

  if (text) {
    params.singleLine = text;
  }

  // add spatialReference property to individual matches
  return request(
    endpoint + "findAddressCandidates",
    params,
    requestOptions
  ).then(response => {
    const sr = response.spatialReference;
    response.candidates.forEach(function(candidate: {
      location: IPoint;
      extent: IExtent;
    }) {
      candidate.location.spatialReference = sr;
      candidate.extent.spatialReference = sr;
    });
    return response;
  });
}

/**
 * Used to determine the address of a location.
 *
 * ```js
 * import EsriRestGeocoder from '@esri/arcgis-geocoder';
 *
 * // expects coordinates in longitude, latitude (XY) order
 * EsriRestGeocoder.reverse([-118.409, 33.943])
 *   .then((response) => {
 *     response.address.PlaceName; // => "LA Airport"
 *   });
 * ```
 *
 * @param params - The parameters to pass to the endpoint.
 * @returns A Promise that will resolve with the data from the request.
 */
export function reverse(
  lngLat?: number[],
  requestParams?: IParams,
  requestOptions?: IGeocodeRequestOptions
): Promise<IReverseGeocodeResponse> {
  const { endpoint }: IGeocodeRequestOptions = {
    ...{ endpoint: worldGeocoder },
    ...requestOptions
  };

  const params: IParams = {
    ...{ location: null },
    ...requestParams
  };

  if (lngLat) {
    params.location = lngLat[0] + "," + lngLat[1];
  }

  return request(endpoint + "reverseGeocode", params, requestOptions);
}

/**
 * Used to return a placename suggestion for a partial string
 *
 * ```js
 * import EsriRestGeocoder from '@esri/arcgis-geocoder';
 *
 * EsriRestGeocoder.suggest("Starb")
 *   .then((response) => {
 *     response.address.PlaceName; // => "Starbucks"
 *   });
 * ```
 *
 * @param partialText - The string to pass to the endpoint.
 * @param requestOptions - Additional options for the request including authentication.
 * @param params - Additional parameters to pass to the endpoint.
 * @returns A Promise that will resolve with the data from the request.
 */
export function suggest(
  partialText: string,
  requestParams?: IParams,
  requestOptions?: IGeocodeRequestOptions
): Promise<ISuggestResponse> {
  const { endpoint }: IGeocodeRequestOptions = {
    ...{ endpoint: worldGeocoder },
    ...requestOptions
  };

  const params: IParams = {
    ...{ text: partialText },
    ...requestParams
  };

  return request(endpoint + "suggest", params, requestOptions);
}

/**
 * Used to geocode a set of addresses in bulk
 *
 * ```js
 * import EsriRestGeocoder from '@esri/arcgis-geocoder';
 *
 * var addresses = [
 *   {
 *     "attributes": { "OBJECTID": 1, "SingleLine": "380 New York Street 92373" }
 *   },
 *   {
 *     "attributes": { "OBJECTID": 2, "SingleLine": "1 World Way Los Angeles 90045" }
 *   }
 *  }];
 *
 *  EsriRestGeocoder.bulk(addresses, { authentication: session })
 *    .then((response) => {
 *      response.locations[0].location; // => { x: -117, y: 34, spatialReference: { wkid: 4326 } }
 *    });
 * ```
 *
 * @param params - The parameters to pass to the geocoder.
 * @param requestOptions - Additional options to pass to the geocoder.
 * @returns A Promise that will resolve with the data from the request.
 */
export function bulk(
  addresses: object[],
  requestOptions: IGeocodeRequestOptions, // POST by default (always)
  requestParams?: IParams
) {
  // passing authentication is mandatory
  const { endpoint }: IGeocodeRequestOptions = {
    ...{ endpoint: worldGeocoder },
    ...requestOptions
  };

  const params: IParams = {
    ...{ forStorage: true, addresses: { records: addresses } },
    ...requestParams
  };

  if (!requestOptions.authentication) {
    return Promise.reject("bulk geocoding requests require authentication");
  }

  return request(
    endpoint + "geocodeAddresses",
    params,
    requestOptions
  ).then(response => {
    const sr = response.spatialReference;
    response.locations.forEach(function(address: { location: IPoint }) {
      address.location.spatialReference = sr;
    });
    return response;
  });
}

/**
 * Used to fetch metadata from a geocoding service.
 *
 * ```js
 * import EsriRestGeocoder from '@esri/arcgis-geocoder';
 *
 * EsriRestGeocoder.serviceInfo()
 *   .then((response) => {
 *     response.serviceDescription; // => 'World Geocoder'
 *   });
 * ```
 *
 * @param endpoint - A custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the request.
 */
export function serviceInfo(
  endpoint?: string,
  requestOptions?: IRequestOptions
): Promise<IGeocodeServiceInfoResponse> {
  const url = endpoint || worldGeocoder;
  return request(url, {}, requestOptions);
}
