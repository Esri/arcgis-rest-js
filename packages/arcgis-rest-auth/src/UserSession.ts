/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as http from "http";
import {
  request,
  ArcGISAuthError,
  ArcGISRequestError,
  IAuthenticationManager
} from "@esri/arcgis-rest-request";
import { generateToken } from "./generate-token";
import { fetchToken, IFetchTokenResponse } from "./fetch-token";

/**
 * Internal utility for resolving a Promise from outside its constructor.
 *
 * See: http://lea.verou.me/2016/12/resolve-promises-externally-with-this-one-weird-trick/
 */
interface IDeferred<T> {
  promise: Promise<T>;
  resolve: (v: T) => void;
  reject: (v: any) => void;
}

function defer<T>(): IDeferred<T> {
  const deferred: any = {
    promise: null,
    resolve: null,
    reject: null
  };

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred as IDeferred<T>;
}

/**
 * Options for static OAuth 2.0 helper methods on `UserSession`.
 */
export interface IOauth2Options {
  /**
   * Client ID of your application. Can be obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  clientId: string;

  /**
   * A valid URL to redirect to after a user authorizes your application. Can be set on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  redirectUri: string;

  /**
   * The ArcGIS Online or ArcGIS Enterprise portal you want to use for authentication. Defaults to `https://www.arcgis.com/sharing/rest` for the ArcGIS Online portal.
   */
  portal?: string;

  /**
   * Duration (in minutes) that a token will be valid. Defaults to 20160 (two weeks).
   */
  duration?: number;

  /**
   * Determines whether to open the authorization window in a new tab/window or in the current window.
   *
   * @browserOnly
   */
  popup?: boolean;

  /**
   * Duration (in minutes) that a refresh token will be valid.
   *
   * @nodeOnly
   */
  refreshTokenTTL?: number;

  /**
   * The locale assumed to render the login page.
   *
   * @browserOnly
   */
  locale?: string;

  /**
   * Applications can specify an opaque value for this parameter to correlate the authorization request sent with the received response. By default, clientId is used.
   *
   * @browserOnly
   */
  state?: string;
}

/**
 * Options for the `UserSession` constructor.
 */
export interface IUserSessionOptions {
  /**
   * Client ID of your application. Can be obtained by registering an application
   * on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  clientId?: string;

  /**
   * A valid URL to redirect to after a user authorizes your application. Can be set on [ArcGIS for Developers](https://developers.arcgis.com/documentation/core-concepts/security-and-authentication/signing-in-arcgis-online-users/#registering-your-application),
   * [ArcGIS Online](http://doc.arcgis.com/en/arcgis-online/share-maps/add-items.htm#ESRI_SECTION1_0D1B620254F745AE84F394289F8AF44B) or on your instance of ArcGIS Enterprise.
   */
  redirectUri?: string;

  /**
   * OAuth 2.0 refresh token from a previous user session.
   */
  refreshToken?: string;

  /**
   * Expiration date of the `refreshToken`
   */
  refreshTokenExpires?: Date;

  /**
   * The authenticated user's username. Guaranteed to be unique across ArcGIS Online or your instance of ArcGIS Enterprise.
   */
  username?: string;

  /**
   * Password for this user. Used in CLI apps where users cannot do OAuth 2.0.
   */
  password?: string;

  /**
   * OAuth 2.0 access token from a previous user session.
   */
  token?: string;

  /**
   * Expiration date for the `token`
   */
  tokenExpires?: Date;

  /**
   * The ArcGIS Online or ArcGIS Enterprise portal you want to use for authentication. Defaults to `https://www.arcgis.com/sharing/rest` for the ArcGIS Online portal.
   */
  portal?: string;

  /**
   * Duration of requested token validity in minutes. Used when requesting tokens with `username` and `password` or when validating the identity of unknown servers. Defaults to two weeks.
   */
  tokenDuration?: number;

  /**
   * Duration (in minutes) that a refresh token will be valid.
   */
  refreshTokenTTL?: number;
}

/**
 * Used to manage the authentication of ArcGIS Online and ArcGIS Enterprise users
 * in `request`. This class also includes several
 * helper methods for authenticating users with OAuth 2.0 in both browser and
 * server applications.
 */
export class UserSession implements IAuthenticationManager {
  /**
   * Client ID being used for authentication if provided in the `constructor`.
   */
  readonly clientId: string;

