/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";

import { IRegisteredAppResponse, IUpdateAppOptions } from "./types/appType.js";
import { isPrivilegesValid, paramsEncodingToJsonStr } from "./helpers.js";

export const updateApp = async (requestOptions: IUpdateAppOptions) => {
  // updated fields override old fields (1. copy IRequestOptions 2. copy old app object 3. updatedField overrides)
  // this type is a combination of app object and IRequestOptions
  // auth manager is also copied since it is required in IUpdateAppOptions
  const mergeOptions: IRequestOptions & IRegisteredAppResponse = {
    ...requestOptions,
    ...requestOptions.app,
    ...requestOptions.updatedField
  };

  // privileges validation
  if (!isPrivilegesValid(mergeOptions.privileges))
    throw new Error("Contain invalid privileges");

  const clientId = mergeOptions.client_id;

  // build params
  const options = appendCustomParams(mergeOptions, [
    "appType",
    "httpReferrers",
    "privileges"
  ]);
  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  paramsEncodingToJsonStr(options);

  const url = getPortalUrl(options) + `/oauth2/apps/${clientId}/update`;
  options.httpMethod = "POST";
  options.params.f = "json";
  return (await request(url, options)) as IRegisteredAppResponse;
};
