"use strict";
/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserUrl = void 0;
const get_portal_url_js_1 = require("../util/get-portal-url.js");
/**
 * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
 *
 * @param session
 * @returns User url to be used in API requests.
 */
function getUserUrl(session) {
    return `${(0, get_portal_url_js_1.getPortalUrl)(session)}/community/users/${encodeURIComponent(session.username)}`;
}
exports.getUserUrl = getUserUrl;
//# sourceMappingURL=get-user-url.js.map