  /**
   * The currently authenticated user if provided in the `constructor`.
   */
  readonly username: string;

  /**
   * The currently authenticated user's password if provided in the `constructor`.
   */
  readonly password: string;

  /**
   * The current portal the user is authenticated with.
   */
  readonly portal: string;

  /**
   * Determines how long new tokens requested are valid.
   */
  readonly tokenDuration: number;

  /**
   * A valid redirect URI for this application if provided in the `constructor`.
   */
  readonly redirectUri: string;

  /**
   * Duration of new OAuth 2.0 refresh token validity.
   */
  readonly refreshTokenTTL: number;

  private _token: string;
  private _tokenExpires: Date;
  private _refreshToken: string;
  private _refreshTokenExpires: Date;

  /**
   * Internal object to keep track of pending token requests. Used to prevent
   *  duplicate token requests.
   */
  private _pendingTokenRequests: {
    [key: string]: Promise<string>;
  };

  /**
   * Internal list of trusted 3rd party servers (federated servers) that have
   *  been validated with `generateToken`.
   */
  private trustedServers: {
    [key: string]: {
      token: string;
      expires: Date;
    };
  };

  /**
   * The current ArcGIS Online or ArcGIS Enterprise `token`.
   */
  get token() {
    return this._token;
  }

  /**
   * The expiration time of the current `token`.
   */
  get tokenExpires() {
    return this._tokenExpires;
  }

  /**
   * The current token to ArcGIS Online or ArcGIS Enterprise.
   */
  get refreshToken() {
    return this._refreshToken;
  }

  /**
   * The expiration time of the current `refreshToken`.
   */
  get refreshTokenExpires() {
    return this._refreshTokenExpires;
  }

  constructor(options: IUserSessionOptions) {
    this.clientId = options.clientId;
    this._refreshToken = options.refreshToken;
    this._refreshTokenExpires = options.refreshTokenExpires;
    this.username = options.username;
    this.password = options.password;
    this._token = options.token;
    this._tokenExpires = options.tokenExpires;
    this.portal = options.portal || "https://www.arcgis.com/sharing/rest";
    this.tokenDuration = options.tokenDuration || 20160;
    this.redirectUri = options.redirectUri;
    this.refreshTokenTTL = options.refreshTokenTTL || 1440;
    this.trustedServers = {};
    this._pendingTokenRequests = {};
  }

  /**
   * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is true the
   * authentication window will open in a new tab/window otherwise the user will
   * be redirected to the authorization page in their current tab.
   *
   * @browserOnly
   */
  static beginOAuth2(
    options: IOauth2Options,
    /* istanbul ignore next */ win: any = window
  ) {
    const {
      portal,
      clientId,
      duration,
      redirectUri,
      popup,
      state,
      locale
    }: IOauth2Options = {
      ...{
        portal: "https://arcgis.com/sharing/rest",
        duration: 20160,
        popup: true,
        state: options.clientId,
        locale: ""
      },
      ...options
    };

    const url = `${portal}/oauth2/authorize?client_id=${clientId}&response_type=token&expiration=${duration}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&locale=${locale}`;

    if (!popup) {
      win.location.href = url;
      return undefined;
    }

    const session = defer<UserSession>();

    win[`__ESRI_REST_AUTH_HANDLER_${clientId}`] = function(
      error: any,
      oauthInfo: IFetchTokenResponse
    ) {
      if (error) {
        session.reject(error);
        return;
      }

      session.resolve(
        new UserSession({
          clientId,
          portal,
          token: oauthInfo.token,
          tokenExpires: oauthInfo.expires,
          username: oauthInfo.username
        })
      );
    };

    win.open(
      url,
      "oauth-window",
      "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
    );

    return session.promise;
  }

  /**
   * Completes a browser-based OAuth 2.0 sign if `options.popup` is true the user
   * will be returned to the previous window. Otherwise a new `UserSession`
   * will be returned.
   *
   * @browserOnly
   */
  static completeOAuth2(
    options: IOauth2Options,
    /* istanbul ignore next*/ win: any = window
  ) {
    const { portal, clientId }: IOauth2Options = {
      ...{ portal: "https://arcgis.com/sharing/rest" },
      ...options
    };

    function completeSignIn(error: any, oauthInfo: IFetchTokenResponse) {
      if (win.opener && win.opener.parent) {
        win.opener.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`](
          error,
          oauthInfo
        );
        win.close();
        return undefined;
      }

      if (win !== win.parent) {
        win.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`](error, oauthInfo);
        win.close();
        return undefined;
      }

      if (error) {
        throw error;
      }

      return new UserSession({
        clientId,
        portal,
        token: oauthInfo.token,
        tokenExpires: oauthInfo.expires,
        username: oauthInfo.username
      });
    }

