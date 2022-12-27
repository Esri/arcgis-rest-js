/// <reference types="node" />
import * as http from "http";
import { IRequestOptions } from "./utils/IRequestOptions.js";
import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
import { ITokenRequestOptions } from "./utils/ITokenRequestOptions.js";
import { IUser } from "./types/user.js";
import { IAppAccess } from "./validate-app-access.js";
/**
 * Options for {@linkcode ArcGISIdentityManager.fromToken}.
 */
export interface IFromTokenOptions {
    /**
     * The token you want to create the {@linkcode ArcGISIdentityManager} instance with.
     */
    token: string;
    /**
     * Date when this token will expire.
     */
    tokenExpires?: Date;
    /**
     * The portal that the token was generated from. Defaults to `https://www.arcgis.com/sharing/rest`. Required if you are not using the default portal.
     */
    portal?: string;
    /**
     * If the token is for a specific instance of ArcGIS Server, set `portal` to `null` or `undefined` and set `server` the URL of the ArcGIS Server.
     */
    server?: string;
    /**
     * Optionally set the username. Recommended if available.
     */
    username?: string;
    /**
     * Optional client ID. Used for refreshing expired tokens.
     */
    clientId?: string;
    /**
     * Optional set a valid redirect URL for the registered client ID. Used internally to refresh expired tokens.
     */
    redirectUri?: string;
}
/**
 * Options for {@linkcode ArcGISIdentityManager.signIn}.
 */
export interface ISignInOptions {
    username: string;
    password: string;
    portal?: string;
}
export declare type AuthenticationProvider = "arcgis" | "facebook" | "google" | "github" | "apple";
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
 * Represents the [`ServerInfo`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-ServerInfo.html) class
 * in the ArcGIS API for JavaScript.
 */
