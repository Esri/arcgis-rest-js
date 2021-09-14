/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams
} from "@esri/arcgis-rest-request";

import type {
  IExtent,
  ISpatialReference,
  IPoint
} from "@esri/arcgis-rest-types";

import { ARCGIS_ONLINE_GEOCODING_URL, IEndpointOptions } from "./helpers.js";

import { arcgisToGeoJSON } from "@terraformer/arcgis";

export interface IGeocodeOptions extends IEndpointOptions {
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
  outFields?: "*" | string[];
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
   * import { suggest, geocode } from '@esri/arcgis-rest-geocoding';
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
  geoJson?: {
    type: string;
    features: Array<{
      type: string;
      geometry: object;
      properties: any;
    }>;
  };
}

/**
 * ```js
 * import { geocode } from '@esri/arcgis-rest-geocoding';
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
  address: string | IGeocodeOptions
): Promise<IGeocodeResponse> {
  let options: IGeocodeOptions = {};
  let endpoint: string;

  if (typeof address === "string") {
    options.params = { singleLine: address };
    endpoint = ARCGIS_ONLINE_GEOCODING_URL;
  } else {
    endpoint = address.endpoint || ARCGIS_ONLINE_GEOCODING_URL;
    options = appendCustomParams<IGeocodeOptions>(
      address,
      [
        "singleLine",
        "address",
        "address2",
        "address3",
        "neighborhood",
        "city",
        "subregion",
        "region",
        "postal",
        "postalExt",
        "countryCode",
        "outFields",
        "magicKey"
      ],
      { params: { ...address.params } }
    );
  }

  // add spatialReference property to individual matches
  return request(`${cleanUrl(endpoint)}/findAddressCandidates`, options).then(
    (response) => {
      if (typeof address !== "string" && address.rawResponse) {
        return response;
      }
      const sr: ISpatialReference = response.spatialReference;
      response.candidates.forEach(function (candidate: {
        location: IPoint;
        extent?: IExtent;
      }) {
        candidate.location.spatialReference = sr;
        if (candidate.extent) {
          candidate.extent.spatialReference = sr;
        }
      });

      // geoJson
      if (sr.wkid === 4326) {
        const features = response.candidates.map((candidate: any) => {
          return {
            type: "Feature",
            geometry: arcgisToGeoJSON(candidate.location),
            properties: Object.assign(
              {
                address: candidate.address,
                score: candidate.score
              },
              candidate.attributes
            )
          };
        });

        response.geoJson = {
          type: "FeatureCollection",
          features
        };
      }

      return response;
    }
  );
}
