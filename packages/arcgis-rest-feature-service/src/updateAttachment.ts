/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { IEditFeatureResult } from "./helpers";

/**
 * Request options to for updating a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 */
export interface IUpdateAttachmentOptions extends IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
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
 * `updateAttachment()` request response.
 */
export interface IUpdateAttachmentResponse {
  /**
   * Standard AGS add/update/edit result Object for the attachment.
   */
  updateAttachmentResult: IEditFeatureResult;
}

/**
 * Update a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 * ```js
 * import { updateAttachment } from '@esri/arcgis-rest-feature-service';
 *
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
export function updateAttachment(
  requestOptions: IUpdateAttachmentOptions
): Promise<IUpdateAttachmentResponse> {
  const options: IUpdateAttachmentOptions = {
    params: {},
    ...requestOptions
  };

  // `attachment` and `attachmentId` --> params: {}
  options.params.attachment = requestOptions.attachment;
  options.params.attachmentId = requestOptions.attachmentId;

  return request(
    `${options.url}/${options.featureId}/updateAttachment`,
    options
  );
}
