"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemMetadata = exports.getItemInfo = exports.getItemParts = exports.getItemStatus = exports.getItemGroups = exports.getItemResource = exports.getItemResources = exports.getRelatedItems = exports.getItemData = exports.getItemBaseUrl = exports.getItem = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
const get_portal_url_js_1 = require("../util/get-portal-url.js");
const scrub_control_chars_js_1 = require("../util/scrub-control-chars.js");
const helpers_js_1 = require("./helpers.js");
/**
 * ```
 * import { getItem } from "@esri/arcgis-rest-portal";
 * //
 * getItem("ae7")
 *   .then(response);
 * // or
 * getItem("ae7", { authentication })
 *   .then(response)
 * ```
 * Get an item by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item.htm) for more information.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
function getItem(id, requestOptions) {
    const url = (0, exports.getItemBaseUrl)(id, requestOptions);
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getItem = getItem;
/**
 * Get the fully qualified base URL to the REST end point for an item.
 * @param id Item Id
 * @param portalUrlOrRequestOptions a portal URL or request options
 * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{id}`
 */
const getItemBaseUrl = (id, portalUrlOrRequestOptions) => {
    const portalUrl = typeof portalUrlOrRequestOptions === "string"
        ? portalUrlOrRequestOptions
        : (0, get_portal_url_js_1.getPortalUrl)(portalUrlOrRequestOptions);
    return `${portalUrl}/content/items/${id}`;
};
exports.getItemBaseUrl = getItemBaseUrl;
/**
 * ```
 * import { getItemData } from "@esri/arcgis-rest-portal";
 * //
 * getItemData("ae7")
 *   .then(response)
 * // or
 * getItemData("ae7", { authentication })
 *   .then(response)
 * ```
 * Get the /data for an item. If no data exists, returns `undefined`. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-data.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the json data for the item.
 */
function getItemData(id, requestOptions) {
    const url = `${(0, exports.getItemBaseUrl)(id, requestOptions)}/data`;
    // default to a GET request
    const options = Object.assign({ httpMethod: "GET", params: {} }, requestOptions);
    if (options.file) {
        options.params.f = null;
    }
    return (0, arcgis_rest_request_1.request)(url, options).catch((err) => {
        /* if the item doesn't include data, the response will be empty
           and the internal call to response.json() will fail */
        const emptyResponseErr = RegExp(/The string did not match the expected pattern|(Unexpected end of (JSON input|data at line 1 column 1))/i);
        /* istanbul ignore else */
        if (emptyResponseErr.test(err.message)) {
            return;
        }
        else
            throw err;
    });
}
exports.getItemData = getItemData;
/**
 * ```
 * import { getRelatedItems } from "@esri/arcgis-rest-portal";
 * //
 * getRelatedItems({
 *   id: "ae7",
 *   relationshipType: "Service2Layer" // or several ["Service2Layer", "Map2Area"]
 * })
 *   .then(response)
 * ```
 * Get the related items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/related-items.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
function getRelatedItems(requestOptions) {
    const url = `${(0, exports.getItemBaseUrl)(requestOptions.id, requestOptions)}/relatedItems`;
    const options = Object.assign({ httpMethod: "GET", params: {
            direction: requestOptions.direction
        } }, requestOptions);
    if (typeof requestOptions.relationshipType === "string") {
        options.params.relationshipType = requestOptions.relationshipType;
    }
    else {
        options.params.relationshipTypes = requestOptions.relationshipType;
    }
    delete options.direction;
    delete options.relationshipType;
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getRelatedItems = getRelatedItems;
/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
function getItemResources(id, requestOptions) {
    const url = `${(0, exports.getItemBaseUrl)(id, requestOptions)}/resources`;
    // Mix in num:1000 with any user supplied params
    // Key thing - we don't want to mutate the passed in requestOptions
    // as that may be used in other (subsequent) calls in the course
    // of a long promise chains
    const options = Object.assign({}, requestOptions);
    options.params = Object.assign({ num: 1000 }, options.params);
    return (0, arcgis_rest_request_1.request)(url, options);
}
exports.getItemResources = getItemResources;
/**
 * Fetches an item resource and optionally parses it to the correct format.
 *
 * Provides JSON parse error protection by sanitizing out any unescaped control characters before parsing that would otherwise cause an error to be thrown.
 *
 * ```js
 * import { getItemResource } from "@esri/arcgis-rest-portal";
 *
 * // Parses contents as blob by default
 * getItemResource("3ef", { fileName: "resource.jpg", ...})
 *  .then(resourceContents => {});
 *
 * // Can override parse method
 * getItemResource("3ef", { fileName: "resource.json", readAs: 'json', ...})
 *  .then(resourceContents => {});
 *
 * // Get the response object instead
 * getItemResource("3ef",{ rawResponse: true, fileName: "resource.json" })
 *  .then(response => {})
 * ```
 *
 * @param {string} itemId
 * @param {IGetItemResourceOptions} requestOptions
 */
