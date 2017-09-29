/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/*
to do:
verify custom endpoints contain 'GeocodeServer' and end in a '/'
*/
import { request, IRequestOptions, IParams } from "@esri/arcgis-rest-request";

import {
  IExtent,
  ISpatialReference,
  IPoint
} from "@esri/arcgis-rest-common-types";

// https always
const worldGeocoder =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";

// it'd be better if doc didnt display these properties in alphabetical order
export interface IAddress {
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

export interface IAddressBulk extends IAddress {
  /**
   * A unique id must be passed along for each individual address.
   */
  OBJECTID: number;
}

// not using this, yet....
export interface ILocation {
  latitude?: number;
  longitude?: number;
  lat?: number;
  long?: number;
}

function isLocationArray(
  coords: ILocation | IPoint | [number, number]
): coords is [number, number] {
  return (coords as [number, number]).length === 2;
}

function isLocation(
  coords: ILocation | IPoint | [number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}

export interface IGeocodeParams extends IParams {
  /**
   * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
   * ```js
   * import { suggest, geocode } from '@esri/arcgis-geocoder';
   * suggest("LAX")
   *   .then((response) => {
   *     response.suggestions[2].magicKey; // =>  "dHA9MCNsb2M9Mjk3ODc2MCNsbmc9MzMjcGw9ODkxNDg4I2xicz0xNDoxNDc4MTI1MA=="
   *   });
   * geocode("LAX, 1 World Way, Los Angeles, CA, 90045, USA", {magicKey: "dHA9MCN..."})
   * ```
   */
  magicKey?: string;
}

export interface IGeocodeRequestOptions extends IRequestOptions {
  /**
   * Any ArcGIS Geocoding service (example: http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer )
   */
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
 * import { geocode } from '@esri/arcgis-geocoder';
 *
 * geocode("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: { wkid: 4326 }  }
 *   });
 *
 * geocode({address: "1600 Pennsylvania Ave", postal: 20500}, { countryCode: "USA" })
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -77.036533, y: 38.898719, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param address | String or IAddress representing the address or Point of Interest to pass to the endpoint.
 * @param requestParams - Other arguments to pass to the endpoint.
 * @param requestOptions - Additional options for the request including authentication.
 * @returns A Promise that will resolve with the address candidates for the request.
 */
export function geocode(
  address: IAddress | string,
  requestParams?: IGeocodeParams,
  requestOptions?: IGeocodeRequestOptions
): Promise<IGeocodeResponse> {
  const { endpoint }: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    ...requestOptions
  };

  let params: IParams = {
    ...requestParams
  };

  // replace with ternary operator?
  if (typeof address === "string") {
    params.singleLine = address;
  } else {
    params = { ...address, ...params };
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
 * Used to return a placename suggestion for a partial string
 *
 * ```js
 * import { suggest } from '@esri/arcgis-geocoder';
 *
 * suggest("Starb")
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
    endpoint: worldGeocoder,
    ...requestOptions
  };

  const params: IParams = {
    text: partialText,
    ...requestParams
  };

  return request(endpoint + "suggest", params, requestOptions);
}

/**
 * Used to determine the address of a location.
 *
 * ```js
 * import { reverseGeocode } from '@esri/arcgis-geocoder';
 *
 * // long, lat
 * reverseGeocode([-118.409,33.943 ])
 *   .then((response) => {
 *     response.address.PlaceName; // => "LA Airport"
 *   });
 *
 * // or
 * reverseGeocode({ long: -118.409, lat: 33.943 })
 * reverseGeocode({ latitude: 33.943, latitude: -118.409 })
 * reverseGeocode({ x: -118.409, y: 33.9425 }) // wgs84 is assumed
 * reverseGeocode({ x: -13181226, y: 4021085, spatialReference: { wkid: 3857 })
 * ```
 *
 * @param params - The parameters to pass to the endpoint.
 * @returns A Promise that will resolve with the data from the request.
 */
export function reverseGeocode(
  coords: IPoint | ILocation | [number, number],
  requestParams?: IParams,
  requestOptions?: IGeocodeRequestOptions
): Promise<IReverseGeocodeResponse> {
  const { endpoint }: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    ...requestOptions
  };

  const params: IParams = {
    location: null,
    ...requestParams
  };

  if (isLocationArray(coords)) {
    params.location = coords.join();
  } else if (isLocation(coords)) {
    if (coords.lat) {
      params.location = coords.long + "," + coords.lat;
    }
    if (coords.latitude) {
      params.location = coords.longitude + "," + coords.latitude;
    }
  } else {
    // if input is a point, we can pass it straight through, with or without an sr
    params.location = coords;
  }

  return request(endpoint + "reverseGeocode", params, requestOptions);
}

/**
 * Used to geocode a batch of addresses
 *
 * ```js
 * import { bulkGeocode } from '@esri/arcgis-geocoder';
 * import { ApplicationSession } from '@esri/arcgis-auth';
 *
 * var addresses = [
 *   { "OBJECTID": 1, "SingleLine": "380 New York Street 92373" },
 *   { "OBJECTID": 2, "SingleLine": "1 World Way Los Angeles 90045" }
 * ];
 *
 * bulkGeocode(addresses, { authentication: session })
 *   .then((response) => {
 *     response.locations[0].location; // => { x: -117, y: 34, spatialReference: { wkid: 4326 } }
 *   });
 * ```
 *
 * @param params - The parameters to pass to the geocoder.
 * @param requestOptions - Additional options to pass to the geocoder.
 * @returns A Promise that will resolve with the data from the request.
 */
export function bulkGeocode(
  addresses: IAddressBulk[],
  requestOptions: IGeocodeRequestOptions, // POST by default (always)
  requestParams?: IParams
) {
  // passing authentication is mandatory
  const { endpoint }: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    ...requestOptions
  };

  const params: IParams = {
    forStorage: true,
    addresses: { records: null },
    ...requestParams
  };

  const parsedAddresses: any[] = [];

  addresses.forEach(address => {
    parsedAddresses.push({ attributes: address });
  });

  params.addresses.records = parsedAddresses;

  if (!requestOptions.authentication) {
    return Promise.reject("bulk geocoding requires authentication");
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
 * import { serviceInfo } from '@esri/arcgis-geocoder';
 *
 * serviceInfo()
 *   .then((response) => {
 *     response.serviceDescription; // => 'World Geocoder'
 *   });
 * ```
 *
 * @param IGeocodeRequestOptions - A custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the request.
 */
export function serviceInfo(
  requestOptions?: IGeocodeRequestOptions
): Promise<IGeocodeServiceInfoResponse> {
  const url = (requestOptions && requestOptions.endpoint) || worldGeocoder;
  return request(url, {}, requestOptions);
}

export default {
  geocode,
  suggest,
  reverseGeocode,
  bulkGeocode,
  serviceInfo
};
