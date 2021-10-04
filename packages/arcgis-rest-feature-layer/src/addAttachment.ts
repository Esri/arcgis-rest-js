/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, cleanUrl } from "@esri/arcgis-rest-request";
import { IGetLayerOptions, IEditFeatureResult } from "./helpers.js";

/**
 * Request options for adding a related attachment to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 */
export interface IAddAttachmentOptions extends IGetLayerOptions {
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
 * ```js
 * import { addAttachment } from '@esri/arcgis-rest-feature-layer';
 * //
 * addAttachment({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   featureId: 8484,
 *   attachment: myFileInput.files[0]
 * })
 *   .then(response)
 * ```
 * Attach a file to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the `addAttachment()` response.
 */
export function addAttachment(
  requestOptions: IAddAttachmentOptions
): Promise<{ addAttachmentResult: IEditFeatureResult }> {
  const options: IAddAttachmentOptions = {
    params: {},
    ...requestOptions
  };

  // `attachment` --> params: {}
  options.params.attachment = requestOptions.attachment;

  return request(
    `${cleanUrl(options.url)}/${options.featureId}/addAttachment`,
    options
  );
}
