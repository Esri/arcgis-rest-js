import { IUserRequestOptions } from "@esri/arcgis-rest-request";
export interface INotification {
    id: string;
    type: string;
    target: string;
    targetType: string;
    received: number;
    data: {
        [key: string]: any;
    };
}
export interface IRemoveNotificationOptions extends IUserRequestOptions {
    /**
     * Unique identifier of the item.
     */
    id: string;
}
export interface INotificationResult {
    notifications: INotification[];
}
/**
 * Get notifications for a user.
 *
 * ```js
 * import { getUserNotifications } from '@esri/arcgis-rest-portal';
 *
 * getUserNotifications({ authentication })
 *   .then(results) // results.notifications.length) => 3
 * ```
 *
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's notifications
 */
export declare function getUserNotifications(requestOptions: IUserRequestOptions): Promise<INotificationResult>;
/**
 * Delete a notification.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export declare function removeNotification(requestOptions: IRemoveNotificationOptions): Promise<{
    success: boolean;
    notificationId: string;
}>;
