/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";

/**
 * Request app-specific token, passing in the token for the current app.
 *
 * This call returns a token after performing the same checks made by validateAppAccess.
 * It returns an app-specific token of the signed-in user only if the user has access
 * to the app and the encrypted platform cookie is valid.
 *
 * A scenario where an app would use this is if it is iframed into another platform app
 * and recieves credentials via postMessage. Those credentials contain a token that is
 * specific to the host app, so the embedded app would use `exchangeToken` to get one
 * that is specific to itself.
 *
 * Note: This is only usable by Esri applications hosted on *arcgis.com, *esri.com or within
 * an ArcGIS Enterprise installation. Custom applications can not use this.
 *
 * @param token
 * @param clientId application
 * @param portal
 */
export function exchangeToken(
  token: string,
  clientId: string,
  portal: string = "https://www.arcgis.com/sharing/rest"
): Promise<string> {
  const url = `${portal}/oauth2/exchangeToken`;
  const ro = {
    method: "POST",
    params: {
      f: "json",
      client_id: clientId,
      token,
    },
  } as IRequestOptions;
  // make the request and return the token
  return request(url, ro).then((response) => response.token);
}

export interface IPlatformSelfResponse {
  username: string;
  token: string;
}

/**
 * Request a token for a specific application using the esri_aopc encrypted cookie
 *
 * When a client app boots up, it will know it's clientId and the redirectUri for use
 * in the normal /oauth/authorize pop-out oAuth flow.
 *
 * If the app sees an `esri_aopc` cookie (only set if the app is hosted on *.arcgis.com),
 * it can call the /oauth2/platformSelf end-point passing in the clientId and redirectUri
 * in headers, and it will recieve back an app-specific token, assuming the user has
 * access to the app.
 *
 * Since there are scenarios where an app can boot using credintials/token from localstorage
 * but those creds are not for the same user as the esri_aopc cookie, it is recommended that
 * an app check the returned username against any existing identity they may have loaded.
 *
 * Note: This is only usable by Esri applications hosted on *arcgis.com, *esri.com or within
 * an ArcGIS Enterprise installation. Custom applications can not use this.
 * @param clientId
 * @param redirectUri
 * @param portal
 */
export function platformSelf(
  clientId: string,
  redirectUri: string,
  portal: string = "https://www.arcgis.com/sharing/rest"
): Promise<IPlatformSelfResponse> {
  // TEMPORARY: the f=json should not be needed, but currently is
  const url = `${portal}/oauth2/platformSelf?f=json`;
  const ro = {
    method: "POST",
    headers: {
      "X-Esri-Auth-Client-Id": clientId,
      "X-Esri-Auth-Redirect-Uri": redirectUri,
    },
    // Note: request has logic to include the cookie
    // for platformSelf calls w/ the X-Esri-Auth-Client-Id header
    params: {
      f: "json",
    },
  } as IRequestOptions;
  // make the request and return the token
  return request(url, ro);
}
