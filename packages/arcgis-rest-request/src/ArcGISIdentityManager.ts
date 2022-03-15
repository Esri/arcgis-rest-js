/* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as http from "http";
import { ArcGISAuthError, request } from "./request.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
import { ITokenRequestOptions } from "./utils/ITokenRequestOptions.js";
import { decodeQueryString } from "./utils/decode-query-string.js";
import { encodeQueryString } from "./utils/encode-query-string.js";
import { IUser } from "./types/user.js";
import { generateToken } from "./generate-token.js";
import { fetchToken, IFetchTokenResponse } from "./fetch-token.js";
import { canUseOnlineToken, isFederated } from "./federation-utils.js";
import { IAppAccess, validateAppAccess } from "./validate-app-access.js";
import { cleanUrl } from "./utils/clean-url.js";
import { revokeToken } from "./revoke-token.js";
import { generateCodeChallenge } from "./utils/generate-code-challenge.js";
import { generateRandomString } from "./utils/generate-random-string.js";
import { ArcGISAccessDeniedError } from "./utils/ArcGISAccessDeniedError.js";

/**
 * Options for {@linkcode ArcGISIdentityManager.fromToken}.
 */
export interface IFromTokenOptions {
  token: string;
  tokenExpires?: Date;
  portal?: string;
}

/**
 * Options for {@linkcode ArcGISIdentityManager.signIn}.
 */
export interface ISignInOptions {
  username: string;
  password: string;
  portal?: string;
}

export type AuthenticationProvider =
  | "arcgis"
  | "facebook"
  | "google"
  | "github"
  | "apple";

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

/**
 * Options for static OAuth 2.0 helper methods on `ArcGISIdentityManager`.
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
   * The requested validity in minutes for a token. Defaults to 20160 (two weeks).
   */
  expiration?: number;

  /**
   * Duration (in minutes) that a token will be valid. Defaults to 20160 (two weeks).
   *
   * @deprecated use 'expiration' instead
   */
  duration?: number;

  /**
   * If `true` will use the PKCE oAuth 2.0 extension spec in to authorize the user and obtain a token. A value of `false` will use the deprecated oAuth 2.0 implicit grant type.
   *
   * @browserOnly
   */
  pkce?: boolean;

  /**
   * Determines whether to open the authorization window in a new tab/window or in the current window.
   *
   * @browserOnly
   */
  popup?: boolean;

  /**
   * The window features passed to [window.open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) when `popup` is true. Defaults to `height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes`
   *
   * @browserOnly
   */
  popupWindowFeatures?: string;

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
   * Sets the color theme of the oAuth 2.0 authorization screen. Will use the system preference or a light theme by default.
   */
  style?: "" | "light" | "dark";

  /**
   * Custom value for oAuth 2.0 state. A random identifier will be generated if this is not passed.
   */
  state?: string;

  [key: string]: any;
}

/**
 * Options for the {@linkcode ArcGISIdentityManager} constructor.
 */
export interface IArcGISIdentityManagerOptions {
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
   * OAuth 2.0 refresh token.
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
   * OAuth 2.0 access token.
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
 * Used to authenticate both ArcGIS Online and ArcGIS Enterprise users. `ArcGISIdentityManager` includes helper methods for [OAuth 2.0](/arcgis-rest-js/guides/browser-authentication/) in both browser and server applications.
 *
 * **It is not recommended to construct `ArcGISIdentityManager` directly**. Instead there are several static methods used for specific workflows. The 2 primary workflows relate to oAuth 2.0:
 *
 * * {@linkcode ArcGISIdentityManager.beginOAuth2} + {@linkcode ArcGISIdentityManager.completeOAuth2} - for oAuth 2.0 in browser-only environment.
 * * {@linkcode ArcGISIdentityManager.authorize} + {@linkcode ArcGISIdentityManager.exchangeAuthorizationCode} - for oAuth 2.0 for server-enabled application.
 *
 * Other more specialized helpers for less common workflows also exist:
 *
 * * {@linkcode ArcGISIdentityManager.enablePostMessageAuth} + {@linkcode ArcGISIdentityManager.fromParent} - For when your application needs to pass authentication details between different pages embedded in iframes.
 * * {@linkcode ArcGISIdentityManager.fromToken} - When you have an existing token from another source and would like create an `ArcGISIdentityManager` instance.
 * * {@linkcode ArcGISIdentityManager.fromCredential} - For creating  an `ArcGISIdentityManager` instance from a `Credentials` object in the ArcGIS JS API `IdentityManager`
 * * {@linkcode ArcGISIdentityManager.signIn} - Authenticate directly with a users username and password.
 *
 * Once a manager is created there are additional utilities:
 *
 * * {@linkcode ArcGISIdentityManager.serialize} can be used to create a JSON object representing an instance of `ArcGISIdentityManager`
 * * {@linkcode ArcGISIdentityManager.deserialize} will create a new `ArcGISIdentityManager` from a JSON object created with {@linkcode ArcGISIdentityManager.serialize}
 * * {@linkcode ArcGISIdentityManager.destroy} or {@linkcode ArcGISIdentityManager.signOut} will invalidate any tokens in use by the  `ArcGISIdentityManager`.
 */
export class ArcGISIdentityManager implements IAuthenticationManager {
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

