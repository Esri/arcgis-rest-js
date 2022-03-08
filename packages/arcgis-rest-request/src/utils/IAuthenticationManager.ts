import { ITokenRequestOptions } from "./ITokenRequestOptions.js";
/**
 * Authentication can be supplied to `request` via [`ArcGISIdentityManager`](../../auth/ArcGISIdentityManager/) or [`ApplicationSession`](../../auth/ApplicationSession/). Both classes extend `IAuthenticationManager`.
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
   * Returns the proper token for a given URL and request options.
   * @param url The requested URL.
   * @param requestOptions the requests options.
   */
  getToken(url: string, requestOptions?: ITokenRequestOptions): Promise<string>;

  /**
   * Returns the proper [`credentials`] option for `fetch` for a given domain.
   * See [trusted server](https://enterprise.arcgis.com/en/portal/latest/administer/windows/configure-security.htm#ESRI_SECTION1_70CC159B3540440AB325BE5D89DBE94A).
   * Used internally by underlying request methods to add support for specific security considerations.
   *
   * @param url The url of the request
   * @returns "include" or "same-origin"
   */
  getDomainCredentials?(url: string): RequestCredentials;

  /**
   * Should return `true` if these credentials can be refreshed and `false` if it cannot. The
   */
  canRefresh?: boolean;

  /**
   * Refresh the stored credentials.
   */
  refreshCredentials?(requestOptions?: ITokenRequestOptions): Promise<this>;
}
