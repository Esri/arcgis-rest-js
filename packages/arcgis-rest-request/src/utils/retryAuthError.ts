/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";
import { IAuthenticationManager } from "./IAuthenticationManager.js";

export type IRetryAuthError = (
  url: string,
  options: IRequestOptions
) => Promise<IAuthenticationManager>;
