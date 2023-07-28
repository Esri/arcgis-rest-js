/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItemAdd
} from "@esri/arcgis-rest-portal";
import {
  IApiKeyResponse,
  ICreateApiKeyOptions
} from "./shared/types/apiKeyType.js";

import { registerApp } from "./shared/registerApp.js";
import { IRegisterAppOptions } from "./shared/types/appType.js";
import {
  appToApiKeyProperties,
  filterKeys,
  extractBaseRequestOptions,
  arePrivilegesValid
} from "./shared/helpers.js";

/**
 * Used to register an API key. See the [security and authentication](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/) for more information about API key.
 *
 * ```js
 * import { createApiKey, IApiKeyResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * createApiKey({
 *   title: "xyz_title",
 *   description: "xyz_desc",
 *   tags: ["xyz_tag1", "xyz_tag2"],
 *   privileges: [Privileges.Geocode, Privileges.FeatureReport],
 *   authentication: authSession
 * }).then((registeredAPIKey: IApiKeyResponse) => {
 *   // => {apiKey: "xyz_key", item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode createApiKey | createApiKey()}, including necessary params to register an API key and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApiKeyResponse} object representing the newly registered API key.
 */
export async function createApiKey(
  requestOptions: ICreateApiKeyOptions
): Promise<IApiKeyResponse> {
  if (!arePrivilegesValid(requestOptions.privileges)) {
    throw new Error("The `privileges` option contains invalid privileges.");
  }

  requestOptions.httpMethod = "POST";

  // filter param buckets:

  const baseRequestOptions = extractBaseRequestOptions(requestOptions); // snapshot of basic IRequestOptions before customized params being built into it

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
      type: "API Key"
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
    appType: "apikey",
    redirect_uris: [],
    httpReferrers: requestOptions.httpReferrers || [],
    privileges: requestOptions.privileges,
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
    ...appToApiKeyProperties(registeredAppResponse),
    item: itemInfo
  };
}
