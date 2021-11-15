/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  appendCustomParams,
  IFeature
} from "@esri/arcgis-rest-request";

import { ISharedEditOptions, IApplyEditsResult } from "./helpers.js";

/**
 * Apply edits request options. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/apply-edits-feature-service-layer-.htm) for more information.
 *
 */
export interface IApplyEditsOptions extends ISharedEditOptions {
  /**
   * Array of JSON features to add.
   */
  adds?: IFeature[];
  /**
   * Array of JSON features to update.
   */
  updates?: IFeature[];
  /**
   * Array of objectIds or globalIds to delete.
   */
  deletes?: number[] | string[];
  /**
   * When set to true, the features and attachments in the adds, updates, deletes, and attachments parameters are identified by their globalIds.
   */
  useGlobalIds?: boolean;
  /**
   * Optional parameter which is false by default is set by client to indicate to the server that client in true curve capable.
   */
  trueCurveClient?: boolean;
  /**
   * Use the attachments parameter to add, update or delete attachments. Applies only when the useGlobalIds parameter is set to true.
   * See [attachment](https://developers.arcgis.com/rest/services-reference/apply-edits-feature-service-layer-.htm) param details.
   */
  attachments?: {
    adds?: any[];
    updates?: any[];
    deletes?: string[];
  };
}

/**
 * ```js
 * import { applyEdits } from '@esri/arcgis-rest-feature-service';
 * //
 * applyEdits({
 *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
 *   adds: [{
 *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
 *     attributes: { status: "alive" }
 *   }],
 *   updates: [{
 *     attributes: { OBJECTID: 1004, status: "alive" }
 *   }],
 *   deletes: [862, 1548]
 * })
 *   .then(response)
 * ```
 * Apply edits request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/apply-edits-feature-service-layer-.htm) for more information.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the applyEdits response.
 */
export function applyEdits(
  requestOptions: IApplyEditsOptions
): Promise<IApplyEditsResult> {
  const url = `${cleanUrl(requestOptions.url)}/applyEdits`;

  // edit operations are POST only
  const options = appendCustomParams<IApplyEditsOptions>(
    requestOptions,
    [
      "adds",
      "updates",
      "deletes",
      "useGlobalIds",
      "attachments",
      "gdbVersion",
      "returnEditMoment",
      "rollbackOnFailure",
      "trueCurveClient"
    ],
    { params: { ...requestOptions.params } }
  );

  return request(url, options);
}
