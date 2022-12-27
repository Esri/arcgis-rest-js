import { IGetLayerOptions, IEditFeatureResult } from "./helpers.js";
/**
 * Request options to for updating a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 */
export interface IUpdateAttachmentOptions extends IGetLayerOptions {
    /**
     * Unique identifier of feature to update related attachment.
     */
    featureId: number;
    /**
     * File to be updated.
     */
    attachment: File;
    /**
     * Unique identifier of the attachment.
     */
    attachmentId: number;
}
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
export declare function updateAttachment(requestOptions: IUpdateAttachmentOptions): Promise<{
    updateAttachmentResult: IEditFeatureResult;
}>;
