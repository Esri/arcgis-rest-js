/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { ISharingRequestOptions, ISharingResponse } from "./helper";

export interface IGroupSharingRequestOptions extends ISharingRequestOptions {
  /**
   * Group identifier
   */
  groupId: string;
}

interface IGroupSharingUnsharingRequestOptions
  extends IGroupSharingRequestOptions {
  action: "share" | "unshare";
}

/**
 * Share an item with a group.
 *
 * ```js
 * import { shareItemWithGroup } from '@esri/arcgis-rest-sharing';
 *
 * shareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export function shareItemWithGroup(
  requestOptions: IGroupSharingRequestOptions
): Promise<ISharingResponse> {
  return changeGroupSharing({ action: "share", ...requestOptions });
}

/**
 * Stop sharing an item with a group.
 *
 * ```js
 * import { unshareItemWithGroup } from '@esri/arcgis-rest-sharing';
 *
 * unshareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   authentication: session
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export function unshareItemWithGroup(
  requestOptions: IGroupSharingRequestOptions
): Promise<ISharingResponse> {
  return changeGroupSharing({ action: "unshare", ...requestOptions });
}

/**
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
function changeGroupSharing(
  requestOptions: IGroupSharingUnsharingRequestOptions
): Promise<ISharingResponse> {
  // https://github.com/Esri/ember-arcgis-portal-services/blob/master/addon/services/sharing-service.js
  return request("http://google.com", requestOptions);
}

/**
 * Find out whether or not an item is already shared with a group.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
function isItemSharedWithGroup(
  requestOptions: IGroupSharingRequestOptions
): Promise<boolean> {
  const query = {
    q: `id: ${requestOptions.id} AND group: ${requestOptions.groupId}`,
    start: 1,
    num: 10,
    sortField: "title"
  };

  requestOptions.params = {
    query,
    ...requestOptions.params
  };

  const url = `${getPortalUrl(requestOptions)}/search`;
  return request(url, requestOptions).then(searchResult => {
    if (searchResult.total === 0) {
      return false;
    } else {
      // Check that the item actually was returned
      const results = searchResult.results;
      const itm = results.find((shadowedItm: { id: string }) => {
        return shadowedItm.id === requestOptions.id;
      });
      if (itm) {
        return true;
      } else {
        return false;
      }
    }
  });
}
