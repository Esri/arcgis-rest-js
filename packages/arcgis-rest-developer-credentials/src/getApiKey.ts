/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGetAppInfoOptions } from "./shared/types/appType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import { IApiKeyResponse } from "./shared/types/apiKeyType.js";

export const getApiKey = async (requestOptions: IGetAppInfoOptions) => {
  const registeredAppInfo = await getRegisteredAppInfo(requestOptions);
  // check if this app type is API Key
  if (registeredAppInfo.appType !== "apikey")
    throw new Error("This itemId is not associated with a API Key typed app.");
  return registeredAppInfo as IApiKeyResponse;
};
