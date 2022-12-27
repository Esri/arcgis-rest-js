import { ApplicationCredentialsManager } from "./ApplicationCredentialsManager.js";
import { ArcGISIdentityManager } from "./ArcGISIdentityManager.js";
import { IRequestOptions } from "./utils/IRequestOptions.js";
/**
 * Used internally by packages for requests that require user authentication.
 */
export interface IAuthenticatedRequestOptions extends IRequestOptions {
    authentication: ArcGISIdentityManager | ApplicationCredentialsManager;
}
/**
 * Used internally by packages for requests that require authentication.
 */
export interface IUserRequestOptions extends IRequestOptions {
    /**
     * A session representing a logged in user.
     */
    authentication: ArcGISIdentityManager;
}
