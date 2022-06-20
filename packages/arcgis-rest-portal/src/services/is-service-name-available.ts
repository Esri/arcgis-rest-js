/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IServiceNameAvailable } from "../helpers.js";

/**
 * Determine if a specific service name is available in the current user's organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceNameAvailable>}
 */
export function isServiceNameAvailable(
  name: string,
  type: string,
  session: ArcGISIdentityManager
): Promise<IServiceNameAvailable> {
  const url = `${session.portal}/portals/self/isServiceNameAvailable`;
  return request(url, {
    params: {
      name,
      type
    },
    httpMethod: "GET",
    authentication: session
  });
}
