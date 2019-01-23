/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IItem, IGroup } from "@esri/arcgis-rest-common-types";

import { IItemIdRequestOptions, IItemDataRequestOptions } from "./helpers";

/**
 * Get an item by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item.htm) for more information.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function getItem(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IItem> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Get the /data for an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-data.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the json data for the item.
 */
export function getItemData(
  id: string,
  requestOptions?: IItemDataRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}/data`;
  // default to a GET request
  const options: IItemDataRequestOptions = {
    ...{ httpMethod: "GET", params: {} },
    ...requestOptions
  };

  if (options.file) {
    options.params.f = null;
  }

  return request(url, options);
}

/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export function getItemResources(
  requestOptions: IItemIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${
    requestOptions.id
  }/resources`;

  // mix in user supplied params
  requestOptions.params = {
    ...requestOptions.params,
    num: 1000
  };
  // at v2, the argument signature of this method should match getItemData() and getItemGroups() if requests can be made anonymously
  return request(url, requestOptions);
}

export interface IItemGroupResponse {
  admin?: IGroup[];
  member?: IGroup[];
  other?: IGroup[];
}

/**
 * ```js
 * import { getItemGroups } from "@esri/arcgis-rest-items";
 * //
 * getItemGroups("30e5fe3149c34df1ba922e6f5bbf808f")
 *   .then(response)
 * ```
 * Lists the groups of which the item is a part, only showing the groups that the calling user can access. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/groups.htm) for more information.
 *
 * @param id - The Id of the item to query group association for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item groups.
 */
export function getItemGroups(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IItemGroupResponse> {
  const url = `${getPortalUrl(requestOptions)}/content/items/${id}/groups`;

  return request(url, requestOptions);
}
