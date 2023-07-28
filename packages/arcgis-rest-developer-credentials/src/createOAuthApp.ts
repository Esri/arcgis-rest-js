/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItemAdd
} from "@esri/arcgis-rest-portal";

import { registerApp } from "./shared/registerApp.js";
import { IRegisterAppOptions } from "./shared/types/appType.js";
import {
  filterKeys,
  extractBaseRequestOptions,
  appToOAuthAppProperties
} from "./shared/helpers.js";
import { ICreateOAuthAppOption, IOAuthApp } from "./shared/types/oAuthType.js";

/**
 * Used to register an OAuth2.0 app. See the [OAuth2.0](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/oauth-2.0/) for more information.
 *
 * ```js
 * import { createOAuthApp, IOAuthApp } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * createOAuthApp({
 *   title: "xyz_title",
 *   description: "xyz_desc",
 *   tags: ["xyz_tag1", "xyz_tag2"],
 *   redirect_uris: ["http://localhost:3000/"],
 *   authentication: authSession
 * }).then((registeredOAuthApp: IOAuthApp) => {
 *   // => {redirect_uris: ["http://localhost:3000/"], item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode createOAuthApp | createOAuthApp()}, including necessary params to register an OAuth app and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IOAuthApp} object representing the newly registered OAuth app.
 */
export async function createOAuthApp(
  requestOptions: ICreateOAuthAppOption
): Promise<IOAuthApp> {
  requestOptions.httpMethod = "POST";

  // filter param buckets:

  const baseRequestOptions = extractBaseRequestOptions(requestOptions);

  const itemAddProperties: Array<keyof IItemAdd> = [
    "categories",
    "culture",
    "description",
    "documentation",
    "extent",
    "owner",
    "properties",
    "snippet",
    "spatialReference",
    "tags",
    "title",
    "type",
    "typeKeywords",
    "url"
  ];

  // step 1: add item
  const createItemOption: ICreateItemOptions = {
    item: {
      ...filterKeys(requestOptions, itemAddProperties),
      type: "Application"
    },
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: {
      f: "json"
    }
  };

  const createItemResponse = await createItem(createItemOption);

  // step 2: register app
  const registerAppOption: IRegisterAppOptions = {
    itemId: createItemResponse.id,
    appType: "multiple",
    redirect_uris: requestOptions.redirect_uris || [],
    httpReferrers: [],
    privileges: [],
    ...baseRequestOptions,
    authentication: requestOptions.authentication
  };

  const registeredAppResponse = await registerApp(registerAppOption);
  const itemInfo = await getItem(registeredAppResponse.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  return {
    ...appToOAuthAppProperties(registeredAppResponse),
    item: itemInfo
  };
}
