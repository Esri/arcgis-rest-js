/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams,
  IPagingParams, 
  IGroup, 
  IItem, 
  IUser
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";

export interface IGroupCategorySchema {
  categorySchema: IGroupCategory[];
}

export interface IGroupCategory {
  title: string;
  description?: string;
  categories?: IGroupCategory[];
}

export interface IGetGroupContentOptions extends IRequestOptions {
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
 * ```js
 * import { getGroup } from "@esri/arcgis-rest-portal";
 * //
 * getGroup("fxb988") // id
 *   .then(response)
 * ```
 * Fetch a group using its id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group.htm) for more information.
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
 * Gets the category schema set on a group
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns A promise that will resolve with JSON of group's category schema
 * @see https://developers.arcgis.com/rest/users-groups-and-items/group-category-schema.htm
 */
export function getGroupCategorySchema(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IGroupCategorySchema> {
  const url = `${getPortalUrl(
    requestOptions
  )}/community/groups/${id}/categorySchema`;

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
  requestOptions?: IGetGroupContentOptions
): Promise<IGroupContentResult> {
  const url = `${getPortalUrl(requestOptions)}/content/groups/${id}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    params: { start: 1, num: 100 },
    ...requestOptions
  } as IGetGroupContentOptions;

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

export interface ISearchGroupUsersOptions
  extends IRequestOptions,
    IPagingParams {
  name?: string;
  sortField?: string;
  sortOrder?: string;
  joined?: number | number[];
  memberType?: string;
  [key: string]: any;
}

export interface ISearchGroupUsersResult {
  total: number;
  start: number;
  num: number;
  nextStart: number;
  owner: IUser;
  users: any[];
}

/**
 * ```js
 * import { searchGroupUsers } from "@esri/arcgis-rest-portal";
 * //
 * searchGroupUsers('abc123')
 *   .then(response)
 * ```
 * Search the users in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-users-list.htm) for more information.
 *
 * @param id - The group id
 * @param searchOptions - Options for the request, including paging parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchGroupUsers(
  id: string,
  searchOptions?: ISearchGroupUsersOptions
): Promise<ISearchGroupUsersResult> {
  const url = `${getPortalUrl(searchOptions)}/community/groups/${id}/userlist`;
  const options = appendCustomParams<ISearchGroupUsersOptions>(
    searchOptions || {},
    ["name", "num", "start", "sortField", "sortOrder", "joined", "memberType"],
    {
      httpMethod: "GET"
    }
  );
  return request(url, options);
}
