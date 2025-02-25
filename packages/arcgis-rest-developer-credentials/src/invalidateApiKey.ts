/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IInvalidateApiKeyOptions,
  IInvalidateApiKeyResponse
} from "./shared/types/apiKeyType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { request } from "@esri/arcgis-rest-request";
import { slotForInvalidationKey } from "./shared/helpers.js";

/**
 * Used to invalidate an API key.
 */
export async function invalidateApiKey(
  requestOptions: IInvalidateApiKeyOptions
): Promise<IInvalidateApiKeyResponse> {
  const portal = getPortalUrl(requestOptions);
  const url = `${portal}/oauth2/revokeToken`;

  const appInfo = await getRegisteredAppInfo({
    itemId: requestOptions.itemId,
    authentication: requestOptions.authentication
  });

  const params = {
    client_id: appInfo.client_id,
    client_secret: appInfo.client_secret,
    apiToken: slotForInvalidationKey(requestOptions.apiKey),
    regenerateApiToken: true,
    grant_type: "client_credentials"
  };

  // authentication is not being passed to the request because client_secret acts as the auth
  return request(url, {
    params
  });
}
