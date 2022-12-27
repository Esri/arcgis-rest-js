"use strict";
/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArcGISAccessDeniedError = void 0;
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
class ArcGISAccessDeniedError extends Error {
    /**
     * Create a new `ArcGISAccessDeniedError`  object.
     */
    constructor() {
        const message = "The user has denied your authorization request.";
        super(message);
        // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
        // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
        const actualProto = new.target.prototype;
        Object.setPrototypeOf(this, actualProto);
        this.name = "ArcGISAccessDeniedError";
    }
}
exports.ArcGISAccessDeniedError = ArcGISAccessDeniedError;
//# sourceMappingURL=ArcGISAccessDeniedError.js.map