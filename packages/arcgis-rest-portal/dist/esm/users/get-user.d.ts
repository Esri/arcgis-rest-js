import { IRequestOptions, ArcGISIdentityManager, IUser } from "@esri/arcgis-rest-request";
export interface IGetUserOptions extends IRequestOptions {
    /**
     * A session representing a logged in user.
     */
    authentication?: ArcGISIdentityManager;
    /**
     * Supply a username if you'd like to fetch information about a different user than is being used to authenticate the request.
     */
    username?: string;
}
/**
 * Get information about a user. This method has proven so generically useful that you can also call {@linkcode ArcGISIdentityManager.getUser}.
 *
 * ```js
 * import { getUser } from '@esri/arcgis-rest-portal';
 * //
 * getUser("jsmith")
 *   .then(response)
 * // => { firstName: "John", lastName: "Smith",tags: ["GIS Analyst", "City of Redlands"] }
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export declare function getUser(requestOptions?: string | IGetUserOptions): Promise<IUser>;
