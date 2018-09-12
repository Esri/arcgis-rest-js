/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { ILayer, ITable } from "@esri/arcgis-rest-common-types";

export interface IAddToServiceDefinitionRequestOptions
  extends IUserRequestOptions {
  /**
   * Layers to add
   */
  layers?: ILayer[];
  /**
   * Tables to add
   */
  tables?: ITable[];
}

export interface IAddToServiceDefinitionItemSummary {
  name: string;
  id: any;
}

export interface IAddToServiceDefinitionSuccessResult {
  layers?: IAddToServiceDefinitionItemSummary[];
  tables?: IAddToServiceDefinitionItemSummary[];
  success: boolean;
}

export interface IAddToServiceDefinitionFailureResult {
  error: {
    code: number;
    message: string;
    details: string[];
  };
}

/**
 * Add layer(s) and/or table(s) to a hosted feature service.
 *
 * ```js
 * import { addToServiceDefinition } from '@esri/arcgis-rest-feature-service-admin';
 *
 * addToServiceDefinition(serviceurl, {
 *   authentication: userSession,
 *   layers: [],
 *   tables: []
 * });
 * ```
 *
 * @param url - URL of feature service
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service details once the service has been created
 */
export function addToServiceDefinition(
  url: string,
  requestOptions: IAddToServiceDefinitionRequestOptions
): Promise<
  IAddToServiceDefinitionSuccessResult | IAddToServiceDefinitionFailureResult
> {
  const adminUrl =
    url.replace("/rest/services", "/rest/admin/services") + "/addToDefinition";

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

  return new Promise(resolve => {
    request(adminUrl, requestOptions).then(
      response => {
        resolve(response);
      },
      response => {
        // We're not interested in the full ArcGISRequestError response, nor having an exception thrown
        resolve(response.response);
      }
    );
  });
}
