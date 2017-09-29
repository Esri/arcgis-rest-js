/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IParams } from "@esri/arcgis-rest-request";

export interface IGenerateTokenParams extends IParams {
  username?: string;
  password?: string;
  expiration?: number;
  token?: string;
  serverUrl?: string;
}

export interface IGenerateTokenResponse {
  token: string;
  expires: number;
  ssl: boolean;
}

export function generateToken(
  url: string,
  params: IGenerateTokenParams
): Promise<IGenerateTokenResponse> {
  /* istanbul ignore else */
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.host
  ) {
    params.referer = window.location.host;
  } else {
    params.referer = "@esri.arcgis-rest-auth";
  }

  return request(url, params);
}
