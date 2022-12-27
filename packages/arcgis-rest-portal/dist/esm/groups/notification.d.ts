import { IUserGroupOptions } from "./helpers.js";
export declare type NotificationChannelType = "push" | "email" | "builtin";
export interface ICreateGroupNotificationOptions extends IUserGroupOptions {
    /**
     * Subject of the notification. This only applies to email and builtin notifications. For push notifications, subject/title is provided as a part of the message payload.
     */
    subject?: string;
    /**
     * Message to be sent. For builtin and email notifications this is a string. For push notifications, this will be JSON.
     */
    message: string | object;
    /**
     * Array of usernames of the users in the group to whom the message should be sent. If not provided, the message will be sent to all users in the group if the user is an admin. Only group admins will be able to send notifications to a list of users. Group users will be able to send notifications to only one user at a time.
     */
    users?: string[];
    /**
     * The channel through which the notification is to be delivered. Supported values are push, email, or builtin. If push is chosen, a message will be delivered only to those group members that have registered their devices to receive push notifications. If the user has registered more than one device for the app, then message will be sent to all the registered devices. Email will be sent when the email option is chosen. If the builtin option is chosen, a notification will be added to the notifications list that the user can see when logged into the home app.
     */
    notificationChannelType?: NotificationChannelType;
    /**
     * ClientId of the application through which user receives messages on the mobile device. This only applies to push notifications.
     */
    clientId?: string;
    /**
     * This only applies to push notifications. When set to true, message will be delivered to the app and it will not show as an alert to the user.
     */
    silentNotification?: boolean;
}
/**
 * Create a group notification.
 *
 * ```js
 * import { createGroupNotification } from '@esri/arcgis-rest-portal';
 * // send an email to an entire group
 * createGroupNotification({
 *   authentication: ArcGISIdentityManager,
 *   subject: "hello",
 *   message: "world!",
 *   id: groupId
 * })
 * ```
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export declare function createGroupNotification(requestOptions: ICreateGroupNotificationOptions): Promise<any>;
