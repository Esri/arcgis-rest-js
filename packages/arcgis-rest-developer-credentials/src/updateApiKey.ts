/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IApiKeyResponse,
  IUpdateApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { updateApp } from "./shared/updateApp.js";
import {
  IGetAppInfoOptions,
  IUpdateAppOptions
} from "./shared/types/appType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";

export const updateApiKey = async (requestOptions: IUpdateApiKeyOptions) => {
  // get app obj as it is required to pass into updateApp as an old app obj
  const getAppOption: IGetAppInfoOptions = {
    ...requestOptions,
    itemId: requestOptions.apiKey.itemId
  };
  const appResponse = await getRegisteredAppInfo(getAppOption);

  const updateAppOption: IUpdateAppOptions = {
    app: appResponse,
    updatedField: requestOptions.updatedField,
    authentication: requestOptions.authentication
  };
  const updatedAppResponse = await updateApp(updateAppOption);
  // updateApp() return missing apiKey field. Need add apiKey manually to be able to cast to key object
  const updatedKeyResponse: IApiKeyResponse = {
    ...updatedAppResponse,
    apiKey: requestOptions.apiKey.apiKey
  };
  return updatedKeyResponse;
};
