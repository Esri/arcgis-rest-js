/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGetApiKeyOptions } from "./shared/types/appType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import { IApiKeyResponse } from "./shared/types/apiKeyType.js";
import { getItem } from "@esri/arcgis-rest-portal";
import { appInfoResponseToApiKeyProperties } from "./shared/helpers.js";

export const getApiKey = async function getApiKey(
  requestOptions: IGetApiKeyOptions
): Promise<IApiKeyResponse> {
  const registeredAppInfo = await getRegisteredAppInfo(requestOptions);

  const itemInfo = await getItem(requestOptions.itemId, {
    ...requestOptions
  });

  // check if this app type is API Key
  if (registeredAppInfo.appType !== "apikey") {
    throw new Error("This itemId is not associated with a API Key typed app.");
  }

  // returned appType must be API Key => can directly cast to key object
  return {
    ...appInfoResponseToApiKeyProperties(registeredAppInfo),
    item: itemInfo
  };
};
