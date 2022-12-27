"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reassignItem = void 0;
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("../sharing/helpers.js");
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
function reassignItem(reassignOptions) {
    return (0, helpers_js_1.isOrgAdmin)(reassignOptions).then((isAdmin) => {
        if (!isAdmin) {
            throw Error(`Item ${reassignOptions.id} can not be reassigned because current user is not an organization administrator.`);
        }
        // we're operating as an org-admin
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(reassignOptions)}/content/users/${reassignOptions.currentOwner}/items/${reassignOptions.id}/reassign`;
        const opts = {
            params: {
                targetUsername: reassignOptions.targetUsername,
                targetFolderName: reassignOptions.targetFolderName
            },
            authentication: reassignOptions.authentication
        };
        return (0, arcgis_rest_request_1.request)(url, opts);
    });
}
exports.reassignItem = reassignItem;
//# sourceMappingURL=reassign.js.map