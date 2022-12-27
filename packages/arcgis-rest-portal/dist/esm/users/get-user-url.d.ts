import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
/**
 * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
 *
 * @param session
 * @returns User url to be used in API requests.
 */
export declare function getUserUrl(session: ArcGISIdentityManager): string;
