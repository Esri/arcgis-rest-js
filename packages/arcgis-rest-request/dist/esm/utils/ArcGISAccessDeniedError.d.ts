/**
 * This error code will be thrown by the following methods when the user cancels or denies an authorization request on the OAuth 2.0
 * authorization screen.
 *
 * * {@linkcode ArcGISIdentityManager.beginOAuth2} when the `popup` option is `true`
 * * {@linkcode ArcGISIdentityManager.completeOAuth2}  when the `popup` option is `false`
 *
 * ```js
 * import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
 *
 * ArcGISIdentityManager.beginOAuth2({
 *   clientId: "***"
 *   redirectUri: "***",
 *   popup: true
 * }).then(authenticationManager => {
 *   console.log("OAuth 2.0 Successful");
 * }).catch(e => {
 *   if(e.name === "ArcGISAccessDeniedError") {
 *     console.log("The user did not authorize your app.")
 *   } else {
 *     console.log("Something else went wrong. Error:", e);
 *   }
 * })
 * ```
 */
export declare class ArcGISAccessDeniedError extends Error {
    /**
     * The name of this error. Will always be `"ArcGISAccessDeniedError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
     */
    name: string;
    /**
     * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
     */
    message: string;
    /**
     * Create a new `ArcGISAccessDeniedError`  object.
     */
    constructor();
}
