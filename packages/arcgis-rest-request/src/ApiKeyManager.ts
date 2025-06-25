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

  /**
   * The original API Key used to create this instance.
   */
  private readonly key: string;

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
   * Gets the current access token (the API Key).
   */
  get token() {
    return this.key;
  }

  /**
   * Gets the current access token (the API Key).
   */
  public getToken(url: string) {
    return Promise.resolve(this.key);
  }

  /**
   * Converts the `ApiKeyManager` instance to a JSON object. This is called when the instance is serialized to JSON with [`JSON.stringify()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).
   *
   * ```js
   * import { ApiKeyManager } from '@esri/arcgis-rest-request';
   *
   * const apiKey = new ApiKeyManager.fromKey("...")
   *
   * const json = JSON.stringify(session);
   * ```
   *
   * @returns A plain object representation of the instance.
   */
  toJSON() {
    return {
      type: "ApiKeyManager",
      token: this.key,
      username: this.username,
      portal: this.portal
    };
  }

  /**
   * Serializes the ApiKeyManager instance to a JSON string.
   *
   * ```js
   * import { ApiKeyManager } from '@esri/arcgis-rest-request';
   *
   * const apiKey = new ApiKeyManager.fromKey("...")
   *
   * localStorage.setItem("apiKey", apiKey.serialize());
   * ```
   * @returns {string} The serialized JSON string.
   */
  serialize() {
    return JSON.stringify(this);
  }

  /**
   * Deserializes a JSON string previously created with {@linkcode ApiKeyManager.deserialize} to an {@linkcode ApiKeyManager} instance.
   *
   * ```js
   * import { ApiKeyManager } from '@esri/arcgis-rest-request';
   *
   * const apiKey = ApiKeyManager.deserialize(localStorage.getItem("apiKey"));
   * ```
   * @param {string} serialized - The serialized JSON string.
   * @returns {ApiKeyManager} The deserialized ApiKeyManager instance.
   */
  static deserialize(serialized: string) {
    const data = JSON.parse(serialized);

    return new ApiKeyManager({
      key: data.token,
      username: data.username,
      portal: data.portal
    });
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
