/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";

/* TODO: - embed item id into some special privileges replace "string"
 *       - e.g. portal:app:access:item:{itemId}
 */
type Privileges =
  | "portal:apikey:basemaps"
  | "premium:user:demographics"
  | "premium:user:elevation"
  | "premium:user:featurereport"
  | "premium:user:geocode"
  | "premium:user:geocode:stored"
  | "premium:user:geocode:temporary"
  | "premium:user:geoenrichment"
  | "premium:user:networkanalysis"
  | "premium:user:networkanalysis:routing"
  | "premium:user:networkanalysis:optimizedrouting"
  | "premium:user:networkanalysis:closestfacility"
  | "premium:user:networkanalysis:servicearea"
  | "premium:user:networkanalysis:locationallocation"
  | "premium:user:networkanalysis:vehiclerouting"
  | "premium:user:networkanalysis:origindestinationcostmatrix"
  | "premium:user:places"
  | "premium:user:spatialanalysis"
  | "premium:publisher:geoanalytics"
  | "premium:publisher:rasteranalysis"
  | string;

// TODO: - definition of params may need to be modified.
export interface IRegisterAppOptions extends IRequestOptions {
  itemId: string;
  appType: "apikey" | "browser" | "native" | "server" | "multiple";
  redirect_uris: string[];
  httpReferrers: string[];
  privileges: Privileges[];
}

export const registerApp = async (requestOptions: IRegisterAppOptions) => {
  // transform IRegisterAppOptions to standard IRequestOptions for request() purpose
  const options = appendCustomParams(requestOptions, [
    "itemId",
    "appType",
    "redirect_uris",
    "httpReferrers",
    "privileges"
  ]);
  options.httpMethod = "POST";
  // encode params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly, which is called inside request()
  Object.entries(options.params).forEach((entry) => {
    const [key, value] = entry;
    if (value.constructor.name === "Array") {
      options.params[key] = JSON.stringify(value);
    }
  });

  // TODO: - should determine url at runtime? (entrepreneur vs online usr)
  const url = "https://www.arcgis.com/sharing/rest/oauth2/registerApp";
  return await request(url, options);
};
