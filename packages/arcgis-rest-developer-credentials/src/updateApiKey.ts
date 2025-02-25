/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IApiKeyResponse,
  IUpdateApiKeyOptions
} from "./shared/types/apiKeyType.js";
import { getRegisteredAppInfo } from "./shared/getRegisteredAppInfo.js";
import {
  appToApiKeyProperties,
  extractBaseRequestOptions,
  stringifyArrays,
  registeredAppResponseToApp,
  generateApiKeyTokens,
  generateOptionsToSlots,
  buildExpirationDateParams
} from "./shared/helpers.js";
import { getItem, getPortalUrl, updateItem } from "@esri/arcgis-rest-portal";
import { appendCustomParams, request } from "@esri/arcgis-rest-request";
import {
  IApp,
  IGetAppInfoOptions,
  IRegisteredAppResponse
} from "./shared/types/appType.js";

/**
 * Used to update an API key.
 *
 * Notes about `privileges` and `httpReferrers` options:
 * 1. Provided option will override corresponding old option.
 * 2. Unprovided option will not trigger corresponding option updates.
 *
 * ```js
 * import { updateApiKey, IApiKeyResponse } from '@esri/arcgis-rest-developer-credentials';
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * const authSession: ArcGISIdentityManager = await ArcGISIdentityManager.signIn({
 *   username: "xyz_usrName",
 *   password: "xyz_pw"
 * });
 *
 * updateApiKey({
 *   itemId: "xyz_itemId",
 *   privileges: [Privileges.Geocode],
 *   httpReferrers: [], // httpReferrers will be set to be empty
 *   authentication: authSession
 * }).then((updatedAPIKey: IApiKeyResponse) => {
 *   // => {apiKey: "xyz_key", item: {tags: ["xyz_tag1", "xyz_tag2"], ...}, ...}
 * }).catch(e => {
 *   // => an exception object
 * });
 * ```
 *
 * @param requestOptions - Options for {@linkcode updateApiKey | updateApiKey()}, including `itemId` of which API key to be operated on, optional new `privileges`, optional new `httpReferrers` and an {@linkcode ArcGISIdentityManager} authentication session.
 * @returns A Promise that will resolve to an {@linkcode IApiKeyResponse} object representing updated API key.
 */
export async function updateApiKey(
  requestOptions: IUpdateApiKeyOptions
): Promise<IApiKeyResponse> {
  requestOptions.httpMethod = "POST";
  const baseRequestOptions = extractBaseRequestOptions(requestOptions); // get base requestOptions snapshot

  /**
   * step 1: update expiration dates if provided. Build the object up to avoid overwriting any existing properties.
   */
  if (
    requestOptions.apiToken1ExpirationDate ||
    requestOptions.apiToken2ExpirationDate
  ) {
    const updateParams = buildExpirationDateParams(requestOptions);
    await updateItem({
      ...baseRequestOptions,
      item: {
        id: requestOptions.itemId,
        ...updateParams
      },
      authentication: requestOptions.authentication
    });
  }

  /**
   * step 2: update privileges and httpReferrers if provided. Build the object up to avoid overwriting any existing properties.
   */
  if (requestOptions.privileges || requestOptions.httpReferrers) {
    const getAppOption: IGetAppInfoOptions = {
      ...baseRequestOptions,
      authentication: requestOptions.authentication,
      itemId: requestOptions.itemId
    };
    const appResponse = await getRegisteredAppInfo(getAppOption);
    const clientId = appResponse.client_id;
    const options = appendCustomParams(
      { ...appResponse, ...requestOptions }, // object with the custom params to look in
      ["privileges", "httpReferrers"] // keys you want copied to the params object
    );
    options.params.f = "json";

    // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
    stringifyArrays(options);

    const url = getPortalUrl(options) + `/oauth2/apps/${clientId}/update`;

    // Raw response from `/oauth2/apps/${clientId}/update`, apiKey not included because key is same.
    const updateResponse: IRegisteredAppResponse = await request(url, {
      ...options,
      authentication: requestOptions.authentication
    });
  }

  /**
   * step 3: get the updated item info to return to the user.
   */
  const updatedItemInfo = await getItem(requestOptions.itemId, {
    ...baseRequestOptions,
    authentication: requestOptions.authentication,
    params: { f: "json" }
  });

  /**
   * step 4: generate tokens if requested
   */
  const generatedTokens = await generateApiKeyTokens(
    requestOptions.itemId,
    generateOptionsToSlots(
      requestOptions.generateToken1,
      requestOptions.generateToken2
    ),
    {
      ...baseRequestOptions,
      authentication: requestOptions.authentication
    }
  );

  /**
   * step 5: get updated registered app info
   */
  const updatedRegisteredAppResponse = await getRegisteredAppInfo({
    ...baseRequestOptions,
    itemId: requestOptions.itemId,
    authentication: requestOptions.authentication
  });

  return {
    ...generatedTokens,
    ...appToApiKeyProperties(updatedRegisteredAppResponse),
    item: updatedItemInfo
  };
}
