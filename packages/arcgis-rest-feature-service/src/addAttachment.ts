/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "@esri/arcgis-rest-request";

import { IEditFeatureResult } from "./helpers";

/**
 * Request options for adding a related attachment to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 */
export interface IAddAttachmentOptions extends IRequestOptions {
  /**
   * Feature service url.
   */
  url: string;
  /**
   * Unique identifier of feature to add related attachment.
   */
  featureId: number;
  /**
   * File to be attached.
   */
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
 *   featureId: 8484,
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

  // `attachment` --> params: {}
  options.params.attachment = requestOptions.attachment;

  return request(`${options.url}/${options.featureId}/addAttachment`, options);
}
