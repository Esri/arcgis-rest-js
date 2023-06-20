import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Privileges } from "./enum/PRIVILEGE.js";
import { IRegisteredAppResponse, IApp } from "./types/appType.js";
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

export function registeredAppResponseToApp(
  response: IRegisteredAppResponse
): IApp {
  const omittedKeys = [
    "apnsProdCert",
    "apnsSandboxCert",
    "gcmApiKey",
    "isBeta"
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

export function appToApiKeyProperties(response: IApp): IApiKeyInfo {
  if (response.appType !== "apikey" || !("apiKey" in response))
    throw new Error("App type is not api key.");
  const { client_id, client_secret, redirect_uris, appType, ...app } = response;
  return app as IApiKeyInfo;
}

// separate iRequestOptions from hybrid options
export function getIRequestOptions<T extends IRequestOptions>(
  options: T
): IRequestOptions {
  // it is impossible to extract properties of iRequestOptions interface since interface doesn't exist at runtime
  const requestOptionsProperties: Array<keyof IRequestOptions> = [
    "authentication",
    "credentials",
    "headers",
    "hideToken",
    "httpMethod",
    "maxUrlLength",
    "params",
    "portal",
    "rawResponse",
    "signal",
    "suppressWarnings"
  ];
  return filterKeys(options, requestOptionsProperties);
}

export function filterKeys<T>(object: T, includedKeys: Array<keyof T>): any {
  return includedKeys.reduce(
    (obj: { [key: string | number | symbol]: any }, ele) => {
      if (ele in object) obj[ele] = object[ele];
      return obj;
    },
    {}
  );
}
