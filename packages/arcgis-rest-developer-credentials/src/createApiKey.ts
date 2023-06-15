/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  createItem,
  getItem,
  IItem
} from "@esri/arcgis-rest-portal";
import {
  IApiKeyInfo,
  IApiKeyResponse,
  ICreateApiKeyOptions
} from "./shared/types/apiKeyType.js";

import { registerApp } from "./shared/registerApp.js";
import {
  IRegisterAppOptions,
  IRegisteredAppResponse
} from "./shared/types/appType.js";
import { appInfoResponseToApiKeyProperties } from "./shared/helpers.js";

export interface ICreateApiKeyResponse extends IRegisteredAppResponse {
  item: IItem;
}

export async function createApiKey(
  requestOptions: ICreateApiKeyOptions
): Promise<IApiKeyResponse> {
  if (!requestOptions.params) {
    requestOptions.params = { f: "json" };
  } else {
    requestOptions.params.f = "json";
  }

  requestOptions.httpMethod = "POST";

  /**
   * @Todo filter out 3 param buckets
   * 1. common things for all requests. https://developers.arcgis.com/arcgis-rest-js/api-reference/arcgis-rest-demographics/IRequestOptions
   * 2. Parameters for createItem
   * 3. parameters for registerApp
   *
   * only want to send documented params to each endpoint
   **/

  // step 1: add item
  const createItemOption: ICreateItemOptions = {
    item: {
      // @Todo handle other item create options like tags
      title: requestOptions.title,
      description: requestOptions.description,
      type: "API Key"
    },
    ...requestOptions
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
      ...requestOptions
    };

    const registeredAppResponse = await registerApp(registerAppOption);

    const itemInfo = await getItem(createItemResponse.id, {
      ...requestOptions
    });

    return {
      ...appInfoResponseToApiKeyProperties(registeredAppResponse),
      item: itemInfo
    };
  }
}
