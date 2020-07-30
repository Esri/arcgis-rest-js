/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";

/**
 * Options for the `ApiKey` constructor.
 */
export interface IApiKeyOptions {
  key: string;
}

/**
 * ```js
 * import { ApiKey } from '@esri/arcgis-rest-auth';
 * const apiKey = new ApiKey("...");
 * ```
 * Used to authenticate with API Keys.
 */
export class ApiKey implements IAuthenticationManager {

  /**
   * The current portal the user is authenticated with.
   */
  public readonly portal: string;

  private key: string;

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
