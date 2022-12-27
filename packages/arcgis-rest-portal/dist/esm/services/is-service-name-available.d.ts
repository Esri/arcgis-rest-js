import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IServiceNameAvailable } from "../helpers.js";
/**
 * Determine if a specific service name is available in the current user's organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceNameAvailable>}
 */
export declare function isServiceNameAvailable(name: string, type: string, session: ArcGISIdentityManager): Promise<IServiceNameAvailable>;
