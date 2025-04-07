/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
import { AuthenticationManagerBase } from "./AuthenticationManagerBase.js";

/**
 * Options for the `ApiKey` constructor.
 */
export interface IApiKeyOptions {
  key: string;
  username?: string;
  portal?: string;
}

/**
 * Used to authenticate methods in ArcGIS REST JS with an API keys. The instance of `ApiKeyManager` can be passed to  {@linkcode IRequestOptions.authentication} to authenticate requests.
 * 
 * ```js
 * import { ApiKeyManager } from '@esri/arcgis-rest-request';
 
 * const apiKey = new ApiKeyManager.fromKey("...");
 * ```
 * 
 * In most cases however the API key can be passed directly to the {@linkcode IRequestOptions.authentication}.
 */
export class ApiKeyManager
  extends AuthenticationManagerBase
  implements IAuthenticationManager
{
  /**
   * The current portal the user is authenticated with.
   */
  public readonly portal: string = "https://www.arcgis.com/sharing/rest";

  private key: string;

  /**
   * The current API key as a string.
   */
  get token() {
    return this.key;
  }

  /**
   * The preferred method for creating an instance of `ApiKeyManager`.
   */
  public static fromKey(apiKey: string | IApiKeyOptions) {
    if (typeof apiKey === "string") {
      return new ApiKeyManager({ key: apiKey });
    } else {
      return new ApiKeyManager(apiKey);
    }
  }

  constructor(options: IApiKeyOptions) {
    super(options);
    this.key = options.key;
  }

  /**
   * Gets a token (the API Key).
   */
  public getToken(url: string) {
    return Promise.resolve(this.key);
  }
}

/**
 * @deprecated - Use {@linkcode ApiKeyManager}.
 * @internal
 */ /* istanbul ignore next */
export function ApiKey(options: IApiKeyOptions) {
  console.log(
    "DEPRECATED:, 'ApiKey' is deprecated. Use 'ApiKeyManager' instead."
  );

  return new ApiKeyManager(options);
}
