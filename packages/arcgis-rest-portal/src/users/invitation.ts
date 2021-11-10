/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IUserRequestOptions,
  IGroup
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";

export interface IInvitation {
  id: string;
  targetType: string;
  targetId: string;
  received: number;
  accepted: boolean;
  mustApprove: boolean;
  email: string;
  role: string;
  type: string;
  dateAccepted: number;
  expiration: number;
  created: number;
  username: string;
  fromUsername: {
    username: string;
    fullname?: string;
  };
  group?: IGroup;
  groupId?: string;
}

export interface IInvitationResult {
  userInvitations: IInvitation[];
}

/**
 * ```js
 * import { getUserInvitations } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * getUserInvitations({ authentication })
 *   .then(response) // response.userInvitations.length => 3
 * ```
 * Get all invitations for a user. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitations.htm) for more information.
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's invitations
 */
export function getUserInvitations(
  requestOptions: IUserRequestOptions
): Promise<IInvitationResult> {
  let options = { httpMethod: "GET" } as IUserRequestOptions;

  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations`;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

export interface IGetUserInvitationOptions extends IUserRequestOptions {
  invitationId: string;
}

/**
 * ```js
 * import { getUserInvitation } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * getUserInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response) // => response.accepted => true
 * ```
 * Get an invitation for a user by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitation.htm) for more information.
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the invitation
 */
export function getUserInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<IInvitation> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}`;

  let options = { httpMethod: "GET" } as IGetUserInvitationOptions;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

/**
 * ```js
 * import { acceptInvitation } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * acceptInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Accept an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/accept-invitation.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function acceptInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<{
  success: boolean;
  username: string;
  groupId: string;
  id: string;
}> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/accept`;

  const options: IGetUserInvitationOptions = { ...requestOptions };
  return request(url, options);
}

/**
 * ```js
 * import { declineInvitation } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * declineInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Decline an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/decline-invitation.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function declineInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<{
  success: boolean;
  username: string;
  groupId: string;
  id: string;
}> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/decline`;

  const options: IGetUserInvitationOptions = { ...requestOptions };
  return request(url, options);
}
