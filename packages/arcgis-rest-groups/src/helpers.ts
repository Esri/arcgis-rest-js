/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

export interface IGroupIdRequestOptions extends IUserRequestOptions {
  id: string;
}
