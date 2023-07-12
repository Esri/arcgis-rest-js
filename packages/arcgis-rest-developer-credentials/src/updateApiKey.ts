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
  arePrivilegesValid,
  stringifyArrays,
  registeredAppResponseToApp
} from "./shared/helpers.js";
import { getItem, getPortalUrl } from "@esri/arcgis-rest-portal";
import { appendCustomParams, request } from "@esri/arcgis-rest-request";
import {
  IApp,
  IGetAppInfoOptions,
  IRegisteredAppResponse
} from "./shared/types/appType.js";

/**
 * Used to update an API key.
 *
 * Notes about `privileges` and `httpReferrers` options:
 * 1. Provided option will override corresponding old option.
 * 2. Unprovided option will not trigger corresponding option updates.
 *
 * ```js
 * import { updateApiKey, IApiKeyResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * updateApiKey({
 *   itemId: "xyz_itemId",
 *   privileges: ["premium:user:geocode"],
 *   httpReferrers: [], // httpReferrers will be set to be empty
 *   authentication: authSession
 * }).then((updatedAPIKey: IApiKeyResponse) => {
 *   // => {apiKey: "xyz_key", item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode updateApiKey | updateApiKey()}, including `itemId` of which API key to be operated on, optional new `privileges`, optional new `httpReferrers` and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApiKeyResponse} object representing updated API key.
 */
export async function updateApiKey(
  requestOptions: IUpdateApiKeyOptions
): Promise<IApiKeyResponse> {
  // privileges validation
  if (
    requestOptions.privileges &&
    !arePrivilegesValid(requestOptions.privileges)
  ) {
    throw new Error("The `privileges` option contains invalid privileges.");
  }

  requestOptions.httpMethod = "POST";

  // get app
  const baseRequestOptions = extractBaseRequestOptions(requestOptions); // get base requestOptions snapshot
  const getAppOption: IGetAppInfoOptions = {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    itemId: requestOptions.itemId
  };

  const appResponse = await getRegisteredAppInfo(getAppOption);

  // appType must be APIKey to continue
  if (appResponse.appType !== "apikey" || !("apiKey" in appResponse))
    throw new Error("Item is not an API key.is not api key.");

  const clientId = appResponse.client_id;
  const options = appendCustomParams(
    { ...appResponse, ...requestOptions }, // object with the custom params to look in
    ["privileges", "httpReferrers"] // keys you want copied to the params object
  );
  options.params.f = "json";

  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  stringifyArrays(options);

  const url = getPortalUrl(options) + `/oauth2/apps/${clientId}/update`;

  // Raw response from `/oauth2/apps/${clientId}/update`, apiKey not included because key is same.
  const updateResponse: IRegisteredAppResponse = await request(url, {
    ...options,
    authentication: requestOptions.authentication
  });

  const app: IApp = registeredAppResponseToApp({
    ...updateResponse,
    apiKey: appResponse.apiKey
  });

  const itemInfo = await getItem(requestOptions.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  return {
    ...appToApiKeyProperties(app),
    item: itemInfo
  };
}
