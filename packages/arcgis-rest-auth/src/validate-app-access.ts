/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, request } from "@esri/arcgis-rest-request";

export interface IAppAccess {
  /**
   * Verifies that the token is valid and the user has access to
   * the specified app (clientId)
   */
  valid: boolean;
  /**
   * Should the app present the current user with a "View Only" mode
   */
  viewOnlyUserTypeApp: boolean;
}

/**
 * Validates that the user has access to the application
 * and if they user should be presented a "View Only" mode
 *
 * This is only needed/valid for Esri applications that are "licensed"
 * and shipped in ArcGIS Online or ArcGIS Enterprise. Most custom applications
 * should not need or use this.
 *
 * ```js
 * import { validateAppAccess } from '@esri/arcgis-rest-auth';
 *
 * return validateAppAccess('your-token', 'theClientId')
 * .then((result) => {
 *    if (!result.valud) {
 *      // redirect or show some other ui
 *    } else {
 *      if (result.viewOnlyUserTypeApp) {
 *        // use this to inform your app to show a "View Only" mode
 *      }
 *    }
 * })
 * .catch((err) => {
 *  // two possible errors
 *  // invalid clientId: {"error":{"code":400,"messageCode":"GWM_0007","message":"Invalid request","details":[]}}
 *  // invalid token: {"error":{"code":498,"message":"Invalid token.","details":[]}}
 * })
 * ```
 *
 * Note: This is only usable by Esri applications hosted on *arcgis.com, *esri.com or within
 * an ArcGIS Enterprise installation. Custom applications can not use this.
 *
 * @param token platform token
 * @param clientId application client id
 * @param portal Optional
 */
export function validateAppAccess(
  token: string,
  clientId: string,
  portal: string = "https://www.arcgis.com/sharing/rest"
): Promise<IAppAccess> {
  const url = `${portal}/oauth2/validateAppAccess`;
  const ro = {
    method: "POST",
    params: {
      f: "json",
      client_id: clientId,
      token,
    },
  } as IRequestOptions;
  return request(url, ro);
}
