/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  IUserRequestOptions
} from "@esri/arcgis-rest-request";
import { IFeatureServiceDefinition } from "./helpers.js";

export interface IUpdateServiceDefinitionOptions extends IUserRequestOptions {
  updateDefinition?: Partial<IFeatureServiceDefinition>;
}

export interface IUpdateServiceDefinitionResult {
  success: boolean;
}

/**
 * Update a definition property in a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/online/update-definition-feature-service-.htm) for more information.
 *
 * ```js
 * import { updateServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * updateServiceDefinition(serviceurl, {
 *   authentication: ArcGISIdentityManager,
 *   updateDefinition: serviceDefinition
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with success or error
 */
export function updateServiceDefinition(
  url: string,
  requestOptions: IUpdateServiceDefinitionOptions
): Promise<IUpdateServiceDefinitionResult> {
  const adminUrl = `${cleanUrl(url).replace(
    `/rest/services`,
    `/rest/admin/services`
  )}/updateDefinition`;

  requestOptions.params = {
    updateDefinition: {},
    ...requestOptions.params
  };

  if (requestOptions.updateDefinition) {
    requestOptions.params.updateDefinition = requestOptions.updateDefinition;
  }

  return request(adminUrl, requestOptions);
}
