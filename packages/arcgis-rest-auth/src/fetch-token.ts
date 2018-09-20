/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  IFetchTokenParams,
  ITokenRequestOptions
} from "@esri/arcgis-rest-request";

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
  requestOptions: IFetchTokenParams | ITokenRequestOptions
): Promise<IFetchTokenResponse> {
  // TODO: remove union type and type guard next breaking change and just expect IGenerateTokenRequestOptions
  const options: IRequestOptions = (requestOptions as ITokenRequestOptions)
    .params
    ? (requestOptions as IRequestOptions)
    : { params: requestOptions };

  return request(url, options).then((response: IFetchTokenRawResponse) => {
    const r: IFetchTokenResponse = {
      token: response.access_token,
      username: response.username,
      expires: new Date(
        Date.now() + (response.expires_in * 60 * 1000 - 60 * 1000)
      ),
      ssl: response.ssl === true
    };
    if (response.refresh_token) {
      r.refreshToken = response.refresh_token;
    }

    return r;
  });
}
