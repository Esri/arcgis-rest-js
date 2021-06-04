/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  ILocation,
  IPoint,
  IPolyline,
  Position2D,
  IFeatureSet,
} from "@esri/arcgis-rest-types";

// https always
export const ARCGIS_ONLINE_ROUTING_URL =
  "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
export const ARCGIS_ONLINE_CLOSEST_FACILITY_URL =
  "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";
export const ARCGIS_ONLINE_SERVICE_AREA_URL =
  "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
export const ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL =
  "https://route.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World";

// nice to have: verify custom endpoints contain 'NAServer' and end in a '/'
export interface IEndpointOptions extends IRequestOptions {
  /**
   * Any ArcGIS Routing service (example: https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route/ ) to use for the routing service request.
   */
  endpoint?: string;
}

function isLocationArray(
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is [number, number] | [number, number, number] {
  return (
    (coords as [number, number]).length === 2 ||
    (coords as [number, number, number]).length === 3
  );
}

function isLocation(
  coords: ILocation | IPoint | [number, number] | [number, number, number]
): coords is ILocation {
  return (
    (coords as ILocation).latitude !== undefined ||
    (coords as ILocation).lat !== undefined
  );
}

export function normalizeLocationsList(
  locations: Array<IPoint | ILocation | [number, number]>
): string[] {
  return locations.map((coords) => {
    if (isLocationArray(coords)) {
      return coords.join();
    } else if (isLocation(coords)) {
      if (coords.lat) {
        return coords.long + "," + coords.lat;
      } else {
        return coords.longitude + "," + coords.latitude;
      }
    } else {
      return coords.x + "," + coords.y;
    }
  });
}

export function decompressGeometry(str: string): IPolyline {
  let xDiffPrev = 0;
  let yDiffPrev = 0;
  const points = [];
  let x;
  let y;

  // Split the string into an array on the + and - characters
  const strings = str.match(/((\+|-)[^+-]+)/g);

  // The first value is the coefficient in base 32
  const coefficient = parseInt(strings[0], 32);

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

/**
 * User Defined Type Guard that verifies this is a featureSet
 */
export function isFeatureSet(arg: any): arg is IFeatureSet {
  return Object.prototype.hasOwnProperty.call(arg, "features");
}
