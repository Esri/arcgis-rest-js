/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";
import { IItemAdd } from "@esri/arcgis-rest-common-types";
import { moveItem } from "./update";
import { IItemCrudRequestOptions, determineOwner } from "./helpers";

export interface IAddFeatureServiceRequestOptions
  extends IItemCrudRequestOptions {
  /**
   * A JSON object specifying the properties of the newly-created service. See the [REST
   * Documentation](https://developers.arcgis.com/rest/users-groups-and-items/working-with-users-groups-and-items.htm)
   * for more information.
   */
  item: IItemAdd;
}

export interface IAddFeatureServiceResult {
  /**
   * The encoded URL to the hosted service.
   */
  encodedServiceURL: string;

  /**
   * Indicates if this feature service represents a view.
   */
  isView: boolean;

  /**
   * The unique ID for this item.
   */
  itemId: string;

  /**
   * Name of the service item.
   */
  name: string;

  /**
   * The ID of the new service item.
   */
  serviceItemId: string;

  /**
   * The URL to the hosted service.
   */
  serviceurl: string;

  /**
   * The size of the item.
   */
  size: number;

  /**
   * Indicates if the operation was successful.
   */
  success: boolean;

  /**
   * The type of service created.
   */
  type: string;
}

/**
 * Create a hosted feature service in the user's root folder.
 *
 * ```js
 * import { createFeatureService } from '@esri/arcgis-rest-items';
 *
 * createFeatureService({
 *   authentication: userSession,
 *   item: {
 *     "name": "EmptyServiceName",
 *     "serviceDescription": "",
 *     "hasStaticData": false,
 *     "maxRecordCount": 1000,
 *     "supportedQueryFormats": "JSON",
 *     "capabilities": "Create,Delete,Query,Update,Editing",
 *     "description": "",
 *     "copyrightText": "",
 *     "spatialReference": {
 *       "wkid": 102100
 *     },
 *     "initialExtent": {
 *       "xmin": -20037507.0671618,
 *       "ymin": -30240971.9583862,
 *       "xmax": 20037507.0671618,
 *       "ymax": 18398924.324645,
 *       "spatialReference": {
 *         "wkid": 102100,
 *         "latestWkid": 3857
 *       }
 *     },
 *     "allowGeometryUpdates": true,
 *     "units": "esriMeters",
 *     "xssPreventionInfo": {
 *       "xssPreventionEnabled": true,
 *       "xssPreventionRule": "InputOnly",
 *       "xssInputRule": "rejectInvalid"
 *     }
 *   }
 * });
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that resolves with service details once the service has been created
 */
export function createFeatureService(
  requestOptions: IAddFeatureServiceRequestOptions
): Promise<IAddFeatureServiceResult> {
  const owner = determineOwner(requestOptions);

  const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
  const url = `${baseUrl}/createService`;

  // Create the service
  requestOptions.params = {
    createParameters: requestOptions.item,
    outputType: "featureService",
    ...requestOptions.params
  };

  if (!requestOptions.folder || requestOptions.folder === "/") {
    // If the service is destined for the root folder, just send the request and return the promise;
    // services are created in the root folder
    return request(url, requestOptions);
  } else {
    // If the service is destined for a subfolder, catch the results of the request and then move
    // the item to the desired folder
    return new Promise((resolve, reject) => {
      request(url, requestOptions).then(results => {
        moveItem({
          itemId: results.itemId,
          folder: requestOptions.folder,
          authentication: requestOptions.authentication
        }).then(
          () => {
            resolve(results);
          },
          error => {
            reject(error);
          }
        );
      });
    });
  }
}
