/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  getPortalUrl
} from "@esri/arcgis-rest-request";

import { IItemUpdate } from "@esri/arcgis-rest-common-types";

import { serializeGroup } from "./helpers";

export interface IGroupUpdateRequestOptions extends IRequestOptions {
  group: IItemUpdate;
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
