/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, getPortalUrl } from "@esri/arcgis-rest-request";

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IGroup } from "@esri/arcgis-rest-common-types";

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
 * import { getUserInvitations } from '@esri/arcgis-rest-users';
 *
 * // username is inferred from UserSession
 * getUserInvitations({ authentication })
 * .then((results) => {
 *   console.log(results.userInvitations.length); // 3
 * })
 * ```
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

export interface IInvitationRequestOptions extends IUserRequestOptions {
  invitationId: string;
}

/**
 * Get an invitation for a user by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitation.htm) for more information.
 *
 * ```js
 * import { getUserInvitation } from '@esri/arcgis-rest-users';
 *
 * // username is inferred from UserSession
 * getUserInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then((results) => {
 *     console.log(results.accepted); // true
 *   })
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the invitation
 */
export function getUserInvitation(
  requestOptions: IInvitationRequestOptions
): Promise<IInvitation> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${
    requestOptions.invitationId
  }`;

  let options = { httpMethod: "GET" } as IInvitationRequestOptions;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

/**
 * Accept an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/accept-invitation.htm) for more information.
 *
 * ```js
 * import { acceptInvitation } from '@esri/arcgis-rest-users';
 *
 * // username is inferred from UserSession
 * acceptInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then((response) => {
 *     console.log(response.success); // true
 *   })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function acceptInvitation(
  requestOptions: IInvitationRequestOptions
): Promise<any> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${
    requestOptions.invitationId
  }/accept`;

  const options: IInvitationRequestOptions = { ...requestOptions };
  return request(url, options);
}

/**
 * Decline an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/decline-invitation.htm) for more information.
 *
 * ```js
 * import { declineInvitation } from '@esri/arcgis-rest-users';
 *
 * // username is inferred from UserSession
 * declineInvitation({
 *   invitationId: "3ef",
 *   authentication
 * })
 *   .then((response) => {
 *     console.log(response.success); // true
 *   })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function declineInvitation(
  requestOptions: IInvitationRequestOptions
): Promise<any> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/invitations/${
    requestOptions.invitationId
  }/decline`;

  const options: IInvitationRequestOptions = { ...requestOptions };
  return request(url, options);
}
