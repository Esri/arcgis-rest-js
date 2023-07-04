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
  isPrivilegesValid,
  paramsEncodingToJsonStr,
  registeredAppResponseToApp
} from "./helpers.js";

/**
 * Used to register an app. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/register-app.htm) for more information.
 *
 * Accepted app types:
 * - apikey
 * - multiple
 * - browser
 * - server
 * - native
 *
 * ```js
 * import { registerApp, IApp } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * registerApp({
 *   itemId: "xyz_itemId",
 *   appType: "multiple",
 *   redirect_uris: ["http://localhost:3000/"],
 *   httpReferrers: ["http://localhost:3000/"],
 *   privileges: ["premium:user:geocode", "premium:user:featurereport"],
 *   authentication: authSession
 * }).then((registeredApp: IApp) => {
 *   // => {client_id: "xyz_id", client_secret: "xyz_secret", ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode registerApp | registerApp()}, including necessary params to register an app and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApp} object representing the newly registered app.
 */
export async function registerApp(
  requestOptions: IRegisterAppOptions
): Promise<IApp> {
  // privileges validation
  if (!isPrivilegesValid(requestOptions.privileges)) {
    throw new Error("Contain invalid privileges");
  }

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
    options
  );

  return registeredAppResponseToApp(registeredAppResponse);
}
