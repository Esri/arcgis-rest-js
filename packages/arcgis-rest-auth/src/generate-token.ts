/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IParams, IRequestOptions } from "@esri/arcgis-rest-request";

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}

export interface IGenerateTokenRequestOptions extends IRequestOptions {
  params: IGenerateTokenParams;
}

export interface IGenerateTokenResponse {
  token: string;
  expires: number;
  ssl: boolean;
}

export function generateToken(
  url: string,
  requestOptions: IGenerateTokenRequestOptions
): Promise<IGenerateTokenResponse> {
  /* istanbul ignore else */
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.host
  ) {
    requestOptions.params.referer = window.location.host;
  } else {
    requestOptions.params.referer = "@esri.arcgis-rest-auth";
  }

  return request(url, requestOptions);
}
