/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";
import { moveItem } from "./update";
import { IItemCrudRequestOptions, determineOwner } from "./helpers";
import { IExtent, ISpatialReference } from "@esri/arcgis-rest-common-types";

/**
 * A [`createParameters` JSON object for a new
 * service](https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm).
 */
export interface IFeatureServiceAdd {
  /**
   * Name of the service to be created. This name must be unique. If the name already exists, the operation will fail. ArcGIS Enterprise does not allow spaces or special characters other than underscores in a service name.
   */
  name?: string;
  /**
   * Description given to the service.
   */
  serviceDescription?: string;
  /**
   * Indicates whether the data changes.
   */
  hasStaticData?: boolean;
  /**
   * A double value indicating any constraints enforced on query operations.
   */
  maxRecordCount?: number;
  /**
   * The formats in which query results are returned.
   */
  supportedQueryFormats?: string;
  /**
   * Specify feature service editing capabilities for Create, Delete, Query, Update, and Sync.
   */
  capabilities?: string;
  /**
   * A user-friendly description for the published dataset.
   */
  description?: string;
  /**
   * Copyright information associated with the dataset.
   */
  copyrightText?: string;
  /**
   * All layers added to a hosted feature service need to have the same spatial reference defined for
   * the feature service. When creating a new empty service without specifying its spatial reference,
   * the spatial reference of the hosted feature service is set to the first layer added to that
   * feature service.
   */
  spatialReference?: ISpatialReference;
  /**
   * The initial extent set for the service.
   */
  initialExtent?: IExtent;
  /**
   * Indicates if updating the geometry of the service is permitted.
   */
  allowGeometryUpdates?: boolean;
  /**
   * Units used by the feature service
   */
  units?: string;
  /**
   * A JSON object specifying the properties of cross-site scripting prevention.
   */
  xssPreventionInfo?: any;
}

export interface IAddFeatureServiceRequestOptions
  extends IItemCrudRequestOptions {
  /**
   * A JSON object specifying the properties of the newly-created service. See the [REST
   * Documentation](https://developers.arcgis.com/rest/users-groups-and-items/working-with-users-groups-and-items.htm)
   * for more information.
   */
  item: IFeatureServiceAdd;
  /**
   * Alphanumeric id of folder to house moved item. If null, empty, or "/", the destination is the
   * root folder.
   */
  folderId?: string;
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

  if (!requestOptions.folderId || requestOptions.folderId === "/") {
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
          folder: requestOptions.folderId,
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
