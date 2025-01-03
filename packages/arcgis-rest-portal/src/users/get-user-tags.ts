/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "../util/get-portal-url.js";
import { IGetUserOptions } from "./get-user.js";
import { determineUsername } from "../util/determine-username.js";

export interface ITagCount {
  /**
   * the name of a tag
   */
  tag: string;
  /**
   * a count that reports the number of times the tag was used
   */
  count: number;
}

export interface IGetUserTagsResponse {
  /**
   * Array of user item tag objects
   */
  tags: ITagCount[];
}

/**
 * Users tag the content they publish in their portal via the add and update item calls. This resource lists all the tags used by the user along with the number of times the tags have been used. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-tags.htm) for more information.
 *
 * ```js
 * import { getUserTags } from '@esri/arcgis-rest-portal';
 *
 * getUserTags({
 *   username: "jsmith",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param IGetUserOptions - options to pass through in the request
 * @returns A Promise that will resolve with the user tag array
 */
export async function getUserTags(
  requestOptions: IGetUserOptions
): Promise<IGetUserTagsResponse> {
  const username = await determineUsername(requestOptions);
  const url = `${getPortalUrl(
    requestOptions
  )}/community/users/${username}/tags`;

  // send the request
  return request(url, requestOptions);
}
