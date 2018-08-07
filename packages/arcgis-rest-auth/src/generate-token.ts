/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  IGenerateTokenParams,
  IGenerateTokenRequestOptions
} from "@esri/arcgis-rest-request";

export interface IGenerateTokenResponse {
  token: string;
  expires: number;
  ssl: boolean;
}

export function generateToken(
  url: string,
  requestOptionsOrParams: IGenerateTokenParams | IGenerateTokenRequestOptions
): Promise<IGenerateTokenResponse> {
  // TODO: remove union type and type guard next breaking change and just expect IGenerateTokenRequestOptions
  const options: IRequestOptions = (requestOptionsOrParams as IGenerateTokenRequestOptions)
    .params
    ? (requestOptionsOrParams as IRequestOptions)
    : { params: requestOptionsOrParams };

  /* istanbul ignore else */
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.host
  ) {
    options.params.referer = window.location.host;
  } else {
    options.params.referer = "@esri.arcgis-rest-auth";
  }

  return request(url, options);
}
