/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  ArcGISRequestError
} from "@esri/arcgis-rest-request";

import { getPortalUrl } from "../util/get-portal-url.js";
import { chunk } from "../util/array.js";

export interface IAddGroupUsersOptions extends IRequestOptions {
  /**
   * Group ID
   */
  id: string;
  /**
   * An array of usernames to be added to the group as group members
   */
  users?: string[];
  /**
   * An array of usernames to be added to the group as group admins
   */
  admins?: string[];
}

export interface IAddGroupUsersResult {
  /**
   * An array of usernames that were not added
   */
  notAdded?: string[];
  /**
   * An array of request errors
   */
  errors?: ArcGISRequestError[];
}

/**
 * ```js
 * import { addGroupUsers } from "@esri/arcgis-rest-portal";
 * //
 * addGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   admins: ["username3"],
 *   authentication
 * })
 * .then(response);
 * ```
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm) for more information.
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export function addGroupUsers(
  requestOptions: IAddGroupUsersOptions
): Promise<IAddGroupUsersResult> {
  const id = requestOptions.id;
  const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/addUsers`;
  const baseOptions = Object.assign({}, requestOptions, {
    admins: undefined,
    users: undefined
  });

  const batchRequestOptions = [
    ..._prepareRequests("users", requestOptions.users, baseOptions),
    ..._prepareRequests("admins", requestOptions.admins, baseOptions)
  ];

  const promises = batchRequestOptions.map((options) =>
    _sendSafeRequest(url, options)
  );

  return Promise.all(promises).then(_consolidateRequestResults);
}

function _prepareRequests(
  type: "admins" | "users",
  usernames: string[],
  baseOptions: IAddGroupUsersOptions
): IAddGroupUsersOptions[] {
  if (!usernames || usernames.length < 1) {
    return [];
  }

  // the ArcGIS REST API only allows to add no more than 25 users per request,
  // see https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm
  const userChunks: string[][] = chunk<string>(usernames, 25);

  return userChunks.map((users) =>
    _generateRequestOptions(type, users, baseOptions)
  );
}

function _generateRequestOptions(
  type: "admins" | "users",
  usernames: string[],
  baseOptions: IAddGroupUsersOptions
) {
  return Object.assign({}, baseOptions, {
    [type]: usernames,
    params: {
      ...baseOptions.params,
      [type]: usernames
    }
  });
}

// this request is safe since the request error will be handled
function _sendSafeRequest(
  url: string,
  requestOptions: IAddGroupUsersOptions
): Promise<IAddGroupUsersResult> {
  return request(url, requestOptions).catch((error) => {
    return {
      errors: [error]
    };
  });
}

function _consolidateRequestResults(
  results: IAddGroupUsersResult[]
): IAddGroupUsersResult {
  const notAdded = results
    .filter((result) => result.notAdded)
    .reduce((collection, result) => collection.concat(result.notAdded), []);

  const errors = results
    .filter((result) => result.errors)
    .reduce((collection, result) => collection.concat(result.errors), []);

  const consolidated: IAddGroupUsersResult = { notAdded };

  if (errors.length > 0) {
    consolidated.errors = errors;
  }

  return consolidated;
}
