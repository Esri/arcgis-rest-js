import { IGetLayerOptions, IEditFeatureResult } from "./helpers.js";
/**
 * Request options for adding a related attachment to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 */
export interface IAddAttachmentOptions extends IGetLayerOptions {
    /**
     * Unique identifier of feature to add related attachment.
     */
    featureId: number;
    /**
     * File to be attached.
     */
    attachment: File;
}
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
export declare function addAttachment(requestOptions: IAddAttachmentOptions): Promise<{
    addAttachmentResult: IEditFeatureResult;
}>;
