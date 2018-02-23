/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions, IParams } from "@esri/arcgis-rest-request";
import { IAuthenticatedRequestOptions } from "@esri/arcgis-rest-auth";

import {
  Extent,
  SpatialReferenceWkid,
  Point
} from "@esri/arcgis-rest-common-types";

// https always
const worldGeocoder =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";

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

export interface Location {
  latitude?: number;
  longitude?: number;
  lat?: number;
  long?: number;
}

function isLocationArray(
  coords: Location | Point | [number, number]
): coords is [number, number] {
  return (coords as [number, number]).length === 2;
}

function isLocation(
  coords: Location | Point | [number, number]
): coords is Location {
  return (
    (coords as Location).latitude !== undefined ||
    (coords as Location).lat !== undefined
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

// nice to have: verify custom endpoints contain 'GeocodeServer' and end in a '/'
export interface IEndpointRequestOptions extends IRequestOptions {
  /**
   * Any ArcGIS Geocoding service (example: http://sampleserver6.arcgisonline.com/arcgis/rest/services/Locators/SanDiego/GeocodeServer )
   */
  endpoint?: string;
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

export interface ISuggestRequestOptions extends IEndpointRequestOptions {
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

export interface IBulkGeocodeRequestOptions extends IEndpointRequestOptions {
  addresses: IAddressBulk[];
}

export interface IGeocodeResponse {
  spatialReference: SpatialReferenceWkid;
  candidates: Array<{
    address: string;
    location: Point;
    extent: Extent;
    attributes: object;
  }>;
}

export interface IReverseGeocodeResponse {
  address: {
    [key: string]: any;
  };
  location: Point;
}

export interface ISuggestResponse {
  suggestions: Array<{
    text: string;
    magicKey: string;
    isCollection: boolean;
  }>;
}

export interface IBulkGeocodeResponse {
  spatialReference: SpatialReferenceWkid;
  locations: Array<{
    address: string;
    location: Point;
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
 * @param address | String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with address candidates for the request.
 */
export function geocode(
  address: string | IGeocodeRequestOptions
  // requestOptions?: IGeocodeRequestOptions
): Promise<IGeocodeResponse> {
  const options: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    params: {}
  };

  if (typeof address === "string") {
    options.params.singleLine = address;
  } else {
    options.params = { ...address.params };
    options.endpoint = address.endpoint || worldGeocoder;
  }

  // add spatialReference property to individual matches
  return request(options.endpoint + "findAddressCandidates", options).then(
    response => {
      const sr = response.spatialReference;
      response.candidates.forEach(function(candidate: {
        location: Point;
        extent: Extent;
      }) {
        candidate.location.spatialReference = sr;
        candidate.extent.spatialReference = sr;
      });
      return response;
    }
  );
}

/**
 * Used to return a placename suggestion for a partial string
 *
 * ```js
 * import { suggest } from '@esri/arcgis-geocoder';
 *
 * suggest({ partialText: "Starb" })
 *   .then((response) => {
 *     response.address.PlaceName; // => "Starbucks"
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

  // is this the most concise way to mixin these optional parameters?
  if (requestOptions && requestOptions.params) {
    options.params = { ...requestOptions.params };
  }

  if (requestOptions && requestOptions.magicKey) {
    options.params.magicKey = requestOptions.magicKey;
  }

  options.params.text = partialText;

  return request(options.endpoint + "suggest", options);
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
 * @param coordinates - the location you'd like to associate an address with.
 * @param requestOptions - Additional options for the request including authentication.
 * @returns A Promise that will resolve with the data from the response.
 */
export function reverseGeocode(
  coords: Point | Location | [number, number],
  requestOptions?: IEndpointRequestOptions
): Promise<IReverseGeocodeResponse> {
  const options: IGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    params: {},
    ...requestOptions
  };

  if (isLocationArray(coords)) {
    options.params.location = coords.join();
  } else if (isLocation(coords)) {
    if (coords.lat) {
      options.params.location = coords.long + "," + coords.lat;
    }
    if (coords.latitude) {
      options.params.location = coords.longitude + "," + coords.latitude;
    }
  } else {
    // if input is a point, we can pass it straight through, with or without a spatial reference
    options.params.location = coords;
  }

  return request(options.endpoint + "reverseGeocode", options);
}

/**
 * Used to geocode a batch of addresses
 *
 * ```js
 * import { bulkGeocode } from '@esri/arcgis-geocoder';
 * import { ApplicationSession } from '@esri/arcgis-auth';
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
  // passing authentication is mandatory
  const options: IBulkGeocodeRequestOptions = {
    endpoint: worldGeocoder,
    ...requestOptions
  };

  requestOptions.params = {
    forStorage: true,
    addresses: { records: null },
    ...requestOptions.params
  };

  const parsedAddresses: any[] = [];

  requestOptions.addresses.forEach(address => {
    parsedAddresses.push({ attributes: address });
  });

  requestOptions.params.addresses.records = parsedAddresses;

  if (!requestOptions.authentication) {
    return Promise.reject("bulk geocoding requires authentication");
  }

  return request(options.endpoint + "geocodeAddresses", requestOptions).then(
    response => {
      const sr = response.spatialReference;
      response.locations.forEach(function(address: { location: Point }) {
        address.location.spatialReference = sr;
      });
      return response;
    }
  );
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
 * @param requestOptions - Request options can contain a custom geocoding service to fetch metadata from.
 * @returns A Promise that will resolve with the data from the response.
 */
export function serviceInfo(
  requestOptions?: IGeocodeRequestOptions
): Promise<IGeocodeServiceInfoResponse> {
  const url = (requestOptions && requestOptions.endpoint) || worldGeocoder;
  return request(url, requestOptions);
}

export default {
  geocode,
  suggest,
  reverseGeocode,
  bulkGeocode,
  serviceInfo
};