    const match = win.location.href.match(
      /access_token=(.+)&expires_in=(.+)&username=([^&]+)/
    );

    if (!match) {
      const errorMatch = win.location.href.match(
        /error=(.+)&error_description=(.+)/
      );

      const error = errorMatch[1];
      const errorMessage = decodeURIComponent(errorMatch[2]);

      return completeSignIn(new ArcGISRequestError(errorMessage, error), null);
    }

    const token = match[1];
    const expires = new Date(
      Date.now() + parseInt(match[2], 10) * 1000 - 60 * 1000
    );
    const username = decodeURIComponent(match[3]);

    return completeSignIn(null, {
      token,
      expires,
      username
    });
  }

  /**
   * Begins a new server-based OAuth 2.0 sign in. This will redirect the user to
   * the ArcGIS Online or ArcGIS Enterprise authorization page.
   *
   * @nodeOnly
   */
  static authorize(options: IOauth2Options, response: http.ServerResponse) {
    const { portal, clientId, duration, redirectUri }: IOauth2Options = {
      ...{ portal: "https://arcgis.com/sharing/rest", duration: 20160 },
      ...options
    };

    response.writeHead(301, {
      Location: `${portal}/oauth2/authorize?client_id=${clientId}&duration=${duration}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`
    });

    response.end();
  }

  /**
   * Completes the server-based OAuth 2.0 sign in process by exchanging the `authorizationCode`
   * for a `access_token`.
   *
   * @nodeOnly
   */
  static exchangeAuthorizationCode(
    options: IOauth2Options,
    authorizationCode: string
  ): Promise<UserSession> {
    const {
      portal,
      clientId,
      duration,
      redirectUri,
      refreshTokenTTL
    }: IOauth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        duration: 20160,
        refreshTokenTTL: 1440
      },
      ...options
    };

    return fetchToken(`${portal}/oauth2/token`, {
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
      code: authorizationCode
    }).then(response => {
      return new UserSession({
        clientId,
        portal,
        redirectUri,
        refreshToken: response.refreshToken,
        refreshTokenTTL,
        refreshTokenExpires: new Date(
          Date.now() + (refreshTokenTTL - 1) * 1000
        ),
        token: response.token,
        tokenExpires: response.expires,
        username: response.username
      });
    });
  }

  static deserialize(str: string) {
    const options = JSON.parse(str);
    return new UserSession({
      clientId: options.clientId,
      refreshToken: options.refreshToken,
      refreshTokenExpires: new Date(options.refreshTokenExpires),
      username: options.username,
      password: options.password,
      token: options.token,
      tokenExpires: new Date(options.tokenExpires),
      portal: options.portal,
      tokenDuration: options.tokenDuration,
      redirectUri: options.redirectUri,
      refreshTokenTTL: options.refreshTokenTTL
    });
  }

  /**
   * Gets a appropriate token for the given URL. If `portal` is ArcGIS Online and
   * the request is to an ArcGIS Online domain `token` will be used. If the request
   * is to the current `portal` the current `token` will also be used. However if
   * the request is to an unknown server we will validate the server with a request
   * to our current `portal`.
   */
  getToken(url: string) {
    if (
      (/^https?:\/\/www\.arcgis\.com\/sharing\/rest\/?/.test(this.portal),
      /^https?:\/\/\S+\.arcgis\.com.+/.test(url))
    ) {
      return this.getFreshToken();
    } else if (new RegExp(this.portal).test(url)) {
      return this.getFreshToken();
    } else {
      return this.getTokenForServer(url);
    }
  }

  toJSON(): IUserSessionOptions {
    return {
      clientId: this.clientId,
      refreshToken: this.refreshToken,
      refreshTokenExpires: this.refreshTokenExpires,
      username: this.username,
      password: this.password,
      token: this.token,
      tokenExpires: this.tokenExpires,
      portal: this.portal,
      tokenDuration: this.tokenDuration,
      redirectUri: this.redirectUri,
      refreshTokenTTL: this.refreshTokenTTL
    };
  }

  serialize() {
    return JSON.stringify(this);
  }

  /**
   * Manually refreshes the current `token` and `tokenExpires`.
   */
  refreshSession(): Promise<UserSession> {
    if (this.username && this.password) {
      return this.refreshWithUsernameAndPassword();
    }

    if (this.clientId && this.refreshToken) {
      return this.refreshWithRefreshToken();
    }

    return Promise.reject(new ArcGISAuthError("Unable to refresh token."));
  }

  /**
   * Validates that a given URL is properly federated with our current `portal`.
   * Attempts to use the internal `trustedServers` cache first.
   */
  private getTokenForServer(url: string) {
    const [root] = url.split("/rest/services/");
    const existingToken = this.trustedServers[root];

    if (existingToken && existingToken.expires.getTime() > Date.now()) {
      return Promise.resolve(existingToken.token);
    }

    if (this._pendingTokenRequests[root]) {
      return this._pendingTokenRequests[root];
    }

    this._pendingTokenRequests[root] = request(`${root}/rest/info`)
      .then((response: any) => {
        return response.owningSystemUrl;
      })
      .then(owningSystemUrl => {
        /**
         * if this server is not owned by this portal bail out with an error
         * since we know we wont be able to generate a token
         */
        if (!new RegExp(owningSystemUrl).test(this.portal)) {
          throw new ArcGISAuthError(
            `${url} is not federated with ${this.portal}.`,
            "NOT_FEDERATED"
          );
        }
        return request(`${owningSystemUrl}/sharing/rest/info`);
      })
      .then((response: any) => {
        return response.authInfo.tokenServicesUrl;
      })
      .then((tokenServicesUrl: string) => {
        return generateToken(tokenServicesUrl, {
          token: this.token,
          serverUrl: url,
          expiration: this.tokenDuration
        });
      })
      .then(response => {
        this.trustedServers[root] = {
          expires: new Date(response.expires),
          token: response.token
        };
        return response.token;
      });

    return this._pendingTokenRequests[root];
  }

  /**
   * Returns an unexpired token for the current `portal`.
   */
  private getFreshToken() {
    if (
      this.token &&
      this.tokenExpires &&
      this.tokenExpires.getTime() > Date.now()
    ) {
      return Promise.resolve(this.token);
    }

    if (!this._pendingTokenRequests[this.portal]) {
      this._pendingTokenRequests[this.portal] = this.refreshSession().then(
        session => {
          this._pendingTokenRequests[this.portal] = null;
          return session.token;
        }
      );
    }

    return this._pendingTokenRequests[this.portal];
  }

  /**
   * Refreshes the current `token` and `tokenExpires` with `username` and
   * `password`.
   */
  private refreshWithUsernameAndPassword() {
    return generateToken(`${this.portal}/generateToken`, {
      username: this.username,
      password: this.password,
      expiration: this.tokenDuration
    }).then((response: any) => {
      this._token = response.token;
      this._tokenExpires = new Date(response.expires);
      return this;
    });
  }

  /**
   * Refreshes the current `token` and `tokenExpires` with `refreshToken`.
   */
  private refreshWithRefreshToken() {
    if (
      this.refreshToken &&
      this.refreshTokenExpires &&
      this.refreshTokenExpires.getTime() < Date.now()
    ) {
      return this.refreshRefreshToken();
    }

    return fetchToken(`${this.portal}/oauth2/token`, {
      client_id: this.clientId,
      refresh_token: this.refreshToken,
      grant_type: "refresh_token"
    }).then(response => {
      this._token = response.token;
      this._tokenExpires = response.expires;
      return this;
    });
  }

  /**
   * Exchanges an expired `refreshToken` for a new one also updates `token` and
   * `tokenExpires`.
   */
  private refreshRefreshToken() {
    return fetchToken(`${this.portal}/oauth2/token`, {
      client_id: this.clientId,
      refresh_token: this.refreshToken,
      redirect_uri: this.redirectUri,
      grant_type: "exchange_refresh_token"
    }).then(response => {
      this._token = response.token;
      this._tokenExpires = response.expires;
      this._refreshToken = response.refreshToken;
      this._refreshTokenExpires = new Date(
        Date.now() + (this.refreshTokenTTL - 1) * 60 * 1000
      );
      return this;
    });
  }
}