  /**
   * The currently authenticated user.
   */
  get username() {
    if (this._username) {
      return this._username;
    }

    if (this._user && this._user.username) {
      return this._user.username;
    }
  }

  /**
   * Returns `true` if these credentials can be refreshed and `false` if it cannot.
   */
  get canRefresh() {
    if (this.username && this.password) {
      return true;
    }

    if (this.clientId && this.refreshToken) {
      return true;
    }

    return false;
  }

  /**
   * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is `true` the
   * authentication window will open in a new tab/window. Otherwise, the user will be redirected to the authorization page in their current tab/window and the function will return `undefined`.
   *
   * @browserOnly
   */
  public static beginOAuth2(
    options: IOAuth2Options,
    win?: any
  ): Promise<ArcGISIdentityManager> | undefined {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
      win = window;
    }

    const {
      portal,
      provider,
      clientId,
      expiration,
      redirectUri,
      popup,
      popupWindowFeatures,
      locale,
      params,
      style,
      pkce,
      state
    }: IOAuth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        provider: "arcgis",
        expiration: 20160,
        popup: true,
        popupWindowFeatures:
          "height=400,width=600,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes",
        state: options.clientId,
        locale: "",
        style: "",
        pkce: true
      },
      ...options
    };

    /**
     * Generate a  random string for the `state` param and store it in local storage. This is used
     * to validate that all parts of the oAuth process were performed on the same client.
     */
    const stateId = state || generateRandomString(win);
    const stateStorageKey = `ARCGIS_REST_JS_AUTH_STATE_${clientId}`;

    win.localStorage.setItem(stateStorageKey, stateId);

    // Start setting up the URL to the authorization screen.
    let authorizeUrl = `${cleanUrl(portal)}/oauth2/authorize`;
    const authorizeUrlParams: any = {
      client_id: clientId,
      response_type: pkce ? "code" : "token",
      expiration: expiration,
      redirect_uri: redirectUri,
      state: JSON.stringify({
        id: stateId,
        originalUrl: win.location.href // this is used to reset the URL back the original URL upon return
      }),
      locale: locale,
      style: style
    };

    // If we are authorizing through a specific social provider update the params and base URL.
    if (provider !== "arcgis") {
      authorizeUrl = `${cleanUrl(portal)}/oauth2/social/authorize`;
      authorizeUrlParams.socialLoginProviderName = provider;
      authorizeUrlParams.autoAccountCreateForSocial = true;
    }

    /**
     * set a value that will be set to a promise which will later resolve when we are ready
     * to send users to the authorization page.
     */
    let setupAuth;

    if (pkce) {
      /**
       * If we are authenticating with PKCE we need to generate the code challenge which is
       * async so we generate the code challenge and assign the resulting Promise to `setupAuth`
       */
      const codeVerifier = generateRandomString(win);
      const codeVerifierStorageKey = `ARCGIS_REST_JS_CODE_VERIFIER_${clientId}`;

      win.localStorage.setItem(codeVerifierStorageKey, codeVerifier);

      setupAuth = generateCodeChallenge(codeVerifier, win).then(function (
        codeChallenge
      ) {
        authorizeUrlParams.code_challenge_method = codeChallenge
          ? "S256"
          : "plain";

        authorizeUrlParams.code_challenge = codeChallenge
          ? codeChallenge
          : codeVerifier;
      });
    } else {
      /**
       * If we aren't authenticating with PKCE we can just assign a resolved promise to `setupAuth`
       */
      setupAuth = Promise.resolve();
    }

    /**
     * Once we are done setting up with (for PKCE) we can start the auth process.
     */
    return setupAuth.then(() => {
      // combine the authorize URL and params
      authorizeUrl = `${authorizeUrl}?${encodeQueryString(authorizeUrlParams)}`;

      // append additional params passed by the user
      if (params) {
        authorizeUrl = `${authorizeUrl}&${encodeQueryString(params)}`;
      }

      if (popup) {
        // If we are authenticating a popup we need to return a Promise that will resolve to an ArcGISIdentityManager later.
        return new Promise((resolve, reject) => {
          // Add an event listener to listen for when a user calls `ArcGISIdentityManager.completeOAuth2()` in the popup.
          win.addEventListener(
            `arcgis-rest-js-popup-auth-${clientId}`,
            (e: CustomEvent<any>) => {
              if (e.detail.error === "access_denied") {
                const error = new ArcGISAccessDeniedError();
                reject(error);
                return error;
              }

              if (e.detail.error) {
                const error = new ArcGISAuthError(
                  e.detail.errorMessage,
                  e.detail.error
                );
                reject(error);
                return error;
              }

              resolve(
                new ArcGISIdentityManager({
                  clientId,
                  portal,
                  ssl: e.detail.ssl,
                  token: e.detail.token,
                  tokenExpires: e.detail.expires,
                  username: e.detail.username,
                  refreshToken: e.detail.refreshToken,
                  refreshTokenExpires: e.detail.refreshTokenExpires
                })
              );
            },
            {
              once: true
            }
          );

          // open the popup
          win.open(authorizeUrl, "oauth-window", popupWindowFeatures);

          win.dispatchEvent(new CustomEvent("arcgis-rest-js-popup-auth-start"));
        });
      } else {
        // If we aren't authenticating with a popup just send the user to the authorization page.
        win.location.href = authorizeUrl;
        return undefined;
      }
    });
  }

  /**
   * Completes a browser-based OAuth 2.0 sign in. If `options.popup` is `true` the user
   * will be returned to the previous window and the popup will close. Otherwise a new `ArcGISIdentityManager` will be returned. You must pass the same values for `clientId`, `popup`, `portal`, and `pkce` as you used in `beginOAuth2()`.
   *
   * @browserOnly
   */
  public static completeOAuth2(options: IOAuth2Options, win?: any) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
      win = window;
    }

    // pull out necessary options
    const { portal, clientId, popup, pkce }: IOAuth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        popup: true,
        pkce: true
      },
      ...options
    };

    // pull the saved state id out of local storage
    const stateStorageKey = `ARCGIS_REST_JS_AUTH_STATE_${clientId}`;
    const stateId = win.localStorage.getItem(stateStorageKey);

    // get the params provided by the server and compare the server state with the client saved state
    const params = decodeQueryString(
      pkce
        ? win.location.search.replace(/^\?/, "")
        : win.location.hash.replace(/^#/, "")
    );

    const state = params && params.state ? JSON.parse(params.state) : undefined;

    function reportError(
      errorMessage: string,
      error: string,
      originalUrl?: string
    ) {
      win.localStorage.removeItem(stateStorageKey);

      if (popup && win.opener) {
        win.opener.dispatchEvent(
          new CustomEvent(`arcgis-rest-js-popup-auth-${clientId}`, {
            detail: {
              error,
              errorMessage
            }
          })
        );

        win.close();
        return;
      }

      if (originalUrl) {
        win.history.replaceState(win.history.state, "", originalUrl);
      }

      if (error === "access_denied") {
        return Promise.reject(new ArcGISAccessDeniedError());
      }

      return Promise.reject(new ArcGISAuthError(errorMessage, error));
    }

    // create a function to create the final ArcGISIdentityManager from the token info.
    function createManager(
      oauthInfo: IFetchTokenResponse,
      originalUrl: string
    ) {
      win.localStorage.removeItem(stateStorageKey);

      if (popup && win.opener) {
        win.opener.dispatchEvent(
          new CustomEvent(`arcgis-rest-js-popup-auth-${clientId}`, {
            detail: {
              ...oauthInfo
            }
          })
        );

        win.close();
        return;
      }

      win.history.replaceState(win.history.state, "", originalUrl);

      return new ArcGISIdentityManager({
        clientId,
        portal,
        ssl: oauthInfo.ssl,
        token: oauthInfo.token,
        tokenExpires: oauthInfo.expires,
        username: oauthInfo.username,
        refreshToken: oauthInfo.refreshToken,
        refreshTokenExpires: oauthInfo.refreshTokenExpires
      });
    }

    if (!stateId || !state) {
      return reportError(
        "No authentication state was found, call `ArcGISIdentityManager.beginOAuth2(...)` to start the authentication process.",
        "no-auth-state"
      );
    }

    if (state.id !== stateId) {
      return reportError(
        "Saved client state did not match server sent state.",
        "mismatched-auth-state"
      );
    }

    if (params.error) {
      const error = params.error;
      const errorMessage = params.error_description || "Unknown error";

      return reportError(errorMessage, error, state.originalUrl);
    }
    /**
     * If we are using PKCE the authorization code will be in the query params.
     * For implicit grants the token will be in the hash.
     */
    if (pkce && params.code) {
      const tokenEndpoint = cleanUrl(`${portal}/oauth2/token/`);

      const codeVerifierStorageKey = `ARCGIS_REST_JS_CODE_VERIFIER_${clientId}`;
      const codeVerifier = win.localStorage.getItem(codeVerifierStorageKey);
      win.localStorage.removeItem(codeVerifierStorageKey);

      // exchange our auth code for a token + refresh token
      return fetchToken(tokenEndpoint, {
        httpMethod: "POST",
        params: {
          client_id: clientId,
          code_verifier: codeVerifier,
          grant_type: "authorization_code",
          redirect_uri: location.href.replace(location.search, ""),
          code: params.code
        }
      })
        .then((tokenResponse) => {
          return createManager(
            { ...tokenResponse, ...state },
            state.originalUrl
          );
        })
        .catch((e) => {
          return reportError(e.message, e.error, state.originalUrl);
        });
    }

    if (!pkce && params.access_token) {
      return Promise.resolve(
        createManager(
          {
            token: params.access_token,
            expires: new Date(
              Date.now() + parseInt(params.expires_in, 10) * 1000
            ),
            ssl: params.ssl === "true",
            username: params.username,
            ...state
          },
          state.originalUrl
        )
      );
    }

    return reportError("Unknown error", "oauth-error", state.originalUrl);
  }

  /**
   * Request credentials information from the parent application
   *
   * When an application is embedded into another application via an IFrame, the embedded app can
   * use `window.postMessage` to request credentials from the host application. This function wraps
   * that behavior.
   *
   * The ArcGIS API for Javascript has this built into the Identity Manager as of the 4.19 release.
   *
   * Note: The parent application will not respond if the embedded app's origin is not:
   * - the same origin as the parent or *.arcgis.com (JSAPI)
   * - in the list of valid child origins (REST-JS)
   *
   *
   * @param parentOrigin origin of the parent frame. Passed into the embedded application as `parentOrigin` query param
   * @browserOnly
   */
  public static fromParent(parentOrigin: string, win?: any): Promise<any> {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
      win = window;
    }
    // Declare handler outside of promise scope so we can detach it
    let handler: (event: any) => void;
    // return a promise that will resolve when the handler receives
    // session information from the correct origin
    return new Promise((resolve, reject) => {
      // create an event handler that just wraps the parentMessageHandler
      handler = (event: any) => {
        // ensure we only listen to events from the parent
        if (event.source === win.parent && event.data) {
          try {
            return resolve(ArcGISIdentityManager.parentMessageHandler(event));
          } catch (err) {
            return reject(err);
          }
        }
      };
      // add listener
      win.addEventListener("message", handler, false);
      win.parent.postMessage(
        { type: "arcgis:auth:requestCredential" },
        parentOrigin
      );
    }).then((manager) => {
      win.removeEventListener("message", handler, false);
      return manager;
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
    const { portal, clientId, expiration, redirectUri, state }: IOAuth2Options =
      {
        ...{ portal: "https://arcgis.com/sharing/rest", expiration: 20160 },
        ...options
      };

    const url = `${portal}/oauth2/authorize?client_id=${clientId}&expiration=${expiration}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`;

    response.writeHead(301, {
      Location: url
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
  ): Promise<ArcGISIdentityManager> {
    const { portal, clientId, redirectUri, refreshTokenTTL }: IOAuth2Options = {
      ...{
        portal: "https://www.arcgis.com/sharing/rest",
        refreshTokenTTL: 20160
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
    }).then((response) => {
      return new ArcGISIdentityManager({
        clientId,
        portal,
        ssl: response.ssl,
        redirectUri,
        refreshToken: response.refreshToken,
        refreshTokenTTL,
        refreshTokenExpires: new Date(
          Date.now() + (refreshTokenTTL - 1) * 60 * 1000
        ),
        token: response.token,
        tokenExpires: response.expires,
        username: response.username
      });
    });
  }

  public static deserialize(str: string) {
    const options = JSON.parse(str);
    return new ArcGISIdentityManager({
      clientId: options.clientId,
      refreshToken: options.refreshToken,
      refreshTokenExpires: options.refreshTokenExpires
        ? new Date(options.refreshTokenExpires)
        : undefined,
      username: options.username,
      password: options.password,
      token: options.token,
      tokenExpires: options.tokenExpires
        ? new Date(options.tokenExpires)
        : undefined,
      portal: options.portal,
      ssl: options.ssl,
      tokenDuration: options.tokenDuration,
      redirectUri: options.redirectUri,
      refreshTokenTTL: options.refreshTokenTTL,
      server: options.server
    });
  }

  /**
   * Translates authentication from the format used in the [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/).
   *
   * ```js
   * ArcGISIdentityManager.fromCredential({
   *   userId: "jsmith",
   *   token: "secret"
   * });
   * ```
   *
   * @returns ArcGISIdentityManager
   */
  public static fromCredential(credential: ICredential) {
    // At ArcGIS Online 9.1, credentials no longer include the ssl and expires properties
    // Here, we provide default values for them to cover this condition
    const ssl = typeof credential.ssl !== "undefined" ? credential.ssl : true;
    const expires = credential.expires || Date.now() + 7200000; /* 2 hours */

    return new ArcGISIdentityManager({
      portal: credential.server.includes("sharing/rest")
        ? credential.server
        : credential.server + `/sharing/rest`,
      ssl,
      token: credential.token,
      username: credential.userId,
      tokenExpires: new Date(expires)
    });
  }

  /**
   * Handle the response from the parent
   * @param event DOM Event
   */
  private static parentMessageHandler(event: any): ArcGISIdentityManager {
    if (event.data.type === "arcgis:auth:credential") {
      return ArcGISIdentityManager.fromCredential(event.data.credential);
    }
    if (event.data.type === "arcgis:auth:error") {
      const err = new Error(event.data.error.message);
      err.name = event.data.error.name;
      throw err;
    } else {
      throw new Error("Unknown message type.");
    }
  }

  /**
   * Revokes all active tokens for a provided {@linkcode ArcGISIdentityManager}. The can be considered the equivalent to signing the user out of your application.
   */
  public static destroy(manager: ArcGISIdentityManager) {
    return revokeToken({
      clientId: manager.clientId,
      portal: manager.portal,
      token: manager.refreshToken || manager.token
    });
  }

  /**
   * Create a  {@linkcode ArcGISIdentityManager} from an existing token. Useful for when you have a users token from a different authentication system and want to get a  {@linkcode ArcGISIdentityManager}.
   */
  public static fromToken(
    options: IFromTokenOptions
  ): Promise<ArcGISIdentityManager> {
    const manager = new ArcGISIdentityManager(options);

    return manager.getUser().then(() => {
      return manager;
    });
  }

  /**
   * Initialize a {@linkcode ArcGISIdentityManager} with a users `username` and `password`. **This method is intended ONLY for applications without a user interface such as CLI tools.**.
   *
   * If possible you should use {@linkcode ArcGISIdentityManager.beginOAuth2} to authenticate users in a browser or {@linkcode ArcGISIdentityManager.authorize} for authenticating users with a web server.
   */
  public static signIn(options: ISignInOptions) {
    const manager = new ArcGISIdentityManager(options);

    return manager.getUser().then(() => {
      return manager;
    });
  }

  /**
   * Client ID being used for authentication if provided in the `constructor`.
   */
  public readonly clientId: string;

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
   * Duration of new OAuth 2.0 refresh token validity (in minutes).
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

  /**
   * Hydrated by a call to [getPortal()](#getPortal-summary).
   */
  private _portalInfo: any;

  private _token: string;
  private _tokenExpires: Date;
  private _refreshToken: string;
  private _refreshTokenExpires: Date;
  private _pendingUserRequest: Promise<IUser>;
  private _pendingPortalRequest: Promise<any>;

  /**
   * Internal object to keep track of pending token requests. Used to prevent
   *  duplicate token requests.
   */
  private _pendingTokenRequests: {
    [key: string]: Promise<string>;
  };

  private _username: string;

  /**
   * Internal list of tokens to 3rd party servers (federated servers) that have
   *  been created via `generateToken`. The object key is the root URL of the server.
   */
  private federatedServers: {
    [key: string]: {
      token: string;
      expires: Date;
    };
  };

  /**
   * Internal list of 3rd party domains that should receive all cookies (credentials: "include").
   * Used to for PKI and IWA workflows in high security environments.
   */
  private trustedDomains: string[];

  private _hostHandler: any;

  constructor(options: IArcGISIdentityManagerOptions) {
    this.clientId = options.clientId;
    this._refreshToken = options.refreshToken;
    this._refreshTokenExpires = options.refreshTokenExpires;
    this._username = options.username;
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
    this.refreshTokenTTL = options.refreshTokenTTL || 20160;
    this.server = options.server;

    this.federatedServers = {};
    this.trustedDomains = [];

    // if a non-federated server was passed explicitly, it should be trusted.
    if (options.server) {
      // if the url includes more than '/arcgis/', trim the rest
      const root = this.getServerRootUrl(options.server);

      this.federatedServers[root] = {
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
   * esriId.registerToken(manager.toCredential());
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
   * manager.getUser()
   *   .then(response => {
   *     console.log(response.role); // "org_admin"
   *   })
   * ```
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns A Promise that will resolve with the data from the response.
   */
  public getUser(requestOptions?: IRequestOptions): Promise<IUser> {
    if (this._pendingUserRequest) {
      return this._pendingUserRequest;
    } else if (this._user) {
      return Promise.resolve(this._user);
    } else {
      const url = `${this.portal}/community/self`;

      const options = {
        httpMethod: "GET",
        authentication: this,
        ...requestOptions,
        rawResponse: false
      } as IRequestOptions;

      this._pendingUserRequest = request(url, options).then((response) => {
        this._user = response;
        this._pendingUserRequest = null;
        return response;
      });

      return this._pendingUserRequest;
    }
  }

  /**
   * Returns information about the currently logged in user's [portal](https://developers.arcgis.com/rest/users-groups-and-items/portal-self.htm). Subsequent calls will *not* result in additional web traffic.
   *
   * ```js
   * manager.getPortal()
   *   .then(response => {
   *     console.log(portal.name); // "City of ..."
   *   })
   * ```
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns A Promise that will resolve with the data from the response.
   */
  public getPortal(requestOptions?: IRequestOptions): Promise<any> {
    if (this._pendingPortalRequest) {
      return this._pendingPortalRequest;
    } else if (this._portalInfo) {
      return Promise.resolve(this._portalInfo);
    } else {
      const url = `${this.portal}/portals/self`;

      const options = {
        httpMethod: "GET",
        authentication: this,
        ...requestOptions,
        rawResponse: false
      } as IRequestOptions;

      this._pendingPortalRequest = request(url, options).then((response) => {
        this._portalInfo = response;
        this._pendingPortalRequest = null;
        return response;
      });

      return this._pendingPortalRequest;
    }
  }

  /**
   * Returns the username for the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic. This is also used internally when a username is required for some requests but is not present in the options.
   *
   *    * ```js
   * manager.getUsername()
   *   .then(response => {
   *     console.log(response); // "casey_jones"
   *   })
   * ```
   */
  public getUsername() {
    if (this.username) {
      return Promise.resolve(this.username);
    } else {
      return this.getUser().then((user) => {
        return user.username;
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

  /**
   * Get application access information for the current user
   * see `validateAppAccess` function for details
   *
   * @param clientId application client id
   */
  public validateAppAccess(clientId: string): Promise<IAppAccess> {
    return this.getToken(this.portal).then((token) => {
      return validateAppAccess(token, clientId);
    });
  }

  public toJSON(): IArcGISIdentityManagerOptions {
    return {
      clientId: this.clientId,
      refreshToken: this.refreshToken,
      refreshTokenExpires: this.refreshTokenExpires || undefined,
      username: this.username,
      password: this.password,
      token: this.token,
      tokenExpires: this.tokenExpires || undefined,
      portal: this.portal,
      ssl: this.ssl,
      tokenDuration: this.tokenDuration,
      redirectUri: this.redirectUri,
      refreshTokenTTL: this.refreshTokenTTL,
      server: this.server
    };
  }

  public serialize() {
    return JSON.stringify(this);
  }
  /**
   * For a "Host" app that embeds other platform apps via iframes, after authenticating the user
   * and creating a ArcGISIdentityManager, the app can then enable "post message" style authentication by calling
   * this method.
   *
   * Internally this adds an event listener on window for the `message` event
   *
   * @param validChildOrigins Array of origins that are allowed to request authentication from the host app
   */
  public enablePostMessageAuth(validChildOrigins: string[], win?: any): any {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
      win = window;
    }
    this._hostHandler = this.createPostMessageHandler(validChildOrigins);
    win.addEventListener("message", this._hostHandler, false);
  }

  /**
   * For a "Host" app that has embedded other platform apps via iframes, when the host needs
   * to transition routes, it should call `ArcGISIdentityManager.disablePostMessageAuth()` to remove
   * the event listener and prevent memory leaks
   */
  public disablePostMessageAuth(win?: any) {
    /* istanbul ignore next: must pass in a mockwindow for tests so we can't cover the other branch */
    if (!win && window) {
      win = window;
    }
    win.removeEventListener("message", this._hostHandler, false);
  }

  /**
   * Manually refreshes the current `token` and `tokenExpires`.
   */
  public refreshCredentials(requestOptions?: ITokenRequestOptions) {
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

    // only the domain is lowercased because in some cases an org id might be
    // in the path which cannot be lowercased.
    return `${protocol}${domain.toLowerCase()}/${path.join("/")}`;
  }

  /**
   * Returns the proper [`credentials`] option for `fetch` for a given domain.
   * See [trusted server](https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-security.htm#ESRI_SECTION1_70CC159B3540440AB325BE5D89DBE94A).
   * Used internally by underlying request methods to add support for specific security considerations.
   *
   * @param url The url of the request
   * @returns "include" or "same-origin"
   */
  public getDomainCredentials(url: string): RequestCredentials {
    if (!this.trustedDomains || !this.trustedDomains.length) {
      return "same-origin";
    }

    return this.trustedDomains.some((domainWithProtocol) => {
      return url.startsWith(domainWithProtocol);
    })
      ? "include"
      : "same-origin";
  }

  /**
   * Convenience method for {@linkcode ArcGISIdentityManager.destroy} for this instance of `ArcGISIdentityManager`
   */
  public signOut() {
    return ArcGISIdentityManager.destroy(this);
  }

  /**
   * Return a function that closes over the validOrigins array and
   * can be used as an event handler for the `message` event
   *
   * @param validOrigins Array of valid origins
   */
  private createPostMessageHandler(
    validOrigins: string[]
  ): (event: any) => void {
    // return a function that closes over the validOrigins and
    // has access to the credential
    return (event: any) => {
      // Verify that the origin is valid
      // Note: do not use regex's here. validOrigins is an array so we're checking that the event's origin
      // is in the array via exact match. More info about avoiding postMessage xss issues here
      // https://jlajara.gitlab.io/web/2020/07/17/Dom_XSS_PostMessage_2.html#tipsbypasses-in-postmessage-vulnerabilities
      const isValidOrigin = validOrigins.indexOf(event.origin) > -1;
      // JSAPI handles this slightly differently - instead of checking a list, it will respond if
      // event.origin === window.location.origin || event.origin.endsWith('.arcgis.com')
      // For Hub, and to enable cross domain debugging with port's in urls, we are opting to
      // use a list of valid origins

      // Ensure the message type is something we want to handle
      const isValidType = event.data.type === "arcgis:auth:requestCredential";
      // Ensure we don't pass an expired session forward
      const isTokenValid = this.tokenExpires.getTime() > Date.now();

      if (isValidOrigin && isValidType) {
        let msg = {};
        if (isTokenValid) {
          const credential = this.toCredential();
          // the following line allows us to conform to our spec without changing other depended-on functionality
          // https://github.com/Esri/arcgis-rest-js/blob/master/packages/arcgis-rest-request/post-message-auth-spec.md#arcgisauthcredential
          credential.server = credential.server.replace("/sharing/rest", "");
          msg = {
            type: "arcgis:auth:credential",
            credential
          };
        } else {
          msg = {
            type: "arcgis:auth:error",
            error: {
              name: "tokenExpiredError",
              message:
                "Token was expired, and not returned to the child application"
            }
          };
        }

        event.source.postMessage(msg, event.origin);
      }
    };
  }

  /**
   * Validates that a given URL is properly federated with our current `portal`.
   * Attempts to use the internal `federatedServers` cache first.
   */
  private getTokenForServer(
    url: string,
    requestOptions?: ITokenRequestOptions
  ) {
    // requests to /rest/services/ and /rest/admin/services/ are both valid
    // Federated servers may have inconsistent casing, so lowerCase it
    const root = this.getServerRootUrl(url);
    const existingToken = this.federatedServers[root];

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

    this._pendingTokenRequests[root] = this.fetchAuthorizedDomains().then(
      () => {
        return request(`${root}/rest/info`, {
          credentials: this.getDomainCredentials(url)
        })
          .then((response) => {
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
              this.federatedServers[root] !== undefined
            ) {
              /**
               * if its a stand-alone instance of ArcGIS Server that doesn't advertise
               * federation, but the root server url is recognized, use its built in token endpoint.
               */
              return Promise.resolve({
                authInfo: response.authInfo
              });
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
                this.updateToken(response.token, new Date(response.expires));
                return response;
              });
            }
          })
          .then((response) => {
            this.federatedServers[root] = {
              expires: new Date(response.expires),
              token: response.token
            };
            delete this._pendingTokenRequests[root];
            return response.token;
          });
      }
    );

    return this._pendingTokenRequests[root];
  }

  /**
   * Returns an unexpired token for the current `portal`.
   */
  private getFreshToken(requestOptions?: ITokenRequestOptions) {
    if (this.token && !this.tokenExpires) {
      return Promise.resolve(this.token);
    }

    if (
      this.token &&
      this.tokenExpires &&
      this.tokenExpires.getTime() > Date.now()
    ) {
      return Promise.resolve(this.token);
    }

    if (!this._pendingTokenRequests[this.portal]) {
      this._pendingTokenRequests[this.portal] = this.refreshCredentials(
        requestOptions
      ).then((manager) => {
        this._pendingTokenRequests[this.portal] = null;
        return manager.token;
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
        this.updateToken(response.token, new Date(response.expires));
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
      return this.exchangeRefreshToken(requestOptions);
    }

    const options: ITokenRequestOptions = {
      params: {
        client_id: this.clientId,
        refresh_token: this.refreshToken,
        grant_type: "refresh_token"
      },
      ...requestOptions
    };

    return fetchToken(`${this.portal}/oauth2/token`, options).then(
      (response) => {
        return this.updateToken(response.token, response.expires);
      }
    );
  }

  /**
   * Update the stored {@linkcode ArcGISIdentityManager.token} and {@linkcode ArcGISIdentityManager.tokenExpires} properties. This method is used internally when refreshing tokens.
   * You may need to call this if you want update the token with a new token from an external source.
   *
   * @param newToken The new token to use for this instance of `ArcGISIdentityManager`.
   * @param newTokenExpiration The new expiration date of the token.
   * @returns
   */
  updateToken(newToken: string, newTokenExpiration: Date) {
    this._token = newToken;
    this._tokenExpires = newTokenExpiration;

    return this;
  }

  /**
   * Exchanges an unexpired `refreshToken` for a new one, also updates `token` and
   * `tokenExpires`.
   */
  exchangeRefreshToken(requestOptions?: ITokenRequestOptions) {
    const options: ITokenRequestOptions = {
      params: {
        client_id: this.clientId,
        refresh_token: this.refreshToken,
        redirect_uri: this.redirectUri,
        grant_type: "exchange_refresh_token"
      },
      ...requestOptions
    };

    return fetchToken(`${this.portal}/oauth2/token`, options).then(
      (response) => {
        this._token = response.token;
        this._tokenExpires = response.expires;
        this._refreshToken = response.refreshToken;
        this._refreshTokenExpires = new Date(
          Date.now() + (this.refreshTokenTTL - 1) * 60 * 1000
        );
        return this;
      }
    );
  }

  /**
   * ensures that the authorizedCrossOriginDomains are obtained from the portal and cached
   * so we can check them later.
   *
   * @returns this
   */
  private fetchAuthorizedDomains() {
    // if this token is for a specific server or we don't have a portal
    // don't get the portal info because we cant get the authorizedCrossOriginDomains
    if (this.server || !this.portal) {
      return Promise.resolve(this);
    }

    return this.getPortal().then((portalInfo) => {
      /**
       * Specific domains can be configured as secure.esri.com or https://secure.esri.com this
       * normalizes to https://secure.esri.com so we can use startsWith later.
       */
      if (
        portalInfo.authorizedCrossOriginDomains &&
        portalInfo.authorizedCrossOriginDomains.length
      ) {
        this.trustedDomains = portalInfo.authorizedCrossOriginDomains
          .filter((d: string) => !d.startsWith("http://"))
          .map((d: string) => {
            if (d.startsWith("https://")) {
              return d;
            } else {
              return `https://${d}`;
            }
          });
      }
      return this;
    });
  }
}

/**
 * @deprecated - Use {@linkcode ArcGISIdentityManager}.
 */ /* istanbul ignore next */
export function UserSession(options: IArcGISIdentityManagerOptions) {
  console.log(
    "DEPRECATED:, 'UserSession' is deprecated. Use 'ArcGISIdentityManagerOptions' instead."
  );

  return new ArcGISIdentityManager(options);
}
