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
  if (response.appType !== "apikey" || !("apiKey" in response)) {
    throw new Error("App type is not api key.");
  }

  delete response.client_id;
  delete response.client_secret;
  delete response.redirect_uris;
  delete response.appType;

  return response as IApiKeyInfo;
}

// separate pure iRequestOptions from hybrid options, also deep copy all values
export function extractBaseRequestOptions<T extends IRequestOptions>(
  options: T
): Partial<IRequestOptions> {
  // it is impossible to extract properties of iRequestOptions interface since interface doesn't exist at runtime
  const requestOptionsProperties = [
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

  return Object.keys(options)
    .filter((key) => requestOptionsProperties.includes(key))
    .reduce((obj, key) => {
      obj[key] = (options as any)[key];
      return obj;
    }, {} as any);
}

//filter object with values containing member functions
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
