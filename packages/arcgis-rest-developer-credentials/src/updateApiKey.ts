/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IApiKeyResponse,
  IUpdateApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import {
  appToApiKeyProperties,
  extractBaseRequestOptions,
  isPrivilegesValid,
  paramsEncodingToJsonStr,
  registeredAppResponseToApp
} from "./shared/helpers.js";
import { getItem, getPortalUrl } from "@esri/arcgis-rest-portal";
import { appendCustomParams, request } from "@esri/arcgis-rest-request";
import {
  IApp,
  IGetAppInfoOptions,
  IRegisteredAppResponse
} from "./shared/types/appType.js";

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

  if (!requestOptions.params) {
    requestOptions.params = { f: "json" };
  } else {
    requestOptions.params.f = "json";
  }
  requestOptions.httpMethod = "POST";

  // get app
  const baseRequestOptions = extractBaseRequestOptions(requestOptions); // get base requestOptions snapshot
  const getAppOption: IGetAppInfoOptions = {
    ...extractBaseRequestOptions(baseRequestOptions),
    authentication: requestOptions.authentication,
    itemId: requestOptions.itemId
  };

  const appResponse = await getRegisteredAppInfo(getAppOption);

  // appType must be APIKey to continue
  if (appResponse.appType !== "apikey" || !("apiKey" in appResponse))
    throw new Error("App type is not api key.");

  const clientId = appResponse.client_id;
  const options = appendCustomParams(
    { ...appResponse, ...requestOptions }, // object with the custom params to look in
    ["privileges", "httpReferrers"] // keys you want copied to the params object
  );

  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  paramsEncodingToJsonStr(options);

  const url = getPortalUrl(options) + `/oauth2/apps/${clientId}/update`;

  // Raw response from `/oauth2/apps/${clientId}/update`, apiKey not included because key is same.
  const updateResponse: IRegisteredAppResponse = await request(url, {
    ...extractBaseRequestOptions(options),
    authentication: requestOptions.authentication
  });

  const app: IApp = registeredAppResponseToApp({
    ...updateResponse,
    apiKey: appResponse.apiKey
  });

  const itemInfo = await getItem(requestOptions.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication
  });

  return {
    ...appToApiKeyProperties(app),
    item: itemInfo
  };
}
