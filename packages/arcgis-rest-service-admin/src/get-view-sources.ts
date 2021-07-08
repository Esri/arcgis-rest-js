/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import { request } from "@esri/arcgis-rest-request";
import { IViewServiceSources } from "@esri/arcgis-rest-types";

/**
 * Return the sources response for a view service item
 *
 * @param {string} viewServiceUrl
 * @param {UserSession} session
 * @return {*}  {Promise<Record<string, unknown>>}
 */
export function getViewSources(
  viewServiceUrl: string,
  session: UserSession
): Promise<IViewServiceSources> {
  return request(`${viewServiceUrl}/sources`, { authentication: session });
}
