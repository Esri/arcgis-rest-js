/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ICreateItemOptions, createItem } from "@esri/arcgis-rest-portal";
import {
  IApiKeyResponse,
  ICreateApiKeyOptions
} from "./shared/types/apiKeyType.js";

import { registerApp } from "./shared/registerApp.js";
import { IRegisterAppOptions } from "./shared/types/appType.js";

export const createAPIKey = async (requestOptions: ICreateApiKeyOptions) => {
  if (!requestOptions.params) {
    requestOptions.params = { f: "json" };
  } else {
    requestOptions.params.f = "json";
  }
  requestOptions.httpMethod = "POST";
  // step 1: add item
  const createItemOption: ICreateItemOptions = {
    item: {
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
    // returned appType must be API Key => can directly cast to key object
    return (await registerApp(registerAppOption)) as IApiKeyResponse;
  }
};
