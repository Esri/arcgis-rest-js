/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import {
  ISharingRequestOptions,
  ISharingResponse,
  isAdmin,
  getUserMembership,
  getOwner
} from "./helper";

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
  const username = requestOptions.authentication.username;
  const owner = requestOptions.owner || username;

  return isAdmin(requestOptions).then(admin => {
    const resultProp =
      requestOptions.action === "share" ? "notSharedWith" : "notUnsharedFrom";
    // check if the item is already shared with group...
    return isItemSharedWithGroup(requestOptions).then(result => {
      // if we are sharing and result is true OR we are unsharing and result is false... short circuit
      if (
        (requestOptions.action === "share" && result === true) ||
        (requestOptions.action === "unshare" && result === false)
      ) {
        // item is shared so we can short-circuit here and send back the same structure ago would
        const obj = { itemId: requestOptions.id, shortcut: true } as any;
        obj[resultProp] = [];
        return obj;
      } else {
        // is the user a member of the group?
        return getUserMembership(requestOptions)
          .then(membership => {
            if (!membership) {
              // reject the whole thing...
              throw Error(
                `This item can not be shared by ${username} as they are not a member of the specified group ${
                  requestOptions.groupId
                }.`
              );
            } else {
              // user is a member of the group - now we figure out if/how they can share it...
              // if user is the owner, or orgAdmin, they can share to the group using the item-owner url...
              if (requestOptions.owner && requestOptions.owner === username) {
                return `${getPortalUrl(
                  requestOptions
                )}/content/users/${owner}/items/${requestOptions.id}/${
                  requestOptions.action
                }`;
              } else {
                if (membership === "admin" || admin) {
                  return `${getPortalUrl(requestOptions)}/content/items/${
                    requestOptions.id
                  }/${requestOptions.action}`;
                } else {
                  // user can not share item to group b/c they don't own the item
                  throw Error(
                    `This item can not be ${
                      requestOptions.action
                    } by ${username} as they are neither the owner, a groupAdmin of ${
                      requestOptions.groupId
                    }, nor an org_admin.`
                  );
                }
              }
            }
          })
          .then(urlPath => {
            // actually do the sharing...
            requestOptions.params = {
              groups: requestOptions.groupId,
              confirmItemControl: requestOptions.confirmItemControl
            };
            // if we mixed in, the old query parameters would be passed through

            return request(urlPath, requestOptions);
          })
          .then(sharingResult => {
            if (sharingResult[resultProp].length) {
              throw Error(
                `Item ${requestOptions.id} could not be ${
                  requestOptions.action
                }ed to group ${requestOptions.groupId}.`
              );
            } else {
              // all is well
              return sharingResult;
            }
          });
      } // else
    }); // then
  });
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
    ...query,
    ...requestOptions.params
  };
  // more manual than calling out to "@esri/arcgis-rest-items, but trims a dependency
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
