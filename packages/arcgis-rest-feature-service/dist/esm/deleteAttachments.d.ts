import { IGetLayerOptions, IEditFeatureResult } from "./helpers.js";
/**
 * Request options to for deleting related attachments of a feature by id. See [Delete Attachments](https://developers.arcgis.com/rest/services-reference/delete-attachments.htm) for more information.
 *
 */
export interface IDeleteAttachmentsOptions extends IGetLayerOptions {
    /**
     * Unique identifier of feature to delete related attachment(s).
     */
    featureId: number;
    /**
     * Array of unique identifiers of attachments to delete.
     */
    attachmentIds: number[];
}
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
export declare function deleteAttachments(requestOptions: IDeleteAttachmentsOptions): Promise<{
    deleteAttachmentResults: IEditFeatureResult[];
}>;
