import {
  request,
  IRequestOptions,
  ArcGISRequestError,
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url";
import { chunk } from "../util/array";

export interface IInviteGroupUsersOptions extends IRequestOptions {
  /**
   * Group ID
   */
  id: string;
  /**
   * An array of usernames to be added to the group as group members
   */
  users: string[];
  /**
   * What role the users should be invited as ('group_member' | 'group_admin')
   */
  role: string;
  /**
   * Expiration date on the invitation can be set for one day, three days, one week, or two weeks, in minutes.
   */
  expiration: number;
}

export interface IInviteGroupUsersResult {
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
 * Invites users to join a group. Operation success
 * will be indicated by a flag on the return
 * object. If there are any errors, they will be
 * placed in an errors array on the return object
 *
 * ```js
 * const authentication: IAuthenticationManager; // Typically passed into to the function
 * //
 * const options: IInviteGroupUsersOptions = {
 *  id: 'group_id',
 *  users: ['ed', 'edd', 'eddy'],
 *  role: 'group-member',
 *  expiration: 20160,
 *  authentication
 * }
 * //
 * const result = await inviteGroupUsers(options);
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
 * @param {IInviteGroupUsersOptions} options
 *
 * @returns {Promise<IAddGroupUsersResult>}
 */
export function inviteGroupUsers(
  options: IInviteGroupUsersOptions
): Promise<IInviteGroupUsersResult> {
  const id = options.id;
  const url = `${getPortalUrl(options)}/community/groups/${id}/invite`;
  const batches = _generateBatchRequests(options);
  const promises = batches.map((batch) => _sendSafeRequest(url, batch));

  return Promise.all(promises).then(_combineResults);
}

/**
 * @private
 */
function _generateBatchRequests(options: IInviteGroupUsersOptions) {
  const userBatches: string[][] = chunk<string>(options.users, 25);
  return userBatches.map((users) => _generateRequestOptions(users, options));
}

/**
 * @private
 */
function _generateRequestOptions(
  users: string[],
  baseOptions: IInviteGroupUsersOptions
): IRequestOptions {
  const requestOptions: IInviteGroupUsersOptions = Object.assign(
    {},
    baseOptions
  );

  requestOptions.params = {
    ...requestOptions.params,
    users,
    role: requestOptions.role,
    expiration: requestOptions.expiration,
  };

  return requestOptions;
}

/**
 * @private
 */
function _sendSafeRequest(
  url: string,
  requestOptions: IRequestOptions
): Promise<IInviteGroupUsersResult> {
  return request(url, requestOptions).catch((error) => ({ errors: [error] }));
}

/**
 * @private
 */
function _combineResults(
  responses: IInviteGroupUsersResult[]
): IInviteGroupUsersResult {
  const success = responses.every((res) => res.success);
  const errors: ArcGISRequestError[] = responses.reduce(
    (collection, res) => collection.concat(res.errors || []),
    []
  );
  const combined: IInviteGroupUsersResult = { success };

  if (errors.length > 0) {
    combined.errors = errors;
  }

  return combined;
}
