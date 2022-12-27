"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAttachments = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Delete existing attachment files of a feature by id. See [Delete Attachments](https://developers.arcgis.com/rest/services-reference/delete-attachments.htm) for more information.
 *
 * ```js
 * import { deleteAttachments } from '@esri/arcgis-rest-feature-service';
 * //
 * deleteAttachments({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484,
 *   attachmentIds: [306]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `deleteAttachments()` response.
 */
function deleteAttachments(requestOptions) {
    const options = Object.assign({ params: {} }, requestOptions);
    // `attachmentIds` --> params: {}
    options.params.attachmentIds = requestOptions.attachmentIds;
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(options.url)}/${options.featureId}/deleteAttachments`, options);
}
exports.deleteAttachments = deleteAttachments;
//# sourceMappingURL=deleteAttachments.js.map