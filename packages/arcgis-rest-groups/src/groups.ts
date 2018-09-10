/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  // IParams,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import {
  IPagingParams,
  IItem,
  IItemUpdate,
  IGroupAdd,
  IGroup
} from "@esri/arcgis-rest-common-types";

export interface IPagingParamsRequestOptions extends IRequestOptions {
  paging: IPagingParams;
}

export interface IGroupIdRequestOptions extends IRequestOptions {
  id: string;
}

export interface IGroupNotificationRequestOptions
  extends IGroupIdRequestOptions {
  subject?: string;
  message: string | object;
  users?: string[];
  notificationChannelType: string;
  clientId?: string;
  silentNotification?: boolean;
}

export interface IGroupAddRequestOptions extends IRequestOptions {
  group: IGroupAdd;
}

export interface IGroupUpdateRequestOptions extends IRequestOptions {
  group: IItemUpdate;
}

export interface IGroupSearchRequest extends IPagingParams {
  q: string;
  sortField?: string;
  sortOrder?: string;
  [key: string]: any;
}

export interface IGroupSearchResult {
  /**
   * Matches the REST APIs form param
   */
  query: string;
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

  // default to a GET
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };

  options.params = { ...searchForm };

  // send the request
  return request(url, options);
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

/**
 * Create a new Group.
 * Note: The group name must be unique within the user's organization.
 * @param requestOptions  - Options for the request, including a group object
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function createGroup(
  requestOptions: IGroupAddRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/createGroup`;
  const options: IGroupAddRequestOptions = {
    ...requestOptions
  };
  // serialize the group into something Portal will accept
  options.params = serializeGroup(requestOptions.group);
  return request(url, options);
}

/**
 * Update the properties of a group - title, tags etc.
 * @param requestOptions - Options for the request, including the group
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function updateGroup(
  requestOptions: IGroupUpdateRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.group.id
  }/update`;

  const options: IGroupUpdateRequestOptions = {
    ...requestOptions
  };
  // serialize the group into something Portal will accept
  options.params = serializeGroup(requestOptions.group);
  return request(url, options);
}

/**
 * Delete a group.
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function removeGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/delete`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Protect a Group. This simply means a user must unprotect the group prior to deleting it
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function protectGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/protect`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Unprotect a Group.
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export function unprotectGroup(
  requestOptions: IGroupIdRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/unprotect`;
  const options: IGroupIdRequestOptions = {
    ...requestOptions
  };
  return request(url, options);
}

/**
 * Serialize a group into a json format accepted by the Portal API
 * for create and update operations
 *
 * @param group IGroup to be serialized
 * @returns a formatted JSON object to be sent to Portal
 */
function serializeGroup(group: IGroupAdd | IItemUpdate | IGroup): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(group));
  // join and tags...
  clone.tags = clone.tags.join(", ");
  return clone;
}

/**
 * Create a group notification.
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the success/failure status of the request
 */
// see http://mediawikidev.esri.com/index.php/ArcGIS.com/User_Notifications
export function createGroupNotification(
  requestOptions: IGroupNotificationRequestOptions
): Promise<any> {
  const url = `${getPortalUrl(requestOptions)}/community/groups/${
    requestOptions.id
  }/createNotification`;

  const options: IGroupNotificationRequestOptions = {
    params: {
      subject: requestOptions.subject,
      message: requestOptions.message,
      users: requestOptions.users,
      notificationChannelType: requestOptions.notificationChannelType,
      clientId: requestOptions.clientId,
      silentNotification: requestOptions.silentNotification,
      notifyAll: !requestOptions.users || requestOptions.users.length === 0,
      ...requestOptions.params
    },
    ...requestOptions
  };
  return request(url, options);
}
