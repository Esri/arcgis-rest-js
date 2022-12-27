"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserMembership = exports.isOrgAdmin = exports.isItemOwner = exports.getSharingUrl = void 0;
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const get_js_1 = require("../groups/get.js");
function getSharingUrl(requestOptions) {
    const username = requestOptions.authentication.username;
    const owner = requestOptions.owner || username;
    return `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${encodeURIComponent(owner)}/items/${requestOptions.id}/share`;
}
exports.getSharingUrl = getSharingUrl;
function isItemOwner(requestOptions) {
    const username = requestOptions.authentication.username;
    const owner = requestOptions.owner || username;
    return owner === username;
}
exports.isItemOwner = isItemOwner;
/**
 * Check it the user is a full org_admin
 * @param requestOptions
 * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
 */
function isOrgAdmin(requestOptions) {
    const session = requestOptions.authentication;
    return session.getUser(requestOptions).then((user) => {
        return user && user.role === "org_admin" && !user.roleId;
    });
}
exports.isOrgAdmin = isOrgAdmin;
/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param requestOptions
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
 */
function getUserMembership(requestOptions) {
    // fetch the group...
    return (0, get_js_1.getGroup)(requestOptions.groupId, requestOptions)
        .then((group) => {
        return group.userMembership.memberType;
    })
        .catch(() => {
        return "none";
    });
}
exports.getUserMembership = getUserMembership;
//# sourceMappingURL=helpers.js.map