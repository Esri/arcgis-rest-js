import {
  request,
  IRequestOptions,
  ArcGISRequestError
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { chunk } from "../util/array.js";

export interface ICreateOrgNotificationOptions extends IRequestOptions {
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
   * The channel through which the notification is to be delivered. Supported values are email or builtin. Email will be sent when the email option is chosen. If the builtin option is chosen, a notification will be added to the notifications list that the user can see when logged into the home app.
   */
  notificationChannelType?: string;

  /**
   * How many emails should be sent at a time. Defaults to the max possible (25)
   */
  batchSize?: number;
}

export interface ICreateOrgNotificationResult {
  /**
   * Whether the operation was successful
   */
  success: boolean;
  /**
   * An array of request errors
   */
  errors?: ArcGISRequestError[];
}

/**
 * Send a notification to members of the requesting user's org.
 * Operation success will be indicated by a flag on the return
 * object. If there are any errors, they will be placed in an
 * errors array on the return object
 *
 * ```js
 * const authentication: IAuthenticationManager; // Typically passed into to the function
 * //
 * const options: IInviteGroupUsersOptions = {
 *  id: 'group_id',
 *  users: ['larry', 'curly', 'moe'],
 *  notificationChannelType: 'email',
 *  expiration: 20160,
 *  authentication
 * }
 * //
 * const result = await createOrgNotification(options);
 * //
 * const if_success_result_looks_like = {
 *  success: true
 * }
 * //
 * const if_failure_result_looks_like = {
 *  success: false,
 *  errors: [ArcGISRequestError]
 * }
 * ```
 * @param {ICreateOrgNotificationOptions} options
 *
 * @returns {ICreateOrgNotificationResult}
 */
export function createOrgNotification(options: ICreateOrgNotificationOptions) {
  const url = `${getPortalUrl(options)}/portals/self/createNotification`;
  const batches = _generateBatchRequests(options);
  const promises = batches.map((batch) => _sendSafeRequest(url, batch));

  return Promise.all(promises).then(_combineResults);
}

/**
 * @private
 */
function _generateBatchRequests(
  options: ICreateOrgNotificationOptions
): IRequestOptions[] {
  const userBatches: string[][] = chunk<string>(
    options.users,
    options.batchSize || 25
  );
  return userBatches.map((users) => _generateRequestOptions(users, options));
}

/**
 * @private
 */
function _generateRequestOptions(
  users: string[],
  baseOptions: ICreateOrgNotificationOptions
): IRequestOptions {
  const requestOptions: ICreateOrgNotificationOptions = Object.assign(
    {},
    baseOptions
  );

  requestOptions.params = {
    ...requestOptions.params,
    users,
    subject: baseOptions.subject,
    message: baseOptions.message,
    notificationChannelType: requestOptions.notificationChannelType
  };

  return requestOptions;
}

/**
 * @private
 */
function _sendSafeRequest(
  url: string,
  requestOptions: IRequestOptions
): Promise<ICreateOrgNotificationResult> {
  return request(url, requestOptions).catch((error) => ({ errors: [error] }));
}

/**
 * @private
 */
function _combineResults(
  responses: ICreateOrgNotificationResult[]
): ICreateOrgNotificationResult {
  const success = responses.every((res) => res.success);
  const errors: ArcGISRequestError[] = responses.reduce(
    (collection, res) => collection.concat(res.errors || []),
    []
  );
  const combined: ICreateOrgNotificationResult = { success };

  if (errors.length > 0) {
    combined.errors = errors;
  }

  return combined;
}
