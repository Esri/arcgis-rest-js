/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getPortalUrl } from "../util/get-portal-url.js";
import { getGroup } from "../groups/get.js";
export function getSharingUrl(requestOptions) {
    const username = requestOptions.authentication.username;
    const owner = requestOptions.owner || username;
    return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(owner)}/items/${requestOptions.id}/share`;
}
export function isItemOwner(requestOptions) {
    const username = requestOptions.authentication.username;
    const owner = requestOptions.owner || username;
    return owner === username;
}
/**
 * Check it the user is a full org_admin
 * @param requestOptions
 * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
 */
export function isOrgAdmin(requestOptions) {
    const session = requestOptions.authentication;
    return session.getUser(requestOptions).then((user) => {
        return user && user.role === "org_admin" && !user.roleId;
    });
}
/**
 * Get the User Membership for a particular group. Use this if all you have is the groupId.
 * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
 *
 * @param requestOptions
 * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
 */
export function getUserMembership(requestOptions) {
    // fetch the group...
    return getGroup(requestOptions.groupId, requestOptions)
        .then((group) => {
        return group.userMembership.memberType;
    })
        .catch(() => {
        return "none";
    });
}
//# sourceMappingURL=helpers.js.map