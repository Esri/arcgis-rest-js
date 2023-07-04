import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Privileges } from "./enum/PRIVILEGE.js";
import { IRegisteredAppResponse, IApp } from "./types/appType.js";
import { IApiKeyInfo } from "./types/apiKeyType.js";

/**
 * @internal
 * Used to check privileges validity.
 */
export const isPrivilegesValid = (
  privileges: Array<keyof typeof Privileges>
): boolean => privileges.every((element) => element in Privileges);

// TODO: This func may be modified to support more types e.g. object
/**
 * @internal
 * Encode special params value (e.g. array type...) in advance in order to make {@linkcode encodeParam} works correctly. Usage is case by case.
 */
export const paramsEncodingToJsonStr = (requestOptions: IRequestOptions) => {
  Object.entries(requestOptions.params).forEach((entry) => {
    const [key, value] = entry;
    if (value.constructor.name === "Array") {
      requestOptions.params[key] = JSON.stringify(value);
    }
  });
};

/**
 * @internal
 * Used to convert {@linkcode IRegisteredAppResponse} to {@linkcode IApp}.
 */
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

/**
 * @internal
 * Used to convert {@linkcode IApp} to {@linkcode IApiKeyInfo} only if `appType` is "apikey".
 */
export function appToApiKeyProperties(response: IApp): IApiKeyInfo {
  if (response.appType !== "apikey" || !("apiKey" in response)) {
    throw new Error("App type is not api key.");
  }

  delete response.client_id;
  delete response.client_secret;
  delete response.redirect_uris;
  delete response.appType;

  return response as IApiKeyInfo;
}

/**
 * @internal
 * Used to extract base request options from a hybrid option and exclude `params` and `authentication`.
 */
export function extractBaseRequestOptions<T extends IRequestOptions>(
  options: T
): Partial<IRequestOptions> {
  const requestOptionsProperties: Array<keyof T> = [
    "credentials",
    "headers",
    "hideToken",
    "httpMethod",
    "maxUrlLength",
    "portal",
    "rawResponse",
    "signal",
    "suppressWarnings"
  ];

  return filterKeys(options, requestOptionsProperties);
}

/**
 * @internal
 * Used to create a new object including only specified keys from another object.
 */
export function filterKeys<T extends object>(
  object: T,
  includedKeys: Array<keyof T>
): any {
  return includedKeys.reduce(
    (obj: { [key: string | number | symbol]: any }, ele) => {
      if (ele in object) {
        obj[ele] = object[ele];
      }
      return obj;
    },
    {}
  );
}
