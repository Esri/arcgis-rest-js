/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
/**
 * Get all invitations for a user. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitations.htm) for more information.
 *
 * ```js
 * import { getUserInvitations } from '@esri/arcgis-rest-portal';
 *
 * getUserInvitations({ authentication })
 *   .then(response) // response.userInvitations.length => 3
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's invitations
 */
export function getUserInvitations(requestOptions) {
    let options = { httpMethod: "GET" };
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/invitations`;
    options = Object.assign(Object.assign({}, requestOptions), options);
    // send the request
    return request(url, options);
}
/**
 * Get an invitation for a user by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitation.htm) for more information.
 *
 * ```js
 * import { getUserInvitation } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * getUserInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response) // => response.accepted => true
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the invitation
 */
export function getUserInvitation(requestOptions) {
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}`;
    let options = { httpMethod: "GET" };
    options = Object.assign(Object.assign({}, requestOptions), options);
    // send the request
    return request(url, options);
}
/**
 * Accept an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/accept-invitation.htm) for more information.
 *
 * ```js
 * import { acceptInvitation } from '@esri/arcgis-rest-portal';
 *
 * acceptInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function acceptInvitation(requestOptions) {
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/accept`;
    const options = Object.assign({}, requestOptions);
    return request(url, options);
}
/**
 * Decline an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/decline-invitation.htm) for more information.
 *
 * ```js
 * import { declineInvitation } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * declineInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function declineInvitation(requestOptions) {
    const username = encodeURIComponent(requestOptions.authentication.username);
    const portalUrl = getPortalUrl(requestOptions);
    const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/decline`;
    const options = Object.assign({}, requestOptions);
    return request(url, options);
}
//# sourceMappingURL=invitation.js.map