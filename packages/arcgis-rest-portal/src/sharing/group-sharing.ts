/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url";
import {
  IGroupSharingOptions,
  ISharingResponse,
  isOrgAdmin,
  getUserMembership
} from "./helpers";
import { getUser } from "../users/get-user";
import { addGroupUsers, IAddGroupUsersResult } from "../groups/add-users";
import { updateUserMemberships } from "../groups/update-user-membership";
import { searchItems } from "../items/search";
import { ISearchOptions } from "../util/search";

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

  return isOrgAdmin(requestOptions).then(isAdmin => {
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
            // Stack all the exception conditions up top so we can
            // strealine the promise chain
            // if user is not a member of the group and not an orgAdmin
            if (membership === "none" && !isAdmin) {
              // abort and reject promise
              throw Error(
                `This item can not be ${requestOptions.action}d by ${username} as they are not a member of the specified group ${requestOptions.groupId}.`
              );
            }
            // it's a sharedEditing Group and user is not owner, org orgAdmin
            if (isSharedEditingGroup && itemOwner !== username && !isAdmin) {
              // abort and reject promise
              throw Error(
                `This item can not be ${requestOptions.action}d to shared editing group ${requestOptions.groupId} by ${username} as they not the item owner.`
              );
            }

            // only item-owners, group-admin's, group-owners can unshare an item from a group
            if (
              requestOptions.action === "unshare" &&
              itemOwner !== username && // not item owner
              membership !== "admin" && // not group admin
              membership !== "owner" // not group owner
            ) {
              throw Error(
                `This item can not be ${requestOptions.action}d from group ${requestOptions.groupId} by ${username} as they not the item owner, group admin or group owner.`
              );
            }

            // if it's a sharedEditing Group, and the current user is not the owner, but an OrgAdmin
            // then we can let call shareToGroupAsAdmin which will add the owner to the group
            // and then share the item to the group
            if (isSharedEditingGroup && itemOwner !== username && isAdmin) {
              return shareToGroupAsAdmin(requestOptions);
            } else {
              // if the current user is a member of the target group
              if (membership !== "none") {
                // we let the sharing call go
                return shareToGroup(requestOptions);
              } else {
                // otherwise - even if they are org_admin - we throw staying the current user must be a member of the group
                throw Error(
                  `This item can not be ${requestOptions.action}d by ${username} as they are not a member of the specified group ${requestOptions.groupId}.`
                );
              }
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

function shareToGroupAsAdmin(
  requestOptions: IGroupSharingUnsharingOptions
): Promise<ISharingResponse> {
  const itemOwner = requestOptions.owner;

  return getUser({
    username: itemOwner,
    authentication: requestOptions.authentication
  })
    .then(userDetails => {
      const userGroups = userDetails.groups;
      const group = userGroups.find(g => {
        return g.id === requestOptions.groupId;
      });
      if (group) {
        // they are in the group...
        // check member type
        if (group.userMembership.memberType !== "admin") {
          // promote them
          return updateUserMemberships({
            id: requestOptions.groupId,
            users: [itemOwner],
            newMemberType: "admin",
            authentication: requestOptions.authentication
          }).then(response => {
            // convert the result into the right type
            const notAdded = response.results.reduce(
              (acc: any[], entry: any) => {
                if (!entry.success) {
                  acc.push(entry.username);
                }
                return acc;
              },
              []
            );
            // and return it
            return {
              notAdded
            } as IAddGroupUsersResult;
          });
        } else {
          // they are already an admin in the group
          // return the same response the API would if we added them
          return { notAdded: [] } as IAddGroupUsersResult;
        }
      } else {
        // add user to group as an admin
        return addGroupUsers({
          id: requestOptions.groupId,
          admins: [itemOwner],
          authentication: requestOptions.authentication
        });
      }
    })
    .then(membershipResponse => {
      if (membershipResponse.notAdded.length) {
        throw Error(
          `Error adding user ${itemOwner} to group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`
        );
      } else {
        // then make the sharing call
        return shareToGroup(requestOptions);
      }
    });
}

function shareToGroup(
  requestOptions: IGroupSharingUnsharingOptions
): Promise<ISharingResponse> {
  const username = requestOptions.authentication.username;
  const itemOwner = requestOptions.owner || username;
  // decide what url to use
  // default to the non-owner url...
  let url = `${getPortalUrl(requestOptions)}/content/items/${
    requestOptions.id
  }/${requestOptions.action}`;

  // but if they are the owner, we use a different path...
  if (itemOwner === username) {
    url = `${getPortalUrl(requestOptions)}/content/users/${itemOwner}/items/${
      requestOptions.id
    }/${requestOptions.action}`;
  }

  // now its finally time to do the sharing
  requestOptions.params = {
    groups: requestOptions.groupId,
    confirmItemControl: requestOptions.confirmItemControl
  };

  return request(url, requestOptions);
}

/**
 * ```js
 * import { isItemSharedWithGroup } from "@esri/arcgis-rest-portal";
 * //
 * isItemSharedWithGroup({
 *   groupId: 'bc3,
 *   itemId: 'f56,
 *   authentication
 * })
 * .then(isShared => {})
 * ```
 * Find out whether or not an item is already shared with a group.
 *
 * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
 * @returns Promise that will resolve with true/false
 */
export function isItemSharedWithGroup(
  requestOptions: IGroupSharingOptions
): Promise<boolean> {
  const searchOpts = {
    q: `id: ${requestOptions.id} AND group: ${requestOptions.groupId}`,
    start: 1,
    num: 10,
    sortField: "title",
    authentication: requestOptions.authentication,
    httpMethod: "POST"
  } as ISearchOptions;

  return searchItems(searchOpts).then(searchResponse => {
    let result = false;
    if (searchResponse.total > 0) {
      result = searchResponse.results.some((itm: any) => {
        return itm.id === requestOptions.id;
      });
      return result;
    }
  });
}
