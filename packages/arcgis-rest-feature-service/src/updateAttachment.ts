/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { IEditFeatureResult, appendCustomParams } from "./helpers";

/**
 * Request options to for updating a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 * @param url - Feature service url.
 * @param featureId - Unique identifier of feature to update related attachment.
 * @param attachment - File to be updated.
 * @param attachmentId - Unique identifier of the attachment.
 */
export interface IUpdateAttachmentOptions extends IRequestOptions {
  url: string;
  featureId: number;
  attachment: File;
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

  // force POST
  options.httpMethod = "POST";

  return request(
    `${options.url}/${options.featureId}/updateAttachment`,
    options
  );
}
