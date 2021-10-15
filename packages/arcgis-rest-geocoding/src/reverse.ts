/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, cleanUrl, IPoint, ILocation } from "@esri/arcgis-rest-request";

import { ARCGIS_ONLINE_GEOCODING_URL, IEndpointOptions } from "./helpers.js";

export interface IReverseGeocodeResponse {
  address: {
    [key: string]: any;
  };
  location: IPoint;
}

function isLocationArray(
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is [number, number] | [number, number, number] {
  return (
    (coords as [number, number]).length === 2 ||
    (coords as [number, number, number]).length === 3
  );
}

function isLocation(
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}

/**
 * ```js
 * import { reverseGeocode } from '@esri/arcgis-rest-geocoding';
 * //
 * reverseGeocode([-118.409,33.943 ]) // long, lat
 *   .then((response) => {
 *     response.address.PlaceName; // => "LA Airport"
 *   });
 * // or
 * reverseGeocode({ long: -118.409, lat: 33.943 })
 * reverseGeocode({ latitude: 33.943, latitude: -118.409 })
 * reverseGeocode({ x: -118.409, y: 33.9425 }) // wgs84 is assumed
 * reverseGeocode({ x: -13181226, y: 4021085, spatialReference: { wkid: 3857 })
 * ```
 * Used to determine the address of a [location](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm).
 *
 * @param coordinates - the location you'd like to associate an address with.
 * @param requestOptions - Additional options for the request including authentication.
 * @returns A Promise that will resolve with the data from the response.
 */
export function reverseGeocode(
  coords: IPoint | ILocation | [number, number],
  requestOptions?: IEndpointOptions
): Promise<IReverseGeocodeResponse> {
  const options: IEndpointOptions = {
    endpoint: ARCGIS_ONLINE_GEOCODING_URL,
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

  return request(`${cleanUrl(options.endpoint)}/reverseGeocode`, options);
}

export default {
  reverseGeocode
};
