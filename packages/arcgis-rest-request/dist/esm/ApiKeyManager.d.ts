import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
/**
 * Options for the `ApiKey` constructor.
 */
export interface IApiKeyOptions {
    key: string;
}
/**
 * Used to authenticate methods in ArcGIS REST JS with an API keys. The instance of `ApiKeyManager` can be passed to  {@linkcode IRequestOptions.authentication} to authenticate requests.
 *
 * ```js
 * import { ApiKeyManager } from '@esri/arcgis-rest-request';
 
 * const apiKey = new ApiKeyManager.fromKey("...");
 * ```
 *
 * In most cases however the API key can be passed directly to the {@linkcode IRequestOptions.authentication}.
 */
export declare class ApiKeyManager implements IAuthenticationManager {
    /**
     * The current portal the user is authenticated with.
     */
    readonly portal: string;
    private key;
    /**
     * The preferred method for creating an instance of `ApiKeyManager`.
     */
    static fromKey(apiKey: string): ApiKeyManager;
    constructor(options: IApiKeyOptions);
    /**
     * Gets a token (the API Key).
     */
    getToken(url: string): Promise<string>;
}
/**
 * @deprecated - Use {@linkcode ApiKeyManager}.
 * @internal
 */ export declare function ApiKey(options: IApiKeyOptions): ApiKeyManager;
