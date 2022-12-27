/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, cleanUrl } from "@esri/arcgis-rest-request";
/**
 * Update a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 * ```js
 * import { updateAttachment } from '@esri/arcgis-rest-feature-service';
 * //
 * updateAttachment({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484,
 *   attachment: myFileInput.files[0],
 *   attachmentId: 306
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `updateAttachment()` response.
 */
export function updateAttachment(requestOptions) {
    const options = Object.assign({ params: {} }, requestOptions);
    // `attachment` and `attachmentId` --> params: {}
    options.params.attachment = requestOptions.attachment;
    options.params.attachmentId = requestOptions.attachmentId;
    return request(`${cleanUrl(options.url)}/${options.featureId}/updateAttachment`, options);
}
//# sourceMappingURL=updateAttachment.js.map