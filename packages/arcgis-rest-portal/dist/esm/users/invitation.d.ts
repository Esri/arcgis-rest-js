import { IUserRequestOptions, IGroup } from "@esri/arcgis-rest-request";
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
export declare function getUserInvitations(requestOptions: IUserRequestOptions): Promise<IInvitationResult>;
export interface IGetUserInvitationOptions extends IUserRequestOptions {
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
export declare function getUserInvitation(requestOptions: IGetUserInvitationOptions): Promise<IInvitation>;
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
export declare function acceptInvitation(requestOptions: IGetUserInvitationOptions): Promise<{
    success: boolean;
    username: string;
    groupId: string;
    id: string;
}>;
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
export declare function declineInvitation(requestOptions: IGetUserInvitationOptions): Promise<{
    success: boolean;
    username: string;
    groupId: string;
    id: string;
}>;
