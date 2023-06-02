/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ICreateItemOptions,
  IItem,
  createItem,
  getItem
} from "@esri/arcgis-rest-portal";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

import { registerApp, IRegisterAppOptions } from "./helpers.js";

export interface ICreateApiKeyOptions
  extends ICreateItemOptions,
    Omit<IRegisterAppOptions, "itemId"> {
  authentication: ArcGISIdentityManager;
}

interface ICreateApiKeyResponse {
  item: IItem;
  apiKey: string;
}

export const createAPIKey = async (requestOptions: ICreateApiKeyOptions) => {
  // step 1: add item
  requestOptions.httpMethod = "POST";
  const createItemResponse = await createItem(requestOptions);
  if (!createItemResponse.success) {
    throw new Error("createItem() is not successful.");
  } else {
    // step 2: register app
    const registerAppOption: IRegisterAppOptions = {
      itemId: createItemResponse.id,
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
