/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";

// https always
export const worldRoutingService =
  "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/";

// nice to have: verify custom endpoints contain 'NAServer' and end in a '/'
export interface IEndpointRequestOptions extends IRequestOptions {
  /**
   * Any ArcGIS Routing service (example: https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route/ ) to use for the routing service request.
   */
  endpoint?: string;
}
