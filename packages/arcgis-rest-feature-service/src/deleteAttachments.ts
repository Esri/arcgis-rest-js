/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { IEditFeatureResult } from "./helpers";

/**
 * Request options to for deleting related attachments of a feature by id. See [Delete Attachments](https://developers.arcgis.com/rest/services-reference/delete-attachments.htm) for more information.
 *
 * @param url - Feature service url.
 * @param featureId - Unique identifier of feature to delete related attachment(s).
 * @param attachmentIds - Array of unique identifiers of attachments to delete.
 */
export interface IDeleteAttachmentsOptions extends IRequestOptions {
  url: string;
  featureId: number;
  attachmentIds: number[];
}

/**
 * `updateAttachment()` request response.
 */
export interface IDeleteAttachmentsResponse {
  /**
   * Array of standard AGS add/update/edit result Object(s) for the attachment(s).
   */
  deleteAttachmentResults: IEditFeatureResult[];
}

/**
 * Delete existing attachment files of a feature by id. See [Delete Attachments](https://developers.arcgis.com/rest/services-reference/delete-attachments.htm) for more information.
 *
 * ```js
 * import { deleteAttachments } from '@esri/arcgis-rest-feature-service';
 *
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
export function deleteAttachments(
  requestOptions: IDeleteAttachmentsOptions
): Promise<IDeleteAttachmentsResponse> {
  const options: IDeleteAttachmentsOptions = {
    params: {},
    ...requestOptions
  };

  // `attachmentIds` --> params: {}
  options.params.attachmentIds = requestOptions.attachmentIds;

  return request(
    `${options.url}/${options.featureId}/deleteAttachments`,
    options
  );
}
