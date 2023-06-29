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
  extractBaseRequestOptions as extractBaseRequestOptions,
  isPrivilegesValid
} from "./shared/helpers.js";

export async function createApiKey(
  requestOptions: ICreateApiKeyOptions
): Promise<IApiKeyResponse> {
  if (!isPrivilegesValid(requestOptions.privileges))
    throw new Error("Contain invalid privileges");

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
    httpReferrers:
      "httpReferrers" in requestOptions ? requestOptions.httpReferrers : [],
    privileges: requestOptions.privileges,
    ...baseRequestOptions,
    authentication: requestOptions.authentication
  };

  const registeredAppResponse = await registerApp(registerAppOption);
  const itemInfo = await getItem(registeredAppResponse.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication
  });

  return {
    ...appToApiKeyProperties(registeredAppResponse),
    item: itemInfo
  };
}
