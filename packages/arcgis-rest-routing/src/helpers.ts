/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IPolyline, Position2D } from "@esri/arcgis-rest-types";

// https always
export const ARCGIS_ONLINE_ROUTING_URL =
  "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

// nice to have: verify custom endpoints contain 'NAServer' and end in a '/'
export interface IEndpointOptions extends IRequestOptions {
  /**
   * Any ArcGIS Routing service (example: https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route/ ) to use for the routing service request.
   */
  endpoint?: string;
}

export function decompressGeometry(str: string) {
  let xDiffPrev = 0;
  let yDiffPrev = 0;
  let points = [];
  let x, y;
  let strings;
  let coefficient;

  // Split the string into an array on the + and - characters
  strings = str.match(/((\+|\-)[^\+\-]+)/g);

  // The first value is the coefficient in base 32
  coefficient = parseInt(strings[0], 32);

  for (let j = 1; j < strings.length; j += 2) {
    // j is the offset for the x value
    // Convert the value from base 32 and add the previous x value
    x = parseInt(strings[j], 32) + xDiffPrev;
    xDiffPrev = x;

    // j+1 is the offset for the y value
    // Convert the value from base 32 and add the previous y value
    y = parseInt(strings[j + 1], 32) + yDiffPrev;
    yDiffPrev = y;

    points.push([x / coefficient, y / coefficient] as Position2D);
  }

  return {
    paths: [points],
  } as IPolyline;
}
