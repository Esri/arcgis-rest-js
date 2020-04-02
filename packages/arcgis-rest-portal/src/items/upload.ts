/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url";
import {
  IUserItemOptions,
  IUpdateItemResponse,
  determineOwner
} from "./helpers";

/**
 * ```js
 * import { commitItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * commitItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Commit is called once all parts are uploaded during a multipart Add Item or Update Item operation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/commit.htm) for more information.
 *
 * @param id - The Id of the item to commit upload for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
export function commitItemUpload(
  requestOptions?: IUserItemOptions
): Promise<IUpdateItemResponse> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/commit`;

    return request(url, requestOptions);
  });
}

/**
 * ```js
 * import { cancelItemUpload } from "@esri/arcgis-rest-portal";
 * //
 * cancelItemUpload({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Cancels a multipart upload on an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/cancel.htm) for more information.
 *
 * @param id - The Id of the item to cancel upload for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the commit result.
 */
export function cancelItemUpload(
  requestOptions?: IUserItemOptions
): Promise<IUpdateItemResponse> {
  return determineOwner(requestOptions).then(owner => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/cancel`;

    return request(url, requestOptions);
  });
}
