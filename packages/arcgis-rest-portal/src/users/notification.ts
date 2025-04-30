/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IAuthenticatedRequestOptions
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";
import { determineUsername } from "../util/determine-username.js";

export interface INotification {
  id: string;
  type: string;
  target: string;
  targetType: string;
  received: number;
  data: { [key: string]: any };
}

export interface IRemoveNotificationOptions
  extends IAuthenticatedRequestOptions {
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
export async function getUserNotifications(
  requestOptions: IAuthenticatedRequestOptions
): Promise<INotificationResult> {
  let options = { httpMethod: "GET" } as IAuthenticatedRequestOptions;

  const username = await determineUsername(requestOptions);
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
export async function removeNotification(
  requestOptions: IRemoveNotificationOptions
): Promise<{ success: boolean; notificationId: string }> {
  const username = await determineUsername(requestOptions);
  const portalUrl = getPortalUrl(requestOptions);
  const url = `${portalUrl}/community/users/${username}/notifications/${requestOptions.id}/delete`;

  return request(url, requestOptions);
}
