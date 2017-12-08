/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  IRequestOptions,
  IParams,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IPagingParams, IItem } from "@esri/arcgis-rest-common-types";

export interface IGroup {
  id?: string;
  owner: string;
  title: string;
  tags: string[];
  description?: string;
  categories?: string[];
  culture?: string;
  [key: string]: any;
}

export interface IGroupSearchRequest extends IPagingParams {
  q: string;
  sortField?: string;
  sortOrder?: string;
  [key: string]: any;
}

export interface IGroupSearchResult {
  query: string; // matches the api's form param
  total: number;
  start: number;
  num: number;
  nextStart: number;
  results: IGroup[];
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
 * Search for groups via the portal api
 * 
 * ```js
 * import { searchGroups } from '@esri/arcgis-rest-groups';
 * 
 * searchgroups({q:'water'})
 * .then((results) => {
 *  console.log(response.results.total); // 355
 * })
 * ```
 * 
 * @param searchForm - Search request
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export function searchGroups(
  searchForm: IGroupSearchRequest,
  requestOptions?: IRequestOptions
): Promise<IGroupSearchResult> {
  // construct the search url
  const url = `${getPortalUrl(requestOptions)}/community/groups`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  // send the request
  return request(url, searchForm, options);
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
  return request(url, null, options);
}

/**
 * Returns the content of a Group. Since the group may contain 1000s of items
 * the requestParams allow for paging.
 * @param id - Group Id
 * @param requestParams - Paging parameters 
 * @param requestOptions  - Options for the request
 * @returns  A Promise that will resolve with the content of the group.
 */
export function getGroupContent(
  id: string,
  requestParams?: IPagingParams,
  requestOptions?: IRequestOptions
): Promise<IGroup> {
  const url = `${getPortalUrl(requestOptions)}/content/groups/${id}`;
  const params: IPagingParams = {
    ...{ start: 1, num: 100 },
    ...requestParams
  };
  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, params, options);
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
  return request(url, null, options);
}

/**
 * Serialize an group into a json format accepted by the Portal API
 * for create and update operations
 * 
 * @param item IGroup to be serialized
 * @returns a formatted json object to be sent to Portal
 */
function serializeGroup(group: IGroup): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(group));
  // join and tags...
  clone.tags = clone.tags.join(", ");
  return clone;
}

/**
 * Create a new Group. 
 * Note: The name must be unique within the user's organization.
 * @param group - Group to create
 * @param requestOptions  - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function createGroup(
  group: IGroup,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/createGroup`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  // serialize the group into something Portal will accept
  const requestParams = serializeGroup(group);
  return request(url, requestParams, options);
}

/**
 * Update the properties of a group - title, tags etc.
 * @param group - Group to update
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function updateGroup(
  group: IGroup,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/community/groups/${group.id}/update`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  // serialize the group into something Portal will accept
  const requestParams = serializeGroup(group);
  return request(url, requestParams, options);
}

/**
 * Delete a group.
 * @param id - Group Id 
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeGroup(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/delete`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Protect a Group. This simply means a user must unprotect the group prior to deleting it
 * @param id - Group Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function protectGroup(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/protect`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
}

/**
 * Unprotect a Group.
 * @param id - Group Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function unprotectGroup(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(
    requestOptions
  )}/community/groups/${id}/unprotect`;
  // default to a POST request
  const options: IRequestOptions = {
    ...{ httpMethod: "POST" },
    ...requestOptions
  };
  return request(url, null, options);
}
