/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, appendCustomParams } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import {
  IApp,
  IRegisterAppOptions,
  IRegisteredAppResponse
} from "./types/appType.js";
import {
  getIRequestOptions,
  isPrivilegesValid,
  paramsEncodingToJsonStr,
  registeredAppResponseToApp
} from "./helpers.js";

export async function registerApp(
  requestOptions: IRegisterAppOptions
): Promise<IApp> {
  // privileges validation
  if (!isPrivilegesValid(requestOptions.privileges))
    throw new Error("Contain invalid privileges");

  // build params
  const options = appendCustomParams(requestOptions, [
    "itemId",
    "appType",
    "redirect_uris",
    "httpReferrers",
    "privileges"
  ]);
  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  paramsEncodingToJsonStr(options);

  const url = getPortalUrl(options) + "/oauth2/registerApp";
  options.httpMethod = "POST";
  options.params.f = "json";

  const registeredAppResponse: IRegisteredAppResponse = await request(
    url,
    getIRequestOptions(options)
  );
  return registeredAppResponseToApp(registeredAppResponse);
}
