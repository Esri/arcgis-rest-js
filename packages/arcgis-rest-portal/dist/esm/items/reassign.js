/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { isOrgAdmin } from "../sharing/helpers.js";
/**
 * Reassign an item from one user to another. Caller must be an org admin or the request will fail. `currentOwner` and `targetUsername` must be in the same organization or the request will fail
 *
 * ```js
 * import { reassignItem } from '@esri/arcgis-rest-portal';
 *
 * reassignItem({
 *   id: "abc123",
 *   currentOwner: "charles",
 *   targetUsername: "leslie",
 *   authentication
 * })
 * ```
 *
 * @param reassignOptions - Options for the request
 */
export function reassignItem(reassignOptions) {
    return isOrgAdmin(reassignOptions).then((isAdmin) => {
        if (!isAdmin) {
            throw Error(`Item ${reassignOptions.id} can not be reassigned because current user is not an organization administrator.`);
        }
        // we're operating as an org-admin
        const url = `${getPortalUrl(reassignOptions)}/content/users/${reassignOptions.currentOwner}/items/${reassignOptions.id}/reassign`;
        const opts = {
            params: {
                targetUsername: reassignOptions.targetUsername,
                targetFolderName: reassignOptions.targetFolderName
            },
            authentication: reassignOptions.authentication
        };
        return request(url, opts);
    });
}
//# sourceMappingURL=reassign.js.map