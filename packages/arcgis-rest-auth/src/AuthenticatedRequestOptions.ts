import { ApplicationSession } from "./ApplicationSession";
import { UserSession } from "./UserSession";

import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Used internally by packages for requests that require authentication.
 */
export interface IAuthenticatedRequestOptions extends IRequestOptions {
  authentication: UserSession | ApplicationSession;
}

/**
 * Used internally by packages for requests that require user authentication.
 */
export interface IUserRequestOptions extends IRequestOptions {
  authentication: UserSession;
}

/**
 * Used internally by packages for requests that require application authentication.
 */
export interface IApplicationRequestOptions extends IRequestOptions {
  authentication: ApplicationSession;
}
