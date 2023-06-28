/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItemAdd
} from "@esri/arcgis-rest-portal";
import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItem
} from "@esri/arcgis-rest-portal";
import {
  IApiKeyInfo,
  IApiKeyResponse,
  ICreateApiKeyOptions,
  FieldTypePreservingOmit
} from "./shared/types/apiKeyType.js";

import { registerApp } from "./shared/registerApp.js";
import { IRegisterAppOptions } from "./shared/types/appType.js";
import {
  appToApiKeyProperties,
  filterKeys,
  getIRequestOptions,
  isPrivilegesValid
} from "./shared/helpers.js";

export async function createApiKey(
  requestOptions: ICreateApiKeyOptions
): Promise<IApiKeyResponse> {
  if (!isPrivilegesValid(requestOptions.privileges))
    throw new Error("Contain invalid privileges");

  if (!requestOptions.params) {
    requestOptions.params = { f: "json" };
  } else {
    requestOptions.params.f = "json";
  }

  requestOptions.httpMethod = "POST";

  // filter param buckets:

  const iRequestOptions = getIRequestOptions(requestOptions); // snapshot of basic IRequestOptions before customized params being built into it

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
  const items: FieldTypePreservingOmit<IItemAdd, "type"> = filterKeys(
    requestOptions,
    itemAddProperties
  );

  // step 1: add item
  const createItemOption: ICreateItemOptions = {
    item: {
      ...items,
      type: "API Key"
    },
    ...getIRequestOptions(iRequestOptions), // deep copy iRequestOptions snapshot in case of some function modified its values which is ref typed.
    authentication: requestOptions.authentication
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
    ...getIRequestOptions(iRequestOptions),
    authentication: requestOptions.authentication
  };

  const registeredAppResponse = await registerApp(registerAppOption);
  const itemInfo = await getItem(registeredAppResponse.itemId, iRequestOptions);

  return {
    ...appToApiKeyProperties(registeredAppResponse),
    item: itemInfo
  };
}
