import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItemUpdate } from "../helpers.js";
export interface IUpdateGroupOptions extends IRequestOptions {
    group: IItemUpdate;
}
/**
 * Update the properties of a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-group.htm) for more information.
 *
 * ```js
 * import { updateGroup } from '@esri/arcgis-rest-portal';
 *
 * updateGroup({
 *   group: { id: "fgr344", title: "new" }
 * })
 *   .then(response)
 * ```
 *
 * @param requestOptions - Options for the request, including the group
 * @returns A Promise that will resolve with the success/failure status of the request
 */
export declare function updateGroup(requestOptions: IUpdateGroupOptions): Promise<{
    success: boolean;
    groupId: string;
}>;
