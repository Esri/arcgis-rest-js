import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IViewServiceSources } from "./helpers.js";
/**
 * Return the sources response for a view service item
 *
 * @param {string} viewServiceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<Record<string, unknown>>}
 */
export declare function getViewSources(viewServiceUrl: string, session: ArcGISIdentityManager): Promise<IViewServiceSources>;