function getItemResource(itemId, requestOptions) {
    const readAs = requestOptions.readAs || "blob";
    return getItemFile(itemId, `/resources/${requestOptions.fileName}`, readAs, requestOptions);
}
exports.getItemResource = getItemResource;
/**
 * Lists the groups of which the item is a part, only showing the groups that the calling user can access. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/groups.htm) for more information.
 *
 * ```js
 * import { getItemGroups } from "@esri/arcgis-rest-portal";
 *
 * getItemGroups("30e5fe3149c34df1ba922e6f5bbf808f")
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to query group association for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item groups.
 */
function getItemGroups(id, requestOptions) {
    const url = `${(0, exports.getItemBaseUrl)(id, requestOptions)}/groups`;
    return (0, arcgis_rest_request_1.request)(url, requestOptions);
}
exports.getItemGroups = getItemGroups;
/**
 * Inquire about status when publishing an item, adding an item in async mode, or adding with a multipart upload. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/status.htm) for more information.
 *
 * ```js
 * import { getItemStatus } from "@esri/arcgis-rest-portal";
 *
 * getItemStatus({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to get status for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item status.
 */
function getItemStatus(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/status`;
        const options = (0, arcgis_rest_request_1.appendCustomParams)(requestOptions, ["jobId", "jobType"], { params: Object.assign({}, requestOptions.params) });
        return (0, arcgis_rest_request_1.request)(url, options);
    });
}
exports.getItemStatus = getItemStatus;
/**
 * Lists the part numbers of the file parts that have already been uploaded in a multipart file upload. This method can be used to verify the parts that have been received as well as those parts that were not received by the server. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/parts.htm) for more information.
 *
 * ```js
 * import { getItemParts } from "@esri/arcgis-rest-portal";
 *
 * getItemParts({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to get part list.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item part list.
 */
function getItemParts(requestOptions) {
    return (0, helpers_js_1.determineOwner)(requestOptions).then((owner) => {
        const url = `${(0, get_portal_url_js_1.getPortalUrl)(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/parts`;
        return (0, arcgis_rest_request_1.request)(url, requestOptions);
    });
}
exports.getItemParts = getItemParts;
/**
 * ```
 * import { getItemInfo } from "@esri/arcgis-rest-portal";
 * // get the "Info Card" for the item
 * getItemInfo("ae7")
 *   .then(itemInfoXml) // XML document as a string
 * // or get the contents of a specific file
 * getItemInfo("ae7", { fileName: "form.json", readAs: "json", authentication })
 *   .then(formJson) // JSON document as JSON
 * ```
 * Get an info file for an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-info-file.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request, including the file name which defaults to `iteminfo.xml`.
 * If the file is not a text file (XML, HTML, etc) you will need to specify the `readAs` parameter
 * @returns A Promise that will resolve with the contents of the info file for the item.
 */
function getItemInfo(id, requestOptions) {
    const { fileName = "iteminfo.xml", readAs = "text" } = requestOptions || {};
    const options = Object.assign({ httpMethod: "GET" }, requestOptions);
    return getItemFile(id, `/info/${fileName}`, readAs, options);
}
exports.getItemInfo = getItemInfo;
/**
 * ```
 * import { getItemMetadata } from "@esri/arcgis-rest-portal";
 * // get the metadata for the item
 * getItemMetadata("ae7")
 *   .then(itemMetadataXml) // XML document as a string
 * // or with additional request options
 * getItemMetadata("ae7", { authentication })
 *   .then(itemMetadataXml) // XML document as a string
 * ```
 * Get the standard formal metadata XML file for an item (`/info/metadata/metadata.xml`)
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the contents of the metadata file for the item as a string.
 */
function getItemMetadata(id, requestOptions) {
    const options = Object.assign(Object.assign({}, requestOptions), { fileName: "metadata/metadata.xml" });
    return getItemInfo(id, options);
}
exports.getItemMetadata = getItemMetadata;
// overrides request()'s default behavior for reading the response
// which is based on `params.f` and defaults to JSON
// Also adds JSON parse error protection by sanitizing out any unescaped control characters before parsing
function getItemFile(id, 
// NOTE: fileName should include any folder/subfolders
fileName, readMethod, requestOptions) {
    const url = `${(0, exports.getItemBaseUrl)(id, requestOptions)}${fileName}`;
    // preserve escape hatch to let the consumer read the response
    // and ensure the f param is not appended to the query string
    const options = Object.assign({ params: {} }, requestOptions);
    const justReturnResponse = options.rawResponse;
    options.rawResponse = true;
    options.params.f = null;
    return (0, arcgis_rest_request_1.request)(url, options).then((response) => {
        if (justReturnResponse) {
            return response;
        }
        return readMethod !== "json"
            ? response[readMethod]()
            : response
                .text()
                .then((text) => JSON.parse((0, scrub_control_chars_js_1.scrubControlChars)(text)));
    });
}
//# sourceMappingURL=get.js.map