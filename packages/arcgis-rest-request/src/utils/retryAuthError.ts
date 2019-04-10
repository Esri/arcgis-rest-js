/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions";
import { IAuthenticationManager } from "./IAuthenticationManager";

export type IRetryAuthError = (
  url: string,
  options: IRequestOptions
) => Promise<IAuthenticationManager>;
