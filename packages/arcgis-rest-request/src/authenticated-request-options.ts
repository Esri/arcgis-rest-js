/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ApplicationSession } from "./ApplicationSession.js";
import { UserSession } from "./UserSession.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";

/**
 * Used internally by packages for requests that require user authentication.
 */
export interface IAuthenticatedRequestOptions extends IRequestOptions {
  authentication: UserSession | ApplicationSession;
}

/**
 * Used internally by packages for requests that require authentication.
 */
export interface IUserRequestOptions extends IRequestOptions {
  /**
   * A session representing a logged in user.
   */
  authentication: UserSession;
}
