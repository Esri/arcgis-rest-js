import { IRequestOptions, IGroup, IUser } from "@esri/arcgis-rest-request";
import { IItem, IPagingParams } from "../helpers.js";
export interface IGroupCategorySchema {
    categorySchema: IGroupCategory[];
}
export interface IGroupCategory {
    title: string;
    description?: string;
    categories?: IGroupCategory[];
}
export interface IGetGroupContentOptions extends IRequestOptions {
    paging: IPagingParams;
}
export interface IGroupContentResult {
    total: number;
    start: number;
    num: number;
    nextStart: number;
    items: IItem[];
}
export interface IGroupUsersResult {
    owner: string;
    admins: string[];
    users: string[];
}
/**
 * Fetch a group using its id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group.htm) for more information.
 *
 * ```js
 * import { getGroup } from "@esri/arcgis-rest-portal";
 * //
 * getGroup("fxb988") // id
 *   .then(response)
 * ```
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns  A Promise that will resolve with the data from the response.
 */
export declare function getGroup(id: string, requestOptions?: IRequestOptions): Promise<IGroup>;
/**
 * Gets the category schema set on a group
 *
 * @param id - Group Id
 * @param requestOptions  - Options for the request
 * @returns A promise that will resolve with JSON of group's category schema
 * @see https://developers.arcgis.com/rest/users-groups-and-items/group-category-schema.htm
 */
export declare function getGroupCategorySchema(id: string, requestOptions?: IRequestOptions): Promise<IGroupCategorySchema>;
/**
 * Returns the content of a Group. Since the group may contain 1000s of items
 * the requestParams allow for paging.
 * @param id - Group Id
 * @param requestOptions  - Options for the request, including paging parameters.
 * @returns  A Promise that will resolve with the content of the group.
 */
export declare function getGroupContent(id: string, requestOptions?: IGetGroupContentOptions): Promise<IGroupContentResult>;
/**
 * Get the usernames of the admins and members. Does not return actual 'User' objects. Those must be
 * retrieved via separate calls to the User's API.
 * @param id - Group Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with arrays of the group admin usernames and the member usernames
 */
export declare function getGroupUsers(id: string, requestOptions?: IRequestOptions): Promise<IGroupUsersResult>;
export interface ISearchGroupUsersOptions extends IRequestOptions, IPagingParams {
    name?: string;
    sortField?: string;
    sortOrder?: string;
    joined?: number | number[];
    memberType?: string;
    [key: string]: any;
}
export interface ISearchGroupUsersResult {
    total: number;
    start: number;
    num: number;
    nextStart: number;
    owner: IUser;
    users: any[];
}
/**
 * Search the users in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-users-list.htm) for more information.
 *
 * ```js
 * import { searchGroupUsers } from "@esri/arcgis-rest-portal";
 *
 * searchGroupUsers('abc123')
 *   .then(response)
 * ```
 *
 * @param id - The group id
 * @param searchOptions - Options for the request, including paging parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function searchGroupUsers(id: string, searchOptions?: ISearchGroupUsersOptions): Promise<ISearchGroupUsersResult>;
