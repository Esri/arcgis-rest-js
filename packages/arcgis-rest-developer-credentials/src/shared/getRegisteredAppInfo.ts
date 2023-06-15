/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request } from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";

import { IRegisteredAppResponse, IGetAppInfoOptions } from "./types/appType.js";

export const getRegisteredAppInfo = async (
  requestOptions: IGetAppInfoOptions
) => {
  const userName = await requestOptions.authentication.getUsername();
  const url =
    getPortalUrl(requestOptions) +
    `/content/users/${userName}/items/${requestOptions.itemId}/registeredAppInfo`;
  requestOptions.httpMethod = "POST";
  if (requestOptions.params) {
    requestOptions.params.f = "json";
  } else {
    requestOptions.params = { f: "json" };
  }
  return (await request(url, requestOptions)) as IRegisteredAppResponse;
};
