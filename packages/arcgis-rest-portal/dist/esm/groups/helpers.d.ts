import { IUserRequestOptions } from "@esri/arcgis-rest-request";
/**
 * Base options interface for making authenticated requests for groups.
 */
export interface IUserGroupOptions extends IUserRequestOptions {
    /**
     * Unique identifier of the group.
     */
    id: string;
}
