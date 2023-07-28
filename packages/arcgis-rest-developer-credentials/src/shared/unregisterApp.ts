import {
  IGetAppInfoOptions,
  IUnregisterAppOptions,
  IUnregisterAppResponse
} from "./types/appType.js";
import { extractBaseRequestOptions } from "./helpers.js";
import { getRegisteredAppInfo } from "./getRegisteredAppInfo.js";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";

/**
 * Used to unregister the app with given `itemId`. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unregister-app.htm) for more information.
 *
 * ```js
 * import { unregisterApp, IUnregisterAppResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * unregisterApp({
 *   itemId: "xyz_itemId",
 *   authentication: authSession
 * }).then((unregisteredApp: IUnregisterAppResponse) => {
 *   // => {itemId: "xyz_itemId", success: true}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode unregisterApp | unregisterApp()}, including `itemId` of which app to be un-registered and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IUnregisterAppResponse} object representing un-registration status.
 */
export async function unregisterApp(
  requestOptions: IUnregisterAppOptions
): Promise<IUnregisterAppResponse> {
  requestOptions.httpMethod = "POST";

  // get app
  const baseRequestOptions = extractBaseRequestOptions(requestOptions);
  const getAppOption: IGetAppInfoOptions = {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    itemId: requestOptions.itemId
  };

  const appResponse = await getRegisteredAppInfo(getAppOption);

  const clientId = appResponse.client_id;

  const url =
    getPortalUrl(requestOptions) + `/oauth2/apps/${clientId}/unregister`;

  const unregisterAppResponse: IUnregisterAppResponse = await request(url, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });
  return unregisterAppResponse;
}
