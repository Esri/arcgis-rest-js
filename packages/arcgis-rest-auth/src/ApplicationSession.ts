/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IAuthenticationManager,
  ITokenRequestOptions
} from "@esri/arcgis-rest-request";
import { fetchToken } from "./fetch-token";

export interface IApplicationSessionOptions {
  /**
   * Client ID of your application. Can be obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  clientId: string;

  /**
   * A Client Secret is also obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise. Treat it like a password.
   */
  clientSecret: string;

  /**
   * OAuth 2.0 access token from a previous application session.
   */
  token?: string;

  /**
   * Expiration date for the `token`
   */
  expires?: Date;

  /**
   * URL of ArcGIS REST base, defaults to "https://www.arcgis.com/sharing/rest"
   */
  portal?: string;

  /**
   * Duration of requested tokens in minutes. defaults to 7200 (5 days).
   */
  duration?: number;
}

/**
 * ```js
 * import { ApplicationSession } from '@esri/arcgis-rest-auth';
 * const session = new ApplicationSession({
 *   clientId: "abc123",
 *   clientSecret: "sshhhhhh"
 * })
 * // visit https://developers.arcgis.com to generate your own clientid and secret
 * ```
 * You can use [App Login](/arcgis-rest-js/guides/node/) to access premium content and services in ArcGIS Online.
 *
 */
export class ApplicationSession implements IAuthenticationManager {
  public portal: string;
  private clientId: string;
  private clientSecret: string;
  private token: string;
  private expires: Date;
  private duration: number;

  /**
   * Internal object to keep track of pending token requests. Used to prevent
   *  duplicate token requests.
   */
  private _pendingTokenRequest: Promise<string>;

  constructor(options: IApplicationSessionOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.token = options.token;
    this.expires = options.expires;
    this.portal = options.portal || "https://www.arcgis.com/sharing/rest";
    this.duration = options.duration || 7200;
  }

  // URL is not actually read or passed through.
  public getToken(
    url: string,
    requestOptions?: ITokenRequestOptions
  ): Promise<string> {
    if (this.token && this.expires && this.expires.getTime() > Date.now()) {
      return Promise.resolve(this.token);
    }

    if (this._pendingTokenRequest) {
      return this._pendingTokenRequest;
    }

    this._pendingTokenRequest = this.refreshToken(requestOptions);

    return this._pendingTokenRequest;
  }

  public refreshToken(requestOptions?: ITokenRequestOptions): Promise<string> {
    const options = {
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
        expiration: this.duration
      },
      ...requestOptions
    };
    return fetchToken(`${this.portal}/oauth2/token/`, options).then(
      response => {
        this._pendingTokenRequest = null;
        this.token = response.token;
        this.expires = response.expires;
        return response.token;
      }
    );
  }

  public refreshSession() {
    return this.refreshToken().then(() => this);
  }
}
