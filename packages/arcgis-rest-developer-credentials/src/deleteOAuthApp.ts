/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { removeItem } from "@esri/arcgis-rest-portal";

import { extractBaseRequestOptions } from "./shared/helpers.js";
import {
  IDeleteOAuthAppOption,
  IDeleteOAuthAppResponse
} from "./shared/types/oAuthType.js";
import { getOAuthApp } from "./getOAuthApp.js";

/**
 * Used to delete the OAuth2.0 app with given `itemId`.
 *
 * ```js
 * import { deleteOAuthApp, IDeleteOAuthAppResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * deleteOAuthApp({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((deletedOAuthApp: IDeleteOAuthAppResponse) => {
 *   // => {itemId: "xyz_itemId", success: true}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode deleteOAuthApp | deleteOAuthApp()}, including `itemId` of which OAuth app to be deleted and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IDeleteOAuthAppResponse} object representing deletion status.
 */
export async function deleteOAuthApp(
  requestOptions: IDeleteOAuthAppOption
): Promise<IDeleteOAuthAppResponse> {
  requestOptions.httpMethod = "POST";

  const baseRequestOptions = extractBaseRequestOptions(requestOptions);

  // validate provided itemId associates with OAuth app
  await getOAuthApp({
    ...baseRequestOptions,
    itemId: requestOptions.itemId,
    authentication: requestOptions.authentication
  });

  const removeItemResponse: IDeleteOAuthAppResponse = await removeItem({
    ...baseRequestOptions,
    id: requestOptions.itemId,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  return removeItemResponse;
}
