import { IUserRequestOptions, IUser } from "@esri/arcgis-rest-request";
export interface IUpdateUserOptions extends IUserRequestOptions {
    /**
     * The user properties to be updated.
     */
    user: IUser;
}
export interface IUpdateUserResponse {
    success: boolean;
    username: string;
}
/**
 * Update a user profile. The username will be extracted from the authentication session unless it is provided explicitly. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-user.htm) for more information.
 *
 * ```js
 * import { updateUser } from '@esri/arcgis-rest-portal';
 *
 * // any user can update their own profile
 * updateUser({
 *   authentication,
 *   user: { description: "better than the last one" }
 * })
 *   .then(response)
 *
 * // org administrators must declare the username that will be updated explicitly
 * updateUser({
 *   authentication,
 *   user: { username: "c@sey", description: "" }
 * })
 *   .then(response)
 * // => { "success": true, "username": "c@sey" }
 * ```
 *
 * @param requestOptions - options to pass through in the request
 * @returns A Promise that will resolve with metadata about the user
 */
export declare function updateUser(requestOptions?: IUpdateUserOptions): Promise<IUpdateUserResponse>;
