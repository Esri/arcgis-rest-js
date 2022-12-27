/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { isItemOwner, getSharingUrl, isOrgAdmin } from "./helpers.js";
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
export function setItemAccess(requestOptions) {
    const url = getSharingUrl(requestOptions);
    if (isItemOwner(requestOptions)) {
        // if the user owns the item, proceed
        return updateItemAccess(url, requestOptions);
    }
    else {
        // otherwise we need to check to see if they are an organization admin
        return isOrgAdmin(requestOptions).then((admin) => {
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
    return request(url, requestOptions);
}
//# sourceMappingURL=access.js.map