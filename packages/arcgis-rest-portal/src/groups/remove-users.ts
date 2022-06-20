/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  ArcGISRequestError
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { chunk } from "../util/array.js";

export interface IRemoveGroupUsersOptions extends IRequestOptions {
  /**
   * Group ID
   */
  id: string;
  /**
   * An array of usernames to be removed from the group
   */
  users?: string[];
}

export interface IRemoveGroupUsersResult {
  /**
   * An array of usernames that were not removed
   */
  notRemoved?: string[];
  /**
   * An array of request errors
   */
  errors?: ArcGISRequestError[];
}

/**
 * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm) for more information.
 *
 * ```js
 * import { removeGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * removeGroupUsers({
 *   id: groupId,
 *   users: ["username1", "username2"],
 *   authentication
 * })
 * .then(response);
 * ```
 *
 * @param requestOptions  - Options for the request
 * @returns A Promise
 */
export function removeGroupUsers(
  requestOptions: IRemoveGroupUsersOptions
): Promise<IRemoveGroupUsersResult> {
  const { id, users: usersToRemove } = requestOptions;
  const url = `${getPortalUrl(
    requestOptions
  )}/community/groups/${id}/removeUsers`;
  const safeSend = (users: string[]) => {
    const options: IRemoveGroupUsersOptions = {
      ...requestOptions,
      users,
      params: { users }
    };
    return request(url, options).catch((error) => ({ errors: [error] }));
  };
  // the ArcGIS REST API only allows to add no more than 25 users per request,
  // see https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm
  const promises = chunk(usersToRemove, 25).map((usersChunk) =>
    safeSend(usersChunk)
  );
  return Promise.all(promises).then((results) => {
    const filtered = (propName: string) =>
      results
        .filter((result) => result[propName])
        .reduce(
          (collection, result) => collection.concat(result[propName]),
          []
        );
    const errors = filtered("errors");
    const consolidated: IRemoveGroupUsersResult = {
      notRemoved: filtered("notRemoved")
    };
    return errors.length ? { ...consolidated, errors } : consolidated;
  });
}
