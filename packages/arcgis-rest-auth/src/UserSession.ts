/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * /generateToken returns a token that cannot be refreshed.
 *
 * oauth2/token can return a token *and* a refreshToken.
 * up until the refreshToken expires, you can use it (and a clientId)
 * to fetch fresh credentials without a username and password.
 *
 * the catch is that this 'authorization_code' flow is only utilized
 * by server based OAuth 2 Node.js applications that call /authorize first.
 */

import * as http from "http";
import {
  request,
  IRequestOptions,
  ArcGISAuthError,
  IAuthenticationManager,
  ITokenRequestOptions,
  cleanUrl,
  encodeQueryString
} from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";
import { generateToken } from "./generate-token";
import { fetchToken, IFetchTokenResponse } from "./fetch-token";
import { canUseOnlineToken, isFederated } from "./federation-utils";

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

export type AuthenticationProvider = "arcgis" | "facebook" | "google";

/**
 * Represents a [credential](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-Credential.html)
 * object used to access a secure ArcGIS resource.
 */
export interface ICredential {
  expires: number;
  server: string;
  ssl: boolean;
  token: string;
  userId: string;
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
 * Used to test if a URL is an ArcGIS Online URL
 */
const arcgisOnlineUrlRegex = /^https?:\/\/\S+\.arcgis\.com.+/;

/**
 * Used to test if a URL is production ArcGIS Online Portal
 */
const arcgisOnlinePortalRegex = /^https?:\/\/www\.arcgis\.com\/sharing\/rest+/;

/**
 * Used to test if a URL is an ArcGIS Online Organization Portal
 */
const arcgisOnlineOrgPortalRegex = /^https?:\/\/(?:[a-z0-9-]+\.maps)?.\arcgis\.com\/sharing\/rest/;

/**
 * Options for static OAuth 2.0 helper methods on `UserSession`.
 */
export interface IOAuth2Options {
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
   * ArcGIS Authentication is used by default. Specifying an alternative will take users directly to the corresponding provider's OAuth page.
   */

  provider?: AuthenticationProvider;

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

  [key: string]: any;
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
   * This value is set to true automatically if the ArcGIS Organization requires that requests be made over https.
   */
  ssl?: boolean;

  /**
   * ArcGIS Authentication is used by default. Specifying an alternative will take users directly to the corresponding provider's OAuth page.
   */
  provider?: AuthenticationProvider;

  /**
   * Duration of requested token validity in minutes. Used when requesting tokens with `username` and `password` or when validating the identity of unknown servers. Defaults to two weeks.
   */
  tokenDuration?: number;

  /**
   * Duration (in minutes) that a refresh token will be valid.
   */
  refreshTokenTTL?: number;

  /**
   * An unfederated ArcGIS Server instance known to recognize credentials supplied manually.
   * ```js
   * {
   *   server: "https://sampleserver6.arcgisonline.com/arcgis",
   *   token: "SOSlV3v..",
   *   tokenExpires: new Date(1545415669763)
   * }
   * ```
   */
  server?: string;
}

/**
 * ```js
 * import { UserSession } from '@esri/arcgis-rest-auth';
 * UserSession.beginOAuth2({
 *   // register an app of your own to create a unique clientId
 *   clientId: "abc123",
 *   redirectUri: 'https://yourapp.com/authenticate.html'
 * })
 *   .then(session)
 * // or
 * new UserSession({
 *   username: "jsmith",
 *   password: "123456"
 * })
 * // or
 * UserSession.deserialize(cache)
 * ```
 * Used to authenticate both ArcGIS Online and ArcGIS Enterprise users. `UserSession` includes helper methods for [OAuth 2.0](/arcgis-rest-js/guides/browser-authentication/) in both browser and server applications.
 */
export class UserSession implements IAuthenticationManager {
  /**
   * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is `true` the
   * authentication window will open in a new tab/window otherwise the user will
   * be redirected to the authorization page in their current tab/window.
   *
   * @browserOnly
   */
  /* istanbul ignore next */
  public static beginOAuth2(options: IOAuth2Options, win: any = window) {
    const {
      portal,
      provider,
      clientId,
      duration,
      redirectUri,
      popup,
      state,
      locale,
      params
    }: IOAuth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        provider: "arcgis",
        duration: 20160,
        popup: true,
        state: options.clientId,
        locale: ""
      },
      ...options
    };
    let url: string;
    if (provider === "arcgis") {
      url = `${portal}/oauth2/authorize?client_id=${clientId}&response_type=token&expiration=${duration}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}&locale=${locale}`;
    } else {
      url = `${portal}/oauth2/social/authorize?client_id=${clientId}&socialLoginProviderName=${provider}&autoAccountCreateForSocial=true&response_type=token&expiration=${duration}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&state=${state}&locale=${locale}`;
    }

