/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, IAuthenticationManager } from "../request";

export type IRetryAuthError = (
  url: string,
  options: IRequestOptions
) => Promise<IAuthenticationManager>;
