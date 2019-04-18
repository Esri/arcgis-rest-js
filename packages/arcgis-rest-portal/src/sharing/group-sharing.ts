/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { getPortalUrl } from "../util/get-portal-url";
import {
  ISharingRequestOptions,
  ISharingResponse,
  isOrgAdmin,
  getUserMembership
} from "./helpers";

export interface IGroupSharingRequestOptions extends ISharingRequestOptions {
  /**
   * Group identifier
   */
  groupId: string;
  confirmItemControl?: boolean;
}

interface IGroupSharingUnsharingRequestOptions
  extends IGroupSharingRequestOptions {
  action: "share" | "unshare";
}

/**
 * ```js
 * import { shareItemWithGroup } from '@esri/arcgis-rest-portal';
 * //
 * shareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   authentication
 * })
 * ```
 * Share an item with a group, either as an [item owner](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-item-owner-.htm), [group admin]((https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-group-admin-.htm)) or organization admin.
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
 * Stop sharing an item with a group, either as an [item owner](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-item-owner-.htm), [group admin]((https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-group-admin-.htm)) or organization admin.
 *
 * ```js
 * import { unshareItemWithGroup } from '@esri/arcgis-rest-portal';
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
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;

  return isOrgAdmin(requestOptions).then(admin => {
    const resultProp =
      requestOptions.action === "share" ? "notSharedWith" : "notUnsharedFrom";
    // check if the item has already been shared with the group...
    return isItemSharedWithGroup(requestOptions).then(result => {
      // if we are sharing and result is true OR we are unsharing and result is false... short circuit
      if (
        (requestOptions.action === "share" && result === true) ||
        (requestOptions.action === "unshare" && result === false)
      ) {
        // and send back the same response ArcGIS Online would
        const response = {
          itemId: requestOptions.id,
          shortcut: true
        } as ISharingResponse;
        response[resultProp] = [];
        return response;
      } else {
        // next check to ensure the user is a member of the group
        return getUserMembership(requestOptions)
          .then(membership => {
            if (membership === "nonmember") {
              // abort and reject promise
              throw Error(
                `This item can not be ${
                  requestOptions.action
                }d by ${username} as they are not a member of the specified group ${
                  requestOptions.groupId
                }.`
              );
            } else {
              // if owner (and member of group) share using the owner url
              if (owner === username) {
                return `${getPortalUrl(
                  requestOptions
                )}/content/users/${owner}/items/${requestOptions.id}/${
                  requestOptions.action
                }`;
              } else {
                // if org admin, group admin/owner, use the bare item url
                if (membership === "admin" || membership === "owner" || admin) {
                  return `${getPortalUrl(requestOptions)}/content/items/${
                    requestOptions.id
                  }/${requestOptions.action}`;
                } else {
                  // otherwise abort
                  throw Error(
                    `This item can not be ${
                      requestOptions.action
                    }d by ${username} as they are neither the owner, a groupAdmin of ${
                      requestOptions.groupId
                    }, nor an org_admin.`
                  );
                }
              }
            }
          })
          .then(url => {
            // now its finally time to do the sharing
            requestOptions.params = {
              groups: requestOptions.groupId,
              confirmItemControl: requestOptions.confirmItemControl
            };
            // dont mixin to ensure that old query parameters from the search request arent included
            return request(url, requestOptions);
          })
          .then(sharingResponse => {
            if (sharingResponse[resultProp].length) {
              throw Error(
                `Item ${requestOptions.id} could not be ${
                  requestOptions.action
                }d to group ${requestOptions.groupId}.`
              );
            } else {
              // all is well
              return sharingResponse;
            }
          });
      } // else
    }); // then
  });
}

/**
 * Find out whether or not an item is already shared with a group.
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
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

  // we need to append some params into requestOptions, so make a clone
  // instead of mutating the params on the inbound requestOptions object
  const options = { ...requestOptions, rawResponse: false };
  // instead of calling out to "@esri/arcgis-rest-items, make the request manually to forgoe another dependency
  options.params = {
    ...query,
    ...requestOptions.params
  };

  const url = `${getPortalUrl(options)}/search`;

  return request(url, options).then(searchResponse => {
    // if there are no search results at all, we know the item hasnt already been shared with the group
    if (searchResponse.total === 0) {
      return false;
    } else {
      let sharedItem: IItem;
      // otherwise loop through and search for the id
      searchResponse.results.some((item: IItem) => {
        const matchedItem = item.id === requestOptions.id;
        if (matchedItem) {
          sharedItem = item;
        }
        return matchedItem;
      });

      if (sharedItem) {
        return true;
      } else {
        return false;
      }
    }
  });
}