    // append additional params
    if (params) {
      url = `${url}&${encodeQueryString(params)}`;
    }

    if (!popup) {
      win.location.href = url;
      return undefined;
    }

    const session = defer<UserSession>();

    win[`__ESRI_REST_AUTH_HANDLER_${clientId}`] = function(
      errorString: any,
      oauthInfoString: string
    ) {
      if (errorString) {
        const error = JSON.parse(errorString);
        session.reject(new ArcGISAuthError(error.errorMessage, error.error));
        return;
      }

      if (oauthInfoString) {
        const oauthInfo = JSON.parse(oauthInfoString);
        session.resolve(
          new UserSession({
            clientId,
            portal,
            ssl: oauthInfo.ssl,
            token: oauthInfo.token,
            tokenExpires: new Date(oauthInfo.expires),
            username: oauthInfo.username
          })
        );
      }
    };

    win.open(
      url,
      "oauth-window",
      "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes"
    );

    return session.promise;
  }

  /**
   * Completes a browser-based OAuth 2.0  in. If `options.popup` is `true` the user
   * will be returned to the previous window. Otherwise a new `UserSession`
   * will be returned. You must pass the same values for `options.popup` and
   * `options.portal` as you used in `beginOAuth2()`.
   *
   * @browserOnly
   */
  /* istanbul ignore next */
  public static completeOAuth2(options: IOAuth2Options, win: any = window) {
    const { portal, clientId, popup }: IOAuth2Options = {
      ...{ portal: "https://www.arcgis.com/sharing/rest", popup: true },
      ...options
    };

    function completeSignIn(error: any, oauthInfo?: IFetchTokenResponse) {
      try {
        if (
          popup &&
          win.opener &&
          win.opener.parent &&
          win.opener.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`]
        ) {
          const handlerFn =
            win.opener.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`];
          if (handlerFn) {
            handlerFn(
              error ? JSON.stringify(error) : undefined,
              JSON.stringify(oauthInfo)
            );
          }
          win.close();
          return undefined;
        }

        if (
          popup &&
          win !== win.parent &&
          win.parent &&
          win.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`]
        ) {
          const handlerFn = win.parent[`__ESRI_REST_AUTH_HANDLER_${clientId}`];
          if (handlerFn) {
            handlerFn(
              error ? JSON.stringify(error) : undefined,
              JSON.stringify(oauthInfo)
            );
          }
          win.close();
          return undefined;
        }
      } catch (e) {
        throw new ArcGISAuthError(
          `Unable to complete authentication. It's possible you specified popup based oAuth2 but no handler from "beginOAuth2()" present. This generally happens because the "popup" option differs between "beginOAuth2()" and "completeOAuth2()".`
        );
      }

      if (error) {
        throw new ArcGISAuthError(error.errorMessage, error.error);
      }

      return new UserSession({
        clientId,
        portal,
        ssl: oauthInfo.ssl,
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

      return completeSignIn({ error, errorMessage });
    }

    const token = match[1];
    const expires = new Date(
      Date.now() + parseInt(match[2], 10) * 1000 - 60 * 1000
    );
    const username = decodeURIComponent(match[3]);
    const ssl =
      win.location.href.indexOf("&ssl=true") > -1 ||
      win.location.href.indexOf("#ssl=true") > -1;

    return completeSignIn(undefined, {
      token,
      expires,
      ssl,
      username
    });
  }

  /**
   * Begins a new server-based OAuth 2.0 sign in. This will redirect the user to
   * the ArcGIS Online or ArcGIS Enterprise authorization page.
   *
   * @nodeOnly
   */
  public static authorize(
    options: IOAuth2Options,
    response: http.ServerResponse
  ) {
    const { portal, clientId, duration, redirectUri }: IOAuth2Options = {
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
  public static exchangeAuthorizationCode(
    options: IOAuth2Options,
    authorizationCode: string
  ): Promise<UserSession> {
    const { portal, clientId, redirectUri, refreshTokenTTL }: IOAuth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        refreshTokenTTL: 1440
      },
      ...options
    };

    return fetchToken(`${portal}/oauth2/token`, {
      params: {
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code: authorizationCode
      }
    }).then(response => {
      return new UserSession({
        clientId,
        portal,
        ssl: response.ssl,
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

  public static deserialize(str: string) {
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
      ssl: options.ssl,
      tokenDuration: options.tokenDuration,
      redirectUri: options.redirectUri,
      refreshTokenTTL: options.refreshTokenTTL
    });
  }

  /**
   * Translates authentication from the format used in the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).
   *
   * ```js
   * UserSession.fromCredential({
   *   userId: "jsmith",
   *   token: "secret"
   * });
   * ```
   *
   * @returns UserSession
   */
  public static fromCredential(credential: ICredential) {
    return new UserSession({
      portal: credential.server.includes("sharing/rest")
        ? credential.server
        : credential.server + `/sharing/rest`,
      ssl: credential.ssl,
      token: credential.token,
      username: credential.userId,
      tokenExpires: new Date(credential.expires)
    });
  }

  /**
   * Client ID being used for authentication if provided in the `constructor`.
   */
  public readonly clientId: string;

  /**
   * The currently authenticated user if provided in the `constructor`.
   */
  public readonly username: string;

  /**
   * The currently authenticated user's password if provided in the `constructor`.
   */
  public readonly password: string;

  /**
   * The current portal the user is authenticated with.
   */
  public readonly portal: string;

  /**
   * This value is set to true automatically if the ArcGIS Organization requires that requests be made over https.
   */
  public readonly ssl: boolean;

  /**
   * The authentication provider to use.
   */
  public readonly provider: AuthenticationProvider;

  /**
   * Determines how long new tokens requested are valid.
   */
  public readonly tokenDuration: number;

  /**
   * A valid redirect URI for this application if provided in the `constructor`.
   */
  public readonly redirectUri: string;

  /**
   * Duration of new OAuth 2.0 refresh token validity.
   */
  public readonly refreshTokenTTL: number;

  /**
   * An unfederated ArcGIS Server instance known to recognize credentials supplied manually.
   * ```js
   * {
   *   server: "https://sampleserver6.arcgisonline.com/arcgis",
   *   token: "SOSlV3v..",
   *   tokenExpires: new Date(1545415669763)
   * }
   * ```
   */
  public readonly server: string;

  /**
   * Hydrated by a call to [getUser()](#getUser-summary).
   */
  private _user: IUser;

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
    this.portal = options.portal
      ? cleanUrl(options.portal)
      : "https://www.arcgis.com/sharing/rest";
    this.ssl = options.ssl;
    this.provider = options.provider || "arcgis";
    this.tokenDuration = options.tokenDuration || 20160;
    this.redirectUri = options.redirectUri;
    this.refreshTokenTTL = options.refreshTokenTTL || 1440;

    this.trustedServers = {};
    // if a non-federated server was passed explicitly, it should be trusted.
    if (options.server) {
      // if the url includes more than '/arcgis/', trim the rest
      const root = this.getServerRootUrl(options.server);

      this.trustedServers[root] = {
        token: options.token,
        expires: options.tokenExpires
      };
    }
    this._pendingTokenRequests = {};
  }

  /**
   * Returns authentication in a format useable in the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).
   *
   * ```js
   * esriId.registerToken(session.toCredential());
   * ```
   *
   * @returns ICredential
   */
  public toCredential(): ICredential {
    return {
      expires: this.tokenExpires.getTime(),
      server: this.portal,
      ssl: this.ssl,
      token: this.token,
      userId: this.username
    };
  }

  /**
   * Returns information about the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic.
   *
   * ```js
   * session.getUser()
   *   .then(response => {
   *     console.log(response.role); // "org_admin"
   *   })
   * ```
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns A Promise that will resolve with the data from the response.
   */
  public getUser(requestOptions?: IRequestOptions): Promise<IUser> {
    if (this._user && this._user.username === this.username) {
      return Promise.resolve(this._user);
    } else {
      const url = `${this.portal}/community/users/${encodeURIComponent(
        this.username
      )}`;

      const options = {
        httpMethod: "GET",
        authentication: this,
        ...requestOptions,
        rawResponse: false
      } as IRequestOptions;
      return request(url, options).then(response => {
        this._user = response;
        return response;
      });
    }
  }

  /**
   * Gets an appropriate token for the given URL. If `portal` is ArcGIS Online and
   * the request is to an ArcGIS Online domain `token` will be used. If the request
   * is to the current `portal` the current `token` will also be used. However if
   * the request is to an unknown server we will validate the server with a request
   * to our current `portal`.
   */
  public getToken(url: string, requestOptions?: ITokenRequestOptions) {
    if (canUseOnlineToken(this.portal, url)) {
      return this.getFreshToken(requestOptions);
    } else if (new RegExp(this.portal, "i").test(url)) {
      return this.getFreshToken(requestOptions);
    } else {
      return this.getTokenForServer(url, requestOptions);
    }
  }

  public toJSON(): IUserSessionOptions {
    return {
      clientId: this.clientId,
      refreshToken: this.refreshToken,
      refreshTokenExpires: this.refreshTokenExpires,
      username: this.username,
      password: this.password,
      token: this.token,
      tokenExpires: this.tokenExpires,
      portal: this.portal,
      ssl: this.ssl,
      tokenDuration: this.tokenDuration,
      redirectUri: this.redirectUri,
      refreshTokenTTL: this.refreshTokenTTL
    };
  }

  public serialize() {
    return JSON.stringify(this);
  }

  /**
   * Manually refreshes the current `token` and `tokenExpires`.
   */
  public refreshSession(
    requestOptions?: ITokenRequestOptions
  ): Promise<UserSession> {
    // make sure subsequent calls to getUser() don't returned cached metadata
    this._user = null;
    if (this.username && this.password) {
      return this.refreshWithUsernameAndPassword(requestOptions);
    }

    if (this.clientId && this.refreshToken) {
      return this.refreshWithRefreshToken();
    }

    return Promise.reject(new ArcGISAuthError("Unable to refresh token."));
  }

  /**
   * Determines the root of the ArcGIS Server or Portal for a given URL.
   *
   * @param url the URl to determine the root url for.
   */
  public getServerRootUrl(url: string) {
    const [root] = cleanUrl(url).split(
      /\/rest(\/admin)?\/services(?:\/|#|\?|$)/
    );
    const [match, protocol, domainAndPath] = root.match(/(https?:\/\/)(.+)/);
    const [domain, ...path] = domainAndPath.split("/");

    // only the domain is lowercased becasue in some cases an org id might be
    // in the path which cannot be lowercased.
    return `${protocol}${domain.toLowerCase()}/${path.join("/")}`;
  }

  /**
   * Validates that a given URL is properly federated with our current `portal`.
   * Attempts to use the internal `trustedServers` cache first.
   */
  private getTokenForServer(
    url: string,
    requestOptions?: ITokenRequestOptions
  ) {
    // requests to /rest/services/ and /rest/admin/services/ are both valid
    // Federated servers may have inconsistent casing, so lowerCase it
    const root = this.getServerRootUrl(url);
    const existingToken = this.trustedServers[root];

    if (
      existingToken &&
      existingToken.expires &&
      existingToken.expires.getTime() > Date.now()
    ) {
      return Promise.resolve(existingToken.token);
    }

    if (this._pendingTokenRequests[root]) {
      return this._pendingTokenRequests[root];
    }

    this._pendingTokenRequests[root] = request(`${root}/rest/info`)
      .then(response => {
        if (response.owningSystemUrl) {
          /**
           * if this server is not owned by this portal
           * bail out with an error since we know we wont
           * be able to generate a token
           */
          if (!isFederated(response.owningSystemUrl, this.portal)) {
            throw new ArcGISAuthError(
              `${url} is not federated with ${this.portal}.`,
              "NOT_FEDERATED"
            );
          } else {
            /**
             * if the server is federated, use the relevant token endpoint.
             */
            return request(
              `${response.owningSystemUrl}/sharing/rest/info`,
              requestOptions
            );
          }
        } else if (
          response.authInfo &&
          this.trustedServers[root] !== undefined
        ) {
          /**
           * if its a stand-alone instance of ArcGIS Server that doesn't advertise
           * federation, but the root server url is recognized, use its built in token endpoint.
           */
          return Promise.resolve({ authInfo: response.authInfo });
        } else {
          throw new ArcGISAuthError(
            `${url} is not federated with any portal and is not explicitly trusted.`,
            "NOT_FEDERATED"
          );
        }
      })
      .then((response: any) => {
        return response.authInfo.tokenServicesUrl;
      })
      .then((tokenServicesUrl: string) => {
        // an expired token cant be used to generate a new token
        if (this.token && this.tokenExpires.getTime() > Date.now()) {
          return generateToken(tokenServicesUrl, {
            params: {
              token: this.token,
              serverUrl: url,
              expiration: this.tokenDuration,
              client: "referer"
            }
          });
          // generate an entirely fresh token if necessary
        } else {
          return generateToken(tokenServicesUrl, {
            params: {
              username: this.username,
              password: this.password,
              expiration: this.tokenDuration,
              client: "referer"
            }
          }).then((response: any) => {
            this._token = response.token;
            this._tokenExpires = new Date(response.expires);
            return response;
          });
        }
      })
      .then(response => {
        this.trustedServers[root] = {
          expires: new Date(response.expires),
          token: response.token
        };
        delete this._pendingTokenRequests[root];
        return response.token;
      });

    return this._pendingTokenRequests[root];
  }

  /**
   * Returns an unexpired token for the current `portal`.
   */
  private getFreshToken(requestOptions?: ITokenRequestOptions) {
    if (
      this.token &&
      this.tokenExpires &&
      this.tokenExpires.getTime() > Date.now()
    ) {
      return Promise.resolve(this.token);
    }

    if (!this._pendingTokenRequests[this.portal]) {
      this._pendingTokenRequests[this.portal] = this.refreshSession(
        requestOptions
      ).then(session => {
        this._pendingTokenRequests[this.portal] = null;
        return session.token;
      });
    }

    return this._pendingTokenRequests[this.portal];
  }

  /**
   * Refreshes the current `token` and `tokenExpires` with `username` and
   * `password`.
   */
  private refreshWithUsernameAndPassword(
    requestOptions?: ITokenRequestOptions
  ) {
    const options = {
      params: {
        username: this.username,
        password: this.password,
        expiration: this.tokenDuration
      },
      ...requestOptions
    };
    return generateToken(`${this.portal}/generateToken`, options).then(
      (response: any) => {
        this._token = response.token;
        this._tokenExpires = new Date(response.expires);
        return this;
      }
    );
  }

  /**
   * Refreshes the current `token` and `tokenExpires` with `refreshToken`.
   */
  private refreshWithRefreshToken(requestOptions?: ITokenRequestOptions) {
    if (
      this.refreshToken &&
      this.refreshTokenExpires &&
      this.refreshTokenExpires.getTime() < Date.now()
    ) {
      return this.refreshRefreshToken(requestOptions);
    }

    const options: ITokenRequestOptions = {
      params: {
        client_id: this.clientId,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token"
      },
      ...requestOptions
    };
    return fetchToken(`${this.portal}/oauth2/token`, options).then(response => {
      this._token = response.token;
      this._tokenExpires = response.expires;
      return this;
    });
  }

  /**
   * Exchanges an unexpired `refreshToken` for a new one, also updates `token` and
   * `tokenExpires`.
   */
  private refreshRefreshToken(requestOptions?: ITokenRequestOptions) {
    const options: ITokenRequestOptions = {
      params: {
        client_id: this.clientId,
        refresh_token: this.refreshToken,
        redirect_uri: this.redirectUri,
        grant_type: "exchange_refresh_token"
      },
      ...requestOptions
    };

    return fetchToken(`${this.portal}/oauth2/token`, options).then(response => {
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
