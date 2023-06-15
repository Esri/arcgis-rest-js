/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IApiKeyResponse,
  IUpdateApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import {
  isPrivilegesValid,
  paramsEncodingToJsonStr
} from "./shared/helpers.js";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { appendCustomParams, request } from "@esri/arcgis-rest-request";
import { getApiKey } from "./getApiKey.js";

export async function updateApiKey(
  requestOptions: IUpdateApiKeyOptions
): Promise<IApiKeyResponse> {
  // privileges validation
  if (
    requestOptions.privileges &&
    !isPrivilegesValid(requestOptions.privileges)
  ) {
    throw new Error("Contain invalid privileges");
  }

  // get app obj as it is required to pass into updateApp as an old app obj
  const getAppOption = {
    ...requestOptions,
    itemId: requestOptions.itemId
  };

  const appResponse = await getRegisteredAppInfo(getAppOption);

  const clientId = appResponse.client_id;

  const options = appendCustomParams(
    { ...appResponse, ...requestOptions }, // object with the custom params to look in
    [...(Object.keys(appResponse) as any)], // keys you want copied to the params object
    requestOptions // options that are part of IRequestOptions
  );

  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  paramsEncodingToJsonStr(options);

  const url =
    getPortalUrl({ authentication: options.authentication }) +
    `/oauth2/apps/${clientId}/update`;

  options.httpMethod = "POST";
  options.params.f = "json";

  await request(url, options);

  return getApiKey({
    itemId: requestOptions.itemId,
    authentication: requestOptions.authentication
  });
}
