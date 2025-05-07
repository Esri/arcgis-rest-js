/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IAuthenticatedRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Base options interface for making authenticated requests for groups.
 */
export interface IUserGroupOptions extends IAuthenticatedRequestOptions {
  /**
   * Unique identifier of the group.
   */
  id: string;
}
