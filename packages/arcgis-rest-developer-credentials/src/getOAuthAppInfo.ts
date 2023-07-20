/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import { getItem } from "@esri/arcgis-rest-portal";
import {
  appToOAuthAppProperties,
  extractBaseRequestOptions
} from "./shared/helpers.js";
import { IGetOAuthAppOptions, IOAuthApp } from "./shared/types/oAuthType.js";

/**
 * Used to retrieve the OAuth2.0 app with given `itemId`. See the [OAuth2.0](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/oauth-2.0/) for more information.
 *
 * ```js
 * import { getOAuthAppInfo, IOAuthApp } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * getOAuthAppInfo({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((retrievedOAuthApp: IOAuthApp) => {
 *   // => {redirect_uris: ["http://localhost:3000/"], item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode getOAuthAppInfo | getOAuthAppInfo()}, including `itemId` of which OAuth app to retrieve and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IOAuthApp} object representing successfully retrieved OAuth app.
 */
export async function getOAuthAppInfo(
  requestOptions: IGetOAuthAppOptions
): Promise<IOAuthApp> {
  const appResponse = await getRegisteredAppInfo(requestOptions);

  const itemInfo = await getItem(requestOptions.itemId, {
    ...extractBaseRequestOptions(requestOptions),
    authentication: requestOptions.authentication
  });

  return {
    ...appToOAuthAppProperties(appResponse),
    item: itemInfo
  };
}
