import {
  request,
  IRequestOptions,
  IAuthenticationManager
} from "@esri/arcgis-rest-request";
import { getRegisteredAppInfo } from "./getRegisteredAppInfo.js";
import { getPortalUrl } from "@esri/arcgis-rest-portal";

export interface IGenerateApiKeyTokenOptions extends IRequestOptions {
  itemId: string;
  apiKey: 1 | 2;
  portal?: string;
  authentication: IAuthenticationManager;
}

export async function generateApiKeyToken(
  options: IGenerateApiKeyTokenOptions
): Promise<{ access_token: string; expires_in: number }> {
  const portal = getPortalUrl(options);
  const url = `${portal}/oauth2/token`;

  const appInfo = await getRegisteredAppInfo({
    itemId: options.itemId,
    authentication: options.authentication
  });

  const params = {
    client_id: appInfo.client_id,
    client_secret: appInfo.client_secret,
    apiToken: options.apiKey,
    regenerateApiToken: true,
    grant_type: "client_credentials"
  };

  // authentication is not being passed to the request because client_secret acts as the auth
  return request(url, {
    params
  });
}
