/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { removeItem } from "@esri/arcgis-rest-portal";

import { extractBaseRequestOptions } from "./shared/helpers.js";
import {
  IDeleteApiKeyOption,
  IDeleteApiKeyResponse
} from "./shared/types/apiKeyType.js";
import { getApiKey } from "./getApiKey.js";

/**
 * Used to delete the API Key with given `itemId`.
 *
 * ```js
 * import { deleteApiKey, IDeleteApiKeyResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * deleteApiKey({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((deletedApiKey: IDeleteApiKeyResponse) => {
 *   // => {itemId: "xyz_itemId", success: true}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode deleteApiKey | deleteApiKey()}, including `itemId` of which API key to be deleted and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IDeleteApiKeyResponse} object representing deletion status.
 */
export async function deleteApiKey(
  requestOptions: IDeleteApiKeyOption
): Promise<IDeleteApiKeyResponse> {
  requestOptions.httpMethod = "POST";

  const baseRequestOptions = extractBaseRequestOptions(requestOptions);

  // validate provided itemId associates with API Key
  await getApiKey({
    ...baseRequestOptions,
    itemId: requestOptions.itemId,
    authentication: requestOptions.authentication
  });

  const removeItemResponse: IDeleteApiKeyResponse = await removeItem({
    ...baseRequestOptions,
    id: requestOptions.itemId,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  return removeItemResponse;
}
