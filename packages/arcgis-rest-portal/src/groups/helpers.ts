/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Base options interface for making authenticated requests for groups.
 */
export interface IUserGroupOptions extends IUserRequestOptions {
  /**
   * Unique identifier of the group.
   */
  id: string;
}
