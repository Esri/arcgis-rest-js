"use strict";
/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationSession = exports.ApplicationCredentialsManager = void 0;
const fetch_token_js_1 = require("./fetch-token.js");
const ArcGISTokenRequestError_js_1 = require("./utils/ArcGISTokenRequestError.js");
/**
 * Used to authenticate methods in ArcGIS REST JS with oAuth 2.0 application credentials. The instance of `ApplicationCredentialsManager` can be passed to {@linkcode IRequestOptions.authentication} to authenticate requests.
 *
 * ```js
 * import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
 *
 * const session = ApplicationCredentialsManager.fromCredentials({
 *   clientId: "abc123",
 *   clientSecret: "••••••"
 * })
 * ```
 */
class ApplicationCredentialsManager {
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.token = options.token;
        this.expires = options.expires;
        this.portal = options.portal || "https://www.arcgis.com/sharing/rest";
        this.duration = options.duration || 7200;
    }
    /**
     * Preferred method for creating an `ApplicationCredentialsManager`
     */
    static fromCredentials(options) {
        return new ApplicationCredentialsManager(options);
    }
    // URL is not actually read or passed through.
    getToken(url, requestOptions) {
        if (this.token && this.expires && this.expires.getTime() > Date.now()) {
            return Promise.resolve(this.token);
        }
        if (this._pendingTokenRequest) {
            return this._pendingTokenRequest;
        }
        this._pendingTokenRequest = this.refreshToken(requestOptions);
        return this._pendingTokenRequest;
    }
    refreshToken(requestOptions) {
        const options = Object.assign({ params: {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: "client_credentials",
                expiration: this.duration
            } }, requestOptions);
        return (0, fetch_token_js_1.fetchToken)(`${this.portal}/oauth2/token/`, options)
            .then((response) => {
            this._pendingTokenRequest = null;
            this.token = response.token;
            this.expires = response.expires;
            return response.token;
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError_js_1.ArcGISTokenRequestError(e.message, ArcGISTokenRequestError_js_1.ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED, e.response, e.url, e.options);
        });
    }
    refreshCredentials() {
        return this.refreshToken().then(() => this);
    }
}
exports.ApplicationCredentialsManager = ApplicationCredentialsManager;
/**
 * @deprecated - Use {@linkcode ApplicationCredentialsManager}.
 * @internal
 */ /* istanbul ignore next */
function ApplicationSession(options) {
    console.log("DEPRECATED:, 'ApplicationSession' is deprecated. Use 'ApplicationCredentialsManager' instead.");
    return new ApplicationCredentialsManager(options);
}
exports.ApplicationSession = ApplicationSession;
//# sourceMappingURL=ApplicationCredentialsManager.js.map