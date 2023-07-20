/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  extractBaseRequestOptions,
  stringifyArrays,
  registeredAppResponseToApp,
  appToOAuthAppProperties
} from "./shared/helpers.js";
import { getItem, getPortalUrl } from "@esri/arcgis-rest-portal";
import { appendCustomParams, request } from "@esri/arcgis-rest-request";
import {
  IApp,
  IGetAppInfoOptions,
  IRegisteredAppResponse
} from "./shared/types/appType.js";
import { IOAuthApp, IUpdateOAuthOptions } from "./shared/types/oAuthType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";

/**
 * Used to update an OAuth2.0 app.
 *
 * Notes about `redirect_uris` options:
 * 1. Provided option will override corresponding old option.
 * 2. Unprovided option will not trigger corresponding option updates.
 *
 * ```js
 * import { updateOAuthApp, IOAuthApp } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * updateOAuthApp({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((updatedOAuthApp: IOAuthApp) => {
 *   // => This OAuth app will be not be updated because its redirect_uris is not provided.
 *   // => {redirect_uris: ["http://localhost:3000/"], item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode updateOAuthApp | updateOAuthApp()}, including `itemId` of which API key to be operated on, optional new `redirect_uris` and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IOAuthApp} object representing updated OAuth app.
 */
export async function updateOAuthApp(
  requestOptions: IUpdateOAuthOptions
): Promise<IOAuthApp> {
  requestOptions.httpMethod = "POST";

  // get app
  const baseRequestOptions = extractBaseRequestOptions(requestOptions); // get base requestOptions snapshot
  const getAppOption: IGetAppInfoOptions = {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    itemId: requestOptions.itemId
  };

  const appResponse = await getRegisteredAppInfo(getAppOption);

  if (appResponse.appType === "apikey") {
    throw new Error("Item is not an OAuth 2.0 app.");
  }

  const clientId = appResponse.client_id;
  const options = appendCustomParams({ ...appResponse, ...requestOptions }, [
    "redirect_uris"
  ]);
  options.params.f = "json";
  options.params.appType = "multiple";

  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  stringifyArrays(options);

  const url = getPortalUrl(options) + `/oauth2/apps/${clientId}/update`;

  // Raw response from `/oauth2/apps/${clientId}/update`.
  const updateResponse: IRegisteredAppResponse = await request(url, {
    ...options,
    authentication: requestOptions.authentication
  });

  const app: IApp = registeredAppResponseToApp(updateResponse);

  const itemInfo = await getItem(requestOptions.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  return {
    ...appToOAuthAppProperties(app),
    item: itemInfo
  };
}
