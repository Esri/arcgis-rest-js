/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";

/**
 * Options for the `ApiKey` constructor.
 */
export interface IApiKeyOptions {
  key: string;
}

/**
 * ```js
 * import { ApiKey } from '@esri/arcgis-rest-auth';
 
 * // preferred method
 * const apiKey = new ApiKey.fromKey("...");
 * 
 * // or construct directly
 * const apiKey = new ApiKey({
 *   key: "..."
 * });
 * ```
 *
 * Used to authenticate with API Keys.
 */
export class ApiKeyManager implements IAuthenticationManager {
  /**
   * The current portal the user is authenticated with.
   */
  public readonly portal: string = "https://www.arcgis.com/sharing/rest";

  private key: string;

  /**
   * The prefered method for creating an instance of `ApiKeyManager`.
   */
  public static fromKey(apiKey: string) {
    return new ApiKeyManager({ key: apiKey });
  }

  constructor(options: IApiKeyOptions) {
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
 */ /* istanbul ignore next */
export function ApiKey(options: IApiKeyOptions) {
  console.log(
    "DEPRECATED:, 'ApiKey' is deprecated. Use 'ApiKeyManager' instead."
  );

  return new ApiKeyManager(options);
}
