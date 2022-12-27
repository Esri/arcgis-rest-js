"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setItemAccess = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const helpers_js_1 = require("./helpers.js");
/**
 * Change who is able to access an item.
 *
 * ```js
 * import { setItemAccess } from "@esri/arcgis-rest-portal";
 *
 * setItemAccess({
 *   id: "abc123",
 *   access: "public", // 'org' || 'private'
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
function setItemAccess(requestOptions) {
    const url = (0, helpers_js_1.getSharingUrl)(requestOptions);
    if ((0, helpers_js_1.isItemOwner)(requestOptions)) {
        // if the user owns the item, proceed
        return updateItemAccess(url, requestOptions);
    }
    else {
        // otherwise we need to check to see if they are an organization admin
        return (0, helpers_js_1.isOrgAdmin)(requestOptions).then((admin) => {
            if (admin) {
                return updateItemAccess(url, requestOptions);
            }
            else {
                // if neither, updating the sharing isnt possible
                throw Error(`This item can not be shared by ${requestOptions.authentication.username}. They are neither the item owner nor an organization admin.`);
            }
        });
    }
}
exports.setItemAccess = setItemAccess;
function updateItemAccess(url, requestOptions) {
    requestOptions.params = Object.assign({ org: false, everyone: false }, requestOptions.params);
    // if the user wants to make the item private, it needs to be unshared from any/all groups as well
    if (requestOptions.access === "private") {
        requestOptions.params.groups = " ";
    }
    if (requestOptions.access === "org") {
        requestOptions.params.org = true;
    }
    // if sharing with everyone, share with the entire organization as well.
    if (requestOptions.access === "public") {
        // this is how the ArcGIS Online Home app sets public access
        // setting org = true instead of account = true will cancel out all sharing
        requestOptions.params.account = true;
        requestOptions.params.everyone = true;
    }
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
//# sourceMappingURL=access.js.map