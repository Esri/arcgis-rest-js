import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IServiceInfo } from "./helpers.js";
/**
 * Given a Feature Service url, fetch the service admin information.
 *
 * The response from this call includes all the detailed information
 * for each layer/table in the service as well as some admin properties
 *
 * @export
 * @param {string} serviceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<IServiceInfo>}
 */
export declare function getServiceAdminInfo(serviceUrl: string, session: ArcGISIdentityManager): Promise<IServiceInfo>;
