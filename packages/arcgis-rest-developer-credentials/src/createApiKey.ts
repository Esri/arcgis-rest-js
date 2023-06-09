/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  IItem,
  createItem,
  getItem
} from "@esri/arcgis-rest-portal";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

import { registerApp, IRegisterAppOptions } from "./registerApp.js";

export interface ICreateApiKeyOptions
  extends Omit<IRegisterAppOptions, "itemId" | "redirect_uris" | "appType"> {
  authentication: ArcGISIdentityManager;
  title: string;
  description: string;
}

interface ICreateApiKeyResponse {
  item: IItem;
  apiKey: string;
}

export const createAPIKey = async (requestOptions: ICreateApiKeyOptions) => {
  requestOptions.params = { f: "json" };
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
    const registerAppResponse = await registerApp(registerAppOption);
    // step 3: get item info
    const getItemResponse = await getItem(
      createItemResponse.id,
      requestOptions
    );
    return {
      item: getItemResponse,
      apiKey: registerAppResponse.apiKey
    } as ICreateApiKeyResponse;
  }
};
