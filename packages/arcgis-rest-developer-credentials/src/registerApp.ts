/* Copyright (c) 2023 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  appendCustomParams,
  IRequestOptions
} from "@esri/arcgis-rest-request";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { Privileges } from "./utils/PRIVILEGE.js";

// TODO: - definition of IRegisterAppOptions may need to be modified in the future.
export interface IRegisterAppOptions extends IRequestOptions {
  itemId: string;
  appType: "apikey" | "browser" | "native" | "server" | "multiple";
  redirect_uris: string[];
  httpReferrers: string[];
  privileges: Array<keyof typeof Privileges>;
}

export const registerApp = async (requestOptions: IRegisterAppOptions) => {
  // privileges validation
  const isValidPrivileges = requestOptions.privileges.every(
    (element) => element in Privileges
  );
  if (!isValidPrivileges) throw new Error("Contain invalid privileges");

  // transform IRegisterAppOptions to standard IRequestOptions for request()
  const options = appendCustomParams(requestOptions, [
    "itemId",
    "appType",
    "redirect_uris",
    "httpReferrers",
    "privileges"
  ]);
  // encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly
  Object.entries(options.params).forEach((entry) => {
    const [key, value] = entry;
    if (value.constructor.name === "Array") {
      options.params[key] = JSON.stringify(value);
    }
  });

  const url = getPortalUrl(options) + "/oauth2/registerApp";
  options.httpMethod = "POST";
  return await request(url, options);
};
