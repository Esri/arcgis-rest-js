/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";
import { getPortalUrl } from "../util/get-portal-url";
import {
  IGroupSharingOptions,
  ISharingResponse,
  isOrgAdmin,
  getUserMembership
} from "./helpers";

interface IGroupSharingUnsharingOptions extends IGroupSharingOptions {
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
 * Share an item with a group, either as an
 * [item owner](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-item-owner-.htm),
 * [group admin](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-group-admin-.htm) or
 * organization admin.
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export function shareItemWithGroup(
  requestOptions: IGroupSharingOptions
): Promise<ISharingResponse> {
  return changeGroupSharing({ action: "share", ...requestOptions });
}

/**
 * Stop sharing an item with a group, either as an
 * [item owner](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-item-owner-.htm),
 * [group admin](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-group-admin-.htm) or
 * organization admin.
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
  requestOptions: IGroupSharingOptions
): Promise<ISharingResponse> {
  return changeGroupSharing({ action: "unshare", ...requestOptions });
}

/**
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
function changeGroupSharing(
  requestOptions: IGroupSharingUnsharingOptions
): Promise<ISharingResponse> {
  const username = requestOptions.authentication.username;
  const itemOwner = requestOptions.owner || username;
  const isSharedEditingGroup = requestOptions.confirmItemControl || false;

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
            // if user is not a member of the group and not an admin
            if (membership === "none" && !admin) {
              // abort and reject promise
              throw Error(
                `This item can not be ${requestOptions.action}d by ${username} as they are not a member of the specified group ${requestOptions.groupId}.`
              );
            } else {
              // ...they are some level of membership or org-admin
              // if the current user does not own the item...
              if (itemOwner !== username) {
                // only item owners or org_admins can share/unshare items w/ shared editing groups
                if (isSharedEditingGroup) {
                  throw Error(
                    `This item can not be ${requestOptions.action}d to shared editing group ${requestOptions.groupId} by ${username} as they not the item owner.`
                  );
                }
                // only item-owners, group-admin's, group-owners or org_admin's can unshare an item from a group
                if (
                  requestOptions.action === "unshare" &&
                  membership !== "admin" && // not group admin
                  membership !== "owner" // not group owner
                ) {
                  throw Error(
                    `This item can not be ${requestOptions.action}d from group ${requestOptions.groupId} by ${username} as they not the item owner, group admin or group owner.`
                  );
                }
              }

              // at this point, the user *should* be able to take the action

              // only question is what url to use

              // default to the non-owner url...
              let url = `${getPortalUrl(requestOptions)}/content/items/${
                requestOptions.id
              }/${requestOptions.action}`;

              // but if they are the owner, we use a different path...
              if (itemOwner === username) {
                url = `${getPortalUrl(
                  requestOptions
                )}/content/users/${itemOwner}/items/${requestOptions.id}/${
                  requestOptions.action
                }`;
              }

              // now its finally time to do the sharing
              requestOptions.params = {
                groups: requestOptions.groupId,
                confirmItemControl: requestOptions.confirmItemControl
              };

              return request(url, requestOptions);
            }
          })
          .then(sharingResponse => {
            if (sharingResponse[resultProp].length) {
              throw Error(
                `Item ${requestOptions.id} could not be ${requestOptions.action}d to group ${requestOptions.groupId}.`
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
  requestOptions: IGroupSharingOptions
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

  // to do: just call searchItems now that its in the same package
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
