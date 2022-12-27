"use strict";
/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelItemUpload = exports.commitItemUpload = exports.addItemPart = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const helpers_js_1 = require("./helpers.js");
/**
 * Add Item Part allows the caller to upload a file part when doing an add or update item operation in multipart mode. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item-part.htm) for more information.
 *
 * ```js
 * import { addItemPart } from "@esri/arcgis-rest-portal";
 *
 * addItemPart({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   file: data,
 *   partNum: 1,
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to add the item part status.
 */
function addItemPart(requestOptions) {
    const partNum = requestOptions.partNum;
    if (!Number.isInteger(partNum) || partNum < 1 || partNum > 10000) {
        return Promise.reject(new Error("The part number must be an integer between 1 to 10000, inclusive."));
    }
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        // AGO adds the "partNum" parameter in the query string, not in the body
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/addPart?partNum=${partNum}`;
        const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, ["file"], { params: Object.assign({}, requestOptions.params) });
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.addItemPart = addItemPart;
/**
 * Commit is called once all parts are uploaded during a multipart Add Item or Update Item operation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/commit.htm) for more information.
 *
 * ```js
 * import { commitItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * commitItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
function commitItemUpload(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/commit`;
        const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, [], {
            params: Object.assign(Object.assign({}, requestOptions.params), requestOptions.item)
        });
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.commitItemUpload = commitItemUpload;
/**
 * Cancels a multipart upload on an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/cancel.htm) for more information.
 *
 * ```js
 * import { cancelItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * cancelItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
function cancelItemUpload(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/cancel`;
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.cancelItemUpload = cancelItemUpload;
//# sourceMappingURL=upload.js.map