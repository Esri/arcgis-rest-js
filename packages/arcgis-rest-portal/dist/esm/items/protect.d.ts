import { IUserItemOptions } from "./helpers.js";
/**
 * Protect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to protect an item.
 */
export declare function protectItem(requestOptions: IUserItemOptions): Promise<{
    success: boolean;
}>;
/**
 * Unprotect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to unprotect an item.
 */
export declare function unprotectItem(requestOptions: IUserItemOptions): Promise<{
    success: boolean;
}>;
