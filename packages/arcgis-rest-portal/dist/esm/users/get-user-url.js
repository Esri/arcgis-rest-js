/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
 *
 * @param session
 * @returns User url to be used in API requests.
 */
export function getUserUrl(session) {
    return `${getPortalUrl(session)}/community/users/${encodeURIComponent(session.username)}`;
}
//# sourceMappingURL=get-user-url.js.map