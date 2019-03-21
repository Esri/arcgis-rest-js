/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getPortalUrl } from "@esri/arcgis-rest-request";
import { UserSession } from "./UserSession";

/**
 * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
 *
 * @param session
 * @returns User url to be used in API requests.
 */
export function getUserUrl(session: UserSession): string {
  return `${getPortalUrl(session)}/community/users/${encodeURIComponent(
    session.username
  )}`;
}
