/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IUserRequestOptions } from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";

export interface INotification {
  id: string;
  type: string;
  target: string;
  targetType: string;
  received: number;
  data: { [key: string]: any };
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
 * ```js
 * import { getUserNotifications } from '@esri/arcgis-rest-portal';
 * // username is inferred from ArcGISIdentityManager
 * getUserNotifications({ authentication })
 *   .then(results) // results.notifications.length) => 3
 * ```
 * Get notifications for a user.
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user's notifications
 */
export function getUserNotifications(
  requestOptions: IUserRequestOptions
): Promise<INotificationResult> {
  let options = { httpMethod: "GET" } as IUserRequestOptions;

  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/notifications`;
  options = { ...requestOptions, ...options };

  // send the request
  return request(url, options);
}

/**
 * Delete a notification.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeNotification(
  requestOptions: IRemoveNotificationOptions
): Promise<{ success: boolean; notificationId: string }> {
  const username = encodeURIComponent(requestOptions.authentication.username);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/notifications/${requestOptions.id}/delete`;

  return request(url, requestOptions);
}
