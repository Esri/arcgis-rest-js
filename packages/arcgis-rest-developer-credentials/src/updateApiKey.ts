/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IApiKeyResponse,
  IUpdateApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { registerApp } from "./shared/registerApp.js";
import { IRegisterAppOptions } from "./shared/types/appType.js";

export const updateApiKey = async (requestOptions: IUpdateApiKeyOptions) => {
  const registerAppOption: IRegisterAppOptions = {
    ...requestOptions.apiKey,
    appType: "apikey",
    redirect_uris: [],
    ...requestOptions.updatedField,
    authentication: requestOptions.authentication
  };
  return (await registerApp(registerAppOption)) as IApiKeyResponse;
};
