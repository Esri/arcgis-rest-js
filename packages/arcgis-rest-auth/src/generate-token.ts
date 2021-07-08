/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  ITokenRequestOptions,
  NODEJS_DEFAULT_REFERER_HEADER,
} from "@esri/arcgis-rest-request";

export interface IGenerateTokenResponse {
  token: string;
  expires: number;
  ssl: boolean;
}

export function generateToken(
  url: string,
  requestOptions: ITokenRequestOptions
): Promise<IGenerateTokenResponse> {
  const options: IRequestOptions = requestOptions;

  /* istanbul ignore else */
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.host
  ) {
    options.params.referer = window.location.host;
  } else {
    options.params.referer = NODEJS_DEFAULT_REFERER_HEADER;
  }

  return request(url, options);
}
