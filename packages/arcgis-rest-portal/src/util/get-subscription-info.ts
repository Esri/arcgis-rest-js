/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "./get-portal-url.js";

export interface ISubscriptionInfo {
  id: string;
  [key: string]: any;
}

/**
 * ```js
 * import { getSubscriptionInfo } from "@esri/arcgis-rest-request";
 * //
 * getSubscriptionInfo()
 * getSubscriptionInfo("fe8")
 * getSubscriptionInfo(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
 * ```
 * Fetch subscription information about the current portal by id. If no id is passed, portals/self/subscriptionInfo will be called
 * @param id
 * @param requestOptions
 */
export function getSubscriptionInfo(
  id?: string,
  requestOptions?: IRequestOptions
): Promise<ISubscriptionInfo> {
  // construct the search url
  const idOrSelf = id ? id : "self";
  const url = `${getPortalUrl(
    requestOptions
  )}/portals/${idOrSelf}/subscriptionInfo`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  // send the request
  return request(url, options);
}
