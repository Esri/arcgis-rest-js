/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IPagingParams, IGroup, IItem } from "@esri/arcgis-rest-common-types";

export interface IPagingParamsRequestOptions extends IRequestOptions {
  paging: IPagingParams;
}

export interface IGroupContentResult {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  items: IItem[];
}

export interface IGroupUsersResult {
  owner: string;
  admins: string[];
  users: string[];
}

/**
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns  A Promise that will resolve with the data from the response.
 */
export function getGroup(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IGroup> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${id}`;
  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Returns the content of a Group. Since the group may contain 1000s of items
 * the requestParams allow for paging.
 * @param id - Group Id
 * @param requestOptions  - Options for the request, including paging parameters.
 * @returns  A Promise that will resolve with the content of the group.
 */
export function getGroupContent(
  id: string,
  requestOptions?: IPagingParamsRequestOptions
): Promise<IGroup> {
  const url = `${getPortalUrl(requestOptions)}/content/groups/${id}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    params: { start: 1, num: 100 },
    ...requestOptions
  } as IPagingParamsRequestOptions;

  // is this the most concise way to mixin with the defaults above?
  if (requestOptions && requestOptions.paging) {
    options.params = { ...requestOptions.paging };
  }

  return request(url, options);
}

/**
 * Get the usernames of the admins and members. Does not return actual 'User' objects. Those must be
 * retrieved via separate calls to the User's API.
 * @param id - Group Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with arrays of the group admin usernames and the member usernames
 */
export function getGroupUsers(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IGroupUsersResult> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/users`;
  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options);
}
