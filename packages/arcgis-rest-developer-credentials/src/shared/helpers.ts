import {
  IRequestOptions,
  IAuthenticationManager
} from "@esri/arcgis-rest-request";
import { IRegisteredAppResponse, IApp } from "./types/appType.js";
import { IApiKeyInfo } from "./types/apiKeyType.js";
import { IOAuthAppInfo } from "./types/oAuthType.js";
import { generateApiKeyToken } from "./generateApiKeyToken.js";

/**
 * @internal
 * Encode special params value (e.g. array type...) in advance in order to make {@linkcode encodeParam} works correctly. Usage is case by case.
 */
export const stringifyArrays = (requestOptions: IRequestOptions) => {
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
    "isBeta",
    "customAppLoginShowTriage"
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
  delete response.client_secret;
  delete response.redirect_uris;
  delete response.appType;
  delete (response as any).customAppLoginShowTriage;
  delete response.apiKey;

  return response as IApiKeyInfo;
}

/**
 * @internal
 * Used to convert {@linkcode IApp} to {@linkcode IOAuthAppInfo}.
 */
export function appToOAuthAppProperties(response: IApp): IOAuthAppInfo {
  delete response.appType;
  delete response.httpReferrers;
  delete response.privileges;
  delete response.apiKey;
  delete (response as any).customAppLoginShowTriage;
  delete response.isPersonalAPIToken;
  delete response.apiToken1Active;
  delete response.apiToken2Active;

  return response as IOAuthAppInfo;
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

/**
 * Used to determine if a generated key is in slot 1 or slot 2 key.
 */
export function slotForKey(key: string) {
  return parseInt(key.substring(key.length - 10, key.length - 9));
}

interface IGenerateApiKeyTokenOptions extends IRequestOptions {
  authentication: IAuthenticationManager;
}

/**
 * @internal
 * Used to generate tokens in slot 1 and/or 2 of an API key.
 */
export function generateApiKeyTokens(
  itemId: string,
  slots: Array<1 | 2>,
  requestOptions: IGenerateApiKeyTokenOptions
) {
  return Promise.all(
    slots.map((slot) => {
      return generateApiKeyToken({
        itemId,
        apiKey: slot,
        ...requestOptions
      });
    })
  ).then((responses) => {
    return responses
      .map((responses) => responses.access_token)
      .reduce((obj, token, index) => {
        obj[`accessToken${slotForKey(token)}`] = token;
        return obj;
      }, {} as { [key: string]: string });
  });
}

/**
 * @internal
 * Convert boolean flags to an array of slots for {@linkcode generateApiKeyTokens}.
 */
export function generateOptionsToSlots(
  generateToken1: boolean,
  generateToken2: boolean
): Array<1 | 2> {
  const slots: Array<1 | 2> = [];
  if (generateToken1) {
    slots.push(1);
  }
  if (generateToken2) {
    slots.push(2);
  }
  return slots;
}

type expirationDateParams =
  | {
      apiToken1ExpirationDate: Date | -1;
      apiToken2ExpirationDate: Date | -1;
    }
  | {
      apiToken1ExpirationDate: Date | -1;
    }
  | {
      apiToken2ExpirationDate: Date | -1;
    }
  | {};

/**
 * @internal
 * Build params for updating expiration dates
 */
export function buildExpirationDateParams(
  requestOptions: {
    apiToken1ExpirationDate?: Date;
    apiToken2ExpirationDate?: Date;
  },
  fillDefaults?: boolean
): expirationDateParams {
  const updateparams: any = {};
  if (requestOptions.apiToken1ExpirationDate) {
    updateparams.apiToken1ExpirationDate =
      requestOptions.apiToken1ExpirationDate;
  }

  if (requestOptions.apiToken2ExpirationDate) {
    updateparams.apiToken2ExpirationDate =
      requestOptions.apiToken2ExpirationDate;
  }

  if (fillDefaults && !updateparams.apiToken1ExpirationDate) {
    updateparams.apiToken1ExpirationDate = -1;
  }

  if (fillDefaults && !updateparams.apiToken2ExpirationDate) {
    updateparams.apiToken2ExpirationDate = -1;
  }
  return updateparams;
}
