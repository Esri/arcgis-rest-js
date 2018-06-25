/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { IFeatureRequestOptions } from "./query";

import { IEditFeatureResult, appendCustomParams } from "./helpers";

/**
 * Request options to for updating a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
 *
 * @param url - Feature service url.
 * @param id - Unique identifier of feature to update related attachment.
 * @param attachment - File to be updated.
 * @param attachmentId - Unique identifier of the attachment.
 * @param params - Additional parameters to be sent via the request. See reference docs.
 */
export interface IUpdateAttachmentOptions extends IFeatureRequestOptions {
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
 * Update an existing attachment file of a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 * ```js
 * import { updateAttachment } from '@esri/arcgis-rest-feature-service';
 *
 * updateAttachment({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   id: 8484,
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

  // `attachment`, `attachmentId` and any additional parameters --> params: {}
  appendCustomParams(requestOptions, options);

  // force POST
  options.httpMethod = "POST";

  return request(
    `${requestOptions.url}/${requestOptions.id}/updateAttachment`,
    options
  );
}
