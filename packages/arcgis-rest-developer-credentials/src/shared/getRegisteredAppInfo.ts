/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";

import {
  IRegisteredAppResponse,
  IGetAppInfoOptions,
  IApp
} from "./types/appType.js";
import { registeredAppResponseToApp } from "./helpers.js";

/**
 * Used to retrieve registered app info. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/registered-app-info.htm) for more information.
 *
 * ```js
 * import { getRegisteredAppInfo, IApp } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * getRegisteredAppInfo({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((registeredApp: IApp) => {
 *   // => {client_id: "xyz_id", client_secret: "xyz_secret", ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode getRegisteredAppInfo | getRegisteredAppInfo()}, including an itemId of which app to retrieve and an {@linkcode @esri/arcgis-rest-request!ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApp} object representing successfully retrieved app.
 */
export async function getRegisteredAppInfo(
  requestOptions: IGetAppInfoOptions
): Promise<IApp> {
  const userName = await requestOptions.authentication.getUsername();
  const url =
    getPortalUrl(requestOptions) +
    `/content/users/${userName}/items/${requestOptions.itemId}/registeredAppInfo`;
  requestOptions.httpMethod = "POST";

  const registeredAppResponse: IRegisteredAppResponse = await request(url, {
    ...requestOptions,
    params: { f: "json" }
  });

  return registeredAppResponseToApp(registeredAppResponse);
}
