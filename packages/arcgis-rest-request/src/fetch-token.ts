/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "./request.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import { ITokenRequestOptions } from "./utils/ITokenRequestOptions.js";

interface IFetchTokenRawResponse {
  access_token: string;
  expires_in: number;
  username: string;
  ssl?: boolean;
  refresh_token?: string;
}

export interface IFetchTokenResponse {
  token: string;
  expires: Date;
  username: string;
  ssl: boolean;
  refreshToken?: string;
}

export function fetchToken(
  url: string,
  requestOptions: ITokenRequestOptions
): Promise<IFetchTokenResponse> {
  const options: IRequestOptions = requestOptions;
  // we generate a response, so we can't return the raw response
  options.rawResponse = false;

  return request(url, options).then((response: IFetchTokenRawResponse) => {
    const r: IFetchTokenResponse = {
      token: response.access_token,
      username: response.username,
      expires: new Date(
        // convert seconds in response to milliseconds and add the value to the current time to calculate a static expiration timestamp
        Date.now() + (response.expires_in * 1000 - 1000)
      ),
      ssl: response.ssl === true
    };
    if (response.refresh_token) {
      r.refreshToken = response.refresh_token;
    }

    return r;
  });
}
