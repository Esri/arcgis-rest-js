/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import {
  IApiKeyResponse,
  IGetApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { getItem } from "@esri/arcgis-rest-portal";
import { appToApiKeyProperties, getIRequestOptions } from "./shared/helpers.js";

export async function getApiKey(
  requestOptions: IGetApiKeyOptions
): Promise<IApiKeyResponse> {
  const appResponse = await getRegisteredAppInfo(requestOptions);

  const itemInfo = await getItem(
    requestOptions.itemId,
    getIRequestOptions(requestOptions)
  );

  return {
    ...appToApiKeyProperties(appResponse),
    item: itemInfo
  };
}
