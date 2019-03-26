/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

import { IItemUpdate, IGroupAdd, IGroup } from "@esri/arcgis-rest-common-types";

export interface IGroupIdRequestOptions extends IUserRequestOptions {
  id: string;
}

/**
 * (Deprecated) Serialize a group into a json format accepted by the Portal API
 * for create and update operations.
 *
 * @param group IGroup to be serialized
 * @returns a formatted JSON object to be sent to Portal
 * @private
 */
/* istanbul ignore next */
export function serializeGroup(group: IGroupAdd | IItemUpdate | IGroup): any {
  const clone = JSON.parse(JSON.stringify(group));
  const { tags = [] } = group;
  clone.tags = tags.join(", ");
  return clone;
}
