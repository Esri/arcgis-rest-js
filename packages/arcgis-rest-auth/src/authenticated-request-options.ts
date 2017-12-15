import { ApplicationSession } from "./ApplicationSession";
import { UserSession } from "./UserSession";

import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Used internally by packages for requests that require authentication.
 */
export interface IUserRequestOptions extends IRequestOptions {
  authentication: UserSession;
}
