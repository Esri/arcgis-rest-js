/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IAuthenticatedRequestOptions,
  IGroup
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";
import { determineUsername } from "../util/determine-username.js";

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
export async function getUserInvitations(
  requestOptions: IAuthenticatedRequestOptions
): Promise<IInvitationResult> {
  let options = { httpMethod: "GET" } as IAuthenticatedRequestOptions;
  const username = await determineUsername(requestOptions);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations`;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

export interface IGetUserInvitationOptions
  extends IAuthenticatedRequestOptions {
  invitationId: string;
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
export async function getUserInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<IInvitation> {
  const username = await determineUsername(requestOptions);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}`;

  let options = { httpMethod: "GET" } as IGetUserInvitationOptions;
  options = { ...requestOptions, ...options };

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
export async function acceptInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<{
  success: boolean;
  username: string;
  groupId: string;
  id: string;
}> {
  const username = await determineUsername(requestOptions);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/accept`;

  const options: IGetUserInvitationOptions = { ...requestOptions };
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
export async function declineInvitation(
  requestOptions: IGetUserInvitationOptions
): Promise<{
  success: boolean;
  username: string;
  groupId: string;
  id: string;
}> {
  const username = await determineUsername(requestOptions);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/decline`;

  const options: IGetUserInvitationOptions = { ...requestOptions };
  return request(url, options);
}
