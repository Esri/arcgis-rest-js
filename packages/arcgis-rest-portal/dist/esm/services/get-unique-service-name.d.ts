import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
/**
 * Given a starting name, return a service name that is unique within
 * the current users organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @param {number} step
 * @return {*}  {Promise<string>}
 */
export declare function getUniqueServiceName(name: string, type: string, session: ArcGISIdentityManager, step: number): Promise<string>;
