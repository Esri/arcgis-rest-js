/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IViewServiceSources } from "./helpers.js";

/**
 * Return the sources response for a view service item
 *
 * @param {string} viewServiceUrl
 * @param {ArcGISIdentityManager} session
 * @return {*}  {Promise<Record<string, unknown>>}
 */
export function getViewSources(
  viewServiceUrl: string,
  session: ArcGISIdentityManager
): Promise<IViewServiceSources> {
  return request(`${viewServiceUrl}/sources`, { authentication: session });
}
