import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { getUserMembership } from "./helpers.js";
import { getUser } from "../users/get-user.js";
import { addGroupUsers } from "../groups/add-users.js";
import { removeGroupUsers } from "../groups/remove-users.js";
import { updateUserMemberships } from "../groups/update-user-membership.js";
import { isItemSharedWithGroup } from "../sharing/is-item-shared-with-group.js";
/**
 * Share an item with a group, either as an [item owner](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-item-owner-.htm), [group admin](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-group-admin-.htm) or organization admin.
 *
 * Sharing the item as an Admin will use the `/content/users/:ownername/items/:itemid/share` end-point
 *
 * ```js
 * import { shareItemWithGroup } from '@esri/arcgis-rest-portal';
 *
 * shareItemWithGroup({
 *   id: "abc123",
 *   groupId: "xyz987",
 *   owner: "some-owner",
 *   authentication
 * })
 * ```
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the data from the response.
 */
export function shareItemWithGroup(requestOptions) {
    return isItemSharedWithGroup(requestOptions)
        .then((isShared) => {
        if (isShared) {
            // already shared, exit early with success response
            return {
                itemId: requestOptions.id,
                shortcut: true,
                notSharedWith: []
            };
        }
        const { authentication: { username }, owner, confirmItemControl } = requestOptions;
        const itemOwner = owner || username;
        // non-item owner
        if (itemOwner !== username) {
            // need to track if the user is an admin
            let isAdmin = false;
            // track if the admin & owner are in the same org
            let isCrossOrgSharing = false;
            // next perform any necessary membership adjustments for
            // current user and/or item owner
            return Promise.all([
                getUser({
                    username,
                    authentication: requestOptions.authentication
                }),
                getUser({
                    username: itemOwner,
                    authentication: requestOptions.authentication
                }),
                getUserMembership(requestOptions)
            ])
                .then(([currentUser, ownerUser, membership]) => {
                const isSharedEditingGroup = !!confirmItemControl;
                isAdmin = currentUser.role === "org_admin" && !currentUser.roleId;
                isCrossOrgSharing = currentUser.orgId !== ownerUser.orgId;
                return getMembershipAdjustments(currentUser, isSharedEditingGroup, membership, isAdmin, ownerUser, requestOptions);
            })
                .then((membershipAdjustments) => {
                const [{ revert } = {
                    promise: Promise.resolve({ notAdded: [] }),
                    revert: (sharingResults) => {
                        return Promise.resolve(sharingResults);
                    }
                }] = membershipAdjustments;
                // perform all membership adjustments
                return Promise.all(membershipAdjustments.map(({ promise }) => promise))
                    .then(() => {
                    // then attempt the share
                    return shareToGroup(requestOptions, isAdmin, isCrossOrgSharing);
                })
                    .then((sharingResults) => {
                    // lastly, if the admin user was added to the group,
                    // remove them from the group. this is a no-op that
                    // immediately resolves the sharingResults when no
                    // membership adjustment was needed
                    return revert(sharingResults);
                });
            });
        }
        // item owner, let it call through
        return shareToGroup(requestOptions);
    })
        .then((sharingResponse) => {
        if (sharingResponse.notSharedWith.length) {
            throw Error(`Item ${requestOptions.id} could not be shared to group ${requestOptions.groupId}.`);
        }
        else {
            // all is well
            return sharingResponse;
        }
    });
}
function getMembershipAdjustments(currentUser, isSharedEditingGroup, membership, isAdmin, ownerUser, requestOptions) {
    const membershipGuarantees = [];
    if (requestOptions.groupId !== currentUser.favGroupId) {
        if (isSharedEditingGroup) {
            if (!isAdmin) {
                // abort and reject promise
                throw Error(`This item can not be shared to shared editing group ${requestOptions.groupId} by ${currentUser.username} as they not the item owner or org admin.`);
            }
            membershipGuarantees.push(
            // admin user must be a group member to share, should be reverted afterwards
            ensureMembership(currentUser, currentUser, false, `Error adding ${currentUser.username} as member to edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions), 
            // item owner must be a group admin
            ensureMembership(currentUser, ownerUser, true, membership === "none"
                ? `Error adding user ${ownerUser.username} to edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`
                : `Error promoting user ${ownerUser.username} to admin in edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions));
        }
        else if (isAdmin) {
            // admin user must be a group member to share, should be reverted afterwards
            membershipGuarantees.push(ensureMembership(currentUser, currentUser, false, `Error adding ${currentUser.username} as member to view group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions));
        }
        else if (membership === "none") {
            // all other non-item owners must be a group member
            throw new Error(`This item can not be shared by ${currentUser.username} as they are not a member of the specified group ${requestOptions.groupId}.`);
        }
    }
    return membershipGuarantees;
}
function shareToGroup(requestOptions, isAdmin = false, isCrossOrgSharing = false) {
    const username = requestOptions.authentication.username;
    const itemOwner = requestOptions.owner || username;
    // decide what url to use
    // default to the non-owner url...
    let url = `${getPortalUrl(requestOptions)}/content/items/${requestOptions.id}/share`;
    // but if they are the owner, or org_admin, use this route
    // Note: When using this end-point as an admin, apparently the admin does not need to be a member of the group (the itemOwner does)
    // Note: Admin's can only use this route when the item is in the same org they are admin for
    if (itemOwner === username || (isAdmin && !isCrossOrgSharing)) {
        url = `${getPortalUrl(requestOptions)}/content/users/${itemOwner}/items/${requestOptions.id}/share`;
    }
    // now its finally time to do the sharing
    requestOptions.params = {
        groups: requestOptions.groupId,
        confirmItemControl: requestOptions.confirmItemControl
    };
    return request(url, requestOptions);
}
export function ensureMembership(currentUser, ownerUser, shouldPromote, errorMessage, requestOptions) {
    const ownerGroups = ownerUser.groups || [];
    const group = ownerGroups.find((g) => {
        return g.id === requestOptions.groupId;
    });
    // if they are in different orgs, eject
    if (currentUser.orgId !== ownerUser.orgId) {
        throw Error(`User ${ownerUser.username} is not a member of the same org as ${currentUser.username}. Consequently they can not be added added to group ${requestOptions.groupId} nor can item ${requestOptions.id} be shared to the group.`);
    }
    // if owner is not a member, and has 512 groups
    if (!group && ownerGroups.length > 511) {
        throw Error(`User ${ownerUser.username} already has 512 groups, and can not be added to group ${requestOptions.groupId}. Consequently item ${requestOptions.id} can not be shared to the group.`);
    }
    let promise;
    let revert;
    // decide if we need to add them or upgrade them
    if (group) {
        // they are in the group...
        // check member type
        if (shouldPromote && group.userMembership.memberType === "member") {
            // promote them
            promise = updateUserMemberships({
                id: requestOptions.groupId,
                users: [ownerUser.username],
                newMemberType: "admin",
                authentication: requestOptions.authentication
            })
                .then((results) => {
                // convert the result into the right type
                const notAdded = results.results.reduce((acc, entry) => {
                    if (!entry.success) {
                        acc.push(entry.username);
                    }
                    return acc;
                }, []);
                // and return it
                return Promise.resolve({ notAdded });
            })
                .catch(() => ({ notAdded: [ownerUser.username] }));
            revert = (sharingResults) => updateUserMemberships({
                id: requestOptions.groupId,
                users: [ownerUser.username],
                newMemberType: "member",
                authentication: requestOptions.authentication
            })
                .then(() => sharingResults)
                .catch(() => sharingResults);
        }
        else {
            // they are already an admin in the group
            // return the same response the API would if we added them
            promise = Promise.resolve({ notAdded: [] });
            revert = (sharingResults) => Promise.resolve(sharingResults);
        }
    }
    else {
        // attempt to add user to group
        const userType = shouldPromote ? "admins" : "users";
        // can't currently determine if the group is within the admin's
        // org without performing a search, so attempt to add and handle
        // the api error
        promise = addGroupUsers({
            id: requestOptions.groupId,
            [userType]: [ownerUser.username],
            authentication: requestOptions.authentication
        })
            .then((results) => {
            // results.errors includes an ArcGISAuthError when the group
            // is in a different org, but notAdded is empty, throw here
            // to normalize the results in below catch
            if (results.errors && results.errors.length) {
                throw results.errors[0];
            }
            return results;
        })
            .catch(() => ({ notAdded: [ownerUser.username] }));
        revert = (sharingResults) => {
            return removeGroupUsers({
                id: requestOptions.groupId,
                users: [ownerUser.username],
                authentication: requestOptions.authentication
            }).then(() => {
                // always resolves, suppress any resolved errors
                return sharingResults;
            });
        };
    }
    return {
        promise: promise.then((membershipResponse) => {
            if (membershipResponse.notAdded.length) {
                throw new Error(errorMessage);
            }
            return membershipResponse;
        }),
        revert
    };
}
//# sourceMappingURL=share-item-with-group.js.map