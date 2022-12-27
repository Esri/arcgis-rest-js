import { IGetLayerOptions } from "./helpers.js";
/**
 * Request options to fetch `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 */
export interface IGetAttachmentsOptions extends IGetLayerOptions {
    /**
     * Unique identifier of feature to request related `attachmentInfos`.
     */
    featureId: number;
}
/**
 * Attachment, a.k.a. `attachmentInfo`. See [Attachment](https://developers.arcgis.com/rest/services-reference/attachment-feature-service-.htm) for more information.
 */
export interface IAttachmentInfo {
    id: number;
    contentType: string;
    size: number;
    name: string;
}
/**
 * Request `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 * ```js
 * import { getAttachments } from '@esri/arcgis-rest-feature-service';
 * //
 * getAttachments({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `getAttachments()` response.
 */
export declare function getAttachments(requestOptions: IGetAttachmentsOptions): Promise<{
    attachmentInfos: IAttachmentInfo[];
}>;
