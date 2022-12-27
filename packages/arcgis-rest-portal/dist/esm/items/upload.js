/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, appendCustomParams } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { determineOwner } from "./helpers.js";
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
export function addItemPart(requestOptions) {
    const partNum = requestOptions.partNum;
    if (!Number.isInteger(partNum) || partNum < 1 || partNum > 10000) {
        return Promise.reject(new Error("The part number must be an integer between 1 to 10000, inclusive."));
    }
    return determineOwner(requestOptions).then((owner) => {
        // AGO adds the "partNum" parameter in the query string, not in the body
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/addPart?partNum=${partNum}`;
        const options = appendCustomParams(requestOptions, ["file"], { params: Object.assign({}, requestOptions.params) });
        return request(url, options);
    });
}
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
export function commitItemUpload(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/commit`;
        const options = appendCustomParams(requestOptions, [], {
            params: Object.assign(Object.assign({}, requestOptions.params), requestOptions.item)
        });
        return request(url, options);
    });
}
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
export function cancelItemUpload(requestOptions) {
    return determineOwner(requestOptions).then((owner) => {
        const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/cancel`;
        return request(url, requestOptions);
    });
}
//# sourceMappingURL=upload.js.map