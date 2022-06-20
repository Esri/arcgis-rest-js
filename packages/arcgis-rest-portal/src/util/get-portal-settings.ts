/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions, IExtent } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "./get-portal-url.js";

export interface IPortalSettings {
  allowedRedirectUris: string[];
  defaultExtent: IExtent;
  helperServices: { [key: string]: any };
  informationalBanner: { [key: string]: any };
  [key: string]: any;
}

/**
 * Fetch the settings for the current portal by id. If no id is passed, portals/self/settings will be called
 *
 * ```js
 * import { getPortalSettings } from "@esri/arcgis-rest-portal";
 *
 * getPortalSettings()
 * getPortalSettings("fe8")
 * getPortalSettings(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 *
 * @param id
 * @param requestOptions
 */
export function getPortalSettings(
  id?: string,
  requestOptions?: IRequestOptions
): Promise<IPortalSettings> {
  // construct the search url
  const idOrSelf = id ? id : "self";
  const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}/settings`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  // send the request
  return request(url, options);
}
