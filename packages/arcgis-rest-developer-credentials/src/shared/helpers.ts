import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Privileges } from "./enum/PRIVILEGE.js";
import { IRegisteredAppResponse } from "./types/appType.js";
import { IApiKeyInfo } from "./types/apiKeyType.js";

// Check privileges validity as user's input at runtime is non-deterministic
export const isPrivilegesValid = (
  privileges: Array<keyof typeof Privileges>
): boolean => privileges.every((element) => element in Privileges);

// TODO: This func may be modified in future to support more types e.g. object
// encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly. This is case by case usage
export const paramsEncodingToJsonStr = (requestOptions: IRequestOptions) => {
  Object.entries(requestOptions.params).forEach((entry) => {
    const [key, value] = entry;
    if (value.constructor.name === "Array") {
      requestOptions.params[key] = JSON.stringify(value);
    }
  });
};

/**
 * Takes an object from the registered app info request and turns it into a `IApiKeyInfoResponse` object.
 */
export function appInfoResponseToApiKeyProperties(
  response: IRegisteredAppResponse
): IApiKeyInfo {
  const omittedKeys = [
    "client_id",
    "client_secret",
    "redirect_uris",
    "appType"
  ];

  const dateKeys = ["modified", "registered"];

  return Object.keys(response)
    .filter((key) => !omittedKeys.includes(key))
    .reduce((obj: any, key) => {
      if (dateKeys.includes(key)) {
        obj[key] = new Date((response as any)[key]);
      } else {
        obj[key] = (response as any)[key];
      }

      return obj;
    }, {});
}
