import { IUser } from "../types/user.js";
import { ITokenRequestOptions } from "./ITokenRequestOptions.js";
/**
 * Authentication can be supplied to `request` via {@linkcode ArcGISIdentityManager}, {@linkcode ApplicationCredentialsManager} or {@linkcode APIKeyManager}. These classes implement {@linkCode IAuthenticationManager}.
 *
 * ```js
 * const session = new ArcGISIdentityManager({
 *   username: "jsmith",
 *   password: "123456",
 *   // optional
 *   portal: "https://[yourserver]/arcgis/sharing/rest"
 * })
 *
 * request(url, { authentication: session })
 * ```
 */
export interface IAuthenticationManager {
  /**
   * Defaults to 'https://www.arcgis.com/sharing/rest'.
   */
  portal: string;

  /**
   * Getter for consistency between ArcGISIdentityManager and older ArcGIS REST JS verisons. This token may be invalid, expired or `undefined`. To guarentee a valid token, use the {@linkcode IAuthenticationManager.getToken} method instead.
   */
  get token(): string;

  /**
   * Returns the proper token for a given URL and request options.
   * @param url The requested URL.
   * @param requestOptions the requests options.
   */
  getToken(url: string, requestOptions?: ITokenRequestOptions): Promise<string>;

  /**
   * Optional. Returns a promise that resolves with the username. Used internally by some methods to consruct URLs that require a username.
   */
  getUsername?(): Promise<string>;

  /**
   * Optional. Returns a promise that resolves with the user. Used internally by some methods to check if the user is an admin but can be used as a generic way to get user information.
   */
  getUser?(): Promise<IUser>;

  /**
   * Optional. Returns the proper [`credentials` option for `fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) for a given domain.
   *
   * See [trusted server](https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-security.htm#ESRI_SECTION1_70CC159B3540440AB325BE5D89DBE94A).
   * Used internally by underlying request methods to add support for specific security considerations.
   *
   * @param url The url of the request
   * @returns "include" or "same-origin"
   */
  getDomainCredentials?(url: string): RequestCredentials;

  /**
   * Optional. Should return `true` if these credentials can be refreshed and `false` if it cannot.
   */
  canRefresh?: boolean;

  /**
   * Optional. Refresh the stored credentials.
   */
  refreshCredentials?(requestOptions?: ITokenRequestOptions): Promise<this>;
}
