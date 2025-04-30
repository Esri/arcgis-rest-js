/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "./ArcGISIdentityManager.js";
import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";

/**
 * Used internally by packages for requests that require authentication.
 */
export interface IAuthenticatedRequestOptions extends IRequestOptions {
  authentication: IAuthenticationManager;
}

/**
 * Used internally by packages for requests that require user authentication.
 */
export interface IUserRequestOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication: ArcGISIdentityManager;
}
