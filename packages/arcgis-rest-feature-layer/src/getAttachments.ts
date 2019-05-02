/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, cleanUrl } from "@esri/arcgis-rest-request";
import { IGetLayerOptions } from "./helpers";

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
 * ```js
 * import { getAttachments } from '@esri/arcgis-rest-feature-layer';
 * //
 * getAttachments({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484
 * });
 * ```
 * Request `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `getAttachments()` response.
 */
export function getAttachments(
  requestOptions: IGetAttachmentsOptions
): Promise<{ attachmentInfos: IAttachmentInfo[] }> {
  const options: IGetAttachmentsOptions = {
    httpMethod: "GET",
    ...requestOptions
  };

  // pass through
  return request(
    `${cleanUrl(options.url)}/${options.featureId}/attachments`,
    options
  );
}
