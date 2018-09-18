/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IItemUpdate, IGroupAdd, IGroup } from "@esri/arcgis-rest-common-types";

export interface IGroupIdRequestOptions extends IRequestOptions {
  id: string;
}

/**
 * Serialize a group into a json format accepted by the Portal API
 * for create and update operations
 *
 * @param group IGroup to be serialized
 * @returns a formatted JSON object to be sent to Portal
 * @private
 */
export function serializeGroup(group: IGroupAdd | IItemUpdate | IGroup): any {
  // create a clone so we're not messing with the original
  const clone = JSON.parse(JSON.stringify(group));
  // join and tags...
  clone.tags = clone.tags.join(", ");
  return clone;
}
