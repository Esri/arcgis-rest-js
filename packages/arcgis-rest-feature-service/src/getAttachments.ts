/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Request options to fetch `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 */
export interface IGetAttachmentsOptions extends IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
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
 * `getAttachments()` request response.
 */
export interface IGetAttachmentsResponse {
  /**
   * Array of `attachmentInfo` Object(s) for each related attachment. Empty Array means no attachments.
   */
  attachmentInfos: IAttachmentInfo[];
}

/**
 * Request `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 * ```js
 * import { getAttachments } from '@esri/arcgis-rest-feature-service';
 *
 * getAttachments({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `getAttachments()` response.
 */
export function getAttachments(
  requestOptions: IGetAttachmentsOptions
): Promise<IGetAttachmentsResponse> {
  // pass through
  return request(
    `${requestOptions.url}/${requestOptions.featureId}/attachments`,
    requestOptions
  );
}