export interface IServerInfo {
    server: string;
    hasPortal: boolean;
    hasServer: boolean;
    owningSystemUrl: string | null;
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
     * The requested validity in minutes for a refresh token/access token. Defaults to 20160 (2 weeks).
     *
     * When using PKCE or server-based OAuth this will control the duration of the refresh token. In this scenario, access tokens will always have a 30 minute validity.
     *
     * When using implicit auth (`pkce: false`) in {@linkcode ArcGISIdentityManager.beginOAuth2}, this controls the duration of the access token and no refresh token will be granted.
     */
    expiration?: number;
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
     * An unfederated ArcGIS Server instance known to recognize credentials supplied manually.
     *
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
 * Used to authenticate both ArcGIS Online and ArcGIS Enterprise users. `ArcGISIdentityManager` includes helper methods for [OAuth 2.0](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/oauth-2.0/) in both browser and server applications.
 *
 * **It is not recommended to construct `ArcGISIdentityManager` directly**. Instead there are several static methods used for specific workflows. The 2 primary workflows relate to oAuth 2.0:
 *
 * * {@linkcode ArcGISIdentityManager.beginOAuth2} and {@linkcode ArcGISIdentityManager.completeOAuth2()} for oAuth 2.0 in browser-only environment.
 * * {@linkcode ArcGISIdentityManager.authorize} and {@linkcode ArcGISIdentityManager.exchangeAuthorizationCode} for oAuth 2.0 for server-enabled application.
 *
 * Other more specialized helpers for less common workflows also exist:
 *
 * * {@linkcode ArcGISIdentityManager.fromToken} for when you have an existing token from another source and would like create an `ArcGISIdentityManager` instance.
 * * {@linkcode ArcGISIdentityManager.fromCredential} for creating  an `ArcGISIdentityManager` instance from a `Credentials` object in the ArcGIS JS API `IdentityManager`
 * * {@linkcode ArcGISIdentityManager.signIn} for authenticating directly with a users username and password for environments with a user interface for oAuth 2.0.
 *
 * Once a manager is created there are additional utilities:
 *
 * * {@linkcode ArcGISIdentityManager.serialize} can be used to create a JSON object representing an instance of `ArcGISIdentityManager`
 * * {@linkcode ArcGISIdentityManager.deserialize} will create a new `ArcGISIdentityManager` from a JSON object created with {@linkcode ArcGISIdentityManager.serialize}
 * * {@linkcode ArcGISIdentityManager.destroy} or {@linkcode ArcGISIdentityManager.signOut} will invalidate any tokens in use by the  `ArcGISIdentityManager`.
 */
export declare class ArcGISIdentityManager implements IAuthenticationManager {
    /**
     * The current ArcGIS Online or ArcGIS Enterprise `token`.
     */
    get token(): string;
    /**
     * The expiration time of the current `token`.
     */
    get tokenExpires(): Date;
    /**
     * The current token to ArcGIS Online or ArcGIS Enterprise.
     */
    get refreshToken(): string;
    /**
     * The expiration time of the current `refreshToken`.
     */
    get refreshTokenExpires(): Date;
    /**
     * The currently authenticated user.
     */
    get username(): string;
    /**
     * Returns `true` if these credentials can be refreshed and `false` if it cannot.
     */
    get canRefresh(): boolean;
    /**
     * Begins a new browser-based OAuth 2.0 sign in. If `options.popup` is `true` the authentication window will open in a new tab/window. Otherwise, the user will be redirected to the authorization page in their current tab/window and the function will return `undefined`.
     *
     * If `popup` is `true` (the default) this method will return a `Promise` that resolves to an `ArcGISIdentityManager` instance and you must call {@linkcode ArcGISIdentityManager.completeOAuth2()} on the page defined in the `redirectUri`. Otherwise it will return undefined and the {@linkcode ArcGISIdentityManager.completeOAuth2()} method will return a `Promise` that resolves to an `ArcGISIdentityManager` instance.
     *
     * A {@linkcode ArcGISAccessDeniedError} error will be thrown if the user denies the request on the authorization screen.
     *
     * @browserOnly
     */
    static beginOAuth2(options: IOAuth2Options, win?: any): Promise<ArcGISIdentityManager> | undefined;
    /**
     * Completes a browser-based OAuth 2.0 sign in. If `options.popup` is `true` the user
     * will be returned to the previous window and the popup will close. Otherwise a new `ArcGISIdentityManager` will be returned. You must pass the same values for `clientId`, `popup`, `portal`, and `pkce` as you used in `beginOAuth2()`.
     *
     * A {@linkcode ArcGISAccessDeniedError} error will be thrown if the user denies the request on the authorization screen.
     * @browserOnly
     */
    static completeOAuth2(options: IOAuth2Options, win?: any): Promise<ArcGISIdentityManager>;
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
    static fromParent(parentOrigin: string, win?: any): Promise<any>;
    /**
     * Begins a new server-based OAuth 2.0 sign in. This will redirect the user to
     * the ArcGIS Online or ArcGIS Enterprise authorization page.
     *
     * @nodeOnly
     */
    static authorize(options: IOAuth2Options, response: http.ServerResponse): void;
    /**
     * Completes the server-based OAuth 2.0 sign in process by exchanging the `authorizationCode`
     * for a `access_token`.
     *
     * @nodeOnly
     */
    static exchangeAuthorizationCode(options: IOAuth2Options, authorizationCode: string): Promise<ArcGISIdentityManager>;
    static deserialize(str: string): ArcGISIdentityManager;
    /**
     * Translates authentication from the format used in the [`IdentityManager` class in the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-Credential.html).
     *
     * You will need to call both [`IdentityManger.findCredential`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#findCredential) and [`IdentityManger.findServerInfo`](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#findServerInfo) to obtain both parameters for this method.
     *
     * This method can be used with {@linkcode ArcGISIdentityManager.toCredential} to interop with the ArcGIS API for JavaScript.
     *
     * ```js
     * require(["esri/id"], (esriId) => {
     *   const credential = esriId.findCredential("https://www.arcgis.com/sharing/rest");
     *   const serverInfo = esriId.findServerInfo("https://www.arcgis.com/sharing/rest");
     *
     *   const manager = ArcGISIdentityManager.fromCredential(credential, serverInfo);
     * });
     * ```
     *
     * @returns ArcGISIdentityManager
     */
    static fromCredential(credential: ICredential, serverInfo: IServerInfo): ArcGISIdentityManager;
    /**
     * Handle the response from the parent
     * @param event DOM Event
     */
    private static parentMessageHandler;
    /**
     * Revokes all active tokens for a provided {@linkcode ArcGISIdentityManager}. The can be considered the equivalent to signing the user out of your application.
     */
    static destroy(manager: ArcGISIdentityManager): Promise<import("./revoke-token.js").IRevokeTokenResponse>;
    /**
     * Create a  {@linkcode ArcGISIdentityManager} from an existing token. Useful for when you have a users token from a different authentication system and want to get a  {@linkcode ArcGISIdentityManager}.
     */
    static fromToken(options: IFromTokenOptions): Promise<ArcGISIdentityManager>;
    /**
     * Initialize a {@linkcode ArcGISIdentityManager} with a users `username` and `password`. **This method is intended ONLY for applications without a user interface such as CLI tools.**.
     *
     * If possible you should use {@linkcode ArcGISIdentityManager.beginOAuth2} to authenticate users in a browser or {@linkcode ArcGISIdentityManager.authorize} for authenticating users with a web server.
     */
    static signIn(options: ISignInOptions): Promise<ArcGISIdentityManager>;
    /**
     * Client ID being used for authentication if provided in the `constructor`.
     */
    readonly clientId: string;
    /**
     * The currently authenticated user's password if provided in the `constructor`.
     */
    readonly password: string;
    /**
     * The current portal the user is authenticated with.
     */
    readonly portal: string;
    /**
     * This value is set to true automatically if the ArcGIS Organization requires that requests be made over https.
     */
    readonly ssl: boolean;
    /**
     * The authentication provider to use.
     */
    readonly provider: AuthenticationProvider;
    /**
     * Determines how long new tokens requested are valid.
     */
    readonly tokenDuration: number;
    /**
     * A valid redirect URI for this application if provided in the `constructor`.
     */
    readonly redirectUri: string;
    /**
     * An unfederated ArcGIS Server instance known to recognize credentials supplied manually.
     *
     * ```js
     * {
     *   server: "https://sampleserver6.arcgisonline.com/arcgis",
     *   token: "SOSlV3v..",
     *   tokenExpires: new Date(1545415669763)
     * }
     * ```
     */
    readonly server: string;
    /**
     * Hydrated by a call to [getUser()](#getUser-summary).
     */
    private _user;
    /**
     * Hydrated by a call to [getPortal()](#getPortal-summary).
     */
    private _portalInfo;
    private _token;
    private _tokenExpires;
    private _refreshToken;
    private _refreshTokenExpires;
    private _pendingUserRequest;
    private _pendingPortalRequest;
    /**
     * Internal object to keep track of pending token requests. Used to prevent
     *  duplicate token requests.
     */
    private _pendingTokenRequests;
    private _username;
    /**
     * Internal list of tokens to 3rd party servers (federated servers) that have
     *  been created via `generateToken`. The object key is the root URL of the server.
     */
    private federatedServers;
    /**
     * Internal list of 3rd party domains that should receive all cookies (credentials: "include").
     * Used to for PKI and IWA workflows in high security environments.
     */
    private trustedDomains;
    private _hostHandler;
    constructor(options: IArcGISIdentityManagerOptions);
    /**
     * Returns authentication in a format useable in the [`IdentityManager.registerToken()` method in the ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-identity-IdentityManager.html#registerToken).
     *
     * This method can be used with {@linkcode ArcGISIdentityManager.fromCredential} to interop with the ArcGIS API for JavaScript.
     *
     * ```js
     * require(["esri/id"], (esriId) => {
     *   esriId.registerToken(manager.toCredential());
     * })
     
     * ```
     *
     * @returns ICredential
     */
    toCredential(): ICredential;
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
    getUser(requestOptions?: IRequestOptions): Promise<IUser>;
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
    getPortal(requestOptions?: IRequestOptions): Promise<any>;
    /**
     * Returns the username for the currently logged in [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm). Subsequent calls will *not* result in additional web traffic. This is also used internally when a username is required for some requests but is not present in the options.
     *
     * ```js
     * manager.getUsername()
     *   .then(response => {
     *     console.log(response); // "casey_jones"
     *   })
     * ```
     */
    getUsername(): Promise<string>;
    /**
     * Gets an appropriate token for the given URL. If `portal` is ArcGIS Online and
     * the request is to an ArcGIS Online domain `token` will be used. If the request
     * is to the current `portal` the current `token` will also be used. However if
     * the request is to an unknown server we will validate the server with a request
     * to our current `portal`.
     */
    getToken(url: string, requestOptions?: ITokenRequestOptions): Promise<string>;
    /**
     * Get application access information for the current user
     * see `validateAppAccess` function for details
     *
     * @param clientId application client id
     */
    validateAppAccess(clientId: string): Promise<IAppAccess>;
    toJSON(): IArcGISIdentityManagerOptions;
    serialize(): string;
    /**
     * For a "Host" app that embeds other platform apps via iframes, after authenticating the user
     * and creating a ArcGISIdentityManager, the app can then enable "post message" style authentication by calling
     * this method.
     *
     * Internally this adds an event listener on window for the `message` event
     *
     * @param validChildOrigins Array of origins that are allowed to request authentication from the host app
     */
    enablePostMessageAuth(validChildOrigins: string[], win?: any): any;
    /**
     * For a "Host" app that has embedded other platform apps via iframes, when the host needs
     * to transition routes, it should call `ArcGISIdentityManager.disablePostMessageAuth()` to remove
     * the event listener and prevent memory leaks
     */
    disablePostMessageAuth(win?: any): void;
    /**
     * Manually refreshes the current `token` and `tokenExpires`.
     */
    refreshCredentials(requestOptions?: ITokenRequestOptions): Promise<this>;
    /**
     * Determines the root of the ArcGIS Server or Portal for a given URL.
     *
     * @param url the URl to determine the root url for.
     */
    getServerRootUrl(url: string): string;
    /**
     * Returns the proper [`credentials`] option for `fetch` for a given domain.
     * See [trusted server](https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-security.htm#ESRI_SECTION1_70CC159B3540440AB325BE5D89DBE94A).
     * Used internally by underlying request methods to add support for specific security considerations.
     *
     * @param url The url of the request
     * @returns "include" or "same-origin"
     */
    getDomainCredentials(url: string): RequestCredentials;
    /**
     * Convenience method for {@linkcode ArcGISIdentityManager.destroy} for this instance of `ArcGISIdentityManager`
     */
    signOut(): Promise<import("./revoke-token.js").IRevokeTokenResponse>;
    /**
     * Return a function that closes over the validOrigins array and
     * can be used as an event handler for the `message` event
     *
     * @param validOrigins Array of valid origins
     */
    private createPostMessageHandler;
    /**
     * Validates that a given URL is properly federated with our current `portal`.
     * Attempts to use the internal `federatedServers` cache first.
     */
    private getTokenForServer;
    /**
     * Generates a token for a given `serverUrl` using a given `tokenServicesUrl`.
     */
    private generateTokenForServer;
    /**
     * Returns an unexpired token for the current `portal`.
     */
    private getFreshToken;
    /**
     * Refreshes the current `token` and `tokenExpires` with `username` and
     * `password`.
     */
    private refreshWithUsernameAndPassword;
    /**
     * Refreshes the current `token` and `tokenExpires` with `refreshToken`.
     */
    private refreshWithRefreshToken;
    /**
     * Update the stored {@linkcode ArcGISIdentityManager.token} and {@linkcode ArcGISIdentityManager.tokenExpires} properties. This method is used internally when refreshing tokens.
     * You may need to call this if you want update the token with a new token from an external source.
     *
     * @param newToken The new token to use for this instance of `ArcGISIdentityManager`.
     * @param newTokenExpiration The new expiration date of the token.
     * @returns
     */
    updateToken(newToken: string, newTokenExpiration: Date): this;
    /**
     * Exchanges an unexpired `refreshToken` for a new one, also updates `token` and
     * `tokenExpires`.
     */
    exchangeRefreshToken(requestOptions?: ITokenRequestOptions): Promise<this>;
    /**
     * ensures that the authorizedCrossOriginDomains are obtained from the portal and cached
     * so we can check them later.
     *
     * @returns this
     */
    private fetchAuthorizedDomains;
}
/**
 * @deprecated - Use {@linkcode ArcGISIdentityManager}.
 * @internal
 *
 */ declare function UserSession(options: IArcGISIdentityManagerOptions): ArcGISIdentityManager;
declare namespace UserSession {
    var beginOAuth2: (options: IOAuth2Options, win?: any) => Promise<ArcGISIdentityManager>;
    var completeOAuth2: (options: IOAuth2Options, win?: any) => Promise<ArcGISIdentityManager>;
    var fromParent: (parentOrigin: string, win?: any) => Promise<any>;
    var authorize: (options: IOAuth2Options, response: http.ServerResponse) => void;
    var exchangeAuthorizationCode: (options: IOAuth2Options, authorizationCode: string) => Promise<ArcGISIdentityManager>;
    var fromCredential: (credential: ICredential, serverInfo: IServerInfo) => ArcGISIdentityManager;
    var deserialize: (str: string) => ArcGISIdentityManager;
}
export { UserSession };
