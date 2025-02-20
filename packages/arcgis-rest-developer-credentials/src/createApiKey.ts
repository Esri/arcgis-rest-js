/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItemAdd,
  updateItem
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
  generateApiKeyTokens,
  generateOptionsToSlots,
  buildExpirationDateParams
} from "./shared/helpers.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";

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
 *   privileges: ["premium:user:networkanalysis:routing"],
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

  /**
   * step 1: create item
   */
  const createItemOption: ICreateItemOptions = {
    item: {
      ...filterKeys(requestOptions as any, itemAddProperties),
      type: "Application"
    },
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: {
      f: "json"
    }
  };

  const createItemResponse = await createItem(createItemOption);

  /**
   * getRegisteredAppInfoRoute
   */
  const registerAppOptions: IRegisterAppOptions = {
    itemId: createItemResponse.id,
    appType: "multiple",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob"],
    httpReferrers: requestOptions.httpReferrers || [],
    privileges: requestOptions.privileges,
    ...baseRequestOptions,
    authentication: requestOptions.authentication
  };

  const registeredAppResponse = await registerApp(registerAppOptions);

  /**
   * step 3: update item with desired expiration dates
   * you cannot set the expiration date propierties until you
   * regiester the app so this has to be a seperate step
   */
  await updateItem({
    ...baseRequestOptions,
    item: {
      id: createItemResponse.id,
      ...buildExpirationDateParams(requestOptions, true)
    },
    authentication: requestOptions.authentication
  });

  /*
   * step 4: get item info
   */
  const itemInfo = await getItem(registeredAppResponse.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  /**
   * step 5: generate tokens if requested
   */
  const generatedTokens = await generateApiKeyTokens(
    itemInfo.id,
    generateOptionsToSlots(
      requestOptions.generateToken1,
      requestOptions.generateToken2
    ),
    {
      ...baseRequestOptions,
      authentication: requestOptions.authentication
    }
  );

  /**
   * step 6: get registered app info to get updated active key status
   */
  const updatedRegisteredAppResponse = await getRegisteredAppInfo({
    ...baseRequestOptions,
    itemId: itemInfo.id,
    authentication: requestOptions.authentication
  });

  return {
    ...generatedTokens,
    ...appToApiKeyProperties(updatedRegisteredAppResponse),
    item: itemInfo
  };
}
