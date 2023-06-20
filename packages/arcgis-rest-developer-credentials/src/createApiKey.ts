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
  getIRequestOptions
} from "./shared/helpers.js";

export async function createApiKey(
  requestOptions: ICreateApiKeyOptions
): Promise<IApiKeyResponse> {
  if (!requestOptions.params) {
    requestOptions.params = { f: "json" };
  } else {
    requestOptions.params.f = "json";
  }

  requestOptions.httpMethod = "POST";

  // filter param buckets:

  const iRequestOptions = getIRequestOptions(requestOptions);

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
  const items: Omit<IItemAdd, "type"> = filterKeys(
    requestOptions,
    itemAddProperties
  );

  // step 1: add item
  const createItemOption: ICreateItemOptions = {
    item: {
      ...items,
      type: "API Key",
      title: items.title
    },
    ...iRequestOptions,
    authentication: requestOptions.authentication
  };

  const createItemResponse = await createItem(createItemOption);

  if (!createItemResponse.success) {
    throw new Error("createItem() is not successful.");
  } else {
    // step 2: register app
    const registerAppOption: IRegisterAppOptions = {
      itemId: createItemResponse.id,
      appType: "apikey",
      redirect_uris: [],
      httpReferrers:
        "httpReferrers" in requestOptions ? requestOptions.httpReferrers : [],
      privileges: requestOptions.privileges,
      ...iRequestOptions,
      authentication: requestOptions.authentication
    };

    const registeredAppResponse = await registerApp(registerAppOption);

    const itemInfo = await getItem(
      registeredAppResponse.itemId,
      iRequestOptions
    );

    return {
      ...appToApiKeyProperties(registeredAppResponse),
      item: itemInfo
    };
  }
}
