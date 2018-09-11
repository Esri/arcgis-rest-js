/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { ILayer, ITable } from "@esri/arcgis-rest-common-types";

export interface IAddToFeatureServiceRequestOptions
  extends IUserRequestOptions {
  /**
   * Feature service URL
   */
  url: string;
  /**
   * Layers to add
   */
  layers?: ILayer[];
  /**
   * Tables to add
   */
  tables?: ITable[];
}

export interface IAddToFeatureServiceItemSummary {
  name: string;
  id: any;
}

export interface IAddToFeatureServiceSuccessResult {
  layers?: IAddToFeatureServiceItemSummary[];
  tables?: IAddToFeatureServiceItemSummary[];
  success: boolean;
}

export interface IAddToFeatureServiceFailureResult {
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
 * import { addLayerToFeatureService } from '@esri/arcgis-rest-items';
 *
 * addLayerToFeatureService({
 *   authentication: userSession,
 *   url: serviceurl,
 *   layers: [],
 *   tables: []
 * });
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service details once the service has been created
 */
export function addToFeatureService(
  requestOptions: IAddToFeatureServiceRequestOptions
): Promise<
  IAddToFeatureServiceSuccessResult | IAddToFeatureServiceFailureResult
> {
  const url =
    requestOptions.url.replace("/rest/services", "/rest/admin/services") +
    "/addToDefinition";

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
    request(url, requestOptions).then(
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
