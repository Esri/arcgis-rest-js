/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";

/**
 * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
 *
 * @param session
 * @returns User url to be used in API requests.
 * @deprecated This function requires a synchronous  `username` on the session object which is not guaranteed. Use `getUser` instead. This function will be removed in the next release.
 */
export function getUserUrl(session: ArcGISIdentityManager): string {
  return `${getPortalUrl(session)}/community/users/${encodeURIComponent(
    session.username
  )}`;
}
