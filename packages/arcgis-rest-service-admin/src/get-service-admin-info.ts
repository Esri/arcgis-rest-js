/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

// TODO: Move to service-admin package in rest-js

import { request } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IServiceInfo } from "@esri/arcgis-rest-types";

/**
 * Given a Feature Service url, fetch the service admin information.
 *
 * The response from this call includes all the detailed information
 * for each layer/table in the service as well as some admin properties
 *
 * @export
 * @param {string} serviceUrl
 * @param {UserSession} session
 * @return {*}  {Promise<IServiceInfo>}
 */
export function getServiceAdminInfo(
  serviceUrl: string,
  session: UserSession
): Promise<IServiceInfo> {
  const serviceAdminUrl = serviceUrl.replace(
    "/rest/services",
    "/rest/admin/services"
  );

  return request(serviceAdminUrl, {
    authentication: session,
    params: {
      f: "json",
    },
  });
}
