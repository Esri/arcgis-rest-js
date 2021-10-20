/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  cleanUrl,
  IUserRequestOptions,
  ILayerDefinition,
  ITable
} from "@esri/arcgis-rest-request";

import { ILayer } from "./helpers.js";

export interface IAddToServiceDefinitionOptions extends IUserRequestOptions {
  /**
   * Layers to add
   */
  layers?: ILayer[] | ILayerDefinition[];
  /**
   * Tables to add
   */
  tables?: ITable[];
}

export interface IAddToServiceDefinitionItemSummary {
  name: string;
  id: any;
}

export interface IAddToServiceDefinitionResult {
  layers?: IAddToServiceDefinitionItemSummary[];
  tables?: IAddToServiceDefinitionItemSummary[];
  success: boolean;
}

/**
 * ```js
 * import { addToServiceDefinition } from '@esri/arcgis-rest-service-admin';
 * //
 * addToServiceDefinition(serviceurl, {
 *   authentication: userSession,
 *   layers: [],
 *   tables: []
 * });
 * ```
 * Add layer(s) and/or table(s) to a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm) for more information.
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service layer and/or table details once the definition
 * has been updated
 */
export function addToServiceDefinition(
  url: string,
  requestOptions: IAddToServiceDefinitionOptions
): Promise<IAddToServiceDefinitionResult> {
  const adminUrl = `${cleanUrl(url).replace(
    `/rest/services`,
    `/rest/admin/services`
  )}/addToDefinition`;

  requestOptions.params = {
    addToDefinition: {},
    ...requestOptions.params
  };

  if (requestOptions.layers && requestOptions.layers.length > 0) {
    requestOptions.params.addToDefinition.layers = requestOptions.layers;
  }

  if (requestOptions.tables && requestOptions.tables.length > 0) {
    requestOptions.params.addToDefinition.tables = requestOptions.tables;
  }

  return request(adminUrl, requestOptions);
}
