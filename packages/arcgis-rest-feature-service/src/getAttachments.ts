/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { IFeatureRequestOptions } from "./query";

import { appendCustomParams } from "./helpers";

/**
 * Request options to fetch `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
 *
 * @param url - Feature service url.
 * @param id - Unique identifier of feature to request related `attachmentInfos`.
 * @param params - Additional parameters to be sent via the request. See reference docs.
 */
// Use IFeatureRequestOptions directly.
// export interface IGetAttachmentsOptions extends IFeatureRequestOptions {}

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
 *   id: 8484
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `getAttachments()` response.
 */
export function getAttachments(
  requestOptions: IFeatureRequestOptions
): Promise<IGetAttachmentsResponse> {
  const options: IFeatureRequestOptions = {
    params: {
      HTTPMethod: "GET"
    },
    ...requestOptions
  };

  // any additional parameters --> params: {}
  appendCustomParams(requestOptions, options);

  return request(
    `${requestOptions.url}/${requestOptions.id}/attachments`,
    options
  );
}
