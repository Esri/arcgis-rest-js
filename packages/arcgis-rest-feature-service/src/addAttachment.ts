/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { IFeatureRequestOptions } from "./query";

import { IEditFeatureResult, appendCustomParams } from "./helpers";

/**
 * Request options to for adding a related attachment to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 * @param url - Feature service url.
 * @param id - Unique identifier of feature to add related attachment.
 * @param attachment - File to be attached.
 * @param params - Additional parameters to be sent via the request. See reference docs.
 */
export interface IAddAttachmentOptions extends IFeatureRequestOptions {
  attachment: File;
}

/**
 * `addAttachment()` request response.
 */
export interface IAddAttachmentResponse {
  /**
   * Standard AGS add/update/edit result Object for the attachment.
   */
  addAttachmentResult: IEditFeatureResult;
}

/**
 * Attach a file to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 * ```js
 * import { addAttachment } from '@esri/arcgis-rest-feature-service';
 *
 * addAttachment({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   id: 8484,
 *   attachment: myFileInput.files[0]
 * });
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `addAttachment()` response.
 */
export function addAttachment(
  requestOptions: IAddAttachmentOptions
): Promise<IAddAttachmentResponse> {
  const options: IAddAttachmentOptions = {
    params: {},
    ...requestOptions
  };

  // `attachment` and any additional parameters --> params: {}
  appendCustomParams(requestOptions, options);

  // force POST
  options.httpMethod = "POST";

  return request(
    `${requestOptions.url}/${requestOptions.id}/addAttachment`,
    options
  );
}
