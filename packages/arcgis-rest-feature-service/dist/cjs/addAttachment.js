"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAttachment = void 0;
const arcgis_rest_request_1 = require("@esri/arcgis-rest-request");
/**
 * Attach a file to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 * ```js
 * import { addAttachment } from '@esri/arcgis-rest-feature-service';
 * //
 * addAttachment({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484,
 *   attachment: myFileInput.files[0]
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `addAttachment()` response.
 */
function addAttachment(requestOptions) {
    const options = Object.assign({ params: {} }, requestOptions);
    // `attachment` --> params: {}
    options.params.attachment = requestOptions.attachment;
    return (0, arcgis_rest_request_1.request)(`${(0, arcgis_rest_request_1.cleanUrl)(options.url)}/${options.featureId}/addAttachment`, options);
}
exports.addAttachment = addAttachment;
//# sourceMappingURL=addAttachment.js.map