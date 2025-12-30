/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import {
  IApiKeyResponse,
  IGetApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { getItem } from "@esri/arcgis-rest-portal";
import {
  appToApiKeyProperties,
  extractBaseRequestOptions
} from "./shared/helpers.js";

/**
 * Used to retrieve the API key with given `itemId`. See the [security and authentication](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/) for more information about API key.
 *
 * ```js
 * import { getApiKey, IApiKeyResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * getApiKey({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((retrievedAPIKey: IApiKeyResponse) => {
 *   // => {apiKey: "xyz_key", item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode getApiKey | getApiKey()}, including `itemId` of which API key to retrieve and an {@linkcode @esri/arcgis-rest-request!ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApiKeyResponse} object representing successfully retrieved API key.
 */
export async function getApiKey(
  requestOptions: IGetApiKeyOptions
): Promise<IApiKeyResponse> {
  const appResponse = await getRegisteredAppInfo(requestOptions);

  const itemInfo = await getItem(requestOptions.itemId, {
    ...extractBaseRequestOptions(requestOptions),
    authentication: requestOptions.authentication
  });

  return {
    ...appToApiKeyProperties(appResponse),
    item: itemInfo
  };
}
