/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { fetchToken } from "./fetch-token.js";
import { ArcGISTokenRequestError, ArcGISTokenRequestErrorCodes } from "./utils/ArcGISTokenRequestError.js";
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
export class ApplicationCredentialsManager {
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
        return fetchToken(`${this.portal}/oauth2/token/`, options)
            .then((response) => {
            this._pendingTokenRequest = null;
            this.token = response.token;
            this.expires = response.expires;
            return response.token;
        })
            .catch((e) => {
            throw new ArcGISTokenRequestError(e.message, ArcGISTokenRequestErrorCodes.TOKEN_REFRESH_FAILED, e.response, e.url, e.options);
        });
    }
    refreshCredentials() {
        return this.refreshToken().then(() => this);
    }
}
/**
 * @deprecated - Use {@linkcode ApplicationCredentialsManager}.
 * @internal
 */ /* istanbul ignore next */
export function ApplicationSession(options) {
    console.log("DEPRECATED:, 'ApplicationSession' is deprecated. Use 'ApplicationCredentialsManager' instead.");
    return new ApplicationCredentialsManager(options);
}
//# sourceMappingURL=ApplicationCredentialsManager.js.map