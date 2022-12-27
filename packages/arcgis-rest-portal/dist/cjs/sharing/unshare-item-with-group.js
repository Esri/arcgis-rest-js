"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unshareItemWithGroup = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
const is_item_shared_with_group_js_1 = require("./is-item-shared-with-group.js");
const get_user_js_1 = require("../users/get-user.js");
/**
 * Stop sharing an item with a group, either as an
 * [item owner](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-item-owner-.htm),
 * [group admin](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-group-admin-.htm) or
 * organization admin.
 *
 * ```js
 * import { unshareItemWithGroup } from '@esri/arcgis-rest-portal';
 *
 * unshareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   owner: "some-owner",
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
function unshareItemWithGroup(requestOptions) {
    return (0, is_item_shared_with_group_js_1.isItemSharedWithGroup)(requestOptions).then((isShared) => {
        // not shared
        if (!isShared) {
            // exit early with success response
            return Promise.resolve({
                itemId: requestOptions.id,
                shortcut: true,
                notUnsharedFrom: []
            });
        }
        const { authentication: { username }, owner } = requestOptions;
        // next check if the user is a member of the group
        return Promise.all([
            (0, helpers_js_1.getUserMembership)(requestOptions),
            (0, get_user_js_1.getUser)({
                username,
                authentication: requestOptions.authentication
            })
        ])
            .then(([membership, currentUser]) => {
            const itemOwner = owner || username;
            const isItemOwner = itemOwner === username;
            const isAdmin = currentUser.role === "org_admin" && !currentUser.roleId;
            if (!isItemOwner &&
                !isAdmin &&
                ["admin", "owner"].indexOf(membership) < 0) {
                // abort and reject promise
                throw Error(`This item can not be unshared from group ${requestOptions.groupId} by ${username} as they not the item owner, an org admin, group admin or group owner.`);
            }
            // let the sharing call go
            return unshareFromGroup(requestOptions);
        })
            .then((sharingResponse) => {
            if (sharingResponse.notUnsharedFrom.length) {
                throw Error(`Item ${requestOptions.id} could not be unshared to group ${requestOptions.groupId}`);
            }
            else {
                // all is well
                return sharingResponse;
            }
        });
    });
}
exports.unshareItemWithGroup = unshareItemWithGroup;
function unshareFromGroup(requestOptions) {
    const username = requestOptions.authentication.username;
    const itemOwner = requestOptions.owner || username;
    // decide what url to use
    // default to the non-owner url...
    let url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/items/${requestOptions.id}/unshare`;
    // but if they are the owner, we use a different path...
    if (itemOwner === username) {
        url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${itemOwner}/items/${requestOptions.id}/unshare`;
    }
    // now its finally time to do the sharing
    requestOptions.params = {
        groups: requestOptions.groupId
    };
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
//# sourceMappingURL=unshare-item-with-group.js.map