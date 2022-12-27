/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getPortalUrl } from "../util/get-portal-url.js";
import { request } from "@esri/arcgis-rest-request";
/**
 * Change the user membership levels of existing users in a group
 *
 * ```js
 * import { updateUserMemberships } from "@esri/arcgis-rest-portal";
 *
 * updateUserMemberships({
 *   id: groupId,
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export function updateUserMemberships(requestOptions) {
    const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/updateUsers`;
    const opts = {
        authentication: requestOptions.authentication,
        params: {}
    };
    // add the correct params depending on the type of membership we are changing to
    if (requestOptions.newMemberType === "admin") {
        opts.params.admins = requestOptions.users;
    }
    else {
        opts.params.users = requestOptions.users;
    }
    // make the request
    return request(url, opts);
}
//# sourceMappingURL=update-user-membership.js.map