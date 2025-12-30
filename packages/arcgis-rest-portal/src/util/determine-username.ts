/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IAuthenticationManager,
  IRequestOptions
} from "@esri/arcgis-rest-request";

export interface RequestOptionsWithUsername extends Partial<IRequestOptions> {
  username?: string;
  authentication?: IAuthenticationManager;
}

/**
 * Used to determine the username to use in a request. Will use the `username` passed in the
 * `requestOptions` if present, otherwise will use the username from the `authentication` option.
 * This method is used internally to determine the username to use in a request and is async to
 * support the case where the username is not immediately available.
 *
 * @param requestOptions the requests options
 * @returns the authentecated users username encoded for use in a URL.
 */
export async function determineUsername(
  requestOptions: RequestOptionsWithUsername
): Promise<string> {
  if (requestOptions.username) {
    return encodeURIComponent(requestOptions.username);
  }
  if ((requestOptions.authentication as any)?.username) {
    return encodeURIComponent((requestOptions.authentication as any).username);
  }
  if (requestOptions.authentication) {
    return requestOptions.authentication.getUsername().then(encodeURIComponent);
  }
}
