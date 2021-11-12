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
  getToken(url: string, requestOptions?: ITokenRequestOptions): Promise<string>;
  getDomainCredentials?(url: string): RequestCredentials;
}
